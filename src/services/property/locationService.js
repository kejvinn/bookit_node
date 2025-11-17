import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import CountryRepository from '../../repositories/property/LocationRepository.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS } from '../../../config/constants.js'

class LocationService {
  async updateLocation(propertyId, userId, data) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })

    if (!property) {
      throw new AppError('Property not found or unauthorized', 404)
    }

    const allowedFields = [
      'country',
      'country_id',
      'state_id',
      'address',
      'city',
      'locality',
      'district',
      'state_province',
      'zip_code',
      'latitude',
      'longitude'
    ]

    const updateData = {}
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    })

    if (data.address && !data.city) {
      throw new AppError('City is required when address is provided', HTTP_STATUS.BAD_REQUEST)
    }

    if (data.address && !data.country_id && !data.country) {
      throw new AppError('Country is required when address is provided', HTTP_STATUS.BAD_REQUEST)
    }

    if (data.country_id) {
      const country = await CountryRepository.getById(data.country_id)
      if (!country) {
        throw new AppError('Invalid country', HTTP_STATUS.BAD_REQUEST)
      }
      updateData.country = country.name
    }

    if (data.state_id) {
      const state = await CountryRepository.getStateById(data.state_id)
      if (!state) {
        throw new AppError('Invalid state', HTTP_STATUS.BAD_REQUEST)
      }
      updateData.state_province = state.name
    }

    const updatedProperty = await PropertyRepository.updateStep(propertyId, userId, 'location', updateData)

    if (!updatedProperty) {
      throw new AppError('Failed to update property', HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    return updatedProperty
  }

  async getStates(countryId) {
    return await CountryRepository.getStates(countryId)
  }
}

export default new LocationService()
