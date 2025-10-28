import { Router } from 'express';
import { PropertyController } from '../../controllers/property/propertyController.js';
import { authenticate, optionalAuth } from '../../middleware/auth/authenticate.js';
import { validatePropertyCreate } from '../../middleware/validation/property/property.js';

const router = Router();

router.get('/:id', optionalAuth, PropertyController.getProperty);

router.post('/', authenticate, validatePropertyCreate, PropertyController.createProperty);
router.get('/user/my-properties', authenticate, PropertyController.getUserProperties);
router.get('/:id/progress', authenticate, PropertyController.getPropertyProgress);
router.delete('/:id', authenticate, PropertyController.deleteProperty);

export default router;