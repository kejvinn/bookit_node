import PriceRepository from '../../repositories/property/PriceRepository.js'
import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import { pricingUtils } from '../../utils/property/pricingUtils.js'
import { AppError } from '../../utils/helpers.js'
import { PRICING_LIMITS } from '../../../config/constants.js'
import { HTTP_STATUS } from '../../../config/constants.js'
import { calculateNights } from '../../utils/reservation/dateUtils.js'

class PriceService {
  async updatePricing(propertyId, userId, data) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })

    if (!property) throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)

    const nightlyPrice = Number(data.night)
    const weeklyDiscount = data.weekly_discount || 0
    const monthlyDiscount = data.monthly_discount || 0

    const weeklyPrice = pricingUtils.calculateWeeklyPrice(nightlyPrice, weeklyDiscount)
    const monthlyPrice = pricingUtils.calculateMonthlyPrice(nightlyPrice, monthlyDiscount)

    const priceData = {
      night: nightlyPrice,
      week: weeklyPrice,
      month: monthlyPrice,
      guests: data.guests || property.capacity || 1,
      addguests: data.addguests || 0,
      cleaning: data.cleaning || 0,
      security_deposit: data.security_deposit || 0,
      currency: data.currency,
      previous_price: data.previous_price || null
    }

    const price = await PriceRepository.upsertPropertyPrice(propertyId, priceData)

    await PropertyRepository.update(propertyId, {
      price: nightlyPrice,
      weekly_price: weeklyPrice,
      monthly_price: monthlyPrice,
      security_deposit: data.security_deposit || 0
    })

    await PropertyRepository.markStepStatus(propertyId, 'pricing', true)

    return {
      ...price.toJSON(),
      weekly_discount: weeklyDiscount,
      monthly_discount: monthlyDiscount
    }
  }

  async getPropertyPricing(propertyId, userId = null) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    if (property.status === 0 || property.deleted) {
      if (!userId || property.user_id !== userId) {
        throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
      }
    }

    const price = await PriceRepository.findByModel(propertyId, 'Property')
    if (!price) return null

    const priceData = price.toJSON()

    const formattedPrice = {
      ...priceData,
      night: Number(priceData.night),
      week: Number(priceData.week),
      month: Number(priceData.month),
      currency: priceData.currency || PRICING_LIMITS.DEFAULT_CURRENCY,
      weekly_discount: pricingUtils.getWeeklyDiscountPercent(priceData.night, priceData.week),
      monthly_discount: pricingUtils.getMonthlyDiscountPercent(priceData.night, priceData.month)
    }

    return formattedPrice
  }

  async deletePropertyPricing(propertyId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
    }

    await PriceRepository.deletePropertyPrice(propertyId)

    await PropertyRepository.markStepStatus(propertyId, 'pricing', false)
    await PropertyRepository.markStepStatus(propertyId, 'calendar', false)

    await PropertyRepository.update(propertyId, {
      price: null,
      weekly_price: null,
      monthly_price: null,
      is_completed: 0
    })

    return { message: 'Pricing deleted successfully' }
  }

  async calculateReservationPricing(propertyId, guests, checkin, checkout) {
    const price = await PriceRepository.findByModel(propertyId, 'Property')

    if (!price) {
      throw new AppError('Property pricing not configured', HTTP_STATUS.BAD_REQUEST)
    }

    const nights = calculateNights(checkin, checkout)
    let nightlyRate = price.night || 0
    let subtotal = 0

    // Calculate subtotal based on duration
    if (nights >= 30 && price.month) {
      const fullMonths = Math.floor(nights / 30)
      let remaining = nights % 30

      const fullWeeks = Math.floor(remaining / 7)
      const leftoverNights = remaining % 7

      subtotal =
        price.month * fullMonths +
        (price.week ? price.week * fullWeeks : nightlyRate * fullWeeks * 7) +
        nightlyRate * leftoverNights
    } else if (nights >= 7 && price.week) {
      const fullWeeks = Math.floor(nights / 7)
      const remainingNights = nights % 7
      subtotal = price.week * fullWeeks + nightlyRate * remainingNights
    } else {
      subtotal = nightlyRate * nights
    }

    // Extra guest fee
    let extraGuestPrice = 0
    const includedGuests = price.guests || 1

    if (guests > includedGuests && price.addguests) {
      const extraGuests = guests - includedGuests
      extraGuestPrice = extraGuests * price.addguests * nights
    }

    // One-time fees
    const cleaningFee = price.cleaning || 0
    const securityFee = price.security_deposit || 0

    // Service fee (10% platform commission)
    const serviceFeeRate = 0.1
    const serviceFee = Math.round((subtotal + extraGuestPrice) * serviceFeeRate * 100) / 100

    // Totals
    const totalPrice = subtotal + extraGuestPrice + cleaningFee + serviceFee
    const averagePrice = Math.round((totalPrice / nights) * 100) / 100

    return {
      pricing: {
        price: nightlyRate,
        subtotal_price: subtotal,
        cleaning_fee: cleaningFee,
        security_fee: securityFee,
        service_fee: serviceFee,
        extra_guest_price: extraGuestPrice,
        avarage_price: averagePrice,
        total_price: totalPrice,
        to_pay: totalPrice
      },
      currency: price.currency || PRICING_LIMITS.DEFAULT_CURRENCY,
      nights
    }
  }
}

export default new PriceService()
