import { Router } from 'express'
import { CouponController } from '../../controllers/coupon/couponController.js'
import { authenticate } from '../../middleware/auth/authenticate.js'
import { requireAdmin } from '../../middleware/auth/requireAdmin.js'
import {
  validateCreateCoupon,
  validateUpdateCoupon,
  validateCouponCode
} from '../../middleware/validation/coupon/coupon.js'

const router = Router()

router.post('/', authenticate, requireAdmin, validateCreateCoupon, CouponController.createCoupon)
router.put('/:id', authenticate, requireAdmin, validateUpdateCoupon, CouponController.updateCoupon)
router.delete('/:id', authenticate, requireAdmin, CouponController.deleteCoupon)
router.get('/:id', authenticate, requireAdmin, CouponController.getCoupon)
router.get('/', authenticate, requireAdmin, CouponController.getAllCoupons)
// Shared (user + host): validate coupon before applying it
router.post('/validate', authenticate, validateCouponCode, CouponController.validateCoupon)

export default router
