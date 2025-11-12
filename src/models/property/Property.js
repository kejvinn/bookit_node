import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class Property extends Model {
  static associate(models) {
    Property.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'host'
    })

    Property.belongsTo(models.RoomType, {
      foreignKey: 'room_type_id',
      targetKey: 'room_type_id',
      as: 'roomType'
    })

    Property.belongsTo(models.AccommodationType, {
      foreignKey: 'accommodation_type_id',
      as: 'accommodationType'
    })

    Property.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'countryData'
    })

    Property.belongsTo(models.State, {
      foreignKey: 'state_id',
      as: 'stateData'
    })

    Property.hasOne(models.PropertyStep, {
      foreignKey: 'property_id',
      as: 'steps'
    })

    Property.hasMany(models.PropertyTranslation, {
      foreignKey: 'property_id',
      as: 'translations'
    })

    Property.belongsToMany(models.Characteristic, {
      through: 'characteristics_properties',
      foreignKey: 'property_id',
      otherKey: 'characteristic_id',
      as: 'characteristics'
    })

    Property.hasMany(models.PropertyPicture, {
      foreignKey: 'property_id',
      as: 'pictures'
    })

    Property.hasOne(models.PropertyPrice, {
      foreignKey: 'model_id',
      constraints: false,
      scope: {
        model: 'Property'
      },
      as: 'pricing'
    })

    Property.hasMany(models.PropertySeasonalPrice, {
      foreignKey: 'property_id',
      as: 'seasonalPrices'
    })

    Property.hasOne(models.Calendar, {
      foreignKey: 'property_id',
      as: 'calendar'
    })

    Property.hasMany(models.Reservation, {
      foreignKey: 'property_id',
      as: 'reservations'
    })

    Property.hasMany(models.Coupon, {
      foreignKey: 'property_id',
      as: 'coupons'
    })

    Property.hasMany(models.UserWishlist, {
      foreignKey: 'property_id',
      as: 'wishlistItems'
    })

    Property.belongsToMany(models.Wishlist, {
      through: models.UserWishlist,
      foreignKey: 'property_id',
      otherKey: 'wishlist_id',
      as: 'wishlists'
    })
  }

  isCompleted() {
    return this.is_completed === 1
  }

  isApproved() {
    return this.is_approved === 1
  }

  isActive() {
    return this.status === 1 && !this.deleted
  }

  canEdit(userId) {
    return this.user_id === userId
  }

  toJSON() {
    const values = { ...this.dataValues }
    return values
  }
}

Property.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.FLOAT(18, 16),
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT(18, 15),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    locality: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    state_province: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    state_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bathroom_number: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    bedroom_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bed_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    garages: {
      type: DataTypes.TINYINT(4),
      allowNull: true
    },
    construction_year: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    surface_area: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10
    },
    contract_type: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: 'rent'
    },
    minimum_days: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 1
    },
    maximum_days: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 365
    },
    availability_type: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: 'always'
    },
    available_from: {
      type: DataTypes.STRING(31),
      allowNull: true
    },
    available_to: {
      type: DataTypes.STRING(31),
      allowNull: true
    },
    checkin_time: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '17'
    },
    checkout_time: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: '10'
    },
    video_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    allow_instant_booking: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 1
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    weekly_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    monthly_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currency_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    room_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    accommodation_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    cancellation_policy_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    security_deposit: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    unicode: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 0
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    hits: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 1
    },
    is_approved: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 0
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    is_featured: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    is_completed: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    delete_reason: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    deleted: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Property',
    tableName: 'properties'
  }
)

export default Property
