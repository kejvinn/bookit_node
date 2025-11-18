import descriptionService from '../../services/property/descriptionService.js'
import locationService from '../../services/property/locationService.js'
import propertyService from '../../services/property/propertyService.js'
import { asyncHandler } from '../../utils/helpers.js'

export class PropertyController {
  static createProperty = asyncHandler(async (req, res) => {
    const property = await propertyService.createProperty(req.user.id, req.body)

    res.status(201).json({
      success: true,
      data: property
    })
  })

  static getProperty = asyncHandler(async (req, res) => {
    const languageId = req.query.language_id || 1
    const property = await propertyService.getProperty(req.params.id, req.user?.id, languageId)

    res.json({
      success: true,
      data: property
    })
  })

  static deleteProperty = asyncHandler(async (req, res) => {
    const propertyId = req.params.id
    const userId = req.user.id

    const result = await propertyService.deleteProperty(propertyId, userId)

    res.json({
      success: true,
      message: 'Property deleted successfully',
      data: result
    })
  })

  static getUserProperties = asyncHandler(async (req, res) => {
    const properties = await propertyService.getUserProperties(req.user.id)

    res.json({
      success: true,
      data: properties
    })
  })

  static getPropertyProgress = asyncHandler(async (req, res) => {
    const progress = await propertyService.getPropertyProgress(req.params.id, req.user.id)

    res.json({
      success: true,
      data: progress
    })
  })

  static updateBasics = asyncHandler(async (req, res) => {
    const property = await propertyService.updateBasics(req.params.id, req.user.id, req.body)

    res.json({
      success: true,
      data: property,
      message: 'Basics updated successfully'
    })
  })

  static getStaticData = (methodName, useLanguage = true) => {
    return asyncHandler(async (req, res) => {
      const languageId = req.query.language_id || 1
      
      const data = useLanguage 
        ? await propertyService[methodName](languageId)
        : await propertyService[methodName]()

      res.json({
        success: true,
        data
      })
    })
  }

  static updateLocation = asyncHandler(async (req, res) => {
    const property = await locationService.updateLocation(req.params.id, req.user.id, req.body)

    res.json({
      success: true,
      data: property,
      message: 'Location updated successfully'
    })
  })



  static getStates = asyncHandler(async (req, res) => {
    const states = await locationService.getStates(req.params.countryId)

    res.json({
      success: true,
      data: states
    })
  })
  static updateAmenities = asyncHandler(async (req, res) => {
    const property = await descriptionService.updateAmenities(
      req.params.id,
      req.user.id,
      req.body.characteristic_ids || []
    )

    res.json({
      success: true,
      data: property,
      message: 'Amenities updated successfully'
    })
  })

  static updateDescription = asyncHandler(async (req, res) => {
    const languageId = req.body.language_id || 1
    const property = await descriptionService.updateDescription(req.params.id, req.user.id, req.body, languageId)

    res.json({
      success: true,
      data: property,
      message: 'Description updated successfully'
    })
  })



  static getPropertyAmenities = asyncHandler(async (req, res) => {
    const amenities = await descriptionService.getPropertyAmenities(req.params.id)

    res.json({
      success: true,
      data: amenities
    })
  })

  static getPropertyTranslations = asyncHandler(async (req, res) => {
    const translations = await descriptionService.getPropertyTranslations(req.params.id, req.user.id)

    res.json({
      success: true,
      data: translations
    })
  })
}
