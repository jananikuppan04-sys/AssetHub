import React from 'react';
import { AlertTriangle, AlertOctagon, Timer, ShieldAlert } from 'lucide-react';
import { KPICard } from './KPICard';
import { DashboardGridLayout } from './DashboardLayout';
import type { DashboardMetrics } from '@/types/dashboard';
import { ROUTES } from '@/constants/routes';

interface RiskKPIGridProps {
  data?: DashboardMetrics['risk'];
  isLoading?: boolean;
}

export function RiskKPIGrid({ data, isLoading }: RiskKPIGridProps) {
  return (
    <DashboardGridLayout>
      <KPICard
        title="Assets at Risk"
        value={data?.assetsAtRisk.current ?? 0}
        trend={data?.assetsAtRisk.trend}
        icon={AlertOctagon}
        colorStatus="critical"
        isLoading={isLoading}
        tooltipText="Assets marked as damaged or poorly conditioned."
      />
      <KPICard
        title="Warranty Expiring Soon"
        value={data?.criticalHealth.current ?? 0}
        icon={Timer}
        colorStatus="warning"
        isLoading={isLoading}
        tooltipText="Assets whose warranties will expire within 30 days."
      />
      <KPICard
        title="Pending Repairs"
        value={data?.pendingRepairs.current ?? 0}
        icon={AlertTriangle}
        colorStatus="warning"
        isLoading={isLoading}
        onClickRoute={ROUTES.MAINTENANCE}
      />
      <KPICard
        title="Security / Audit Alerts"
        value={data?.securityAlerts.current ?? 0}
        icon={ShieldAlert}
        colorStatus="critical"
        isLoading={isLoading}
      />
    </DashboardGridLayout>
  );
}
