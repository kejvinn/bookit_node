import multer from 'multer'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import { AppError } from '../utils/helpers.js'
import { ALLOWED_IMAGE_TYPES, HTTP_STATUS } from '../../config/constants.js'
import crypto from 'crypto'

const uploadsDir = 'uploads/properties'
const tempDir = 'uploads/temp'

;[uploadsDir, tempDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError(`Only ${ALLOWED_IMAGE_TYPES.join(', ')} images are allowed`, HTTP_STATUS.BAD_REQUEST), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10 // Maximum 10 files at once
  }
})

export const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next()
  }

  try {
    req.processedFiles = []

    for (const file of req.files) {
      // Calculate hash of original file
      const fileBuffer = fs.readFileSync(file.path)
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex')

      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`
      const outputPath = path.join(uploadsDir, filename)

      await sharp(file.path)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath)

      // Create thumbnail
      const thumbnailName = `thumb_${filename}`
      const thumbnailPath = path.join(uploadsDir, thumbnailName)

      await sharp(file.path)
        .resize(400, 300, {
          fit: 'cover'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath)

      fs.unlinkSync(file.path)

      req.processedFiles.push({
        filename,
        originalname: file.originalname,
        size: fs.statSync(outputPath).size,
        hash: fileHash
      })
    }

    next()
  } catch (error) {
    if (req.processedFiles) {
      req.processedFiles.forEach((file) => {
        const filePath = path.join(uploadsDir, file.filename)
        const thumbPath = path.join(uploadsDir, `thumb_${file.filename}`)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath)
      })
    }

    next(new AppError(`Image processing failed: ${error.message}`, HTTP_STATUS.INTERNAL_SERVER_ERROR))
  }
}

// Clean up temp files on error
export const cleanupTempFiles = (err, req, res, next) => {
  if (req.files) {
    req.files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path)
      }
    })
  }
  next(err)
}
