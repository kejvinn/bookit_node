import Joi from 'joi'
import { AppError } from '../../../../utils/helpers.js'
import { HTTP_STATUS, PRICING_LIMITS } from '../../../../../config/constants.js'

const seasonalPriceSchema = Joi.object({
  price: Joi.number().min(PRICING_LIMITS.MIN_NIGHTLY_PRICE).max(PRICING_LIMITS.MAX_NIGHTLY_PRICE).required().messages({
    'number.min': 'Price must be at least 1',
    'number.max': 'Price cannot exceed 100000',
    'any.required': 'Price is required'
  }),
  start_date: Joi.date().iso().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required'
  }),
  end_date: Joi.date().iso().greater(Joi.ref('start_date')).required().messages({
    'date.base': 'End date must be a valid date',
    'date.greater': 'End date must be after start date',
    'any.required': 'End date is required'
  }),
  currency: Joi.string().length(3).uppercase().default(PRICING_LIMITS.DEFAULT_CURRENCY).optional()
})

const updateSeasonalPriceSchema = Joi.object({
  price: Joi.number().min(PRICING_LIMITS.MIN_NIGHTLY_PRICE).max(PRICING_LIMITS.MAX_NIGHTLY_PRICE).optional(),
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  currency: Joi.string().length(3).uppercase().optional()
}).min(1)

export const validateSeasonalPrice = (req, res, next) => {
  const { error } = seasonalPriceSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateUpdateSeasonalPrice = (req, res, next) => {
  const { error } = updateSeasonalPriceSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
