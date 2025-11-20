import { Router } from 'express'
import { authenticate, optionalAuth } from '../../middleware/auth/authenticate.js'
import { validateCalendar, validateBlockDates } from '../../middleware/validation/property/calendar.js'
import { PropertyCalendarController } from '../../controllers/property/propertyCalendarController.js'

const router = Router()
router
  .route('/:id/calendar')
  .get(optionalAuth, PropertyCalendarController.getCalendar)
  .put(authenticate, validateCalendar, PropertyCalendarController.updateCalendar)
  .delete(authenticate, PropertyCalendarController.deleteCalendar)

router.post('/:id/calendar/block', authenticate, validateBlockDates, PropertyCalendarController.blockDates)
router.post('/:id/calendar/unblock', authenticate, validateBlockDates, PropertyCalendarController.unblockDates)

export default router
