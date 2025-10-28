import { Router } from 'express';
import authRoutes from './auth/auth.js';
import userRoutes from './auth/user.js';
import propertyRoutes from './property/property.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/auth', userRoutes);
router.use('/properties', propertyRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;