import { BaseRepository } from '../../BaseRepository.js'
import PropertySeasonalPrice from '../../../models/property/Price/SeasonalPrice.js'
import { Op } from 'sequelize'

class SeasonalPriceRepository extends BaseRepository {
  constructor() {
    super(PropertySeasonalPrice)
  }

  async findByPropertyId(propertyId) {
    return await PropertySeasonalPrice.findAll({
      where: { property_id: propertyId },
      order: [['start_date', 'ASC']]
    })
  }

  async findActiveForDate(propertyId, date) {
    // Ensure we only keep YYYY-MM-DD format
    const checkDate = typeof date === 'string' ? date.split('T')[0] : date.toISOString().split('T')[0]

    return await PropertySeasonalPrice.findOne({
      where: {
        property_id: propertyId,
        start_date: { [Op.lte]: checkDate },
        end_date: { [Op.gte]: checkDate }
      }
    })
  }

  async findOverlapping(propertyId, startDate, endDate, excludeId = null) {
    const where = {
      property_id: propertyId,
      [Op.or]: [
        {
          start_date: { [Op.between]: [startDate, endDate] }
        },
        {
          end_date: { [Op.between]: [startDate, endDate] }
        },
        {
          [Op.and]: [{ start_date: { [Op.lte]: startDate } }, { end_date: { [Op.gte]: endDate } }]
        }
      ]
    }

    if (excludeId) {
      where.id = { [Op.ne]: excludeId }
    }
    try {
      const results = await PropertySeasonalPrice.findAll({ where })
      return results
    } catch (error) {
      console.error('SQL executed:', error.sql)
      console.error('MySQL error message:', error.parent?.sqlMessage)
      console.error('MySQL error code:', error.parent?.code)
      throw error
    }
  }

  async deleteByPropertyId(propertyId) {
    return await PropertySeasonalPrice.destroy({
      where: { property_id: propertyId }
    })
  }
}

export default new SeasonalPriceRepository()
