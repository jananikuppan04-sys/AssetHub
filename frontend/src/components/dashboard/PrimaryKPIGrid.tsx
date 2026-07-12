import React from 'react';
import { Package, Building2, Users, Wrench, ArrowRightLeft, ShieldCheck, Tag, XCircle, AlertTriangle, Briefcase, CalendarClock, Box } from 'lucide-react';
import { KPICard } from './KPICard';
import { DashboardGridLayout } from './DashboardLayout';
import type { DashboardMetrics } from '@/types/dashboard';
import { ROUTES } from '@/constants/routes';

interface PrimaryKPIGridProps {
  data?: DashboardMetrics['primary'];
  isLoading?: boolean;
}

export function PrimaryKPIGrid({ data, isLoading }: PrimaryKPIGridProps) {
  return (
    <DashboardGridLayout>
      <KPICard
        title="Total Assets"
        value={data?.totalAssets.current ?? 0}
        trend={data?.totalAssets.trend}
        icon={Package}
        colorStatus="info"
        isLoading={isLoading}
        onClickRoute={ROUTES.ASSETS}
        tooltipText="Total number of assets registered in the system."
      />
      <KPICard
        title="Available Assets"
        value={data?.availableAssets.current ?? 0}
        trend={data?.availableAssets.trend}
        icon={Box}
        colorStatus="healthy"
        isLoading={isLoading}
        onClickRoute={`${ROUTES.ASSETS}?status=Available`}
        tooltipText="Assets currently in storage and available for allocation."
      />
      <KPICard
        title="Allocated Assets"
        value={data?.allocatedAssets.current ?? 0}
        trend={data?.allocatedAssets.trend}
        icon={ArrowRightLeft}
        colorStatus="warning"
        isLoading={isLoading}
        onClickRoute={ROUTES.ALLOCATIONS}
      />
      <KPICard
        title="Under Maintenance"
        value={data?.maintenanceAssets.current ?? 0}
        trend={data?.maintenanceAssets.trend}
        icon={Wrench}
        colorStatus="critical"
        isLoading={isLoading}
        onClickRoute={`${ROUTES.ASSETS}?status=Maintenance`}
      />
      <KPICard
        title="Departments"
        value={data?.departments.current ?? 0}
        icon={Building2}
        colorStatus="info"
        isLoading={isLoading}
        onClickRoute={ROUTES.DEPARTMENTS}
      />
      <KPICard
        title="Employees"
        value={data?.employees.current ?? 0}
        icon={Users}
        colorStatus="healthy"
        isLoading={isLoading}
        onClickRoute={ROUTES.EMPLOYEES}
      />
      <KPICard
        title="Open Audits"
        value={data?.openAudits.current ?? 0}
        icon={ShieldCheck}
        colorStatus="warning"
        isLoading={isLoading}
        onClickRoute={ROUTES.AUDITS}
      />
      <KPICard
        title="Retired / Disposed"
        value={data?.retiredAssets.current ?? 0}
        icon={XCircle}
        colorStatus="inactive"
        isLoading={isLoading}
        onClickRoute={`${ROUTES.ASSETS}?status=Retired`}
      />
    </DashboardGridLayout>
  );
}
