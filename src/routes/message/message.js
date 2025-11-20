import { Router } from 'express'
import { authenticate } from '../../middleware/auth/authenticate.js'
import { validateSendMessage } from '../../middleware/validation/message/message.js'
import * as messageController from '../../controllers/message/messageController.js'

const router = Router()

// Send a message
router.post('/', authenticate, validateSendMessage, messageController.sendMessage)

// Get user's conversations
router.get('/conversations', authenticate, messageController.getUserConversations)

// Get specific conversation with messages
router.get('/conversations/:conversationId', authenticate, messageController.getConversation)

// Mark conversation as read
router.patch('/conversations/:conversationId/read', authenticate, messageController.markAsRead)

// Archive/Unarchive conversation
router.patch('/conversations/:conversationId/archive', authenticate, messageController.archiveConversation)
router.patch('/conversations/:conversationId/unarchive', authenticate, messageController.unarchiveConversation)

// Get unread message count
router.get('/unread-count', authenticate, messageController.getUnreadCount)

// Delete a message
router.delete('/:messageId', authenticate, messageController.deleteMessage)

export default router
