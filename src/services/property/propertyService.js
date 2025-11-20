import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import CountryRepository from '../../repositories/property/LocationRepository.js'
import CharacteristicRepository from '../../repositories/property/CharacteristicRepository.js'
import { RoomType, AccommodationType, AccommodationTypeTranslation } from '../../models/index.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS } from '../../../config/constants.js'

class PropertyService {
  async createProperty(userId, data) {
    const { room_type_id } = data

    const roomType = await RoomType.findOne({
      where: {
        room_type_id,
        language_id: 1
      }
    })

    if (!roomType) {
      console.log('Invalid room type:', room_type_id)
      throw new AppError('Invalid room type', HTTP_STATUS.BAD_REQUEST)
    }

    const propertyData = {
      room_type_id,
      status: 0,
      is_completed: 0,
      is_approved: 0
    }

    const property = await PropertyRepository.createWithSteps(propertyData, userId)

    return {
      id: property.id,
      room_type_id: property.room_type_id,
      created: property.created
    }
  }

  async getProperty(propertyId, userId = null, languageId = 1) {
    const property = await PropertyRepository.findByIdWithDetails(propertyId, languageId)

    if (!property || property.deleted !== null) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    if (property.status !== 1) {
      if (!userId || property.user_id !== userId) {
        throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
      }
    }

    return property
  }

  async getUserProperties(userId) {
    return await PropertyRepository.findByUserId(userId)
  }

  async getPropertyProgress(propertyId, userId) {
    const property = await this.getProperty(propertyId, userId)

    if (!property.steps) {
      return {
        completed: 0,
        total: 6,
        percentage: 0,
        steps: {}
      }
    }

    const completedSteps = property.steps.getCompletedSteps()
    const percentage = property.steps.getProgress()

    return {
      completed: completedSteps.length,
      total: 6,
      percentage,
      steps: {
        basics: property.steps.basics === 1,
        description: property.steps.description === 1,
        location: property.steps.location === 1,
        photos: property.steps.photos === 1,
        pricing: property.steps.pricing === 1,
        calendar: property.steps.calendar === 1
      },
      isComplete: property.steps.isComplete()
    }
  }

  async updateBasics(propertyId, userId, data) {
    const allowedFields = [
      'accommodation_type_id',
      'capacity',
      'bedroom_number',
      'bed_number',
      'bathroom_number',
      'garages'
    ]

    const updateData = {}
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    })

    if (updateData.capacity !== undefined && updateData.capacity < 1) {
      throw new AppError('Capacity must be at least 1', HTTP_STATUS.BAD_REQUEST)
    }

    if (updateData.bed_number !== undefined && updateData.bed_number < 1) {
      throw new AppError('Bed number must be at least 1', HTTP_STATUS.BAD_REQUEST)
    }

    if (updateData.accommodation_type_id) {
      const accommodationType = await AccommodationType.findByPk(updateData.accommodation_type_id)

      if (!accommodationType) {
        throw new AppError('Invalid accommodation type', HTTP_STATUS.BAD_REQUEST)
      }
    }

    const property = await PropertyRepository.updateStep(propertyId, userId, 'basics', updateData)

    if (!property) {
      throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
    }

    return property
  }

  async deleteProperty(propertyId, userId) {
    const property = await PropertyRepository.findById(propertyId)

    if (!property) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    if (property.user_id !== userId) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    if (property.status !== 0) {
      throw new AppError('Cannot delete published property', HTTP_STATUS.BAD_REQUEST)
    }

    await PropertyRepository.softDelete(propertyId)

    return { id: propertyId, deleted: true }
  }

  // Static data retrieval methods
  async getRoomTypes(languageId = 1) {
    const roomTypes = await RoomType.findAll({
      where: { language_id: languageId },
      attributes: ['id', 'room_type_id', 'room_type_name'],
      order: [['room_type_id', 'ASC']]
    })

    const uniqueTypes = roomTypes.reduce((acc, type) => {
      if (!acc.find((t) => t.room_type_id === type.room_type_id)) {
        acc.push(type)
      }
      return acc
    }, [])

    return uniqueTypes
  }

  async getAccommodationTypes(languageId = 1) {
    const types = await AccommodationType.findAll({
      include: [
        {
          model: AccommodationTypeTranslation,
          as: 'translations',
          where: { language_id: languageId },
          attributes: ['accommodation_type_name'],
          required: true
        }
      ],
      attributes: ['id'],
      order: [['id', 'ASC']]
    })

    return types.map((type) => ({
      id: type.id,
      accommodation_type_id: type.id, // For backward compatibility
      accommodation_type_name: type.translations[0].accommodation_type_name
    }))
  }

  async getCountries() {
    return await CountryRepository.getAllActive()
  }

  async getCharacteristics(languageId = 1) {
    return await CharacteristicRepository.getAllWithTranslations(languageId)
  }
}

export default new PropertyService()
