import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class Coupon extends Model {
  static associate(models) {
    Coupon.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'creator'
    })
    Coupon.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })
  }

  isValid() {
    const now = new Date()
    const from = new Date(this.date_from)
    const to = new Date(this.date_to)

    return this.status === 1 && now >= from && now <= to && this.purchase_count < this.quantity
  }

  hasUsagesLeft() {
    return this.purchase_count < this.quantity
  }

  isValidForProperty(propertyId) {
    return !this.property_id || this.property_id === propertyId
  }
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'Admin or user who created the coupon'
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'If set, coupon only works for this property'
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    price_type: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: 1,
      comment: '1=percentage, 2=fixed'
    },
    price_value: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false
    },
    coupon_type: {
      type: DataTypes.STRING(60),
      allowNull: false,
      defaultValue: 'travel',
      comment: 'Business, travel, Promote, Advert, Birthday card etc'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    date_from: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    date_to: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    purchase_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: '0=inactive, 1=active'
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'coupons',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { name: 'user_id', fields: ['user_id'] },
      { name: 'property_id', fields: ['property_id'] }
    ]
  }
)

export default Coupon
