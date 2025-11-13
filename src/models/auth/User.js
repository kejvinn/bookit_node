import { DataTypes, Model } from 'sequelize'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import sequelize from '../../../config/sequelize.js'

class User extends Model {
  static associate(models) {
    User.hasOne(models.UserProfile, {
      foreignKey: 'user_id',
      as: 'profile'
    })

    User.hasMany(models.Property, {
      foreignKey: 'user_id',
      as: 'properties'
    })

    User.hasMany(models.PropertyPicture, {
      foreignKey: 'user_id',
      as: 'uploadedPictures'
    })

    // As a guest
    User.hasMany(models.Reservation, {
      foreignKey: 'user_by',
      as: 'guest_reservations'
    })

    // As a host
    User.hasMany(models.Reservation, {
      foreignKey: 'user_to',
      as: 'host_reservations'
    })

    User.hasMany(models.Coupon, {
      foreignKey: 'user_id',
      as: 'created_coupons'
    })

    User.hasMany(models.Wishlist, {
      foreignKey: 'user_id',
      as: 'wishlists'
    })

    User.hasMany(models.UserWishlist, {
      foreignKey: 'user_id',
      as: 'wishlistItems'
    })
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
  }

  isActive() {
    return this.status === 1 && !this.is_banned
  }

  isAdmin() {
    return this.role === 'admin'
  }

  getFullName() {
    return `${this.name} ${this.surname}`.trim()
  }

  async activate() {
    this.status = 1
    this.activation_date = new Date()
    this.activation_code = null
    await this.save()
  }

  async setResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.reset_password = resetToken
    await this.save()
    return resetToken
  }

  async resetPassword(newPassword) {
    this.password = newPassword
    this.reset_password = null
    await this.save()
  }

  toJSON() {
    const values = { ...this.dataValues }
    delete values.password
    delete values.reset_password
    delete values.activation_code
    delete values.api_token
    return values
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12)
  }

  static generateActivationCode() {
    return crypto.randomBytes(32).toString('hex')
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    surname: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    birthday: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    image_path: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    token_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    api_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    activation_code: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    activation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    role: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: 'user'
    },
    is_host: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: 'Indicates if user is an active host with approved properties'
    },
    is_banned: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    deleted: {
      type: DataTypes.DATE,
      allowNull: true
    },
    token_version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    indexes: [
      { name: 'user_email', fields: ['email'] },
      { name: 'user_login', fields: ['email', 'password'] },
      { name: 'id_user_passwd', fields: ['id', 'password'] }
    ],
    uniqueKeys: {
      username_unique: { fields: ['username'] },
      email_unique: { fields: ['email'] }
    },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await User.hashPassword(user.password)
        }
        if (!user.activation_code && user.status === 0) {
          user.activation_code = User.generateActivationCode()
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await User.hashPassword(user.password)
        }
      }
    }
  }
)

export default User
