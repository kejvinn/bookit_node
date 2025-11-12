import { Router } from 'express'
import { WishlistController } from '../../controllers/wishlist/wishlistController.js'
import { authenticate } from '../../middleware/auth/authenticate.js'
import {
  validateWishlistCreate,
  validateWishlistUpdate,
  validateAddProperty,
  validateUpdateNote
} from '../../middleware/validation/wishlist/wishlistValidation.js'

const router = Router()

// Collection
router.post('/', authenticate, validateWishlistCreate, WishlistController.createWishlist)
router.get('/', authenticate, WishlistController.getUserWishlists)
router.get('/:id', authenticate, WishlistController.getWishlist)
router.put('/:id', authenticate, validateWishlistUpdate, WishlistController.updateWishlist)
router.delete('/:id', authenticate, WishlistController.deleteWishlist)

// Favourites
router.post('/items', authenticate, validateAddProperty, WishlistController.addProperty)
router.delete('/items/:wishlistId/:propertyId', authenticate, WishlistController.removeProperty)
router.patch('/items/:id/note', authenticate, validateUpdateNote, WishlistController.updateNote)

// Get wishlists containing a specific property
router.get('/property/:propertyId', authenticate, WishlistController.getPropertyWishlists)

export default router
