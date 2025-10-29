import { Router } from 'express'
import { BasicsController } from '../../controllers/property/basicsController.js'
import { authenticate } from '../../middleware/auth/authenticate.js'
import { validatePropertyBasics } from '../../middleware/validation/property/basics.js'

const router = Router()

router.get('/room-types', BasicsController.getRoomTypes)
router.get('/accommodation-types', BasicsController.getAccommodationTypes)

router.patch('/:id/basics', authenticate, validatePropertyBasics, BasicsController.updateBasics)

export default router
