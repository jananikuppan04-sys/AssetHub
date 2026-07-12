export type DateRangeType = 'today' | 'yesterday' | '7d' | '30d' | 'quarter' | 'year' | 'custom';

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: any; // Allow multiple series
}

export interface AnalyticsResponse {
  assetsByDepartment: ChartDataPoint[];
  assetsByCategory: ChartDataPoint[];
  assetsByStatus: ChartDataPoint[];
  assetGrowth: ChartDataPoint[];
  assetUtilization: ChartDataPoint[];
  
  financialMonthlyCost: ChartDataPoint[];
  financialROI: ChartDataPoint[];
  
  maintenanceByDepartment: ChartDataPoint[];
  maintenanceCostTrend: ChartDataPoint[];
  maintenanceEfficiency: ChartDataPoint[];
  
  bookingsByDepartment: ChartDataPoint[];
  bookingStatus: ChartDataPoint[];
  
  employeesByDepartment: ChartDataPoint[];
  employeeGrowth: ChartDataPoint[];
  
  healthScoreDistribution: ChartDataPoint[];
  
  auditsCompliance: ChartDataPoint[];
  
  heatmapData: { date: string, count: number }[];
}
