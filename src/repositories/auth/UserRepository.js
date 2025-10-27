import { BaseRepository } from '../BaseRepository.js';
import { User } from '../../models/index.js';
import { Op } from 'sequelize';

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.findOne({ 
      email,
      deleted: null 
    });
  }

  async findByUsername(username) {
    return await this.findOne({ 
      username,
      deleted: null 
    });
  }

  async findByEmailOrUsername(emailOrUsername) {
    return await this.findOne({
      [Op.or]: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ],
      deleted: null
    });
  }

  async findByActivationCode(code) {
    return await this.findOne({ 
      activation_code: code,
      deleted: null 
    });
  }

  async findByResetToken(token) {
    return await this.findOne({ 
      reset_password: token,
      deleted: null 
    });
  }

  async findWithProfile(id) {
    return await this.findById(id, {
      include: [{
        model: this.model.sequelize.models.UserProfile,
        as: 'profile'
      }]
    });
  }
}