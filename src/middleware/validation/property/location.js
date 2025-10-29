import Joi from 'joi';
import { AppError } from '../../../utils/helpers.js';
import { HTTP_STATUS } from '../../../../config/constants.js';

const propertyLocationUpdateSchema = Joi.object({
  country_id: Joi.number().integer().min(1).optional(),
  state_id: Joi.number().integer().min(1).optional(),
  country: Joi.string().min(2).max(60).optional(),
  address: Joi.string().min(5).max(255).optional()
    .messages({
      'string.min': 'Address must be at least 5 characters'
    }),
  city: Joi.string().min(2).max(160).optional(),
  locality: Joi.string().max(80).optional().allow(''),
  district: Joi.string().max(80).optional().allow(''),
  state_province: Joi.string().max(80).optional().allow(''),
  zip_code: Joi.string().max(10).optional().allow(''),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional()
});


export const validatePropertyLocation = (req, res, next) => {
  const { error } = propertyLocationUpdateSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST);
  }
  next();
};