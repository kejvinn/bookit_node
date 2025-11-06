import SeasonalPriceRepository from '../../../repositories/property/price/SeasonalPriceRepository.js'
import PropertyRepository from '../../../repositories/property/PropertyRepository.js'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

class SeasonalPriceService {
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

export default new SeasonalPriceService()
