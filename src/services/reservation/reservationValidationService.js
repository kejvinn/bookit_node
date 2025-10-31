import CalendarRepository from '../../repositories/property/CalendarRepository.js'
import ReservationRepository from '../../repositories/reservation/ReservationRepository.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS, AVAILABILITY_TYPES } from '../../../config/constants.js'
import { getDateRange } from '../../utils/reservation/dateUtils.js'

class ReservationValidationService {
  async validatePropertyForBooking(property, userId) {
    if (!property) {
      throw new AppError('Property not available for booking', HTTP_STATUS.NOT_FOUND)
    }

    if (property.user_id === userId) {
      throw new AppError('You cannot book your own property', HTTP_STATUS.BAD_REQUEST)
    }

    return true
  }

  validateReservationDates(checkin, checkout, property) {
    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkinDate < today) {
      throw new AppError('Check-in date cannot be in the past', HTTP_STATUS.BAD_REQUEST)
    }

    if (checkoutDate <= checkinDate) {
      throw new AppError('Check-out must be after check-in', HTTP_STATUS.BAD_REQUEST)
    }

    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))

    if (nights < property.minimum_days) {
      throw new AppError(`Minimum stay is ${property.minimum_days} night(s)`, HTTP_STATUS.BAD_REQUEST)
    }

    if (nights > property.maximum_days) {
      throw new AppError(`Maximum stay is ${property.maximum_days} night(s)`, HTTP_STATUS.BAD_REQUEST)
    }

    return nights
  }

  validateGuestCapacity(guests, property) {
    if (guests > property.capacity) {
      throw new AppError(`Property can accommodate maximum ${property.capacity} guest(s)`, HTTP_STATUS.BAD_REQUEST)
    }
    return true
  }

  validateAvailabilityWindow(checkin, checkout, property) {
    if (property.availability_type === AVAILABILITY_TYPES.ALWAYS) {
      return true
    }

    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)

    if (property.available_from) {
      const availableFrom = new Date(property.available_from)
      if (availableFrom > checkinDate) {
        throw new AppError('Property not available from this date', HTTP_STATUS.BAD_REQUEST)
      }
    }

    if (property.available_to) {
      const availableTo = new Date(property.available_to)
      if (availableTo < checkoutDate) {
        throw new AppError('Property not available until this date', HTTP_STATUS.BAD_REQUEST)
      }
    }

    return true
  }

  async checkBlockedDates(propertyId, checkin, checkout) {
    const calendar = await CalendarRepository.findByPropertyId(propertyId)

    if (calendar?.calendar_data?.blocked_dates) {
      const blockedDates = calendar.calendar_data.blocked_dates
      const requestedDates = getDateRange(checkin, checkout)

      const hasBlockedDate = requestedDates.some((date) => blockedDates.includes(date))

      if (hasBlockedDate) {
        throw new AppError('Some dates in your selected range are not available', HTTP_STATUS.BAD_REQUEST)
      }
    }

    return true
  }

  async checkOverlappingReservations(propertyId, checkin, checkout, excludeReservationId = null) {
    const overlapping = await ReservationRepository.findOverlappingReservations(
      propertyId,
      checkin,
      checkout,
      excludeReservationId
    )

    if (overlapping.length > 0) {
      throw new AppError('Property is already booked for selected dates', HTTP_STATUS.CONFLICT)
    }

    return true
  }

  async validateReservationAvailability(propertyId, checkin, checkout, excludeReservationId = null) {
    await this.checkBlockedDates(propertyId, checkin, checkout)
    await this.checkOverlappingReservations(propertyId, checkin, checkout, excludeReservationId)
    return true
  }
}

export default new ReservationValidationService()
