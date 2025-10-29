import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS, GENDER_OPTIONS } from '../../../../config/constants.js'

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(32).required(),
  surname: Joi.string().min(2).max(32).required(),
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(64).required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }),
  birthday: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4}$/)
    .optional(),
  gender: Joi.string()
    .valid(...GENDER_OPTIONS)
    .optional()
})

const loginSchema = Joi.object({
  emailOrUsername: Joi.string().required(),
  password: Joi.string().required()
})

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
})

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    })
})

export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateForgotPassword = (req, res, next) => {
  const { error } = forgotPasswordSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}

export const validateResetPassword = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
