import { AVAILABILITY_TYPES } from '../../../config/constants.js'
import CalendarRepository from '../../repositories/property/CalendarRepository.js'
import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import { AppError } from '../../utils/helpers.js'

class CalendarService {
  async updateCalendar(propertyId, userId, data) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found or unauthorized', 404)
    }

    const minDays = data.minimum_days || property.minimum_days || 1
    const maxDays = data.maximum_days || property.maximum_days || 365

    if (minDays < 1) {
      throw new AppError('Minimum days must be at least 1', 400)
    }
    if (maxDays < minDays) {
      throw new AppError('Maximum days must be greater than or equal to minimum days', 400)
    }

    if (data.available_from && data.available_to) {
      const fromDate = new Date(data.available_from)
      const toDate = new Date(data.available_to)

      if (toDate <= fromDate) {
        throw new AppError('Available to date must be after available from date', 400)
      }
    }

    const propertyUpdates = {
      minimum_days: minDays,
      maximum_days: maxDays,
      availability_type: data.availability_type || property.availability_type || AVAILABILITY_TYPES.ALWAYS,
      checkin_time: data.checkin_time || property.checkin_time || '15:00',
      checkout_time: data.checkout_time || property.checkout_time || '11:00'
    }

    if (data.available_from !== undefined) propertyUpdates.available_from = data.available_from
    if (data.available_to !== undefined) propertyUpdates.available_to = data.available_to

    await PropertyRepository.update(propertyId, propertyUpdates)

    if (data.blocked_dates !== undefined) {
      await CalendarRepository.upsertCalendar(propertyId, {
        blocked_dates: data.blocked_dates || [],
        updated_at: new Date().toISOString()
      })
    }

    await PropertyRepository.markStepStatus(propertyId, 'calendar', true)

    const calendar = await CalendarRepository.findByPropertyId(propertyId)

    return {
      minimum_days: propertyUpdates.minimum_days,
      maximum_days: propertyUpdates.maximum_days,
      availability_type: propertyUpdates.availability_type,
      available_from: propertyUpdates.available_from || null,
      available_to: propertyUpdates.available_to || null,
      checkin_time: propertyUpdates.checkin_time,
      checkout_time: propertyUpdates.checkout_time,
      blocked_dates: calendar ? calendar.calendar_data.blocked_dates : []
    }
  }

  async getCalendar(propertyId, userId = null) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      deleted: null
    })
    if (!property) throw new AppError('Property not found', 404)

    if (property.status === 0 && (!userId || userId !== property.user_id)) {
      throw new AppError('Property not found', 404)
    }

    const calendar = await CalendarRepository.findByPropertyId(propertyId)
    return {
      minimum_days: property.minimum_days,
      maximum_days: property.maximum_days,
      availability_type: property.availability_type,
      available_from: property.available_from,
      available_to: property.available_to,
      checkin_time: property.checkin_time,
      checkout_time: property.checkout_time,
      blocked_dates: calendar ? calendar.calendar_data.blocked_dates : []
    }
  }

  async deleteCalendar(propertyId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found or unauthorized', 404)
    }

    await CalendarRepository.deleteByPropertyId(propertyId)

    await PropertyRepository.update(propertyId, {
      minimum_days: 1,
      maximum_days: 365,
      availability_type: AVAILABILITY_TYPES.ALWAYS,
      available_from: null,
      available_to: null,
      checkin_time: '17:00',
      checkout_time: '10:00'
    })

    await PropertyRepository.markStepStatus(propertyId, 'calendar', false)

    return { message: 'Calendar settings reset to defaults' }
  }

  async blockDates(propertyId, userId, dates) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) throw new AppError('Property not found or unauthorized', 404)

    let calendar = await CalendarRepository.findByPropertyId(propertyId)

    if (!calendar) {
      calendar = await CalendarRepository.create({
        property_id: propertyId,
        calendar_data: { blocked_dates: dates }
      })
    } else {
      const currentData = calendar.calendar_data || { blocked_dates: [] }
      const existingBlocked = currentData.blocked_dates || []

      // Merge & deduplicate
      const blocked_dates = [...new Set([...existingBlocked, ...dates])]

      calendar.calendar_data = {
        ...currentData,
        blocked_dates,
        updated_at: new Date().toISOString()
      }
      await calendar.save()
    }

    return {
      blocked_dates: calendar.calendar_data.blocked_dates
    }
  }

  async unblockDates(propertyId, userId, dates) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) throw new AppError('Property not found or unauthorized', 404)

    const calendar = await CalendarRepository.findByPropertyId(propertyId)
    if (!calendar) {
      return { blocked_dates: [] }
    }

    const currentData = calendar.calendar_data || { blocked_dates: [] }
    const blockedDates = currentData.blocked_dates || []

    // Remove selected dates
    const remainingBlocked = blockedDates.filter((date) => !dates.includes(date))

    calendar.calendar_data = {
      ...currentData,
      blocked_dates: remainingBlocked,
      updated_at: new Date().toISOString()
    }
    await calendar.save()

    return {
      blocked_dates: calendar.calendar_data.blocked_dates
    }
  }
}

export default new CalendarService()
