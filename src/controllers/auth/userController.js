import { userService } from '../../services/auth/userService.js';
import { HTTP_STATUS } from '../../../config/constants.js';

export class UserController {
  static async me(req, res, next) {
    try {
      const user = await userService.getUserWithProfile(req.user.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const user = await userService.updateUserProfile(
        req.user.id,
        req.body
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAccount(req, res, next) {
    try {
      const user = await userService.updateUser(req.user.id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  // User self-deletion
  static async deleteMyAccount(req, res, next) {
    try {
      const { reason } = req.body;
      const result = await userService.deleteAccount(req.user.id, reason);
      res.clearCookie('refreshToken');

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin operations
  static async adminDeleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const result = await userService.adminDeleteUser(
        req.user.id,
        userId,
        reason
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async banUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const result = await userService.banUser(
        req.user.id,
        userId,
        reason
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async unbanUser(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await userService.unbanUser(req.user.id, userId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}  