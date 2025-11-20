import { Router } from 'express'

import { authenticate, optionalAuth } from '../../../middleware/auth/authenticate.js'
import { validatePropertyPricing } from '../../../middleware/validation/property/price/price.js'
import {
  validateSeasonalPrice,
  validateUpdateSeasonalPrice
} from '../../../middleware/validation/property/price/seasonalPrice.js'
import { PropertyPriceController } from '../../../controllers/property/propertyPriceController.js'

const router = Router()

router
  .route('/:id/pricing')
  .get(optionalAuth, PropertyPriceController.getPropertyPricing)
  .patch(authenticate, validatePropertyPricing, PropertyPriceController.updatePricing)
  .delete(authenticate, PropertyPriceController.deletePropertyPricing)

router
  .route('/:id/seasonal-prices')
  .get(optionalAuth, PropertyPriceController.getPropertySeasonalPrices)
  .post(authenticate, validateSeasonalPrice, PropertyPriceController.createSeasonalPrice)
router
  .route('/:id/seasonal-prices/:seasonalPriceId')
  .patch(authenticate, validateUpdateSeasonalPrice, PropertyPriceController.updateSeasonalPrice)
  .delete(authenticate, PropertyPriceController.deleteSeasonalPrice)

export default router
