import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

const sendMessageSchema = Joi.object({
  conversation_id: Joi.number().integer().positive().optional(),
  property_id: Joi.number().integer().positive().optional(),
  reservation_id: Joi.number().integer().positive().optional(),
  recipient_id: Joi.number().integer().positive().optional(),
  message: Joi.string().min(1).max(2000).required().trim(),
  subject: Joi.string().max(255).optional().trim()
}).custom((value, helpers) => {
  if (!value.conversation_id && (!value.property_id || !value.recipient_id)) {
    return helpers.error('any.invalid')
  }
  return value
}, 'New conversation validation')

export const validateSendMessage = (req, res, next) => {
  const { error } = sendMessageSchema.validate(req.body)
  if (error) {
    if (error.message.includes('invalid')) {
      throw new AppError('For new conversations, property_id and recipient_id are required', HTTP_STATUS.BAD_REQUEST)
    }
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
