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
  .patch('/update', authenticate, validatePropertyPricing, PropertyPriceController.updatePricing)
  .delete('/delete', authenticate, PropertyPriceController.deletePropertyPricing)

router
  .route('/:id/seasonal-prices')
  .get(optionalAuth, PropertyPriceController.getPropertySeasonalPrices)
  .post('/create', authenticate, validateSeasonalPrice, PropertyPriceController.createSeasonalPrice)
  .patch('/:seasonalPriceId/update', authenticate, validateUpdateSeasonalPrice, PropertyPriceController.updateSeasonalPrice)
  .delete('/:seasonalPriceId/delete', authenticate, PropertyPriceController.deleteSeasonalPrice)

export default router
