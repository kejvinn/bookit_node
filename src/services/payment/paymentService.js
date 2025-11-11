import PayPalService from './paypalService.js'
import ReservationRepository from '../../repositories/reservation/ReservationRepository.js'
import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import CalendarService from '../property/calendarService.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS, RESERVATION_STATUS, PAYMENT_STATUS } from '../../../config/constants.js'
import { getDateRange } from '../../utils/reservation/dateUtils.js'
import logger from '../../utils/logger.js'

class PaymentService {
  async createPayPalOrder(reservationId, userId) {
    const reservation = await ReservationRepository.findById(reservationId)

    if (!reservation || reservation.deleted) {
      throw new AppError('Reservation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (reservation.user_by !== userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    if (reservation.is_payed) {
      throw new AppError('Reservation is already paid', HTTP_STATUS.BAD_REQUEST)
    }

    if (reservation.is_canceled) {
      throw new AppError('Cannot pay for canceled reservation', HTTP_STATUS.BAD_REQUEST)
    }

    const property = await PropertyRepository.findOne({
      id: reservation.property_id
    })

    if (!property) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    const orderData = {
      reservationId: reservation.id,
      amount: reservation.to_pay,
      currency: reservation.currency,
      description: `Booking for ${property.slug || 'Property'} - ${reservation.nights} night(s)`,
      breakdown: {
        subtotal: reservation.subtotal_price + reservation.extra_guest_price || 0,
        cleaning_fee: reservation.cleaning_fee || 0,
        service_fee: reservation.service_fee || 0,
        discount: reservation.discount_amount || 0
      }
    }

    const paypalOrder = await PayPalService.createOrder(orderData)

    await ReservationRepository.update(reservationId, {
      paypal_token: paypalOrder.orderId,
      reservation_status: RESERVATION_STATUS.PENDING_PAYMENT,
      payment_method: 'paypal',
      payment_status: PAYMENT_STATUS.PENDING,
      modified: new Date()
    })

    const approvalUrl = PayPalService.getApprovalUrl(paypalOrder.links)

    return {
      orderId: paypalOrder.orderId,
      approvalUrl,
      reservation: {
        id: reservation.id,
        tracking_code: reservation.tracking_code,
        amount: reservation.to_pay,
        currency: reservation.currency
      }
    }
  }

  async capturePayPalOrder(reservationId, orderId, userId) {
    const reservation = await ReservationRepository.findById(reservationId)

    if (!reservation || reservation.deleted) {
      throw new AppError('Reservation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (reservation.user_by !== userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    if (reservation.is_payed) {
      throw new AppError('Reservation is already paid', HTTP_STATUS.BAD_REQUEST)
    }

    if (reservation.paypal_token !== orderId) {
      throw new AppError('Invalid PayPal order', HTTP_STATUS.BAD_REQUEST)
    }

    try {
      const captureResult = await PayPalService.captureOrder(orderId)

      const property = await PropertyRepository.findOne({
        id: reservation.property_id
      })

      const updateData = {
        is_payed: true,
        is_payed_guest: true,
        payed_date: new Date(),
        paypal_transaction_id: captureResult.transactionId,
        paypal_payer_id: captureResult.payerId,
        paypal_payer_email: captureResult.payerEmail,
        paypal_transaction_type: 'sale',
        payment_method: 'paypal',
        payment_status: PAYMENT_STATUS.COMPLETED,
        modified: new Date()
      }

      if (property.allow_instant_booking) {
        updateData.reservation_status = RESERVATION_STATUS.CONFIRMED
        updateData.confirmation_code = ReservationRepository.generateConfirmationCode()
      } else {
        updateData.reservation_status = RESERVATION_STATUS.AWAITING_HOST_APPROVAL
      }

      await ReservationRepository.update(reservationId, updateData)

      if (property.allow_instant_booking) {
        const dates = getDateRange(reservation.checkin, reservation.checkout)
        await CalendarService.blockDates(reservation.property_id, property.user_id, dates)
      }

      logger.info(`Payment captured for reservation ${reservationId}`)

      return {
        transactionId: captureResult.transactionId,
        status: 'success',
        reservation: {
          id: reservation.id,
          tracking_code: reservation.tracking_code,
          confirmation_code: updateData.confirmation_code,
          status: updateData.reservation_status,
          instant_booking: property.allow_instant_booking
        }
      }
    } catch (error) {
      logger.error('Payment capture failed:', error)

      await ReservationRepository.update(reservationId, {
        reservation_status: RESERVATION_STATUS.PENDING_PAYMENT,
        payment_status: PAYMENT_STATUS.FAILED,
        modified: new Date()
      })

      throw new AppError('Payment processing failed', HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }

  async refundPayment(reservationId, userId, userRole = 'user') {
    const reservation = await ReservationRepository.findById(reservationId)

    if (!reservation || reservation.deleted) {
      throw new AppError('Reservation not found', HTTP_STATUS.NOT_FOUND)
    }

    // Only block non-admin manual calls, allow host/guest auto flows
    const automaticRoles = ['host', 'guest']
    if (userRole !== 'admin' && !automaticRoles.includes(userRole)) {
      throw new AppError('Unauthorized refund attempt', HTTP_STATUS.FORBIDDEN)
    }

    if (!reservation.is_payed) {
      throw new AppError('Reservation is not paid', HTTP_STATUS.BAD_REQUEST)
    }

    if (reservation.is_refunded) {
      throw new AppError('Reservation is already refunded', HTTP_STATUS.BAD_REQUEST)
    }

    if (!reservation.paypal_transaction_id) {
      throw new AppError('No PayPal transaction found', HTTP_STATUS.BAD_REQUEST)
    }

    try {
      const refundResult = await PayPalService.refundPayment(
        reservation.paypal_transaction_id,
        reservation.to_pay,
        reservation.currency
      )

      await ReservationRepository.update(reservationId, {
        is_refunded: true,
        is_canceled: true,
        reservation_status: RESERVATION_STATUS.CANCELED,
        payment_status: PAYMENT_STATUS.REFUNDED,
        cancel_date: new Date(),
        modified: new Date()
      })

      const property = await PropertyRepository.findOne({
        id: reservation.property_id
      })
      const dates = getDateRange(reservation.checkin, reservation.checkout)
      await CalendarService.unblockDates(reservation.property_id, property.user_id, dates)

      logger.info(`Refund processed for reservation ${reservationId}`)

      return {
        refundId: refundResult.refundId,
        status: refundResult.status,
        amount: refundResult.amount
      }
    } catch (error) {
      logger.error('Refund failed:', error)
      throw new AppError('Refund processing failed', HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }

  async getPaymentStatus(reservationId, userId) {
    const reservation = await ReservationRepository.findById(reservationId)

    if (!reservation || reservation.deleted) {
      throw new AppError('Reservation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (reservation.user_by !== userId && reservation.user_to !== userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    return {
      is_payed: reservation.is_payed,
      is_refunded: reservation.is_refunded,
      payment_method: reservation.payment_method,
      transaction_id: reservation.paypal_transaction_id,
      payed_date: reservation.payed_date,
      amount: reservation.to_pay,
      currency: reservation.currency,
      status: reservation.reservation_status
    }
  }
}

export default new PaymentService()
