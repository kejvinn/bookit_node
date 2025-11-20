import { DataTypes, Model } from 'sequelize'
import sequelize from '../../../config/sequelize.js'

class Conversation extends Model {
  static associate(models) {
    Conversation.belongsTo(models.User, {
      foreignKey: 'user_by',
      as: 'initiator'
    })

    Conversation.belongsTo(models.User, {
      foreignKey: 'user_to',
      as: 'participant'
    })

    Conversation.belongsTo(models.Property, {
      foreignKey: 'property_id',
      as: 'property'
    })

    Conversation.belongsTo(models.Reservation, {
      foreignKey: 'reservation_id',
      as: 'reservation'
    })

    Conversation.hasMany(models.Message, {
      foreignKey: 'conversation_id',
      as: 'messages'
    })
  }

  isParticipant(userId) {
    return this.user_by === userId || this.user_to === userId
  }

  getOtherParticipant(userId) {
    return this.user_by === userId ? this.user_to : this.user_by
  }

  async updateLastMessage(messageId) {
    this.last_message_id = messageId
    this.last_message_at = new Date()
    await this.save()
  }

  async incrementUnreadCount(userId) {
    if (this.user_to === userId) {
      this.unread_count_recipient += 1
    } else if (this.user_by === userId) {
      this.unread_count_initiator += 1
    }
    await this.save()
  }

  async markAsRead(userId) {
    if (this.user_to === userId) {
      this.unread_count_recipient = 0
    } else if (this.user_by === userId) {
      this.unread_count_initiator = 0
    }
    await this.save()
  }

  getUnreadCount(userId) {
    return this.user_to === userId ? this.unread_count_recipient : this.unread_count_initiator
  }
}

Conversation.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    user_to: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'properties', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    reservation_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: { model: 'reservations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    last_message_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: { model: 'messages', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    conversation_type: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: 'inquiry'
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    unread_count_initiator: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    unread_count_recipient: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_archived_by_initiator: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    is_archived_by_recipient: {
      type: DataTypes.TINYINT(1),
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
    modelName: 'Conversation',
    tableName: 'conversations',
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified'
  }
)

export default Conversation
