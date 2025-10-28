import basicsService from '../../services/property/basicsService.js';
import { asyncHandler } from '../../utils/helpers.js';

export class BasicsController {
  static updateBasics = asyncHandler(async (req, res) => {
    const property = await basicsService.updateBasics(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      data: property,
      message: 'Basics updated successfully'
    });
  });

  static getRoomTypes = asyncHandler(async (req, res) => {
    const languageId = req.query.language_id || 1;
    const roomTypes = await basicsService.getRoomTypes(languageId);

    res.json({
      success: true,
      data: roomTypes
    });
  });

  static getAccommodationTypes = asyncHandler(async (req, res) => {
    const languageId = req.query.language_id || 1;
    const types = await basicsService.getAccommodationTypes(languageId);

    res.json({
      success: true,
      data: types
    });
  });
}