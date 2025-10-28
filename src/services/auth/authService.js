import jwt from 'jsonwebtoken';
import { config } from '../../../config/env.js';
import { UserRepository } from '../../repositories/auth/UserRepository.js';
import { UserProfileRepository } from '../../repositories/auth/UserProfileRepository.js';
import { emailService } from '../email/emailService.js';
import { AppError } from '../../utils/helpers.js';
import { HTTP_STATUS } from '../../../config/constants.js';
import sequelize from '../../../config/sequelize.js';

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.userProfileRepository = new UserProfileRepository();
  }

  static generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiresIn
    });
  }

  static verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
  }

  async register(userData) {
    const transaction = await sequelize.transaction();

    try {
      const existingUserByEmail =
        await this.userRepository.findByEmail(userData.email);
      if (existingUserByEmail) {
        throw new AppError('Email already registered', HTTP_STATUS.CONFLICT);
      }

      const existingUserByUsername =
        await this.userRepository.findByUsername(userData.username);
      if (existingUserByUsername) {
        throw new AppError('Username already taken', HTTP_STATUS.CONFLICT);
      }

      const user = await this.userRepository.create(userData, {
        transaction
      });
      await this.userProfileRepository.createForUser(
        user.id,
        {},
        { transaction }
      );

      await transaction.commit();

      await emailService.sendActivationEmail(
        user.email,
        user.activation_code
      );

      return {
        user: user.toJSON(),
        message:
          'Registration successful. Please check your email to activate your account.'
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async login(emailOrUsername, password) {
    const user =
      await this.userRepository.findByEmailOrUsername(emailOrUsername);

    if (!user) {
      throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    if (user.deleted) {
      throw new AppError('Account has been deleted', HTTP_STATUS.FORBIDDEN);
    }

    if (user.is_banned) {
      throw new AppError('Account has been banned', HTTP_STATUS.FORBIDDEN);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    if (user.status === 0) {
      throw new AppError(
        'Please activate your account first',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    await user.update({
      modified: new Date(),
      token_version: user.token_version + 1
    });
    await user.reload();

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      version: user.token_version
    };

    const token = AuthService.generateToken(tokenPayload);
    const refreshToken = AuthService.generateRefreshToken(tokenPayload);

    return {
      user: user.toJSON(),
      token,
      refreshToken
    };
  }

  async activateAccount(activationCode) {
    const user =
      await this.userRepository.findByActivationCode(activationCode);

    if (!user) {
      throw new AppError('Invalid activation code', HTTP_STATUS.BAD_REQUEST);
    }

    if (user.status === 1) {
      throw new AppError(
        'Account already activated',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await user.activate();

    return {
      message: 'Account activated successfully'
    };
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return {
        message:
          'If an account with that email exists, a password reset link has been sent.'
      };
    }

    const resetToken = await user.setResetToken();
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message:
        'If an account with that email exists, a password reset link has been sent.'
    };
  }

  async resetPassword(token, newPassword) {
    const user = await this.userRepository.findByResetToken(token);

    if (!user) {
      throw new AppError(
        'Invalid or expired reset token',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await user.resetPassword(newPassword);

    return {
      message: 'Password reset successful'
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = AuthService.verifyToken(refreshToken);
      const user = await this.userRepository.findById(decoded.id);

      if (!user || user.is_banned || user.status === 0 || user.deleted) {
        throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
      }

      if (decoded.version !== user.token_version) {
        throw new AppError(
          'Token expired or invalid',
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const newVersion = user.token_version + 1;
      await user.update({ token_version: newVersion });

      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        version: newVersion
      };

      const newToken = AuthService.generateToken(tokenPayload);
      const newRefreshToken = AuthService.generateRefreshToken(tokenPayload);

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
    }
  }

  async logout(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    await user.update({ token_version: user.token_version + 1 });

    return {
      message: 'Logged out successfully'
    };
  }
}

export const authService = new AuthService();