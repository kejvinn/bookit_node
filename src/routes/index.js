import { Router } from 'express'
import authRoutes from './auth/auth.js'
import userRoutes from './auth/user.js'
import propertyRoutes from './property/property.js'
import propertyPriceRoutes from './property/price/price.js'
import propertyCalendarRoutes from './property/calendar.js'
import propertyPublishRoutes from './property/publish.js'
import propertyReservationRoutes from './reservation/reservation.js'
import propertyInstantBookingRoutes from './reservation/instantBooking.js'
import couponRoutes from './coupon/coupon.js'
import paymentRoutes from './payment/payment.js'
import wishlistRoutes from './wishlist/wishlist.js'
import messageRoutes from './message/message.js'

const router = Router()

router.use('/auth', [authRoutes, userRoutes])
router.use('/properties', [
  propertyRoutes,
  propertyPriceRoutes,
  propertyCalendarRoutes,
  propertyPublishRoutes,
  propertyInstantBookingRoutes,
  propertyReservationRoutes
])
router.use('/reservations', [propertyInstantBookingRoutes, propertyReservationRoutes])
router.use('/coupons', couponRoutes)
router.use('/payments', paymentRoutes)
router.use('/wishlists', wishlistRoutes)
router.use('/messages', messageRoutes)

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

export default router
