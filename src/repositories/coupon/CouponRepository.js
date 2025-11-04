import { BaseRepository } from '../BaseRepository.js'
import Coupon from '../../models/coupon/Coupon.js'
import { Op } from 'sequelize'

class CouponRepository extends BaseRepository {
  constructor() {
    super(Coupon)
  }

  async findByCode(code) {
    return await Coupon.findOne({ where: { code: code.toUpperCase(), status: 1 } })
  }

  async findActiveCoupons() {
    const now = new Date()
    return await Coupon.findAll({
      where: {
        status: 1,
        date_from: { [Op.lte]: now },
        date_to: { [Op.gte]: now }
      },
      order: [['created', 'DESC']]
    })
  }

  async incrementUsage(couponId) {
    const coupon = await Coupon.findByPk(couponId)
    if (coupon) {
      coupon.purchase_count += 1
      await coupon.save()
    }
  }

  generateCode() {
    return `SAVE${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  }
}

export default new CouponRepository()
