import { Asset, MaintenanceRequest } from "@prisma/client"

export function calculateAssetHealthScore(asset: any): number {
  let score = 100

  // 1. Asset Age Deduction
  const ageInYears = (new Date().getTime() - new Date(asset.acquisitionDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
  score -= ageInYears * 5 // Deduct 5 points per year

  // 2. Condition Deduction
  if (asset.currentCondition === "Fair") score -= 15
  if (asset.currentCondition === "Poor") score -= 40

  // 3. Repairs Deduction
  const repairs = asset.maintenanceReqs?.length || 0
  score -= repairs * 5 // Deduct 5 points per repair

  // 4. Warranty Bonus/Deduction
  if (asset.warranty) {
    // If it has warranty, give it a slight boost
    score += 5
  }

  // Cap between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getPredictiveMaintenanceRisk(asset: any): "Low" | "Medium" | "High" {
  const healthScore = calculateAssetHealthScore(asset)
  
  if (healthScore < 40) return "High"
  if (healthScore < 75) return "Medium"
  return "Low"
}
