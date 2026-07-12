import React from 'react';
import { Activity, Clock, CheckCircle2, Zap } from 'lucide-react';
import { KPICard } from './KPICard';
import { DashboardGridLayout } from './DashboardLayout';
import type { DashboardMetrics } from '@/types/dashboard';

interface PerformanceKPIGridProps {
  data?: DashboardMetrics['performance'];
  isLoading?: boolean;
}

export function PerformanceKPIGrid({ data, isLoading }: PerformanceKPIGridProps) {
  return (
    <DashboardGridLayout>
      <KPICard
        title="Asset Utilization"
        value={data?.utilizationPercent.current ?? 0}
        trend={data?.utilizationPercent.trend}
        icon={Activity}
        colorStatus="healthy"
        isLoading={isLoading}
        isPercent
        tooltipText="Percentage of total assets currently allocated to users."
      />
      <KPICard
        title="Asset Availability"
        value={data?.assetAvailability.current ?? 0}
        icon={Zap}
        colorStatus="info"
        isLoading={isLoading}
        isPercent
        tooltipText="Percentage of healthy assets available for immediate use."
      />
      <KPICard
        title="Avg. Maintenance Time"
        value={data?.avgMaintenanceTime.current ?? 0}
        icon={Clock}
        colorStatus="warning"
        isLoading={isLoading}
        tooltipText="Average turnaround time (in days) to resolve maintenance requests."
      />
      <KPICard
        title="Maintenance Success Rate"
        value={data?.maintenanceSuccessRate.current ?? 0}
        icon={CheckCircle2}
        colorStatus="healthy"
        isLoading={isLoading}
        isPercent
      />
    </DashboardGridLayout>
  );
}
