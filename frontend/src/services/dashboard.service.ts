import api from '@/api/axios';
import type { DashboardData, ApiResponse, ExecutiveSummary } from '@/types';

class DashboardService {
  async getSummary(): Promise<ApiResponse<DashboardData>> {
    // We mock the API call for the frontend structural phase since the backend doesn't have this exact route structure yet.
    // In a real scenario, this would be: 
    // const { data } = await api.get<ApiResponse<DashboardData>>('/dashboard/summary');
    // return data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Dashboard data fetched',
          data: {
            metrics: {
              primary: {
                totalAssets: { current: 1284, trend: { value: 12, isPositive: true, label: 'vs last month' } },
                availableAssets: { current: 342, trend: { value: 5, isPositive: true } },
                allocatedAssets: { current: 876, trend: { value: 8, isPositive: true } },
                maintenanceAssets: { current: 23, trend: { value: 2, isPositive: false } },
                retiredAssets: { current: 12 },
                lostAssets: { current: 4, trend: { value: 0, isPositive: undefined } },
                damagedAssets: { current: 27 },
                warrantyExpiring: { current: 45, trend: { value: 15, isPositive: false, label: 'in 30 days' } },
                healthyAssets: { current: 1104 },
                criticalAssets: { current: 18, trend: { value: 5, isPositive: false } },
                pendingMaintenance: { current: 12 },
                pendingBookings: { current: 8 },
                openAudits: { current: 2 },
                departments: { current: 18 },
                employees: { current: 342 },
                vendors: { current: 45 },
              },
              financial: {
                totalValue: { current: 12500000, trend: { value: 4, isPositive: true } },
                currentValue: { current: 8400000 },
                monthlyMaintenance: { current: 45000, trend: { value: 12, isPositive: false } },
                annualMaintenance: { current: 540000 },
                avgAssetCost: { current: 8500 },
                avgRepairCost: { current: 3200 },
                totalProcurement: { current: 1200000 },
                depreciation: { current: 4100000 },
              },
              performance: {
                utilizationPercent: { current: 82, trend: { value: 3, isPositive: true } },
                avgAllocationTime: { current: 14 },
                avgMaintenanceTime: { current: 3 },
                maintenanceSuccessRate: { current: 94 },
                bookingSuccessRate: { current: 88 },
                assetAvailability: { current: 78 },
              },
              risk: {
                assetsAtRisk: { current: 32, trend: { value: 8, isPositive: false } },
                criticalHealth: { current: 15 },
                pendingRepairs: { current: 28 },
                auditFindings: { current: 4 },
                securityAlerts: { current: 1 },
              }
            },
            recentActivities: [],
            upcomingTasks: { maintenance: [], audits: [] },
            lastUpdated: new Date().toISOString(),
          }
        });
      }, 800);
    });
  }

  async getExecutiveSummary(): Promise<ApiResponse<ExecutiveSummary>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Executive summary fetched',
          data: {
            today: {
              assetsAdded: 12,
              assetsAllocated: 45,
              maintenanceCompleted: 8,
              employeesAdded: 3,
              bookings: 24,
              reportsGenerated: 5,
              auditsCompleted: 1,
              pendingApprovals: 14,
            },
            health: {
              overallScore: 94,
              systemStatus: 'healthy',
              infrastructureStatus: 'healthy',
              databaseStatus: 'healthy',
              apiStatus: 'healthy',
              serverStatus: 'warning',
              storageUsage: 68,
              memoryUsage: 82,
              cpuUsage: 45,
              networkStatus: 'healthy',
            },
            insights: [
              { id: '1', message: 'Assets increased by 12% this month.', type: 'positive', category: 'asset' },
              { id: '2', message: 'Maintenance requests decreased by 8%.', type: 'positive', category: 'maintenance' },
              { id: '3', message: 'Department IT has the highest utilization.', type: 'neutral', category: 'department' },
              { id: '4', message: '15 assets have not been audited.', type: 'negative', category: 'asset' },
            ],
            recommendations: [
              { id: '1', message: 'Schedule maintenance for Printer A12.', actionLabel: 'Schedule', actionRoute: '/maintenance/new', priority: 'high' },
              { id: '2', message: 'Audit Department C this week.', actionLabel: 'Audit', actionRoute: '/audits/new', priority: 'medium' },
              { id: '3', message: 'Replace Laptop L-102.', actionLabel: 'Replace', actionRoute: '/assets/new', priority: 'high' },
            ],
            alerts: [
              { id: '1', message: '5 warranties expire this week.', priority: 'critical', type: 'warranty', route: '/assets?filter=warranty' },
              { id: '2', message: '2 assets require immediate replacement.', priority: 'high', type: 'asset', route: '/assets?filter=critical' },
              { id: '3', message: 'Transfer pending approval.', priority: 'medium', type: 'approval', route: '/allocations?filter=pending' },
            ],
          }
        });
      }, 600);
    });
  }
}

export const dashboardService = new DashboardService();
