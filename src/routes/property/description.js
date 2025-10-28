import { Router } from 'express';
import { DescriptionController } from '../../controllers/property/descriptionController.js';
import { authenticate } from '../../middleware/auth/authenticate.js';
import { 
  validatePropertyAmenities, 
  validatePropertyDescription 
} from '../../middleware/validation/property/description.js';

const router = Router();

router.get('/characteristics', DescriptionController.getCharacteristics);

router.get('/:id/amenities', authenticate, DescriptionController.getPropertyAmenities);
router.get('/:id/translations', authenticate, DescriptionController.getPropertyTranslations);
router.patch('/:id/amenities', authenticate, validatePropertyAmenities, DescriptionController.updateAmenities);
router.patch('/:id/description', authenticate, validatePropertyDescription, DescriptionController.updateDescription);

export default router;