import photosService from '../../services/property/photosService.js'
import { asyncHandler } from '../../utils/helpers.js'
import { AppError } from '../../utils/helpers.js'

export class PropertyPhotosController {
  static uploadPhotos = asyncHandler(async (req, res) => {
    if (!req.processedFiles || req.processedFiles.length === 0) {
      throw new AppError('No images uploaded', 400)
    }

    const result = await photosService.uploadPhotos(req.params.id, req.user.id, req.processedFiles)

    res.status(201).json({
      success: true,
      data: result.pictures,
      meta: {
        total: result.total,
        minimumRequired: 5,
        remaining: result.remaining,
        stepComplete: result.remaining === 0
      },
      message:
        result.remaining > 0
          ? `${result.pictures.length} photo(s) uploaded. ${result.remaining} more required.`
          : `${result.pictures.length} photo(s) uploaded successfully. Photo requirement met!`
    })
  })

  static getPropertyPhotos = asyncHandler(async (req, res) => {
    const photos = await photosService.getPropertyPhotos(req.params.id, req.user?.id)

    res.json({
      success: true,
      data: photos
    })
  })

  static deletePhoto = asyncHandler(async (req, res) => {
    const { id: propertyId, photoId } = req.params
    const result = await photosService.deletePhoto(propertyId, photoId, req.user.id)

    res.json({
      success: true,
      message: result.message,
      meta: {
        remaining: result.remaining,
        minimumRequired: result.minimumRequired,
        needsMore: result.remaining < result.minimumRequired
      }
    })
  })

  static setFeaturedPhoto = asyncHandler(async (req, res) => {
    const photo = await photosService.setFeaturedPhoto(req.params.id, req.params.photoId, req.user.id)

    res.json({
      success: true,
      data: photo,
      message: 'Featured photo updated successfully'
    })
  })

  static reorderPhotos = asyncHandler(async (req, res) => {
    const photos = await photosService.reorderPhotos(req.params.id, req.user.id, req.body.imageOrders)

    res.json({
      success: true,
      data: photos,
      message: 'Photo order updated successfully'
    })
  })

  static getPhotoStatus = asyncHandler(async (req, res) => {
    const status = await photosService.validatePhotoCompletion(req.params.id)

    res.json({
      success: true,
      data: status
    })
  })
}
