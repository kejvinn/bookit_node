import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import { RoomType, AccommodationType } from '../../models/index.js'
import { AppError } from '../../utils/helpers.js'

class BasicsService {
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
      throw new AppError('Capacity must be at least 1', 400)
    }

    if (updateData.bed_number !== undefined && updateData.bed_number < 1) {
      throw new AppError('Bed number must be at least 1', 400)
    }

    if (updateData.accommodation_type_id) {
      const accommodationType = await AccommodationType.findOne({
        where: {
          accommodation_type_id: updateData.accommodation_type_id,
          language_id: 1
        }
      })

      if (!accommodationType) {
        throw new AppError('Invalid accommodation type', 400)
      }
    }

    const property = await PropertyRepository.updateStep(propertyId, userId, 'basics', updateData)

    if (!property) {
      throw new AppError('Property not found or unauthorized', 404)
    }

    return property
  }

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
      where: { language_id: languageId },
      attributes: ['id', 'accommodation_type_id', 'accommodation_type_name'],
      order: [['accommodation_type_id', 'ASC']]
    })

    const uniqueTypes = types.reduce((acc, type) => {
      if (!acc.find((t) => t.accommodation_type_id === type.accommodation_type_id)) {
        acc.push(type)
      }
      return acc
    }, [])

    return uniqueTypes
  }
}

export default new BasicsService()
