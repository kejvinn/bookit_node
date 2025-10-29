import { HTTP_STATUS } from '../../config/constants.js'
import logger from '../utils/logger.js'
import { AppError } from '../utils/helpers.js'

// Main error handler
export const errorHandler = (error, req, res) => {
  let statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  let message = error.message || 'Internal Server Error'

  // Handle specific database errors
  if (error.code === 'ER_DUP_ENTRY') {
    statusCode = HTTP_STATUS.CONFLICT
    if (error.message.includes('email')) {
      message = 'Email already exists'
    } else if (error.message.includes('username')) {
      message = 'Username already exists'
    } else {
      message = 'Duplicate entry'
    }
  }

  // Handle Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST
    message = error.errors.map((e) => e.message).join(', ')
  }

  // Handle Sequelize unique constraint errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = HTTP_STATUS.CONFLICT
    message = 'Duplicate entry'
  }

  // Handle Sequelize foreign key constraint errors
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = HTTP_STATUS.BAD_REQUEST
    message = 'Invalid reference'
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED
    message = 'Invalid token'
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED
    message = 'Token expired'
  }

  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    statusCode
  })

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: error
    })
  })
}

// 404 handler
export const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND)
  next(error)
}
