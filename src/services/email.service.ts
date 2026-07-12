import nodemailer from 'nodemailer';
import logger from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525', 10),
      auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@assethub.com',
        to,
        subject,
        html,
      });
      logger.info(`Email sent to ${to}`);
    } catch (error) {
      logger.error(`Failed to send email to ${to}`, error);
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const html = `<h1>Welcome to AssetHub, ${name}!</h1><p>Your enterprise asset management journey begins here.</p>`;
    await this.sendEmail(to, 'Welcome to AssetHub', html);
  }

  async sendAssetAllocationEmail(to: string, assetName: string, date: string): Promise<void> {
    const html = `<h2>Asset Allocation</h2><p>You have been allocated <strong>${assetName}</strong> on ${date}.</p>`;
    await this.sendEmail(to, 'New Asset Allocated', html);
  }

  async sendWarrantyExpiryAlert(to: string, assetName: string, daysLeft: number): Promise<void> {
    const html = `<h2>Warranty Alert</h2><p>The warranty for <strong>${assetName}</strong> expires in ${daysLeft} days.</p>`;
    await this.sendEmail(to, 'Warranty Expiry Alert', html);
  }
}

export const emailService = new EmailService();
