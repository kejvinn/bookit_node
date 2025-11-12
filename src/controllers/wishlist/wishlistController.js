import WishlistService from '../../services/wishlist/wishlistService.js'
import { HTTP_STATUS } from '../../../config/constants.js'

export class WishlistController {
  static async createWishlist(req, res, next) {
    try {
      const wishlist = await WishlistService.createWishlist(req.user.id, req.body)

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Wishlist created successfully',
        data: wishlist
      })
    } catch (error) {
      next(error)
    }
  }

  static async getUserWishlists(req, res, next) {
    try {
      const wishlists = await WishlistService.getUserWishlists(req.user.id)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: wishlists
      })
    } catch (error) {
      next(error)
    }
  }

  static async getWishlist(req, res, next) {
    try {
      const wishlist = await WishlistService.getWishlistById(req.params.id, req.user.id)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: wishlist
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateWishlist(req, res, next) {
    try {
      const wishlist = await WishlistService.updateWishlist(req.params.id, req.user.id, req.body)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Wishlist updated successfully',
        data: wishlist
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteWishlist(req, res, next) {
    try {
      const result = await WishlistService.deleteWishlist(req.params.id, req.user.id)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Wishlist deleted successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async addProperty(req, res, next) {
    try {
      const { propertyId, wishlistId, note } = req.body

      const userWishlist = await WishlistService.addPropertyToWishlist(req.user.id, propertyId, wishlistId, note)

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Property added to wishlist successfully',
        data: userWishlist
      })
    } catch (error) {
      next(error)
    }
  }

  static async removeProperty(req, res, next) {
    try {
      const result = await WishlistService.removePropertyFromWishlist(
        req.user.id,
        req.params.propertyId,
        req.params.wishlistId
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Property removed from wishlist successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateNote(req, res, next) {
    try {
      const { note } = req.body

      const userWishlist = await WishlistService.updateNote(req.user.id, req.params.id, note)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Note updated successfully',
        data: userWishlist
      })
    } catch (error) {
      next(error)
    }
  }

  static async getPropertyWishlists(req, res, next) {
    try {
      const wishlists = await WishlistService.getPropertyWishlists(req.user.id, req.params.propertyId)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: wishlists
      })
    } catch (error) {
      next(error)
    }
  }
}
