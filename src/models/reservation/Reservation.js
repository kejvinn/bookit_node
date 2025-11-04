import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class Reservation extends Model {
  static associate(models) {
    Reservation.belongsTo(models.User, {
      foreignKey: 'user_by',
      as: 'guest'
    })
    Reservation.belongsTo(models.User, {
      foreignKey: 'user_to',
      as: 'host'
    })
    Reservation.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })
  }
}

Reservation.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'guest'
    },
    user_to: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'host'
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    coupon_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    coupon_code: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    discount_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    discount_type: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'percentage or fixed'
    },
    tracking_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    checkin: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    checkout: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nights: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    currency: {
      type: DataTypes.STRING(11),
      defaultValue: 'EUR'
    },
    type: {
      type: DataTypes.STRING(255),
      defaultValue: 'site',
      comment: 'site or mobile'
    },
    confirmation_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    reservation_status: {
      type: DataTypes.STRING(50),
      defaultValue: 'awaiting_host_approval',
      comment: 'awaiting_host_approval, confirmed, canceled, completed'
    },
    payment_method: {
      type: DataTypes.STRING(255),
      defaultValue: 'paypal'
    },
    payment_country: {
      type: DataTypes.STRING(50),
      defaultValue: 'N/A'
    },
    paypal_payment_type: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    paypal_token: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    paypal_payer_id: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    paypal_transaction_id: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    paypal_transaction_type: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    paypal_payer_email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    paypal_payer_phonenum: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    subtotal_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cleaning_fee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    security_fee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    service_fee: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'admin commission'
    },
    extra_guest_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    avarage_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    to_pay: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cancellation_policy_id: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: true
    },
    book_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    payed_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancel_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_payed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_payed_host: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_payed_guest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_refunded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_canceled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reason_to_cancel: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'reservations',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
    paranoid: true,
    deletedAt: 'deleted'
  }
)

export default Reservation
