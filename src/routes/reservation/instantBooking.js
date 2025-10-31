import { Router } from 'express'
import { authenticate } from '../../middleware/auth/authenticate.js'
import { InstantBookingController } from '../../controllers/reservation/instantBookingController.js'

const router = Router()

// Toggle instant booking for a property (host only)
router.patch('/:id/instant-booking', authenticate, InstantBookingController.toggleInstantBooking)

export default router
