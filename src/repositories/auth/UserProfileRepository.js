import { BaseRepository } from '../BaseRepository.js'
import { UserProfile } from '../../models/index.js'

export class UserProfileRepository extends BaseRepository {
  constructor() {
    super(UserProfile)
  }

  async findByUserId(userId) {
    return await this.findOne({
      user_id: userId,
      deleted: 0
    })
  }

  async createForUser(userId, profileData = {}, options = {}) {
    return await this.create(
      {
        user_id: userId,
        ...profileData
      },
      options
    )
  }

  async updateByUserId(userId, profileData) {
    const profile = await this.findByUserId(userId)

    if (!profile) {
      return await this.createForUser(userId, profileData)
    }

    return await this.update(profile.id, profileData)
  }
}
