import { BaseRepository } from '../BaseRepository.js'
import Conversation from '../../models/message/Conversation.js'
import { Op } from 'sequelize'
import { User, Property, Reservation, Message } from '../../models/index.js'

class ConversationRepository extends BaseRepository {
  constructor() {
    super(Conversation)
  }

  async findUserConversations(userId, options = {}) {
    const where = {
      [Op.or]: [{ user_by: userId }, { user_to: userId }]
    }

    // Handle archived filter
    if (options.includeArchived === false) {
      where[Op.and] = [
        {
          [Op.or]: [
            { user_by: userId, is_archived_by_initiator: false },
            { user_to: userId, is_archived_by_recipient: false }
          ]
        }
      ]
    }

    return await Conversation.findAll({
      where,
      include: [
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'name', 'surname', 'image_path']
        },
        {
          model: User,
          as: 'participant',
          attributes: ['id', 'name', 'surname', 'image_path']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'thumbnail', 'city', 'country']
        },
        {
          model: Reservation,
          as: 'reservation',
          attributes: ['id', 'tracking_code', 'checkin', 'checkout', 'reservation_status'],
          required: false
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['created', 'DESC']],
          separate: true
        }
      ],
      order: [['last_message_at', 'DESC']],
      limit: options.limit || 50,
      offset: options.offset || 0
    })
  }

  async findExistingConversation(userBy, userTo, propertyId, reservationId = null) {
    const where = {
      user_by: userBy,
      user_to: userTo,
      property_id: propertyId
    }

    if (reservationId) {
      where.reservation_id = reservationId
    }

    return await Conversation.findOne({ where })
  }

  async findByIdWithDetails(conversationId) {
    return await Conversation.findByPk(conversationId, {
      include: [
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'name', 'surname', 'image_path', 'email']
        },
        {
          model: User,
          as: 'participant',
          attributes: ['id', 'name', 'surname', 'image_path', 'email']
        },
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'thumbnail', 'city', 'country', 'user_id']
        },
        {
          model: Reservation,
          as: 'reservation',
          required: false
        }
      ]
    })
  }

  async createConversation(data) {
    return await Conversation.create({
      ...data,
      last_message_at: new Date()
    })
  }

  async getTotalUnreadCount(userId) {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user_by: userId }, { user_to: userId }]
      },
      attributes: ['id', 'user_by', 'user_to', 'unread_count_initiator', 'unread_count_recipient']
    })

    return conversations.reduce((total, conv) => {
      return total + conv.getUnreadCount(userId)
    }, 0)
  }
}

export default new ConversationRepository()
