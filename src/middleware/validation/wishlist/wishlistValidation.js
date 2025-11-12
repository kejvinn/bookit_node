import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

const wishlistCreateSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'Wishlist name is required',
    'string.max': 'Wishlist name must not exceed 50 characters',
    'any.required': 'Wishlist name is required'
  })
})

const wishlistUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'Wishlist name is required',
    'string.max': 'Wishlist name must not exceed 50 characters',
    'any.required': 'Wishlist name is required'
  })
})

const addPropertySchema = Joi.object({
  propertyId: Joi.number().integer().positive().required().messages({
    'number.base': 'Property ID must be a number',
    'any.required': 'Property ID is required'
  }),
  wishlistId: Joi.number().integer().positive().required().messages({
    'number.base': 'Wishlist ID must be a number',
    'any.required': 'Wishlist ID is required'
  }),
  note: Joi.string().max(500).allow(null, '').messages({
    'string.max': 'Note must not exceed 500 characters'
  })
})

const updateNoteSchema = Joi.object({
  note: Joi.string().max(500).allow(null, '').messages({
    'string.max': 'Note must not exceed 500 characters'
  })
})

export const validateWishlistCreate = (req, res, next) => {
  const { error } = wishlistCreateSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateWishlistUpdate = (req, res, next) => {
  const { error } = wishlistUpdateSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateAddProperty = (req, res, next) => {
  const { error } = addPropertySchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateUpdateNote = (req, res, next) => {
  const { error } = updateNoteSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
