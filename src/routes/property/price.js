import { Router } from 'express'
import { PriceController } from '../../controllers/property/priceController.js'
import { optionalAuth, authenticate } from '../../middleware/auth/authenticate.js'
import { validatePropertyPricing } from '../../middleware/validation/property/price.js'

const router = Router()

router.get('/:id/pricing', optionalAuth, PriceController.getPropertyPricing)

router.patch('/:id/pricing', authenticate, validatePropertyPricing, PriceController.updatePricing)
router.delete('/:id/pricing', authenticate, PriceController.deletePropertyPricing)

export default router
