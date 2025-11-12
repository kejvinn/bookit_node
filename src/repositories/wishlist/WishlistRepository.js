import { BaseRepository } from '../BaseRepository.js'
import { Wishlist, Property, PropertyPicture } from '../../models/index.js'
import { Op } from 'sequelize'

class WishlistRepository extends BaseRepository {
  constructor() {
    super(Wishlist)
  }

  async findByUserIdWithProperties(userId) {
    return await Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Property,
          as: 'properties',
          through: {
            attributes: ['note', 'created']
          },
          required: false,
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

  async findByIdWithProperties(id, userId) {
    return await Wishlist.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: Property,
          as: 'properties',
          through: {
            attributes: ['id', 'note', 'created']
          },
          required: false,
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
      ]
    })
  }

  async existsByName(userId, name, excludeId = null) {
    const where = {
      user_id: userId,
      name
    }

    if (excludeId) {
      where.id = { [Op.ne]: excludeId }
    }

    return await this.exists(where)
  }

  async findByUserAndName(userId, name) {
    return await this.findOne({ user_id: userId, name })
  }
}

export default new WishlistRepository()
