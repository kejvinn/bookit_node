import Joi from 'joi';
import { AppError } from '../../../utils/helpers.js';
import { HTTP_STATUS } from '../../../../config/constants.js';

const propertyCreateSchema = Joi.object({
  room_type_id: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'Room type must be a number',
      'any.required': 'Room type is required'
    })
});


export const validatePropertyCreate = (req, res, next) => {
  const { error } = propertyCreateSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST);
  }
  next();
};