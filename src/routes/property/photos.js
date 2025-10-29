import { Router } from 'express'
import { PhotosController } from '../../controllers/property/photosController.js'
import { optionalAuth, authenticate } from '../../middleware/auth/authenticate.js'
import { upload, processImages, cleanupTempFiles } from '../../middleware/upload.js'
import { validatePhotoReorder } from '../../middleware/validation/property/photos.js'

const router = Router()

router.get('/:id/photos', optionalAuth, PhotosController.getPropertyPhotos)

router.post(
  '/:id/photos',
  upload.array('photos', 10),
  processImages,
  cleanupTempFiles,
  authenticate,
  PhotosController.uploadPhotos
)
router.delete('/:id/photos/:photoId', authenticate, PhotosController.deletePhoto)
router.patch('/:id/photos/:photoId/featured', authenticate, PhotosController.setFeaturedPhoto)
router.patch('/:id/photos/reorder', authenticate, validatePhotoReorder, PhotosController.reorderPhotos)
router.get('/:id/photos/status', authenticate, PhotosController.getPhotoStatus)

export default router
