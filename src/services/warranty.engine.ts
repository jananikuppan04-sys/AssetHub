import logger from '../utils/logger';
import { emailService } from './email.service';
import { socketService } from './socket.service';

// Mocking AssetRepository since original files are missing in Next.js structure
// In a real environment, this would import from '../repositories/asset.repository'
const assetRepository = {
  findAll: async () => { return []; } // Mock
};

class WarrantyEngine {
  async checkWarranties() {
    logger.info('Starting Warranty Engine Check...');
    const assets = await assetRepository.findAll();
    
    const today = new Date();
    
    for (const asset of assets as any[]) {
      if (!asset.purchaseDate || !asset.warrantyPeriodMonths) continue;

      const expiryDate = new Date(asset.purchaseDate);
      expiryDate.setMonth(expiryDate.getMonth() + asset.warrantyPeriodMonths);
      
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 90 || diffDays === 60 || diffDays === 30) {
        // Send Email Alert
        await emailService.sendWarrantyExpiryAlert(
          'admin@assethub.com', 
          asset.assetName || 'Unknown Asset', 
          diffDays
        );

        // Broadcast Real-time notification
        socketService.broadcast('warrantyAlert', {
          assetId: asset._id,
          assetName: asset.assetName,
          daysLeft: diffDays,
        });
      }
    }
  }
}

export const warrantyEngine = new WarrantyEngine();
