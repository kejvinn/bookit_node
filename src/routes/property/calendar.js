import { Router } from 'express'
import { authenticate, optionalAuth } from '../../middleware/auth/authenticate.js'
import { validateCalendar, validateBlockDates } from '../../middleware/validation/property/calendar.js'
import { PropertyCalendarController } from '../../controllers/property/propertyCalendarController.js'

const router = Router()
router
  .route('/:id/calendar')
  .get('', optionalAuth, PropertyCalendarController.getCalendar)
  .put('/update', authenticate, validateCalendar, PropertyCalendarController.updateCalendar)
  .delete('/delete', authenticate, PropertyCalendarController.deleteCalendar)
  .post('/block', authenticate, validateBlockDates, PropertyCalendarController.blockDates)
  .post('/unblock', authenticate, validateBlockDates, PropertyCalendarController.unblockDates)

export default router
