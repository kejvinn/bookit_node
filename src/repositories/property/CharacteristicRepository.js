import { BaseRepository } from '../BaseRepository.js'
import { Characteristic, CharacteristicTranslation, CharacteristicsProperties } from '../../models/index.js'
import { Op } from 'sequelize'

class CharacteristicRepository extends BaseRepository {
  constructor() {
    super(Characteristic)
  }

  async getAllWithTranslations(languageId = 1) {
    return await Characteristic.findAll({
      include: [
        {
          model: CharacteristicTranslation,
          as: 'translations',
          where: { language_id: languageId },
          required: true,
          attributes: ['characteristic_name']
        }
      ],
      order: [['id', 'ASC']]
    })
  }

  async getPropertyCharacteristics(propertyId) {
    const associations = await CharacteristicsProperties.findAll({
      where: { property_id: propertyId },
      attributes: ['characteristic_id']
    })

    return associations.map((assoc) => assoc.characteristic_id)
  }

  async updatePropertyCharacteristics(propertyId, characteristicIds) {
    await CharacteristicsProperties.destroy({
      where: { property_id: propertyId }
    })

    if (characteristicIds && characteristicIds.length > 0) {
      const associations = characteristicIds.map((charId) => ({
        property_id: propertyId,
        characteristic_id: charId
      }))

      await CharacteristicsProperties.bulkCreate(associations)
    }

    return await this.getPropertyCharacteristics(propertyId)
  }

  async validateCharacteristicIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return true // Empty is valid
    }

    const count = await Characteristic.count({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })

    return count === ids.length
  }
}

export default new CharacteristicRepository()
