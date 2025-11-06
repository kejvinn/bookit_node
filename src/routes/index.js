import { Router } from 'express'
import authRoutes from './auth/auth.js'
import userRoutes from './auth/user.js'
import propertyRoutes from './property/property.js'
import basicsRoutes from './property/basics.js'
import locationRoutes from './property/location.js'
import descriptionRoutes from './property/description.js'
import photosRoutes from './property/photos.js'
import priceRoutes from './property/price/price.js'
import calendarRoutes from './property/calendar.js'
import publishRoutes from './property/publish.js'
import reservationRoutes from './reservation/reservation.js'
import instantBookingRoutes from './reservation/instantBooking.js'
import couponRoutes from './coupon/coupon.js'
import seasonalPrice from './property/price/seasonalPrice.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/auth', userRoutes)
router.use('/properties', basicsRoutes)
router.use('/properties', locationRoutes)
router.use('/properties', descriptionRoutes)
router.use('/properties', photosRoutes)
router.use('/properties', priceRoutes)
router.use('/properties', seasonalPrice)
router.use('/properties', calendarRoutes)
router.use('/properties', publishRoutes)
router.use('/properties', propertyRoutes)
router.use('/reservations', instantBookingRoutes)
router.use('/reservations', reservationRoutes)
router.use('/coupons', couponRoutes)

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

export default router
