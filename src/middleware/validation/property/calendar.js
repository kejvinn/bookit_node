import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'
import { AVAILABILITY_TYPES } from '../../../../config/constants.js'

const propertyCalendarSchema = Joi.object({
  minimum_days: Joi.number().integer().min(1).max(365).optional().messages({
    'number.min': 'Minimum days must be at least 1',
    'number.max': 'Minimum days cannot exceed 365'
  }),
  maximum_days: Joi.number().integer().min(1).max(365).optional().messages({
    'number.min': 'Maximum days must be at least 1',
    'number.max': 'Maximum days cannot exceed 365'
  }),
  availability_type: Joi.string()
    .valid(...Object.values(AVAILABILITY_TYPES))
    .optional()
    .messages({
      'any.only': 'Availability type must be: always, sometimes, or one_time'
    }),
  available_from: Joi.string().optional(),
  available_to: Joi.string().optional(),
  checkin_time: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      'string.pattern.base': 'Check-in time must be in HH:MM format (e.g., 17:00)'
    }),
  checkout_time: Joi.string()
    .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      'string.pattern.base': 'Check-out time must be in HH:MM format (e.g., 10:00)'
    }),
  blocked_dates: Joi.array().items(Joi.string()).optional()
})

const blockDatesSchema = Joi.object({
  dates: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one date is required',
    'any.required': 'Dates array is required'
  })
})

export const validateCalendar = (req, res, next) => {
  const { error } = propertyCalendarSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateBlockDates = (req, res, next) => {
  const { error } = blockDatesSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
