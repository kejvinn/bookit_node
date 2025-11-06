import Joi from 'joi'
import { AppError } from '../../../../utils/helpers.js'
import { HTTP_STATUS, PRICING_LIMITS } from '../../../../../config/constants.js'

const propertyPricingSchema = Joi.object({
  night: Joi.number().min(PRICING_LIMITS.MIN_NIGHTLY_PRICE).max(PRICING_LIMITS.MAX_NIGHTLY_PRICE).required().messages({
    'number.positive': 'Nightly price must be greater than 0',
    'any.required': 'Nightly price is required'
  }),
  weekly_discount: Joi.number().min(0).max(PRICING_LIMITS.MAX_WEEKLY_DISCOUNT).optional().messages({
    'number.min': 'Weekly discount cannot be negative',
    'number.max': 'Weekly discount cannot exceed 100%'
  }),
  monthly_discount: Joi.number().min(0).max(PRICING_LIMITS.MAX_MONTHLY_DISCOUNT).optional().messages({
    'number.min': 'Monthly discount cannot be negative',
    'number.max': 'Monthly discount cannot exceed 100%'
  }),
  guests: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Base guest count must be at least 1'
  }),
  addguests: Joi.number().min(0).optional().messages({
    'number.min': 'Additional guest price cannot be negative'
  }),
  cleaning: Joi.number().min(0).optional().messages({
    'number.min': 'Cleaning fee cannot be negative'
  }),
  security_deposit: Joi.number().min(0).optional().messages({
    'number.min': 'Security deposit cannot be negative'
  }),
  currency: Joi.string().length(3).uppercase().default(PRICING_LIMITS.DEFAULT_CURRENCY).required().messages({
    'string.length': 'Currency must be a 3-letter code (e.g., EUR, USD)',
    'any.required': 'Currency is required'
  }),
  previous_price: Joi.number().positive().optional()
})

export const validatePropertyPricing = (req, res, next) => {
  const { error } = propertyPricingSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
