import logger from '../utils/logger';

class PredictiveEngine {
  predictMaintenanceRisk(asset: any): { riskScore: number; prediction: string; recommendation: string } {
    let riskScore = 0;

    // Age Factor (max 30 points)
    if (asset.purchaseDate) {
      const ageYears = (new Date().getTime() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
      riskScore += Math.min(30, ageYears * 3);
    }

    // Health Score Factor (lower health = higher risk) (max 40 points)
    if (asset.healthScore !== undefined) {
      riskScore += (100 - asset.healthScore) * 0.4;
    }

    // Maintenance Frequency Factor (max 30 points)
    if (asset.maintenanceCount) {
      riskScore += Math.min(30, asset.maintenanceCount * 5);
    }

    let prediction = 'Low Risk';
    let recommendation = 'Standard annual checkup.';

    if (riskScore > 75) {
      prediction = 'Critical';
      recommendation = 'Immediate replacement or major overhaul required.';
    } else if (riskScore > 50) {
      prediction = 'High Risk';
      recommendation = 'Schedule preventative maintenance within 30 days.';
    } else if (riskScore > 25) {
      prediction = 'Medium Risk';
      recommendation = 'Monitor condition during next standard check.';
    }

    return {
      riskScore: Math.round(riskScore),
      prediction,
      recommendation
    };
  }
}

export const predictiveEngine = new PredictiveEngine();
