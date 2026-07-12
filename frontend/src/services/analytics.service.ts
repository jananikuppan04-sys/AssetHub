import type { AnalyticsResponse } from '@/types/analytics';
import type { ApiResponse } from '@/types';

class AnalyticsService {
  async getAnalytics(dateRange: string): Promise<ApiResponse<AnalyticsResponse>> {
    // Mock the analytics endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Analytics fetched successfully',
          data: {
            assetsByDepartment: [
              { name: 'Engineering', value: 450 },
              { name: 'HR', value: 120 },
              { name: 'Finance', value: 80 },
              { name: 'Marketing', value: 210 },
              { name: 'Operations', value: 340 },
            ],
            assetsByCategory: [
              { name: 'Laptops', value: 600 },
              { name: 'Monitors', value: 400 },
              { name: 'Mobile Devices', value: 250 },
              { name: 'Furniture', value: 800 },
              { name: 'Vehicles', value: 25 },
            ],
            assetsByStatus: [
              { name: 'Available', value: 342 },
              { name: 'Allocated', value: 876 },
              { name: 'Maintenance', value: 23 },
              { name: 'Retired', value: 43 },
            ],
            assetGrowth: [
              { name: 'Jan', value: 1100 },
              { name: 'Feb', value: 1150 },
              { name: 'Mar', value: 1180 },
              { name: 'Apr', value: 1220 },
              { name: 'May', value: 1250 },
              { name: 'Jun', value: 1284 },
            ],
            assetUtilization: [
              { name: 'Jan', value: 75 },
              { name: 'Feb', value: 78 },
              { name: 'Mar', value: 77 },
              { name: 'Apr', value: 80 },
              { name: 'May', value: 81 },
              { name: 'Jun', value: 82 },
            ],
            financialMonthlyCost: [
              { name: 'Jan', cost: 42000, revenue: 120000 },
              { name: 'Feb', cost: 45000, revenue: 125000 },
              { name: 'Mar', cost: 38000, revenue: 130000 },
              { name: 'Apr', cost: 41000, revenue: 128000 },
              { name: 'May', cost: 44000, revenue: 135000 },
              { name: 'Jun', cost: 45000, revenue: 140000 },
            ],
            financialROI: [
              { name: 'Q1', value: 12 },
              { name: 'Q2', value: 15 },
              { name: 'Q3', value: 14 },
              { name: 'Q4', value: 18 },
            ],
            maintenanceByDepartment: [
              { name: 'Engineering', completed: 45, pending: 12 },
              { name: 'Operations', completed: 30, pending: 8 },
              { name: 'Marketing', completed: 15, pending: 2 },
            ],
            maintenanceCostTrend: [
              { name: 'Jan', value: 15000 },
              { name: 'Feb', value: 18000 },
              { name: 'Mar', value: 14000 },
              { name: 'Apr', value: 16000 },
              { name: 'May', value: 21000 },
              { name: 'Jun', value: 19000 },
            ],
            maintenanceEfficiency: [
              { name: 'Eng', value: 85 },
              { name: 'Ops', value: 70 },
              { name: 'Mkt', value: 95 },
              { name: 'HR', value: 90 },
            ],
            bookingsByDepartment: [
              { name: 'Engineering', value: 120 },
              { name: 'Marketing', value: 80 },
              { name: 'Sales', value: 150 },
            ],
            bookingStatus: [
              { name: 'Approved', value: 450 },
              { name: 'Pending', value: 45 },
              { name: 'Rejected', value: 15 },
            ],
            employeesByDepartment: [
              { name: 'Engineering', value: 150 },
              { name: 'Sales', value: 85 },
              { name: 'Marketing', value: 45 },
              { name: 'HR', value: 20 },
              { name: 'Operations', value: 42 },
            ],
            employeeGrowth: [
              { name: '2021', value: 120 },
              { name: '2022', value: 180 },
              { name: '2023', value: 250 },
              { name: '2024', value: 342 },
            ],
            healthScoreDistribution: [
              { name: 'Excellent (90-100)', value: 450 },
              { name: 'Good (70-89)', value: 600 },
              { name: 'Fair (50-69)', value: 150 },
              { name: 'Poor (0-49)', value: 84 },
            ],
            auditsCompliance: [
              { name: 'Q1', value: 98 },
              { name: 'Q2', value: 95 },
              { name: 'Q3', value: 99 },
              { name: 'Q4', value: 97 },
            ],
            heatmapData: Array.from({ length: 30 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - i);
              return {
                date: d.toISOString().split('T')[0],
                count: Math.floor(Math.random() * 20),
              };
            }).reverse(),
          }
        });
      }, 1000); // 1s delay for realistic loading
    });
  }
}

export const analyticsService = new AnalyticsService();
