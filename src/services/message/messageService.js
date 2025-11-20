import MessageRepository from '../../repositories/message/MessageRepository.js'
import ConversationRepository from '../../repositories/message/ConversationRepository.js'
import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import ReservationRepository from '../../repositories/reservation/ReservationRepository.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS, MESSAGE_TYPES } from '../../../config/constants.js'
import logger from '../../utils/logger.js'

class MessageService {
  async sendMessage(userId, data) {
    const { conversation_id, property_id, reservation_id, recipient_id, message, subject } = data

    let conversation

    if (conversation_id) {
      conversation = await ConversationRepository.findByIdWithDetails(conversation_id)

      if (!conversation) {
        throw new AppError('Conversation not found', HTTP_STATUS.NOT_FOUND)
      }

      if (!conversation.isParticipant(userId)) {
        throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
      }
    } else {
      if (!property_id || !recipient_id) {
        throw new AppError('Property and recipient required for new conversation', HTTP_STATUS.BAD_REQUEST)
      }

      const property = await PropertyRepository.findById(property_id)
      if (!property || property.deleted) {
        throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)
      }

      const existing = await ConversationRepository.findExistingConversation(
        userId,
        recipient_id,
        property_id,
        reservation_id
      )

      if (existing) {
        conversation = existing
      } else {
        if (reservation_id) {
          const reservation = await ReservationRepository.findById(reservation_id)
          if (!reservation || reservation.deleted) {
            throw new AppError('Reservation not found', HTTP_STATUS.NOT_FOUND)
          }

          if (reservation.user_by !== userId && reservation.user_to !== userId) {
            throw new AppError('Unauthorized access to reservation', HTTP_STATUS.FORBIDDEN)
          }
        }

        conversation = await ConversationRepository.createConversation({
          user_by: userId,
          user_to: recipient_id,
          property_id,
          reservation_id: reservation_id || null,
          conversation_type: reservation_id ? MESSAGE_TYPES.RESERVATION : MESSAGE_TYPES.INQUIRY,
          subject: subject || 'Property Inquiry'
        })
      }
    }

    // Create message
    const newMessage = await MessageRepository.create({
      conversation_id: conversation.id,
      property_id: conversation.property_id,
      reservation_id: conversation.reservation_id || null,
      user_by: userId,
      user_to: conversation.getOtherParticipant(userId),
      message,
      subject: subject || null,
      message_type: conversation.conversation_type,
      is_read: false
    })

    // Update conversation
    await conversation.updateLastMessage(newMessage.id)
    await conversation.incrementUnreadCount(conversation.getOtherParticipant(userId))

    logger.info(`Message sent from user ${userId} in conversation ${conversation.id}`)

    return {
      message: newMessage,
      conversation_id: conversation.id
    }
  }

  async getConversation(conversationId, userId) {
    const conversation = await ConversationRepository.findByIdWithDetails(conversationId)

    if (!conversation) {
      throw new AppError('Conversation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!conversation.isParticipant(userId)) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    const messages = await MessageRepository.findByConversationId(conversationId)

    return {
      conversation,
      messages
    }
  }

  async getUserConversations(userId, includeArchived = false) {
    return await ConversationRepository.findUserConversations(userId, { includeArchived })
  }

  async markConversationAsRead(conversationId, userId) {
    const conversation = await ConversationRepository.findById(conversationId)

    if (!conversation) {
      throw new AppError('Conversation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!conversation.isParticipant(userId)) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    await MessageRepository.markConversationAsRead(conversationId, userId)
    await conversation.markAsRead(userId)

    return { message: 'Conversation marked as read' }
  }

  async archiveConversation(conversationId, userId) {
    const conversation = await ConversationRepository.findById(conversationId)

    if (!conversation) {
      throw new AppError('Conversation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!conversation.isParticipant(userId)) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    const updateData =
      conversation.user_by === userId ? { is_archived_by_initiator: true } : { is_archived_by_recipient: true }

    await ConversationRepository.update(conversationId, updateData)

    return { message: 'Conversation archived' }
  }

  async unarchiveConversation(conversationId, userId) {
    const conversation = await ConversationRepository.findById(conversationId)

    if (!conversation) {
      throw new AppError('Conversation not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!conversation.isParticipant(userId)) {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }

    const updateData =
      conversation.user_by === userId ? { is_archived_by_initiator: false } : { is_archived_by_recipient: false }

    await ConversationRepository.update(conversationId, updateData)

    return { message: 'Conversation unarchived' }
  }

  async getUnreadCount(userId) {
    return await ConversationRepository.getTotalUnreadCount(userId)
  }

  async deleteMessage(messageId, userId) {
    const message = await MessageRepository.findById(messageId)

    if (!message) {
      throw new AppError('Message not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!message.canDelete(userId)) {
      throw new AppError('You can only delete your own messages', HTTP_STATUS.FORBIDDEN)
    }

    await MessageRepository.delete(messageId)

    return { message: 'Message deleted' }
  }
}

export default new MessageService()
