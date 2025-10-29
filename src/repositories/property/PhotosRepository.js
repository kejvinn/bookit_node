import { BaseRepository } from '../BaseRepository.js'
import PropertyPicture from '../../models/property/Photos/Picture.js'
import fs from 'fs'
import path from 'path'

class PhotosRepository extends BaseRepository {
  constructor() {
    super(PropertyPicture)
  }

  async findByPropertyId(propertyId) {
    return await PropertyPicture.findAll({
      where: { property_id: propertyId, status: 1 },
      order: [
        ['is_featured', 'DESC'],
        ['sort', 'ASC'],
        ['id', 'ASC']
      ]
    })
  }

  async countPropertyPhotos(propertyId) {
    return await PropertyPicture.count({
      where: { property_id: propertyId, status: 1 }
    })
  }

  async findDuplicateHashes(propertyId, hashes) {
    return await PropertyPicture.findAll({
      where: {
        property_id: propertyId,
        file_hash: hashes,
        status: 1
      },
      attributes: ['file_hash', 'image_caption']
    })
  }

  async createMany(propertyId, userId, images) {
    const existingCount = await this.countPropertyPhotos(propertyId)

    const picturesData = images.map((image, index) => ({
      property_id: propertyId,
      user_id: userId,
      image_path: image.filename,
      image_caption: image.originalname,
      file_hash: image.hash,
      sort: existingCount + index,
      is_featured: existingCount === 0 && index === 0 ? 1 : 0,
      status: 1
    }))

    return await PropertyPicture.bulkCreate(picturesData)
  }

  async getFeaturedImage(propertyId) {
    return await PropertyPicture.findOne({
      where: {
        property_id: propertyId,
        is_featured: 1,
        status: 1
      }
    })
  }

  async setFeatured(pictureId, propertyId) {
    const transaction = await this.model.sequelize.transaction()

    try {
      // Unset all featured images
      await PropertyPicture.update(
        { is_featured: 0 },
        {
          where: { property_id: propertyId },
          transaction
        }
      )

      // Set new featured image
      await PropertyPicture.update(
        { is_featured: 1 },
        {
          where: { id: pictureId, property_id: propertyId },
          transaction
        }
      )

      await transaction.commit()
      return await this.findById(pictureId)
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async updateSortOrder(propertyId, imageOrders) {
    const transaction = await this.model.sequelize.transaction()

    try {
      for (const { id, sort } of imageOrders) {
        await PropertyPicture.update(
          { sort },
          {
            where: { id, property_id: propertyId },
            transaction
          }
        )
      }

      await transaction.commit()
      return await this.findByPropertyId(propertyId)
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async deleteImage(pictureId, propertyId) {
    const picture = await PropertyPicture.findOne({
      where: { id: pictureId, property_id: propertyId, status: 1 }
    })
    if (!picture) return false

    const imagePath = path.join('uploads/properties', picture.image_path)
    const thumbPath = path.join('uploads/properties', `thumb_${picture.image_path}`)

    // Delete physical files safely
    for (const filePath of [imagePath, thumbPath]) {
      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath)
        }
      } catch (err) {
        console.warn(`Warning: failed to delete ${filePath}:`, err.message)
      }
    }

    // Delete DB record
    await picture.destroy()

    // Maintain is_featured flag
    if (picture.is_featured) {
      const firstImage = await PropertyPicture.findOne({
        where: { property_id: propertyId, status: 1 },
        order: [['sort', 'ASC']]
      })

      if (firstImage) {
        await firstImage.update({ is_featured: 1 })
      }
    }

    return picture
  }
}

export default new PhotosRepository()
