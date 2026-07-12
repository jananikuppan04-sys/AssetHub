import logger from '../utils/logger';

// Mocking repository
const assetRepository = {
  findAll: async () => { return []; },
  update: async (id: string, data: any) => { return; }
};

class HealthEngine {
  private calculateScore(asset: any): number {
    let score = 100;

    // Deduct based on Age
    if (asset.purchaseDate) {
      const ageYears = (new Date().getTime() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
      score -= Math.floor(ageYears * 5); // 5 points per year
    }

    // Deduct based on Condition
    switch (asset.condition) {
      case 'Excellent': break;
      case 'Good': score -= 10; break;
      case 'Average': score -= 25; break;
      case 'Poor': score -= 50; break;
      case 'Damaged': score -= 80; break;
    }

    // Deduct based on Maintenance Count (Mocked property)
    if (asset.maintenanceCount) {
      score -= asset.maintenanceCount * 2;
    }

    return Math.max(0, Math.min(100, score)); // Keep between 0 and 100
  }

  async updateAllHealthScores() {
    logger.info('Starting Health Engine Update...');
    const assets = await assetRepository.findAll();

    for (const asset of assets as any[]) {
      const newScore = this.calculateScore(asset);
      if (asset.healthScore !== newScore) {
        await assetRepository.update(asset._id, { healthScore: newScore });
      }
    }
  }
}

export const healthEngine = new HealthEngine();
