import calendarService from '../../services/property/calendarService.js'
import { asyncHandler } from '../../utils/helpers.js'

export class CalendarController {
  static updateCalendar = asyncHandler(async (req, res) => {
    const result = await calendarService.updateCalendar(req.params.id, req.user.id, req.body)

    res.json({
      success: true,
      data: result,
      message: 'Calendar settings updated successfully'
    })
  })

  static getCalendar = asyncHandler(async (req, res) => {
    const calendar = await calendarService.getCalendar(req.params.id, req.user?.id)

    res.json({
      success: true,
      data: calendar
    })
  })

  static deleteCalendar = asyncHandler(async (req, res) => {
    const result = await calendarService.deleteCalendar(req.params.id, req.user.id)

    res.json({
      success: true,
      message: result.message
    })
  })

  static blockDates = asyncHandler(async (req, res) => {
    const calendar = await calendarService.blockDates(req.params.id, req.user.id, req.body.dates)

    res.json({
      success: true,
      data: calendar,
      message: 'Dates blocked successfully'
    })
  })

  static unblockDates = asyncHandler(async (req, res) => {
    const calendar = await calendarService.unblockDates(req.params.id, req.user.id, req.body.dates)

    res.json({
      success: true,
      data: calendar,
      message: 'Dates unblocked successfully'
    })
  })
}
