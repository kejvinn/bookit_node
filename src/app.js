import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { config } from '../config/env.js'
import logger from './utils/logger.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: config.app.frontendUrl,
    credentials: true
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.'
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`)
  next()
})

// Routes
app.use('/api', routes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

export default app
