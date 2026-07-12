import type { ActivityLog, Asset, Maintenance, Audit } from './index';

export interface TrendData {
  value: number;
  label?: string;
  isPositive?: boolean;
}

export interface KPIValue {
  current: number;
  trend?: TrendData;
}

export interface DashboardMetrics {
  primary: {
    totalAssets: KPIValue;
    availableAssets: KPIValue;
    allocatedAssets: KPIValue;
    maintenanceAssets: KPIValue;
    retiredAssets: KPIValue;
    lostAssets: KPIValue;
    damagedAssets: KPIValue;
    warrantyExpiring: KPIValue;
    healthyAssets: KPIValue;
    criticalAssets: KPIValue;
    pendingMaintenance: KPIValue;
    pendingBookings: KPIValue;
    openAudits: KPIValue;
    departments: KPIValue;
    employees: KPIValue;
    vendors: KPIValue;
  };
  financial: {
    totalValue: KPIValue;
    currentValue: KPIValue;
    monthlyMaintenance: KPIValue;
    annualMaintenance: KPIValue;
    avgAssetCost: KPIValue;
    avgRepairCost: KPIValue;
    totalProcurement: KPIValue;
    depreciation: KPIValue;
  };
  performance: {
    utilizationPercent: KPIValue;
    avgAllocationTime: KPIValue;
    avgMaintenanceTime: KPIValue;
    maintenanceSuccessRate: KPIValue;
    bookingSuccessRate: KPIValue;
    assetAvailability: KPIValue;
  };
  risk: {
    assetsAtRisk: KPIValue;
    criticalHealth: KPIValue;
    pendingRepairs: KPIValue;
    auditFindings: KPIValue;
    securityAlerts: KPIValue;
  };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivities: ActivityLog[];
  upcomingTasks: {
    maintenance: Maintenance[];
    audits: Audit[];
  };
  lastUpdated: string;
}

// ---------------------------------------------------------
// Executive Summary Types
// ---------------------------------------------------------

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface BusinessHealth {
  overallScore: number;
  systemStatus: HealthStatus;
  infrastructureStatus: HealthStatus;
  databaseStatus: HealthStatus;
  apiStatus: HealthStatus;
  serverStatus: HealthStatus;
  storageUsage: number; // percentage
  memoryUsage: number; // percentage
  cpuUsage: number; // percentage
  networkStatus: HealthStatus;
}

export interface Insight {
  id: string;
  message: string;
  type: 'positive' | 'negative' | 'neutral';
  category: 'asset' | 'maintenance' | 'department' | 'financial';
}

export interface Recommendation {
  id: string;
  message: string;
  actionLabel: string;
  actionRoute: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DashboardAlert {
  id: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'asset' | 'repair' | 'warranty' | 'conflict' | 'audit' | 'approval';
  route: string;
}

export interface TodaySummary {
  assetsAdded: number;
  assetsAllocated: number;
  maintenanceCompleted: number;
  employeesAdded: number;
  bookings: number;
  reportsGenerated: number;
  auditsCompleted: number;
  pendingApprovals: number;
}

export interface ExecutiveSummary {
  today: TodaySummary;
  health: BusinessHealth;
  insights: Insight[];
  recommendations: Recommendation[];
  alerts: DashboardAlert[];
}
