import { Router } from 'express';
import { UserController } from '../../controllers/auth/userController.js';
import { authenticate } from '../../middleware/auth/authenticate.js';
import { requireAdmin } from '../../middleware/auth/requireAdmin.js';

const router = Router();

router.get('/me', authenticate, UserController.me);
router.put('/profile', authenticate, UserController.updateProfile);
router.put('/account', authenticate, UserController.updateAccount);
router.delete('/account', authenticate, UserController.deleteMyAccount);

router.delete('/admin/users/:userId', authenticate, requireAdmin, UserController.adminDeleteUser);
router.post('/admin/users/:userId/ban', authenticate, requireAdmin, UserController.banUser);
router.post('/admin/users/:userId/unban', authenticate, requireAdmin, UserController.unbanUser);

export default router;