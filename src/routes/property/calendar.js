import { Router } from 'express'
import { CalendarController } from '../../controllers/property/calendarController.js'
import { authenticate, optionalAuth } from '../../middleware/auth/authenticate.js'
import { validateCalendar, validateBlockDates } from '../../middleware/validation/property/calendar.js'

const router = Router()

router.get('/:id/calendar', optionalAuth, CalendarController.getCalendar)

router.put('/:id/calendar', authenticate, validateCalendar, CalendarController.updateCalendar)
router.delete('/:id/calendar', authenticate, CalendarController.deleteCalendar)
router.post('/:id/calendar/block', authenticate, validateBlockDates, CalendarController.blockDates)
router.post('/:id/calendar/unblock', authenticate, validateBlockDates, CalendarController.unblockDates)

export default router
