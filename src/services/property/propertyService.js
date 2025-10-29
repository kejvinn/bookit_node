import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import { RoomType } from '../../models/index.js'
import { AppError } from '../../utils/helpers.js'

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
      throw new AppError('Invalid room type', 400)
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
      throw new AppError('Property not found', 404)
    }

    if (property.status !== 1) {
      if (!userId || property.user_id !== userId) {
        throw new AppError('Property not found', 404)
      }
    }

    return property
  }

  async getUserProperties(userId) {
    return await PropertyRepository.findByUserId(userId)
  }

  async getPropertyForEdit(propertyId, userId, languageId = 1) {
    const property = await PropertyRepository.findByIdWithDetails(propertyId, languageId)

    if (!property) {
      throw new AppError('Property not found', 404)
    }

    if (property.user_id !== userId) {
      throw new AppError('Unauthorized', 403)
    }

    return property
  }

  async getPropertyProgress(propertyId, userId) {
    const property = await this.getPropertyForEdit(propertyId, userId)

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

  async deleteProperty(propertyId, userId) {
    const property = await PropertyRepository.findById(propertyId)

    if (!property) {
      throw new AppError('Property not found', 404)
    }

    if (property.user_id !== userId) {
      throw new AppError('Unauthorized', 403)
    }

    if (property.status !== 0) {
      throw new AppError('Cannot delete published property', 400)
    }

    await PropertyRepository.softDelete(propertyId)

    return { id: propertyId, deleted: true }
  }
}

export default new PropertyService()
