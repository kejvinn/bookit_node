import PropertyRepository from '../../repositories/property/PropertyRepository.js'
import { AppError } from '../../utils/helpers.js'
import models from '../../models/index.js'
import { HTTP_STATUS } from '../../../config/constants.js'
const { User, PropertyTranslation } = models

class PublishService {
  async updateUserHostStatus(userId) {
    const hasApprovedProperties = await PropertyRepository.count({
      user_id: userId,
      is_approved: 1,
      status: 1,
      deleted: null
    })

    await User.update({ is_host: hasApprovedProperties > 0 ? 1 : 0 }, { where: { id: userId } })
  }

  async submitForReview(propertyId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)

    const steps = await PropertyRepository.getPropertySteps(propertyId)
    if (!steps?.isComplete())
      throw new AppError('Please complete all steps before submitting for review', HTTP_STATUS.BAD_REQUEST)

    if (property.status === 1) throw new AppError('Property is already published', HTTP_STATUS.BAD_REQUEST)

    await PropertyRepository.update(propertyId, {
      is_completed: 1,
      is_approved: 0,
      status: 0
    })

    return {
      id: propertyId,
      status: 'pending_review',
      message: 'Property submitted for admin review'
    }
  }

  async unpublishProperty(propertyId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })
    if (!property) throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)

    if (property.status === 0) throw new AppError('Property is already unpublished', HTTP_STATUS.BAD_REQUEST)

    await PropertyRepository.update(propertyId, { status: 0 })

    // Update user's host status after unpublishing
    await this.updateUserHostStatus(userId)

    return {
      id: propertyId,
      status: 'unpublished',
      message: 'Property unpublished successfully'
    }
  }

  async approveProperty(propertyId) {
    const property = await PropertyRepository.findById(propertyId)
    if (!property) throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)

    if (property.deleted) throw new AppError('Cannot approve deleted property', HTTP_STATUS.BAD_REQUEST)

    if (!property.is_completed) throw new AppError('Property steps not completed', HTTP_STATUS.BAD_REQUEST)

    if (property.is_approved === 1 && property.status === 1)
      throw new AppError('Property is already approved and published', HTTP_STATUS.BAD_REQUEST)

    if (property.is_approved === -1)
      throw new AppError('Property was rejected. Host must resubmit for review.', HTTP_STATUS.BAD_REQUEST)

    await PropertyRepository.update(propertyId, {
      is_approved: 1,
      status: 1
    })

    await this.updateUserHostStatus(property.user_id)

    return {
      id: propertyId,
      status: 'published',
      message: 'Property approved and published successfully'
    }
  }

  async rejectProperty(propertyId, adminUserId, reason = null) {
    const property = await PropertyRepository.findById(propertyId)
    if (!property) throw new AppError('Property not found', HTTP_STATUS.NOT_FOUND)

    if (property.deleted) throw new AppError('Cannot reject deleted property', HTTP_STATUS.BAD_REQUEST)

    if (property.is_approved === 1 && property.status === 1)
      throw new AppError('Cannot reject a published property. Unpublish first.', HTTP_STATUS.BAD_REQUEST)

    await PropertyRepository.update(propertyId, {
      is_approved: -1,
      status: 0
    })

    await this.updateUserHostStatus(property.user_id)

    return {
      id: propertyId,
      status: 'rejected',
      reason: reason || 'Rejected by admin',
      message: 'Property rejected successfully.'
    }
  }

  async republishProperty(propertyId, userId) {
    const property = await PropertyRepository.findOne({
      id: propertyId,
      user_id: userId,
      deleted: null
    })

    if (!property) throw new AppError('Property not found or unauthorized', HTTP_STATUS.NOT_FOUND)

    if (property.is_approved !== 1)
      throw new AppError('Property has not been approved by admin yet', HTTP_STATUS.BAD_REQUEST)

    if (property.status === 1) throw new AppError('Property is already published', HTTP_STATUS.BAD_REQUEST)

    await PropertyRepository.update(propertyId, { status: 1 })

    await this.updateUserHostStatus(userId)

    return {
      id: propertyId,
      status: 'published',
      message: 'Property republished successfully'
    }
  }

  async getPendingProperties(page = 1, limit = 20) {
    const offset = (page - 1) * limit

    const { count, rows } = await PropertyRepository.findAndCountAll(
      {
        is_completed: 1,
        is_approved: 0,
        status: 0,
        deleted: null
      },
      {
        include: [
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'surname', 'email', 'is_host']
          },
          {
            model: PropertyTranslation,
            as: 'translations',
            where: { language_id: 1 },
            required: false
          }
        ],
        limit,
        offset,
        order: [['created', 'DESC']]
      }
    )

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  }

  async getPublishedProperties(page = 1, limit = 20, languageId = 1) {
    const offset = (page - 1) * limit

    const { count, rows } = await PropertyRepository.findAndCountAll(
      {
        is_completed: 1,
        is_approved: 1,
        status: 1,
        deleted: null
      },
      {
        include: [
          {
            model: PropertyTranslation,
            as: 'translations',
            where: { language_id: languageId },
            required: false
          },
          {
            model: User,
            as: 'host',
            attributes: ['id', 'name', 'surname', 'is_host']
          }
        ],
        limit,
        offset,
        order: [['created', 'DESC']]
      }
    )

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  }
}

export default new PublishService()
