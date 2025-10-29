import { UserRepository } from '../../repositories/auth/UserRepository.js'
import { UserProfileRepository } from '../../repositories/auth/UserProfileRepository.js'
import { AppError } from '../../utils/helpers.js'
import { HTTP_STATUS } from '../../../config/constants.js'

export class UserService {
  constructor() {
    this.userRepository = new UserRepository()
    this.userProfileRepository = new UserProfileRepository()
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    return user
  }

  async getUserWithProfile(id) {
    const user = await this.userRepository.findWithProfile(id)

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    return user
  }

  async updateUserProfile(userId, profileData) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    await this.userProfileRepository.updateByUserId(userId, profileData)
    return await this.getUserWithProfile(userId)
  }

  async updateUser(userId, updates) {
    const allowedFields = ['name', 'surname', 'birthday', 'gender']
    const filtered = Object.fromEntries(Object.entries(updates).filter(([k]) => allowedFields.includes(k)))

    const user = await this.userRepository.findById(userId)
    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)

    await user.update(filtered)
    return user.toJSON()
  }

  async deleteAccount(userId) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    if (user.deleted) {
      throw new AppError('Account already deleted', HTTP_STATUS.BAD_REQUEST)
    }

    await user.update({
      deleted: new Date(),
      status: 0,
      token_version: user.token_version + 1,
      email: `deleted_${user.id}_${Date.now()}@deleted.com`,
      username: `deleted_${user.id}_${Date.now()}`
    })

    return {
      message: 'Account successfully deleted'
    }
  }

  async adminDeleteUser(adminId, targetUserId) {
    await this.verifyAdmin(adminId)

    const user = await this.userRepository.findById(targetUserId)
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    if (user.deleted) {
      throw new AppError('User already deleted', HTTP_STATUS.BAD_REQUEST)
    }

    await user.update({
      deleted: new Date(),
      status: 0,
      token_version: user.token_version + 1,
      email: `deleted_${user.id}_${Date.now()}@deleted.com`,
      username: `deleted_${user.id}_${Date.now()}`
    })

    return {
      message: 'User successfully deleted'
    }
  }

  async banUser(adminId, targetUserId) {
    await this.verifyAdmin(adminId)

    const user = await this.userRepository.findById(targetUserId)
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    if (user.is_banned) {
      throw new AppError('User already banned', HTTP_STATUS.BAD_REQUEST)
    }

    await user.update({
      is_banned: 1,
      status: 0,
      token_version: user.token_version + 1
    })

    return {
      message: 'User successfully banned'
    }
  }

  async unbanUser(adminId, targetUserId) {
    await this.verifyAdmin(adminId)

    const user = await this.userRepository.findById(targetUserId)
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!user.is_banned) {
      throw new AppError('User is not banned', HTTP_STATUS.BAD_REQUEST)
    }

    await user.update({
      is_banned: 0,
      status: 1
    })

    return {
      message: 'User successfully unbanned'
    }
  }

  // Helper methods
  async verifyAdmin(adminId) {
    const admin = await this.userRepository.findById(adminId)
    if (!admin || admin.role !== 'admin') {
      throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN)
    }
    return admin
  }
}

export const userService = new UserService()
