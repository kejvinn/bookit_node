import Joi from 'joi'
import { AppError } from '../../../utils/helpers.js'
import { HTTP_STATUS } from '../../../../config/constants.js'

const photoReorderSchema = Joi.object({
  imageOrders: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().required(),
        sort: Joi.number().integer().min(0).required()
      })
    )
    .min(1)
    .required()
})

export const validatePhotoReorder = (req, res, next) => {
  const { error } = photoReorderSchema.validate(req.body)
  if (error) {
    throw new AppError(error.details[0].message, HTTP_STATUS.BAD_REQUEST)
  }
  next()
}
