import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class Message extends Model {
  static associate(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'user_by',
      as: 'sender'
    })

    Message.belongsTo(models.User, {
      foreignKey: 'user_to',
      as: 'recipient'
    })

    Message.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })

    Message.belongsTo(models.Reservation, {
      foreignKey: 'reservation_id',
      as: 'reservation'
    })

    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversation_id',
      as: 'conversation'
    })
  }

  markAsRead() {
    this.is_read = true
    this.read_at = new Date()
    return this.save()
  }

  isReadBy(userId) {
    return this.is_read && this.user_to === userId
  }

  canDelete(userId) {
    return this.user_by === userId
  }

  toJSON() {
    const values = { ...this.dataValues }
    return values
  }
}

Message.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    conversation_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: { model: 'conversations', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'properties', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    reservation_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: 'reservations', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    user_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    user_to: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message_type: {
      type: DataTypes.STRING(36),
      defaultValue: 'conversation',
      comment: 'conversation, inquiry, reservation_request, booking_confirmation, cancellation_notice'
    },
    is_read: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_starred: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    is_archived: {
      type: DataTypes.TINYINT(1),
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
    modelName: 'Message',
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified'
  }
)

export default Message
