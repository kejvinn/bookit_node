import { BaseRepository } from '../../BaseRepository.js'
import PropertyPrice from '../../../models/property/Price/Price.js'

class PriceRepository extends BaseRepository {
  constructor() {
    super(PropertyPrice)
  }

  async findByModel(modelId, model = 'Property') {
    return await PropertyPrice.findOne({
      where: {
        model_id: modelId,
        model
      }
    })
  }

  async upsertPropertyPrice(propertyId, priceData) {
    const existingPrice = await this.findByModel(propertyId, 'Property')

    const dataToSave = {
      model_id: propertyId,
      model: 'Property',
      ...priceData
    }

    if (existingPrice) {
      await existingPrice.update(dataToSave)
      return existingPrice
    }

    return await PropertyPrice.create(dataToSave)
  }

  async deletePropertyPrice(propertyId) {
    return await PropertyPrice.destroy({
      where: {
        model_id: propertyId,
        model: 'Property'
      }
    })
  }
}

export default new PriceRepository()
