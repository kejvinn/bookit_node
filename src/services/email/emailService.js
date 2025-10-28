import nodemailer from 'nodemailer';
import { config } from '../../../config/env.js';
import logger from '../../utils/logger.js';
import { emailTemplates } from './emailTemplates.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    if (config.email.host && config.email.user && config.email.password) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.port === 465,
        auth: {
          user: config.email.user,
          pass: config.email.password
        }
      });

      try {
        await this.transporter.verify();
        logger.info('Email service initialized successfully');
      } catch (error) {
        logger.error('Email service initialization failed:', error);
      }
    } else {
      logger.warn('Email configuration missing. Email service disabled.');
    }
  }

  async sendEmail(to, subject, html) {
    if (!this.transporter) {
      logger.warn(`Email not sent (service disabled): ${subject} to ${to}`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Airbnb Clone" <${config.email.user}>`,
        to,
        subject,
        html
      });

      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendActivationEmail(email, activationCode) {
    const activationUrl = `${config.app.frontendUrl}/activate/${activationCode}`;
    
    const html = await emailTemplates.render('activation', {
      activationUrl
    });

    await this.sendEmail(email, 'Activate Your Airbnb Clone Account', html);
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${config.app.frontendUrl}/reset-password/${resetToken}`;
    
    const html = await emailTemplates.render('password-reset', {
      resetUrl
    });

    await this.sendEmail(email, 'Reset Your Password', html);
  }
}

export const emailService = new EmailService();