import { Sequelize } from 'sequelize'
import { config } from './env.js'
import logger from '../src/utils/logger.js'

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  define: {
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
    underscored: true,
    freezeTableName: true
  },
  timezone: '+00:00'
})

// Test the connection
export const connectDatabase = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Database connection has been established successfully')

    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: false }) // Don't alter in production
      logger.info('Database synchronized')
    }
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

export default sequelize
