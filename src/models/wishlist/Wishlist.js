import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class Wishlist extends Model {
  static associate(models) {
    Wishlist.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    })

    Wishlist.hasMany(models.UserWishlist, {
      foreignKey: 'wishlist_id',
      as: 'items'
    })

    Wishlist.belongsToMany(models.Property, {
      through: models.UserWishlist,
      foreignKey: 'wishlist_id',
      otherKey: 'property_id',
      as: 'properties'
    })
  }

  async incrementCount() {
    return await this.increment('count')
  }

  async decrementCount() {
    if (this.count > 0) {
      return await this.decrement('count')
    }
    return this
  }

  async updateCount() {
    const UserWishlist = sequelize.models.UserWishlist
    const count = await UserWishlist.count({
      where: { wishlist_id: this.id }
    })
    return await this.update({ count })
  }

  isActive() {
    return this.status === 1
  }

  belongsTo(userId) {
    return this.user_id === userId
  }

  toJSON() {
    const values = { ...this.dataValues }
    return values
  }
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 1
    }
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified'
  }
)

export default Wishlist
