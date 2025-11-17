import publishService from '../../services/property/publishService.js'
import { asyncHandler } from '../../utils/helpers.js'

export class PropertyPublishController {
  static submitForReview = asyncHandler(async (req, res) => {
    const result = await publishService.submitForReview(req.params.id, req.user.id)

    res.json({
      success: true,
      data: result
    })
  })

  static unpublishProperty = asyncHandler(async (req, res) => {
    const result = await publishService.unpublishProperty(req.params.id, req.user.id)

    res.json({
      success: true,
      data: result
    })
  })

  static approveProperty = asyncHandler(async (req, res) => {
    const result = await publishService.approveProperty(req.params.id, req.user.id)

    res.json({
      success: true,
      data: result
    })
  })

  static rejectProperty = asyncHandler(async (req, res) => {
    const result = await publishService.rejectProperty(req.params.id, req.user.id, req.body.reason)

    res.json({
      success: true,
      data: result
    })
  })

  static republishProperty = asyncHandler(async (req, res) => {
    const result = await publishService.republishProperty(req.params.id, req.user.id)

    res.json({
      success: true,
      data: result
    })
  })

  static getPendingProperties = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const result = await publishService.getPendingProperties(page, limit)

    res.json({
      success: true,
      ...result
    })
  })

  static getPublishedProperties = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const languageId = parseInt(req.query.language_id) || 1

    const result = await publishService.getPublishedProperties(page, limit, languageId)

    res.json({
      success: true,
      ...result
    })
  })
}
