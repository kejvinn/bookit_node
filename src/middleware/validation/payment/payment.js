import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

const capturePaymentSchema = Joi.object({
  orderId: Joi.string().alphanum().min(10).max(40).required().messages({
    'string.base': 'orderId must be a string',
    'string.alphanum': 'orderId can only contain letters and numbers',
    'string.empty': 'orderId is required',
    'any.required': 'orderId is required to capture a PayPal payment'
  })
})

export const validateCapturePayment = (req, res, next) => {
  const { error } = capturePaymentSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
