import { Router } from 'express';
import { AuthController } from '../../controllers/auth/authController.js';
import { authenticate } from '../../middleware/auth/authenticate.js';
import { 
  validateRegister,    
  validateLogin,
  validateForgotPassword,
  validateResetPassword 
} from '../../middleware/validation/auth/auth.js';

const router = Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/activate/:code', AuthController.activate);
router.post('/forgot-password', validateForgotPassword, AuthController.forgotPassword);
router.post('/reset-password/:token', validateResetPassword, AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);

export default router;