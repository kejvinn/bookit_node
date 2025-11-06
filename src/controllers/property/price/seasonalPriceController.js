import SeasonalPriceService from '../../../services/property/price/seasonalPriceService.js'
import { asyncHandler } from '../../../utils/helpers.js'

export class SeasonalPriceController {
  static createSeasonalPrice = asyncHandler(async (req, res) => {
    const seasonalPrice = await SeasonalPriceService.createSeasonalPrice(req.params.id, req.user.id, req.body)

    res.status(201).json({
      success: true,
      data: seasonalPrice,
      message: 'Seasonal price created successfully'
    })
  })

  static updateSeasonalPrice = asyncHandler(async (req, res) => {
    const seasonalPrice = await SeasonalPriceService.updateSeasonalPrice(
      req.params.seasonalPriceId,
      req.user.id,
      req.body
    )

    res.json({
      success: true,
      data: seasonalPrice,
      message: 'Seasonal price updated successfully'
    })
  })

  static deleteSeasonalPrice = asyncHandler(async (req, res) => {
    const result = await SeasonalPriceService.deleteSeasonalPrice(req.params.seasonalPriceId, req.user.id)

    res.json({
      success: true,
      ...result
    })
  })

  static getPropertySeasonalPrices = asyncHandler(async (req, res) => {
    const seasonalPrices = await SeasonalPriceService.getPropertySeasonalPrices(req.params.id, req.user?.id)

    res.json({
      success: true,
      data: seasonalPrices
    })
  })
}
