import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

const createCouponSchema = Joi.object({
  name: Joi.string().max(60).required(),
  code: Joi.string()
    .max(15)
    .uppercase()
    .pattern(/^[A-Z0-9]+$/)
    .optional(),
  price_type: Joi.number().valid(1, 2).required(),
  price_value: Joi.number()
    .min(0)
    .max(100)
    .when('price_type', {
      is: 1,
      then: Joi.number().max(100),
      otherwise: Joi.number().max(100000)
    })
    .required(),
  quantity: Joi.number().integer().min(1).default(1),
  date_from: Joi.date().iso().required(),
  date_to: Joi.date().iso().greater(Joi.ref('date_from')).required(),
  description: Joi.string().max(120).optional(),
  property_id: Joi.number().integer().optional(),
  coupon_type: Joi.string().max(60).default('travel'),
  currency: Joi.string().length(3).optional(),
  status: Joi.number().valid(0, 1).default(1)
})

const updateCouponSchema = Joi.object({
  name: Joi.string().max(60).optional(),
  code: Joi.string()
    .max(15)
    .uppercase()
    .pattern(/^[A-Z0-9]+$/)
    .optional(),
  price_type: Joi.number().valid(1, 2).optional(),
  price_value: Joi.number().min(0).optional(),
  quantity: Joi.number().integer().min(1).optional(),
  date_from: Joi.date().iso().optional(),
  date_to: Joi.date().iso().optional(),
  description: Joi.string().max(120).optional(),
  property_id: Joi.number().integer().optional().allow(null),
  status: Joi.number().valid(0, 1).optional()
})

const validateCouponSchema = Joi.object({
  code: Joi.string().required(),
  property_id: Joi.number().integer().required(),
  amount: Joi.number().min(0).required()
})

export const validateCreateCoupon = (req, res, next) => {
  const { error } = createCouponSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateUpdateCoupon = (req, res, next) => {
  const { error } = updateCouponSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateCouponCode = (req, res, next) => {
  const { error } = validateCouponSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
