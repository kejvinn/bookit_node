import couponService from '../../services/coupon/couponService.js'
import { asyncHandler } from '../../utils/helpers.js'

export class CouponController {
  static createCoupon = asyncHandler(async (req, res) => {
    const coupon = await couponService.createCoupon(req.user.id, req.body)

    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    })
  })

  static updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await couponService.updateCoupon(req.params.id, req.body)

    res.json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully'
    })
  })

  static deleteCoupon = asyncHandler(async (req, res) => {
    await couponService.deleteCoupon(req.params.id)

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    })
  })

  static getCoupon = asyncHandler(async (req, res) => {
    const coupon = await couponService.getCoupon(req.params.id)

    res.json({
      success: true,
      data: coupon
    })
  })

  static getAllCoupons = asyncHandler(async (req, res) => {
    const filters = {
      active: req.query.active === 'true'
    }
    const coupons = await couponService.getAllCoupons(filters)

    res.json({
      success: true,
      data: coupons,
      count: coupons.length
    })
  })

  static validateCoupon = asyncHandler(async (req, res) => {
    const { code, property_id, amount } = req.body

    const result = await couponService.validateAndApplyCoupon(code, property_id, amount, 'EUR')

    res.json({
      success: true,
      data: result,
      message: 'Coupon is valid'
    })
  })
}
