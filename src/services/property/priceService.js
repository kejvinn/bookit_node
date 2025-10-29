import PriceRepository from '../../repositories/property/PriceRepository.js'
import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import { pricingUtils } from '../../utils/pricingUtils.js'
import { AppError } from '../../utils/helpers.js'
import { PRICING_LIMITS } from '../../../config/constants.js'
import { HTTP_STATUS } from '../../../config/constants.js'

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
}

export default new PriceService()
