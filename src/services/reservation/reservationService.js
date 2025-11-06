import ReservationRepository from '../../repositories/reservation/ReservationRepository.js'
import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import PriceService from '../property/price/priceService.js'
import CalendarService from '../property/calendarService.js'
import ReservationValidationService from './reservationValidationService.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS } from '../../../config/constants.js'
import { getDateRange } from '../../utils/reservation/dateUtils.js'
import CouponService from '../coupon/couponService.js'

class ReservationService {
  async createReservation(userId, propertyId, data) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      status: 1,
      is_approved: 1,
      deleted: null
    })

    await ReservationValidationService.validatePropertyForBooking(property, userId)

    const nights = ReservationValidationService.validateReservationDates(data.checkin, data.checkout, property)

    ReservationValidationService.validateGuestCapacity(data.guests, property)

    ReservationValidationService.validateAvailabilityWindow(data.checkin, data.checkout, property)

    await ReservationValidationService.validateReservationAvailability(propertyId, data.checkin, data.checkout)

    const { pricing, currency, coupon } = await PriceService.calculateReservationPricing(
      propertyId,
      data.guests,
      data.checkin,
      data.checkout,
      data.coupon_code || null
    )
    // Create reservation with pending_payment status
    const reservation = await ReservationRepository.create({
      user_by: userId,
      user_to: property.user_id,
      property_id: propertyId,
      tracking_code: ReservationRepository.generateTrackingCode(),
      confirmation_code: null,
      checkin: data.checkin,
      checkout: data.checkout,
      guests: data.guests,
      nights,
      currency,
      reservation_status: 'pending_payment', // Changed from awaiting_host_approval/confirmed
      payment_method: 'pending',
      coupon_id: coupon?.couponId || null,
      coupon_code: coupon?.couponCode || null,
      discount_amount: coupon?.discountAmount || 0,
      discount_type: coupon?.discountType || null,
      ...pricing,
      book_date: new Date(),
      is_payed: false,
      is_payed_host: false,
      is_payed_guest: false
    })

    if (coupon) {
      await CouponService.incrementUsage(coupon.couponId)
    }

    return {
      ...reservation.toJSON(),
      instant_booking: property.allow_instant_booking,
      requires_payment: true
    }
  }

  async getReservation(reservationId, userId, userRole = 'user') {
    const reservation = await ReservationRepository.findById(reservationId)

    if (!reservation || reservation.deleted) {
      throw new AppError('Reservation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (userRole !== 'admin' && reservation.user_by !== userId && reservation.user_to !== userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.FORBIDDEN)
    }

    return reservation
  }

  async approveReservation(reservationId, hostId) {
    const reservation = await this.getReservation(reservationId, hostId)

    if (reservation.user_to !== hostId) {
      throw new AppError('Only the host can approve this reservation', HTTP_STATUS.FORBIDDEN)
    }

    if (reservation.reservation_status !== 'awaiting_host_approval') {
      throw new AppError('Only pending reservations can be approved', HTTP_STATUS.BAD_REQUEST)
    }

    if (reservation.is_canceled) {
      throw new AppError('Cannot approve a canceled reservation', HTTP_STATUS.BAD_REQUEST)
    }

    // Check if dates are still available
    await ReservationValidationService.validateReservationAvailability(
      reservation.property_id,
      reservation.checkin,
      reservation.checkout,
      reservationId
    )

    // Block the dates
    const dates = getDateRange(reservation.checkin, reservation.checkout)
    const property = await PropertyRepository.findOne({
      id: reservation.property_id
    })
    await CalendarService.blockDates(reservation.property_id, property.user_id, dates)

    await ReservationRepository.update(reservationId, {
      reservation_status: 'confirmed',
      confirmation_code: ReservationRepository.generateConfirmationCode(),
      modified: new Date()
    })

    return { message: 'Reservation approved successfully' }
  }

  async rejectReservation(reservationId, hostId, reason) {
    const reservation = await this.getReservation(reservationId, hostId)

    if (reservation.user_to !== hostId) {
      throw new AppError('Only the host can reject this reservation', HTTP_STATUS.FORBIDDEN)
    }

    if (reservation.reservation_status !== 'awaiting_host_approval') {
      throw new AppError('Only pending reservations can be rejected', HTTP_STATUS.BAD_REQUEST)
    }

    if (reservation.is_canceled) {
      throw new AppError('Reservation is already canceled', HTTP_STATUS.BAD_REQUEST)
    }

    await ReservationRepository.update(reservationId, {
      reservation_status: 'rejected',
      is_canceled: true,
      cancel_date: new Date(),
      reason_to_cancel: reason,
      modified: new Date()
    })

    return { message: 'Reservation rejected' }
  }

  async cancelReservation(reservationId, userId, reason) {
    const reservation = await this.getReservation(reservationId, userId)

    const isGuest = reservation.user_by === userId
    const isHost = reservation.user_to === userId

    if (!isGuest && !isHost) {
      throw new AppError('Unauthorized to cancel this reservation', HTTP_STATUS.FORBIDDEN)
    }

    if (reservation.is_canceled) {
      throw new AppError('Reservation is already canceled', HTTP_STATUS.BAD_REQUEST)
    }

    if (reservation.reservation_status === 'completed') {
      throw new AppError('Cannot cancel completed reservation', HTTP_STATUS.BAD_REQUEST)
    }

    // Unblock dates if reservation was confirmed
    if (reservation.reservation_status === 'confirmed') {
      const dates = getDateRange(reservation.checkin, reservation.checkout)
      const property = await PropertyRepository.findOne({
        id: reservation.property_id
      })
      await CalendarService.unblockDates(reservation.property_id, property.user_id, dates)
    }

    await ReservationRepository.update(reservationId, {
      is_canceled: true,
      reservation_status: 'canceled',
      cancel_date: new Date(),
      reason_to_cancel: reason,
      modified: new Date()
    })

    return {
      message: 'Reservation canceled successfully',
      canceled_by: isGuest ? 'guest' : 'host'
    }
  }

  async getUserReservations(userId, type = 'guest') {
    return await ReservationRepository.findUserReservations(userId, type)
  }

  async getPropertyReservations(propertyId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })

    if (!property) {
      throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
    }

    return await ReservationRepository.findPropertyReservations(propertyId)
  }

  async markAsPaid(reservationId) {
    const reservation = await ReservationRepository.findById(reservationId)

    if (!reservation) {
      throw new AppError('Reservation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (reservation.is_payed) {
      throw new AppError('Reservation is already marked as paid', HTTP_STATUS.BAD_REQUEST)
    }

    await ReservationRepository.update(reservationId, {
      is_payed: true,
      is_payed_guest: true,
      payed_date: new Date(),
      payment_method: 'manual',
      modified: new Date()
    })

    return { message: 'Reservation marked as paid' }
  }
}

export default new ReservationService()
