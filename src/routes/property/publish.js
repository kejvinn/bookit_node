import { Router } from 'express'
import { PublishController } from '../../controllers/property/publishController.js'
import { authenticate } from '../../middleware/auth/authenticate.js'
import { requireAdmin } from '../../middleware/auth/requireAdmin.js'

const router = Router()

router.get('/published', PublishController.getPublishedProperties)

router.post('/:id/submit-review', authenticate, PublishController.submitForReview)
router.post('/:id/unpublish', authenticate, PublishController.unpublishProperty)
router.post('/:id/republish', authenticate, PublishController.republishProperty)

router.get('/admin/pending', authenticate, requireAdmin, PublishController.getPendingProperties)
router.post('/:id/approve', authenticate, requireAdmin, PublishController.approveProperty)
router.post('/:id/reject', authenticate, requireAdmin, PublishController.rejectProperty)

export default router
