import { BaseRepository } from '../BaseRepository.js'
import { UserWishlist, Property, Wishlist, PropertyPicture } from '../../models/index.js'

class UserWishlistRepository extends BaseRepository {
  constructor() {
    super(UserWishlist)
  }

  async findByUserAndProperty(userId, propertyId) {
    return await UserWishlist.findAll({
      where: {
        user_id: userId,
        property_id: propertyId
      },
      include: [
        {
          model: Wishlist,
          as: 'wishlist',
          attributes: ['id', 'name']
        }
      ]
    })
  }

  async existsInWishlist(userId, propertyId, wishlistId) {
    return await this.exists({
      user_id: userId,
      property_id: propertyId,
      wishlist_id: wishlistId
    })
  }

  async findByWishlist(wishlistId, userId) {
    return await UserWishlist.findAll({
      where: {
        wishlist_id: wishlistId,
        user_id: userId
      },
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: PropertyPicture,
              as: 'pictures',
              where: { is_featured: 1 },
              required: false,
              limit: 1
            }
          ]
        }
      ],
      order: [['created', 'DESC']]
    })
  }

  async deleteByWishlistAndProperty(wishlistId, propertyId, userId) {
    return await UserWishlist.destroy({
      where: {
        wishlist_id: wishlistId,
        property_id: propertyId,
        user_id: userId
      }
    })
  }

  async deleteByWishlist(wishlistId, userId) {
    return await UserWishlist.destroy({
      where: {
        wishlist_id: wishlistId,
        user_id: userId
      }
    })
  }
}

export default new UserWishlistRepository()
