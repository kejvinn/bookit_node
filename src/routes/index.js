import { Router } from 'express'
import authRoutes from './auth/auth.js'
import userRoutes from './auth/user.js'
import propertyRoutes from './property/property.js'
import basicsRoutes from './property/basics.js'
import locationRoutes from './property/location.js'
import descriptionRoutes from './property/description.js'
import photosRoutes from './property/photos.js'
import priceRoutes from './property/price.js'
import calendarRoutes from './property/calendar.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/auth', userRoutes)
router.use('/properties', basicsRoutes)
router.use('/properties', locationRoutes)
router.use('/properties', descriptionRoutes)
router.use('/properties', photosRoutes)
router.use('/properties', priceRoutes)
router.use('/properties', calendarRoutes)
router.use('/properties', propertyRoutes)

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

export default router
