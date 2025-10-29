import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

const propertyBasicsSchema = Joi.object({
  room_type_id: Joi.number().integer().min(1).optional(),
  accommodation_type_id: Joi.number().integer().min(1).optional(),
  capacity: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Capacity must be at least 1'
  }),
  bedroom_number: Joi.number().integer().min(0).optional().messages({
    'number.min': 'Bedroom number cannot be negative'
  }),
  bed_number: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Bed number must be at least 1'
  }),
  bathroom_number: Joi.number().min(0).optional().messages({
    'number.min': 'Bathroom number cannot be negative'
  }),
  garages: Joi.number().integer().min(0).optional()
})

export const validatePropertyBasics = (req, res, next) => {
  const { error } = propertyBasicsSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
