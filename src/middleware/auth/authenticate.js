import { AuthService } from '../../services/auth/authService.js';
import { AppError } from '../../utils/helpers.js';
import { HTTP_STATUS } from '../../../config/constants.js';
import { UserService } from '../../services/auth/userService.js';

const userService = new UserService();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);

    const user = await userService.getUserById(decoded.id);

    if (decoded.version !== user.token_version) {
      throw new AppError('Token expired or invalid', HTTP_STATUS.UNAUTHORIZED);
    }
    
    if (user.is_banned) {
      throw new AppError('Account has been banned', HTTP_STATUS.FORBIDDEN);
    }

    if (user.status === 0) {
      throw new AppError('Account not activated', HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = user.toJSON();
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', HTTP_STATUS.UNAUTHORIZED));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', HTTP_STATUS.UNAUTHORIZED));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = AuthService.verifyToken(token);

      const user = await userService.getUserById(decoded.id);

      if (user && !user.is_banned && user.status === 1) {
        req.user = user.toJSON();
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};