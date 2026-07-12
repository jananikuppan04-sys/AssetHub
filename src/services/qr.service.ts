import QRCode from 'qrcode';
import logger from '../utils/logger';

class QRService {
  async generateAssetPassportQR(assetId: string, assetTag: string): Promise<string> {
    try {
      // In a real app, this URL points to the frontend asset passport page
      const passportUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/assets/${assetId}/passport`;
      
      const qrDataUrl = await QRCode.toDataURL(passportUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      return qrDataUrl;
    } catch (error) {
      logger.error('QR Generation Error', error);
      throw error;
    }
  }
}

export const qrService = new QRService();
