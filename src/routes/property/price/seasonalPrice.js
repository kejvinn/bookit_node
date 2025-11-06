import { Router } from 'express'
import { SeasonalPriceController } from '../../../controllers/property/price/seasonalPriceController.js'
import { authenticate, optionalAuth } from '../../../middleware/auth/authenticate.js'
import {
  validateSeasonalPrice,
  validateUpdateSeasonalPrice
} from '../../../middleware/validation/property/price/seasonalPrice.js'
const router = Router()

// Get all seasonal prices for a property
router.get('/:id/seasonal-prices', optionalAuth, SeasonalPriceController.getPropertySeasonalPrices)

// Create seasonal price
router.post('/:id/seasonal-prices', authenticate, validateSeasonalPrice, SeasonalPriceController.createSeasonalPrice)

// Update seasonal price
router.patch(
  '/:id/seasonal-prices/:seasonalPriceId',
  authenticate,
  validateUpdateSeasonalPrice,
  SeasonalPriceController.updateSeasonalPrice
)

// Delete seasonal price
router.delete('/:id/seasonal-prices/:seasonalPriceId', authenticate, SeasonalPriceController.deleteSeasonalPrice)

export default router
