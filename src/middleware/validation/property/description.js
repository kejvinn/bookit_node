import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

const propertyAmenitiesSchema = Joi.object({
  characteristic_ids: Joi.array().items(Joi.number().integer().min(1)).min(0).max(50).required().messages({
    'array.base': 'Characteristic IDs must be an array',
    'array.max': 'Maximum 50 amenities allowed'
  })
})

const propertyDescriptionSchema = Joi.object({
  language_id: Joi.number().integer().min(1).optional().default(1),
  title: Joi.string()
    .min(10)
    .max(128)
    .allow(null, '')
    .optional() //eshte required per ta bere description = 1
    .messages({
      'string.min': 'Title must be at least 10 characters',
      'string.max': 'Title must not exceed 128 characters'
    }),
  description: Joi.string()
    .min(50)
    .max(5000)
    .allow(null, '')
    .optional() //eshte required per ta bere description = 1
    .messages({
      'string.min': 'Description must be at least 50 characters'
    }),
  space: Joi.string().max(5000).optional().allow(''),
  access: Joi.string().max(5000).optional().allow(''),
  interaction: Joi.string().max(5000).optional().allow(''),
  notes: Joi.string().max(5000).optional().allow(''),
  house_rules: Joi.string().max(5000).optional().allow(''),
  neighborhood_overview: Joi.string().max(5000).optional().allow(''),
  location_description: Joi.string().max(5000).optional().allow('')
})

export const validatePropertyAmenities = (req, res, next) => {
  const { error } = propertyAmenitiesSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validatePropertyDescription = (req, res, next) => {
  const { error } = propertyDescriptionSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
