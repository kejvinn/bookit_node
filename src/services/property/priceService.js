import PriceRepository from '../../../repositories/property/price/PriceRepository.js'
import PropertyRepository from '../../../repositories/property/PropertyRepository.js'
import { pricingUtils } from '../../../utils/property/pricingUtils.js'
import { AppError } from '../../../utils/helpers.js'
import { PRICING_LIMITS } from '../../../../config/constants.js'
import { HTTP_STATUS } from '../../../../config/constants.js'
import { calculateNights } from '../../../utils/reservation/dateUtils.js'
import CouponService from '../../coupon/couponService.js'
import SeasonalPriceRepository from '../../../repositories/property/price/SeasonalPriceRepository.js'

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

  async getNightlyRateForDate(propertyId, date) {
    const seasonalPrice = await SeasonalPriceRepository.findActiveForDate(propertyId, date)

    if (seasonalPrice) {
      return seasonalPrice.price
    }

    const basePrice = await PriceRepository.findByModel(propertyId, 'Property')
    return basePrice ? basePrice.night : null
  }

  async calculateReservationPricing(propertyId, guests, checkin, checkout, couponCode = null) {
    const price = await PriceRepository.findByModel(propertyId, 'Property')

    if (!price) {
      throw new AppError('Property pricing not configured', HTTP_STATUS.BAD_REQUEST)
    }

    const nights = calculateNights(checkin, checkout)
    const nightlyRate = price.night || 0
    let subtotal = 0

    // Calculate subtotal with seasonal pricing
    const checkinDate = new Date(checkin)
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkinDate)
      currentDate.setDate(currentDate.getDate() + i)

      // Convert Date object to YYYY-MM-DD string format
      const dateString = currentDate.toISOString().split('T')[0]

      const nightRate = await this.getNightlyRateForDate(propertyId, dateString)
      subtotal += nightRate || nightlyRate
    }

    // Extra guest fees
    let extraGuestPrice = 0
    const includedGuests = price.guests || 1

    if (guests > includedGuests && price.addguests) {
      const extraGuests = guests - includedGuests
      extraGuestPrice = extraGuests * price.addguests * nights
    }

    // One-time fees
    const cleaningFee = price.cleaning || 0
    const securityFee = price.security_deposit || 0
    const baseSubtotal = subtotal + extraGuestPrice

    // Service fee
    const serviceFeeRate = 0.1
    const serviceFee = Math.round(baseSubtotal * serviceFeeRate * 100) / 100

    // Total BEFORE coupon
    const totalPrice = baseSubtotal + cleaningFee + serviceFee + securityFee

    // Coupon
    let coupon = null
    let discountAmount = 0

    if (couponCode) {
      coupon = await CouponService.validateAndApplyCoupon(
        couponCode,
        propertyId,
        totalPrice,
        price.currency || PRICING_LIMITS.DEFAULT_CURRENCY
      )
      discountAmount = coupon.discountAmount
    }

    // Total AFTER coupon
    const toPay = totalPrice - discountAmount
    const averagePrice = Math.round((toPay / nights) * 100) / 100

    // Calculate the average nightly rate based on actual subtotal (with seasonal pricing)
    const averageNightlyRate = Math.round((subtotal / nights) * 100) / 100

    return {
      pricing: {
        price: averageNightlyRate, // Use calculated average instead of base rate
        subtotal_price: subtotal,
        extra_guest_price: extraGuestPrice,
        cleaning_fee: cleaningFee,
        security_fee: securityFee,
        service_fee: serviceFee,
        total_price: totalPrice,
        discount_amount: discountAmount,
        avarage_price: averagePrice,
        to_pay: toPay
      },
      currency: price.currency || PRICING_LIMITS.DEFAULT_CURRENCY,
      nights,
      coupon
    }
  }
  async createSeasonalPrice(propertyId, userId, data) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })

    if (!property) {
      throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
    }

    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)

    if (endDate <= startDate) {
      throw new AppError('End date must be after start date', HTTP_STATUS.BAD_REQUEST)
    }

    const overlapping = await SeasonalPriceRepository.findOverlapping(propertyId, data.start_date, data.end_date)

    if (overlapping.length > 0) {
      throw new AppError('Date range overlaps with existing seasonal pricing', HTTP_STATUS.CONFLICT)
    }

    return await SeasonalPriceRepository.create({
      property_id: propertyId,
      price: data.price,
      start_date: data.start_date,
      end_date: data.end_date,
      currency: data.currency || property.currency_id || 'EUR'
    })
  }

  async updateSeasonalPrice(seasonalPriceId, userId, data) {
    const seasonalPrice = await SeasonalPriceRepository.findById(seasonalPriceId)

    if (!seasonalPrice) {
      throw new AppError('Seasonal price not found', HTTP_STATUS.NOT_FOUND)
    }

    const property = await PropertyRepository.findOne({
      id: seasonalPrice.property_id,
      user_id: userId,
      deleted: null
    })

    if (!property) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date)
      const endDate = new Date(data.end_date)

      if (endDate <= startDate) {
        throw new AppError('End date must be after start date', HTTP_STATUS.BAD_REQUEST)
      }

      const overlapping = await SeasonalPriceRepository.findOverlapping(
        seasonalPrice.property_id,
        data.start_date,
        data.end_date,
        seasonalPriceId
      )

      if (overlapping.length > 0) {
        throw new AppError('Date range overlaps with existing seasonal pricing', HTTP_STATUS.CONFLICT)
      }
    }

    return await SeasonalPriceRepository.update(seasonalPriceId, data)
  }

  async deleteSeasonalPrice(seasonalPriceId, userId) {
    const seasonalPrice = await SeasonalPriceRepository.findById(seasonalPriceId)

    if (!seasonalPrice) {
      throw new AppError('Seasonal price not found', HTTP_STATUS.NOT_FOUND)
    }

    const property = await PropertyRepository.findOne({
      id: seasonalPrice.property_id,
      user_id: userId,
      deleted: null
    })

    if (!property) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    await SeasonalPriceRepository.delete(seasonalPriceId)
    return { message: 'Seasonal price deleted successfully' }
  }

  async getPropertySeasonalPrices(propertyId, userId = null) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      deleted: null
    })

    if (!property) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    if (property.status === 0 && (!userId || userId !== property.user_id)) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    return await SeasonalPriceRepository.findByPropertyId(propertyId)
  }

  async getSeasonalPriceForDate(propertyId, date) {
    return await SeasonalPriceRepository.findActiveForDate(propertyId, date)
  }
}

export default new PriceService()
