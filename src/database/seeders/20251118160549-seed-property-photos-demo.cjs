'use strict'

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const uploadsDir = path.join(__dirname, '../../uploads/properties')

    const images = [
      { filename: '1763456630498-163952299.jpg', caption: 'images.jpeg' },
      { filename: '1763456630515-125974538.jpg', caption: 'download.jpeg' },
      { filename: '1763456630532-264984165.jpg', caption: 'download (1).jpeg' },
      { filename: '1763456630552-36437204.jpg', caption: 'download (2).jpeg' },
      { filename: '1763456630569-654017082.jpg', caption: 'download (3).jpeg' }
    ]

    const pictures = images.map((img, index) => {
      const filePath = path.join(uploadsDir, img.filename)
      let fileHash = ''

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath)
        fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex')
      } else {
        console.warn(`File missing: ${filePath}`)
      }

      return {
        user_id: 2,
        property_id: 1,
        image_path: img.filename,
        file_hash: fileHash,
        image_caption: img.caption,
        sort: index + 1,
        is_featured: index === 0 ? 1 : 0,
        status: 1,
        created: new Date(),
        modified: new Date()
      }
    })

    await queryInterface.bulkInsert('property_pictures', pictures)
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('property_pictures', null, {})
  }
}
