import logger from '../utils/logger';
import { getCachedData, cacheData } from '../utils/redis';

// Mocking mongoose model for Assets
const AssetModel: any = {
  countDocuments: async (filter: any) => 0,
  aggregate: async (pipeline: any[]) => []
};

class AnalyticsService {
  async getDashboardStats() {
    const cacheKey = 'analytics:dashboard';
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const totalAssets = await AssetModel.countDocuments();
      const availableAssets = await AssetModel.countDocuments({ status: 'Available' });
      const allocatedAssets = await AssetModel.countDocuments({ status: 'Allocated' });
      const maintenanceAssets = await AssetModel.countDocuments({ status: 'Maintenance' });

      // Department Wise Distribution
      const departmentDistribution = await AssetModel.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } }
      ]);

      // Category Wise Distribution
      const categoryDistribution = await AssetModel.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      const data = {
        totalAssets,
        availableAssets,
        allocatedAssets,
        maintenanceAssets,
        departmentDistribution,
        categoryDistribution
      };

      await cacheData(cacheKey, data, 1800); // Cache for 30 minutes
      return data;
    } catch (error) {
      logger.error('Analytics Engine Error', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
