import descriptionService from '../../services/property/descriptionService.js';
import { asyncHandler } from '../../utils/helpers.js';

export class DescriptionController {
  static updateAmenities = asyncHandler(async (req, res) => {
    const property = await descriptionService.updateAmenities(
      req.params.id,
      req.user.id,
      req.body.characteristic_ids || []
    );
  
    res.json({
      success: true,
      data: property,
      message: 'Amenities updated successfully'
    });
  });
    
  static updateDescription = asyncHandler(async (req, res) => {
    const languageId = req.body.language_id || 1;
    const property = await descriptionService.updateDescription(
      req.params.id,
      req.user.id,
      req.body,
      languageId
    );

    res.json({
      success: true,
      data: property,
      message: 'Description updated successfully'
    });
  });

  static getCharacteristics = asyncHandler(async (req, res) => {
    const languageId = req.query.language_id || 1;
    const characteristics = await descriptionService.getCharacteristics(languageId);

    res.json({
      success: true,
      data: characteristics
    });
  });

  static getPropertyAmenities = asyncHandler(async (req, res) => {
    const amenities = await descriptionService.getPropertyAmenities(req.params.id);

    res.json({
      success: true,
      data: amenities
    });
  });
 
  static getPropertyTranslations = asyncHandler(async (req, res) => {
    const translations = await descriptionService.getPropertyTranslations(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: translations
    });
  });
}