import { asyncHandler } from '../../utils/helpers.js'
import messageService from '../../services/message/messageService.js'
import { HTTP_STATUS } from '../../../config/constants.js'

export const sendMessage = asyncHandler(async (req, res) => {
  const result = await messageService.sendMessage(req.user.id, req.body)

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: result
  })
})

export const getConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params
  const data = await messageService.getConversation(conversationId, req.user.id)

  res.json({
    success: true,
    data
  })
})

export const getUserConversations = asyncHandler(async (req, res) => {
  const includeArchived = req.query.include_archived === 'true'
  const conversations = await messageService.getUserConversations(req.user.id, includeArchived)

  res.json({
    success: true,
    data: conversations
  })
})

export const markAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params
  const result = await messageService.markConversationAsRead(conversationId, req.user.id)

  res.json({
    success: true,
    message: result.message
  })
})

export const archiveConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params
  const result = await messageService.archiveConversation(conversationId, req.user.id)

  res.json({
    success: true,
    message: result.message
  })
})

export const unarchiveConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params
  const result = await messageService.unarchiveConversation(conversationId, req.user.id)

  res.json({
    success: true,
    message: result.message
  })
})

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await messageService.getUnreadCount(req.user.id)

  res.json({
    success: true,
    data: { unread_count: count }
  })
})

export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params
  const result = await messageService.deleteMessage(messageId, req.user.id)

  res.json({
    success: true,
    message: result.message
  })
})
