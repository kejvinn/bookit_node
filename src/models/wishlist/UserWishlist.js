import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class UserWishlist extends Model {
  static associate(models) {
    UserWishlist.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    })

    UserWishlist.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })

    UserWishlist.belongsTo(models.Wishlist, {
      foreignKey: 'wishlist_id',
      as: 'wishlist'
    })
  }

  belongsTo(userId) {
    return this.user_id === userId
  }

  toJSON() {
    const values = { ...this.dataValues }
    return values
  }
}

UserWishlist.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    wishlist_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'wishlists',
        key: 'id'
      }
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'UserWishlist',
    tableName: 'user_wishlists',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { name: 'wishlist_id', fields: ['wishlist_id'] },
      { name: 'property_id', fields: ['property_id'] },
      { name: 'user_id', fields: ['user_id'] }
    ]
  }
)

export default UserWishlist
