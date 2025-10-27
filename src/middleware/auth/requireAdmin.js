import { AppError } from '../../utils/helpers.js';
import { HTTP_STATUS } from '../../../config/constants.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    throw new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED);
  }

  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', HTTP_STATUS.FORBIDDEN);
  }

  next();
};