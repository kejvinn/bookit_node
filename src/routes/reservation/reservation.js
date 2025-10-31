import { Router } from 'express'
import { ReservationController } from '../../controllers/reservation/reservationController.js'
import { authenticate } from '../../middleware/auth/authenticate.js'
import {
  validateReservation,
  validateCancelReservation,
  validateRejectReservation
} from '../../middleware/validation/reservation/reservation.js'
import { requireAdmin } from '../../middleware/auth/requireAdmin.js'

const router = Router()

// Create reservation for a property
router.post('/property/:id', authenticate, validateReservation, ReservationController.createReservation)

// Get property reservations (host only)
router.get('/property/:id', authenticate, ReservationController.getPropertyReservations)

// Get user's reservations (as guest or host)
router.get('/', authenticate, ReservationController.getUserReservations)

router.get('/:reservationId', authenticate, ReservationController.getReservation)
router.post('/:reservationId/approve', authenticate, ReservationController.approveReservation)
router.post('/:reservationId/reject', authenticate, validateRejectReservation, ReservationController.rejectReservation)
router.post('/:reservationId/cancel', authenticate, validateCancelReservation, ReservationController.cancelReservation)

// Mark as paid (admin only - temporary until PayPal integration)
router.post('/:reservationId/mark-paid', authenticate, requireAdmin, ReservationController.markAsPaid)

export default router
