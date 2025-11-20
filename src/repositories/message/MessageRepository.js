import { BaseRepository } from '../BaseRepository.js'
import Message from '../../models/message/Message.js'
import { Op } from 'sequelize'
import { User, Property } from '../../models/index.js'

class MessageRepository extends BaseRepository {
  constructor() {
    super(Message)
  }

  async findByConversationId(conversationId, options = {}) {
    return await Message.findAll({
      where: { conversation_id: conversationId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'surname', 'image_path']
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'name', 'surname', 'image_path']
        }
      ],
      order: [['created', 'ASC']],
      ...options
    })
  }

  async findUserMessages(userId, filters = {}) {
    const where = {
      [Op.or]: [{ user_by: userId }, { user_to: userId }]
    }

    if (filters.unreadOnly) {
      where.is_read = false
      where.user_to = userId
    }

    if (filters.conversationId) {
      where.conversation_id = filters.conversationId
    }

    if (filters.propertyId) {
      where.property_id = filters.propertyId
    }

    return await Message.findAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'surname', 'image_path']
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'name', 'surname', 'image_path']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'thumbnail'],
          required: false
        }
      ],
      order: [['created', 'DESC']],
      limit: filters.limit || 50,
      offset: filters.offset || 0
    })
  }

  async countUnreadMessages(userId) {
    return await Message.count({
      where: {
        user_to: userId,
        is_read: false
      }
    })
  }

  async markConversationAsRead(conversationId, userId) {
    return await Message.update(
      {
        is_read: true,
        read_at: new Date()
      },
      {
        where: {
          conversation_id: conversationId,
          user_to: userId,
          is_read: false
        }
      }
    )
  }

  async getLastMessage(conversationId) {
    return await Message.findOne({
      where: { conversation_id: conversationId },
      order: [['created', 'DESC']]
    })
  }
}

export default new MessageRepository()
