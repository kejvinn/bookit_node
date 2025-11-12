import WishlistRepository from '../../repositories/wishlist/WishlistRepository.js'
import UserWishlistRepository from '../../repositories/wishlist/UserWishlistRepository.js'
import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS } from '../../../config/constants.js'

class WishlistService {
  async createWishlist(userId, data) {
    const { name } = data

    const exists = await WishlistRepository.existsByName(userId, name)
    if (exists) {
      throw new AppError('A wishlist with this name already exists', HTTP_STATUS.CONFLICT)
    }

    const wishlist = await WishlistRepository.create({
      user_id: userId,
      name,
      count: 0,
      status: 1
    })

    return wishlist
  }

  async getUserWishlists(userId) {
    const wishlists = await WishlistRepository.findByUserIdWithProperties(userId)
    return wishlists
  }

  async getWishlistById(wishlistId, userId) {
    const wishlist = await WishlistRepository.findByIdWithProperties(wishlistId, userId)

    if (!wishlist) {
      throw new AppError('Wishlist not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!wishlist.belongsTo(userId)) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    return wishlist
  }

  async updateWishlist(wishlistId, userId, data) {
    const wishlist = await WishlistRepository.findById(wishlistId)

    if (!wishlist) {
      throw new AppError('Wishlist not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!wishlist.belongsTo(userId)) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    const { name } = data

    if (name && name !== wishlist.name) {
      const exists = await WishlistRepository.existsByName(userId, name, wishlistId)
      if (exists) {
        throw new AppError('A wishlist with this name already exists', HTTP_STATUS.CONFLICT)
      }
    }

    await wishlist.update({ name })

    return await WishlistRepository.findByIdWithProperties(wishlistId, userId)
  }

  async deleteWishlist(wishlistId, userId) {
    const wishlist = await WishlistRepository.findById(wishlistId)

    if (!wishlist) {
      throw new AppError('Wishlist not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!wishlist.belongsTo(userId)) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    await UserWishlistRepository.deleteByWishlist(wishlistId, userId)

    await WishlistRepository.delete(wishlistId)

    return { id: wishlistId, deleted: true }
  }

  async addPropertyToWishlist(userId, propertyId, wishlistId, note = null) {
    const property = await PropertyRepository.findById(propertyId)
    if (!property || !property.isActive()) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    const wishlist = await WishlistRepository.findOne({
      id: wishlistId,
      user_id: userId
    })

    if (!wishlist) {
      throw new AppError('Wishlist not found', HTTP_STATUS.NOT_FOUND)
    }

    const exists = await UserWishlistRepository.existsInWishlist(userId, propertyId, wishlistId)

    if (exists) {
      throw new AppError('Property already exists in this wishlist', HTTP_STATUS.CONFLICT)
    }

    const userWishlist = await UserWishlistRepository.create({
      user_id: userId,
      property_id: propertyId,
      wishlist_id: wishlistId,
      note
    })

    await wishlist.incrementCount()

    return userWishlist
  }

  async removePropertyFromWishlist(userId, propertyId, wishlistId) {
    const wishlist = await WishlistRepository.findOne({
      id: wishlistId,
      user_id: userId
    })

    if (!wishlist) {
      throw new AppError('Wishlist not found', HTTP_STATUS.NOT_FOUND)
    }

    const deleted = await UserWishlistRepository.deleteByWishlistAndProperty(wishlistId, propertyId, userId)

    if (deleted === 0) {
      throw new AppError('Property not found in wishlist', HTTP_STATUS.NOT_FOUND)
    }

    await wishlist.decrementCount()

    return { wishlistId, propertyId, deleted: true }
  }

  async updateNote(userId, userWishlistId, note) {
    const userWishlist = await UserWishlistRepository.findById(userWishlistId)

    if (!userWishlist) {
      throw new AppError('Wishlist item not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!userWishlist.belongsTo(userId)) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    await userWishlist.update({ note })

    return userWishlist
  }

  async getPropertyWishlists(userId, propertyId) {
    const property = await PropertyRepository.findById(propertyId)
    if (!property || !property.isActive()) {
      throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
    }

    const wishlists = await UserWishlistRepository.findByUserAndProperty(userId, propertyId)

    return wishlists
  }
}

export default new WishlistService()
