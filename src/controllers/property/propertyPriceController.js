import priceService from '../../../services/property/price/priceService.js'
import { asyncHandler } from '../../../utils/helpers.js'

export class PropertyPriceController {
  static updatePricing = asyncHandler(async (req, res) => {
    const pricing = await priceService.updatePricing(req.params.id, req.user.id, req.body)

    res.json({
      success: true,
      data: pricing,
      message: 'Pricing updated successfully'
    })
  })

  static getPropertyPricing = asyncHandler(async (req, res) => {
    const pricing = await priceService.getPropertyPricing(req.params.id, req.user?.id)
    res.json({
      success: true,
      data: pricing
    })
  })

  static deletePropertyPricing = asyncHandler(async (req, res) => {
    const result = await priceService.deletePropertyPricing(req.params.id, req.user.id)
    res.json({
      success: true,
      ...result
    })
  })

  static createSeasonalPrice = asyncHandler(async (req, res) => {
    const seasonalPrice = await priceService.createSeasonalPrice(req.params.id, req.user.id, req.body)

    res.status(201).json({
      success: true,
      data: seasonalPrice,
      message: 'Seasonal price created successfully'
    })
  })

  static updateSeasonalPrice = asyncHandler(async (req, res) => {
    const seasonalPrice = await priceService.updateSeasonalPrice(
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
    const result = await priceService.deleteSeasonalPrice(req.params.seasonalPriceId, req.user.id)

    res.json({
      success: true,
      ...result
    })
  })

  static getPropertySeasonalPrices = asyncHandler(async (req, res) => {
    const seasonalPrices = await priceService.getPropertySeasonalPrices(req.params.id, req.user?.id)

    res.json({
      success: true,
      data: seasonalPrices
    })
  })
}
