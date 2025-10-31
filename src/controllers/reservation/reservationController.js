import reservationService from '../../services/reservation/reservationService.js'
import { asyncHandler } from '../../utils/helpers.js'

export class ReservationController {
  static createReservation = asyncHandler(async (req, res) => {
    const reservation = await reservationService.createReservation(req.user.id, req.params.id, req.body)

    const statusMessage = reservation.instant_booking
      ? 'Reservation confirmed! Your dates have been booked.'
      : 'Reservation request sent! Waiting for host approval.'

    res.status(201).json({
      success: true,
      data: reservation,
      message: statusMessage
    })
  })

  static getReservation = asyncHandler(async (req, res) => {
    const reservation = await reservationService.getReservation(req.params.reservationId, req.user.id, req.user.role)

    res.json({
      success: true,
      data: reservation
    })
  })

  static approveReservation = asyncHandler(async (req, res) => {
    const result = await reservationService.approveReservation(req.params.reservationId, req.user.id)

    res.json({
      success: true,
      message: result.message
    })
  })

  static rejectReservation = asyncHandler(async (req, res) => {
    const result = await reservationService.rejectReservation(req.params.reservationId, req.user.id, req.body.reason)

    res.json({
      success: true,
      message: result.message
    })
  })

  static cancelReservation = asyncHandler(async (req, res) => {
    const result = await reservationService.cancelReservation(req.params.reservationId, req.user.id, req.body.reason)

    res.json({
      success: true,
      message: result.message,
      canceled_by: result.canceled_by
    })
  })

  static getUserReservations = asyncHandler(async (req, res) => {
    const type = req.query.type || 'guest'
    const reservations = await reservationService.getUserReservations(req.user.id, type)

    res.json({
      success: true,
      data: reservations,
      count: reservations.length
    })
  })

  static getPropertyReservations = asyncHandler(async (req, res) => {
    const reservations = await reservationService.getPropertyReservations(req.params.id, req.user.id)

    res.json({
      success: true,
      data: reservations,
      count: reservations.length
    })
  })

  // Admin only - mark reservation as paid manually
  static markAsPaid = asyncHandler(async (req, res) => {
    const result = await reservationService.markAsPaid(req.params.reservationId, req.user.id)

    res.json({
      success: true,
      message: result.message
    })
  })
}
