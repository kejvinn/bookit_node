import app from './src/app.js'
import { connectDatabase } from './config/sequelize.js'
import { config } from './config/env.js'
import logger from './src/utils/logger.js'

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err)
  process.exit(1)
})

const startServer = async () => {
  try {
    console.log(process.env)
    await connectDatabase()

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`)
    })

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err)
      server.close(() => {
        process.exit(1)
      })
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
