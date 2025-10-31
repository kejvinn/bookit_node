import { BaseRepository } from '../BaseRepository.js'
import Reservation from '../../models/reservation/Reservation.js'
import { Op } from 'sequelize'

class ReservationRepository extends BaseRepository {
  constructor() {
    super(Reservation)
  }

  async findByTrackingCode(trackingCode) {
    return await Reservation.findOne({
      where: { tracking_code: trackingCode }
    })
  }

  async findOverlappingReservations(propertyId, checkin, checkout, excludeId = null) {
    try {
      const where = {
        property_id: propertyId,
        is_canceled: false,
        deleted: null,
        checkin: {
          [Op.lt]: checkout
        },
        checkout: {
          [Op.gt]: checkin
        }
      }

      if (excludeId) {
        where.id = { [Op.ne]: excludeId }
      }

      console.log('Query where clause:', JSON.stringify(where, null, 2))

      return await Reservation.findAll({ where })
    } catch (error) {
      console.error('Error in findOverlappingReservations:', error.message)
      console.error('Full error:', error)
      throw error
    }
  }

  async findUserReservations(userId, type = 'guest', includeCanceled = false) {
    const userField = type === 'guest' ? 'user_by' : 'user_to'
    const where = {
      [userField]: userId,
      deleted: null
    }

    if (!includeCanceled) {
      where.is_canceled = false
    }

    return await Reservation.findAll({
      where,
      order: [['created', 'DESC']]
    })
  }

  async findPropertyReservations(propertyId, includeCanceled = false) {
    const where = {
      property_id: propertyId,
      deleted: null
    }

    if (!includeCanceled) {
      where.is_canceled = false
    }

    return await Reservation.findAll({
      where,
      order: [['checkin', 'ASC']]
    })
  }

  generateTrackingCode() {
    return `RES-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  }

  generateConfirmationCode() {
    return Math.random().toString(36).substring(2, 12).toUpperCase()
  }
}

export default new ReservationRepository()
