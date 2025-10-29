import locationService from '../../services/property/locationService.js';
import { asyncHandler } from '../../utils/helpers.js';

export class LocationController  {
  static updateLocation = asyncHandler(async (req, res) => {
    const property = await locationService.updateLocation(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      data: property,
      message: 'Location updated successfully'
    });
  });

  static getCountries = asyncHandler(async (req, res) => {
    const countries = await locationService.getCountries();

    res.json({
      success: true,
      data: countries
    });
  });
  
  static getStates = asyncHandler(async (req, res) => {
    const states = await locationService.getStates(req.params.countryId);

    res.json({
      success: true,
      data: states
    });
  });
}
