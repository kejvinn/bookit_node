import priceService from '../../../services/property/price/priceService.js'
import { asyncHandler } from '../../../utils/helpers.js'

export class PriceController {
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
}
