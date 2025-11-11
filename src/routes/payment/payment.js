import { Router } from 'express'
import { PaymentController } from '../../controllers/payment/paymentController.js'
import { authenticate } from '../../middleware/auth/authenticate.js'
import { validateCapturePayment } from '../../middleware/validation/payment/payment.js'
import { requireAdmin } from '../../middleware/auth/requireAdmin.js'

const router = Router()

// PayPal return URLs
router.get('/paypal/success', PaymentController.handlePayPalSuccess)
router.get('/paypal/cancel', PaymentController.handlePayPalCancel)

// Capture PayPal payment
router.post('/:reservationId/create', authenticate, PaymentController.createPayPalOrder)
router.post('/:reservationId/capture', authenticate, validateCapturePayment, PaymentController.capturePayPalOrder)
router.get('/:reservationId/status', authenticate, PaymentController.getPaymentStatus)
router.get('/paypal/order/:orderId/status', authenticate, PaymentController.checkPayPalOrderStatus)
router.post('/:reservationId/refund', authenticate, requireAdmin, PaymentController.refundPayment)

export default router
