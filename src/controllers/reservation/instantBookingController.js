import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS } from '../../../config/constants.js'

export class InstantBookingController {
  static async toggleInstantBooking(req, res, next) {
    try {
      const propertyId = req.params.id
      const userId = req.user.id

      const property = await PropertyRepository.findOne({
        id: propertyId,
        user_id: userId,
        deleted: null
      })
      if (!property) {
        throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)
      }

      const newStatus = !property.allow_instant_booking
      await PropertyRepository.update(propertyId, {
        allow_instant_booking: newStatus ? 1 : 0,
        modified: new Date()
      })

      res.json({
        success: true,
        message: `Instant booking ${newStatus ? 'enabled' : 'disabled'} successfully.`,
        allow_instant_booking: newStatus
      })
    } catch (err) {
      next(err)
    }
  }
}
