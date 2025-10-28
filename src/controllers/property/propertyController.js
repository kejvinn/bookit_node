import propertyService from '../../services/property/propertyService.js';
import { asyncHandler } from '../../utils/helpers.js';

export class PropertyController {
  static createProperty = asyncHandler(async (req, res) => {
    const property = await propertyService.createProperty(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: property
    });
  });

  static getProperty = asyncHandler(async (req, res) => {
    const languageId = req.query.language_id || 1;
    const property = await propertyService.getProperty(
      req.params.id,
      req.user?.id,
      languageId
    );

    res.json({
      success: true,
      data: property
    });
  });

  static getUserProperties = asyncHandler(async (req, res) => {
    const properties = await propertyService.getUserProperties(req.user.id);

    res.json({
      success: true,
      data: properties
    });
  });

  
  static getPropertyProgress = asyncHandler(async (req, res) => {
    const progress = await propertyService.getPropertyProgress(
      req.params.id,
      req.user.id
    );
    
    res.json({
      success: true,
      data: progress
    });
  });
  
  static deleteProperty = asyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const userId = req.user.id;

    const result = await propertyService.deleteProperty(propertyId, userId);

    res.json({
      success: true,
      message: 'Property deleted successfully',
      data: result
    });
  });  
}