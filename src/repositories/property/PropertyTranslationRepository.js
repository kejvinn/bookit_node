import { BaseRepository } from '../BaseRepository.js'
import { PropertyTranslation } from '../../models/index.js'

class PropertyTranslationRepository extends BaseRepository {
  constructor() {
    super(PropertyTranslation)
  }

  async findByPropertyAndLanguage(propertyId, languageId) {
    return await PropertyTranslation.findOne({
      where: {
        property_id: propertyId,
        language_id: languageId
      }
    })
  }

  async findAllByProperty(propertyId) {
    return await PropertyTranslation.findAll({
      where: { property_id: propertyId },
      order: [['language_id', 'ASC']]
    })
  }

  async upsertTranslation(propertyId, languageId, data) {
    const existing = await this.findByPropertyAndLanguage(propertyId, languageId)

    if (existing) {
      return await existing.update(data, { fields: Object.keys(data) })
    }

    return await PropertyTranslation.create({
      property_id: propertyId,
      language_id: languageId,
      ...data
    })
  }

  async deleteByProperty(propertyId) {
    return await PropertyTranslation.destroy({
      where: { property_id: propertyId }
    })
  }
}

export default new PropertyTranslationRepository()
