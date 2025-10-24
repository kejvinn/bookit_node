import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { config } from '../config/env.js';
import logger from './utils/logger.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.app.frontendUrl,
  credentials: true
}));

app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;