import { Router } from 'express'
import { PropertyPublishController } from '../../controllers/property/propertyPublishController.js'
import { authenticate } from '../../middleware/auth/authenticate.js'
import { requireAdmin } from '../../middleware/auth/requireAdmin.js'

const router = Router()

router.get('/published', PropertyPublishController.getPublishedProperties)

router.post('/:id/submit-review', authenticate, PropertyPublishController.submitForReview)
router.post('/:id/unpublish', authenticate, PropertyPublishController.unpublishProperty)
router.post('/:id/republish', authenticate, PropertyPublishController.republishProperty)
router.get('/admin/pending', authenticate, requireAdmin, PropertyPublishController.getPendingProperties)
router.post('/:id/approve', authenticate, requireAdmin, PropertyPublishController.approveProperty)
router.post('/:id/reject', authenticate, requireAdmin, PropertyPublishController.rejectProperty)

export default router
