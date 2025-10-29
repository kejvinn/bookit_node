import { BaseRepository } from '../BaseRepository.js';
import { Country, State } from '../../models/index.js';

class LocationRepository extends BaseRepository {
  constructor() {
    super(Country);
  }

  async getAllActive() {
    return await Country.findAll({
      where: { status: 1 },
      attributes: [
        'id', 
        'name', 
        'iso_code', 
        'phonecode', 
        'contains_states',
        'need_zip_code',
        'zip_code_format'
      ],
      order: [['name', 'ASC']]
    });
  }

  async getById(id) {
    return await Country.findOne({
      where: { 
        id,
        status: 1
      }
    });
  }

  async getByIsoCode(isoCode) {
    return await Country.findOne({
      where: { 
        iso_code: isoCode.toUpperCase(),
        status: 1
      }
    });
  }

  async getStates(countryId) {
    return await State.findAll({
      where: { 
        country_id: countryId,
        status: 1
      },
      attributes: ['id', 'name', 'iso_code'],
      order: [['name', 'ASC']]
    });
  }

  async getStateById(stateId) {
    return await State.findOne({
      where: {
        id: stateId,
        status: 1
      }
    });
  }
}

export default new LocationRepository();