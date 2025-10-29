import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import PhotosRepository from '../../repositories/property/PhotosRepository.js'
import { AppError } from '../../utils/helpers.js'
import { UPLOAD_LIMITS, HTTP_STATUS } from '../../../config/constants.js'

class PhotosService {
  async uploadPhotos(propertyId, userId, images) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
    }

    // Check for duplicate photos
    const hashes = images.map((img) => img.hash)
    const existingPhotos = await PhotosRepository.findDuplicateHashes(propertyId, hashes)

    if (existingPhotos.length > 0) {
      const duplicateNames = existingPhotos.map((p) => p.image_caption).join(', ')
      throw new AppError(
        `Duplicate photo(s) detected: ${duplicateNames}. These photos have already been uploaded.`,
        HTTP_STATUS.BAD_REQUEST
      )
    }

    // Check maximum count
    const currentCount = await PhotosRepository.countPropertyPhotos(propertyId)
    if (currentCount + images.length > UPLOAD_LIMITS.MAX_PHOTOS_PER_PROPERTY) {
      throw new AppError(
        `Maximum ${UPLOAD_LIMITS.MAX_PHOTOS_PER_PROPERTY} photos allowed. You currently have ${currentCount} photos.`,
        HTTP_STATUS.BAD_REQUEST
      )
    }

    const pictures = await PhotosRepository.createMany(propertyId, userId, images)
    const totalPhotos = currentCount + images.length

    if (currentCount === 0 && pictures.length > 0) {
      await PropertyRepository.update(propertyId, {
        thumbnail: pictures[0].image_path
      })
    }

    const stepComplete = totalPhotos >= UPLOAD_LIMITS.MIN_PHOTOS_REQUIRED
    await PropertyRepository.markStepStatus(propertyId, 'photos', stepComplete)

    return {
      pictures,
      total: totalPhotos,
      remaining: Math.max(0, UPLOAD_LIMITS.MIN_PHOTOS_REQUIRED - totalPhotos)
    }
  }

  async getPropertyPhotos(propertyId, userId = null) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    if (property.status === 0 || property.deleted) {
      if (!userId || property.user_id !== userId) {
        throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
      }
    }

    return await PhotosRepository.findByPropertyId(propertyId)
  }

  async deletePhoto(propertyId, photoId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
    }

    // Perform file + DB deletion via repository
    const deletedPicture = await PhotosRepository.deleteImage(photoId, propertyId)
    if (!deletedPicture) {
      throw new AppError('Photo not found', HTTP_STATUS.NOT_FOUND)
    }

    const remainingPhotos = await PhotosRepository.findByPropertyId(propertyId)
    const photoCount = remainingPhotos.length

    const stepComplete = photoCount >= UPLOAD_LIMITS.MIN_PHOTOS_REQUIRED
    await PropertyRepository.markStepStatus(propertyId, 'photos', stepComplete)

    // Update thumbnail
    if (photoCount === 0) {
      await PropertyRepository.update(propertyId, { thumbnail: null })
    } else if (property.thumbnail === deletedPicture.image_path) {
      await PropertyRepository.update(propertyId, {
        thumbnail: remainingPhotos[0].image_path
      })
    }

    return {
      message: 'Photo deleted successfully',
      remaining: photoCount,
      minimumRequired: UPLOAD_LIMITS.MIN_PHOTOS_REQUIRED
    }
  }

  async setFeaturedPhoto(propertyId, photoId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
    }

    const photo = await PhotosRepository.setFeatured(photoId, propertyId)
    if (!photo) {
      throw new AppError('Photo not found', HTTP_STATUS.NOT_FOUND)
    }

    await PropertyRepository.update(propertyId, {
      thumbnail: photo.image_path
    })

    return photo
  }

  async reorderPhotos(propertyId, userId, imageOrders) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) {
      throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
    }

    return await PhotosRepository.updateSortOrder(propertyId, imageOrders)
  }

  async validatePhotoCompletion(propertyId) {
    const photoCount = await PhotosRepository.countPropertyPhotos(propertyId)

    return {
      isComplete: photoCount >= UPLOAD_LIMITS.MIN_PHOTOS_REQUIRED,
      current: photoCount,
      required: UPLOAD_LIMITS.MIN_PHOTOS_REQUIRED,
      remaining: Math.max(0, UPLOAD_LIMITS.MIN_PHOTOS_REQUIRED - photoCount)
    }
  }
}

export default new PhotosService()
