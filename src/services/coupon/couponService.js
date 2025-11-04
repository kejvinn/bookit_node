import CouponRepository from '../../repositories/coupon/CouponRepository.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS } from '../../../config/constants.js'

class CouponService {
  async validateAndApplyCoupon(code, propertyId, subtotal, currency) {
    const coupon = await CouponRepository.findByCode(code)
    if (!coupon) {
      throw new AppError('Invalid coupon code', HTTP_STATUS.BAD_REQUEST)
    }

    const now = new Date()
    if (!(coupon.status === 1 && now >= new Date(coupon.date_from) && now <= new Date(coupon.date_to))) {
      throw new AppError('Coupon expired or inactive', HTTP_STATUS.BAD_REQUEST)
    }

    if (coupon.property_id && coupon.property_id !== propertyId) {
      throw new AppError('Coupon not valid for this property', HTTP_STATUS.BAD_REQUEST)
    }

    if (coupon.currency && coupon.currency !== currency) {
      throw new AppError(`Coupon only valid for currency ${coupon.currency}`, HTTP_STATUS.BAD_REQUEST)
    }

    if (coupon.purchase_count >= coupon.quantity) {
      throw new AppError('Coupon usage limit reached', HTTP_STATUS.BAD_REQUEST)
    }

    let discountAmount = 0
    let discountType = coupon.price_type === 1 ? 'percentage' : 'fixed'

    if (coupon.price_type === 1) discountAmount = (subtotal * coupon.price_value) / 100
    else discountAmount = coupon.price_value

    discountAmount = Math.min(discountAmount, subtotal)

    return {
      couponId: coupon.id,
      couponCode: coupon.code,
      discountAmount,
      discountType
    }
  }

  async incrementUsage(couponId) {
    await CouponRepository.incrementUsage(couponId)
  }

  async createCoupon(adminId, data) {
    const dateFrom = new Date(data.date_from)
    const dateTo = new Date(data.date_to)

    if (dateTo <= dateFrom) {
      throw new AppError('End date must be after start date', HTTP_STATUS.BAD_REQUEST)
    }

    // Generate code if not provided
    if (!data.code) {
      data.code = CouponRepository.generateCode()
    } else {
      data.code = data.code.toUpperCase()
    }

    // Check if code already exists
    const existing = await CouponRepository.findByCode(data.code)
    if (existing) {
      throw new AppError('A coupon with this code already exists', HTTP_STATUS.CONFLICT)
    }

    const coupon = await CouponRepository.create({
      user_id: adminId,
      name: data.name,
      code: data.code,
      price_type: data.price_type,
      price_value: data.price_value,
      coupon_type: data.coupon_type || 'travel',
      quantity: data.quantity || 1,
      date_from: data.date_from,
      date_to: data.date_to,
      description: data.description,
      property_id: data.property_id || null,
      currency: data.currency,
      status: data.status !== undefined ? data.status : 1
    })

    return coupon
  }

  async updateCoupon(couponId, data) {
    const coupon = await CouponRepository.findById(couponId)

    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND)
    }

    if (data.code && data.code !== coupon.code) {
      const existing = await CouponRepository.findByCode(data.code)
      if (existing) {
        throw new AppError('A coupon with this code already exists', HTTP_STATUS.CONFLICT)
      }
    }

    return await CouponRepository.update(couponId, data)
  }

  async deleteCoupon(couponId) {
    const coupon = await CouponRepository.findById(couponId)

    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND)
    }

    return await CouponRepository.delete(couponId)
  }

  async getCoupon(couponId) {
    const coupon = await CouponRepository.findById(couponId)

    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND)
    }

    return coupon
  }

  async getAllCoupons(filters = {}) {
    if (filters.active) {
      return await CouponRepository.findActiveCoupons()
    }
    return await CouponRepository.findAll()
  }
}

export default new CouponService()
