import { Router } from 'express'
import { PropertyController } from '../../controllers/property/propertyController.js'
import { authenticate, optionalAuth } from '../../middleware/auth/authenticate.js'
import { validatePropertyCreate } from '../../middleware/validation/property/property.js'
import { validatePropertyBasics } from '../../middleware/validation/property/basics.js'
import { validatePropertyLocation } from '../../middleware/validation/property/location.js'
import {
  validatePropertyAmenities,
  validatePropertyDescription
} from '../../middleware/validation/property/description.js'
import { PropertyPhotosController } from '../../controllers/property/propertyPhotosController.js'
import { cleanupTempFiles, processImages, upload } from '../../middleware/upload.js'
import { validatePhotoReorder } from '../../middleware/validation/property/photos.js'

const router = Router()
// main routes
router.get('/:id', optionalAuth, PropertyController.getProperty)
router.get('/:id/progress', authenticate, PropertyController.getPropertyProgress)
router.get('/my-properties', authenticate, PropertyController.getUserProperties)
router.post('/create', authenticate, validatePropertyCreate, PropertyController.createProperty)
router.delete('/:id', authenticate, PropertyController.deleteProperty)

//general type routes
router.get('/room-types', PropertyController.getStaticData('getRoomTypes'))
router.get('/accommodation-types', PropertyController.getStaticData('getAccommodationTypes'))
router.get('/countries', PropertyController.getStaticData('getCountries', false))
router.get('/characteristics', PropertyController.getStaticData('getCharacteristics'))

// basics routes
router.patch('/:id/basics', authenticate, validatePropertyBasics, PropertyController.updateBasics)

// location routes
router.get('/countries/:countryId/states', PropertyController.getStates)
router.patch('/:id/location', authenticate, validatePropertyLocation, PropertyController.updateLocation)

//Description routes
router.get('/:id/translations', authenticate, PropertyController.getPropertyTranslations)
router.patch('/:id/description', authenticate, validatePropertyDescription, PropertyController.updateDescription)
router.get('/:id/amenities', authenticate, PropertyController.getPropertyAmenities)
router.patch('/:id/amenities', authenticate, validatePropertyAmenities, PropertyController.updateAmenities)

// Photos routes
router.get('/:id/photos', optionalAuth, PropertyPhotosController.getPropertyPhotos)
router.post(
  '/:id/photos',
  upload.array('photos', 10),
  processImages,
  cleanupTempFiles,
  authenticate,
  PropertyPhotosController.uploadPhotos
)
router.delete('/:id/photos/:photoId', authenticate, PropertyPhotosController.deletePhoto)
router.patch('/:id/photos/:photoId/featured', authenticate, PropertyPhotosController.setFeaturedPhoto)
router.patch('/:id/photos/reorder', authenticate, validatePhotoReorder, PropertyPhotosController.reorderPhotos)
router.get('/:id/photos/status', authenticate, PropertyPhotosController.getPhotoStatus)

export default router
