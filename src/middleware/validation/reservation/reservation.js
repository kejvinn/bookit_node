import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

const createReservationSchema = Joi.object({
  checkin: Joi.date().iso().required().messages({
    'date.base': 'Check-in date must be a valid date',
    'any.required': 'Check-in date is required'
  }),
  checkout: Joi.date().iso().greater(Joi.ref('checkin')).required().messages({
    'date.base': 'Check-out date must be a valid date',
    'date.greater': 'Check-out date must be after check-in date',
    'any.required': 'Check-out date is required'
  }),
  guests: Joi.number().integer().min(1).max(50).required().messages({
    'number.min': 'At least 1 guest is required',
    'number.max': 'Maximum 50 guests allowed',
    'any.required': 'Number of guests is required'
  }),
  message: Joi.string().max(500).optional().messages({
    'string.max': 'Message cannot exceed 500 characters'
  }),
  coupon_code: Joi.string().max(15).uppercase().optional()
})

const cancelReservationSchema = Joi.object({
  reason: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Cancellation reason must be at least 10 characters',
    'string.max': 'Cancellation reason cannot exceed 500 characters',
    'any.required': 'Cancellation reason is required'
  })
})

const rejectReservationSchema = Joi.object({
  reason: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Rejection reason must be at least 10 characters',
    'string.max': 'Rejection reason cannot exceed 500 characters',
    'any.required': 'Rejection reason is required'
  })
})

export const validateReservation = (req, res, next) => {
  const { error } = createReservationSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateCancelReservation = (req, res, next) => {
  const { error } = cancelReservationSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateRejectReservation = (req, res, next) => {
  const { error } = rejectReservationSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
