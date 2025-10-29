import { Router } from 'express'
import { LocationController } from '../../controllers/property/locationController.js'
import { authenticate } from '../../middleware/auth/authenticate.js'
import { validatePropertyLocation } from '../../middleware/validation/property/location.js'

const router = Router()

router.get('/countries', LocationController.getCountries)
router.get('/countries/:countryId/states', LocationController.getStates)

router.patch('/:id/location', authenticate, validatePropertyLocation, LocationController.updateLocation)

export default router
