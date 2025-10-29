import { BaseRepository } from '../BaseRepository.js'
import {
  Property,
  PropertyStep,
  RoomType,
  User,
  AccommodationType,
  Characteristic,
  CharacteristicTranslation,
  PropertyTranslation,
  Country,
  State,
  PropertyPrice
} from '../../models/index.js'

class PropertyRepository extends BaseRepository {
  constructor() {
    super(Property)
  }

  async findByIdWithDetails(id, languageId = 1) {
    return await Property.findOne({
      where: { id, deleted: null },
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'name', 'surname', 'email', 'image_path']
        },
        {
          model: PropertyStep,
          as: 'steps'
        },
        {
          model: RoomType,
          as: 'roomType',
          where: { language_id: languageId },
          required: false
        },
        {
          model: AccommodationType,
          as: 'accommodationType',
          where: { language_id: languageId },
          required: false
        },
        {
          model: Country,
          as: 'countryData',
          required: false,
          attributes: ['id', 'name', 'iso_code', 'phonecode']
        },
        {
          model: State,
          as: 'stateData',
          required: false,
          attributes: ['id', 'name', 'iso_code']
        },
        {
          model: Characteristic,
          as: 'characteristics',
          through: { attributes: [] },
          include: [
            {
              model: CharacteristicTranslation,
              as: 'translations',
              where: { language_id: languageId },
              required: false,
              attributes: ['characteristic_name']
            }
          ]
        },
        {
          model: PropertyPrice,
          as: 'pricing',
          required: false
        }
      ]
    })
  }

  async findByUserId(userId, includeDeleted = false) {
    const where = { user_id: userId }
    if (!includeDeleted) {
      where.deleted = null
    }

    return await Property.findAll({
      where,
      include: [
        {
          model: PropertyStep,
          as: 'steps'
        },
        {
          model: PropertyTranslation,
          as: 'translations',
          where: { language_id: 1 },
          required: false
        }
      ],
      order: [['created', 'DESC']]
    })
  }

  async createWithSteps(propertyData, userId) {
    const property = await Property.create({
      ...propertyData,
      user_id: userId
    })

    await PropertyStep.create({
      id: property.id,
      property_id: property.id
    })

    return property
  }

  async updateStep(id, userId, stepName, data) {
    const property = await Property.findOne({
      where: { id, user_id: userId, deleted: null }
    })

    if (!property) {
      return null
    }

    await property.update(data)

    const steps = await PropertyStep.findOne({
      where: { property_id: id }
    })

    if (!steps) return this.findByIdWithDetails(id)

    //  Check if all updated values are null or empty — means user reset step
    const allNull = Object.values(data).every((val) => val === null || val === '' || val === undefined)

    if (allNull) {
      //  Mark step incomplete again
      await steps.update({ [stepName]: 0 })
      await property.update({ is_completed: 0 })
    } else if (steps[stepName] === 0) {
      await steps.completeStep(stepName)
    }

    // If everything done, mark property completed
    if (steps.isComplete()) {
      await property.update({ is_completed: 1 })
    }

    return await this.findByIdWithDetails(id)
  }

  async markStepStatus(id, stepName, isComplete = true) {
    const steps = await PropertyStep.findOne({ where: { property_id: id } })
    if (!steps) return

    if (isComplete) {
      if (steps[stepName] === 0) {
        await steps.completeStep(stepName)
      }
    } else {
      await steps.update({ [stepName]: 0 })
    }
  }

  async getPropertySteps(propertyId) {
    return await PropertyStep.findOne({
      where: { property_id: propertyId }
    })
  }

  async findAndCountAll(conditions = {}, options = {}) {
    return await Property.findAndCountAll({
      where: conditions,
      ...options
    })
  }
}

export default new PropertyRepository()
