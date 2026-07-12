import React from 'react';
import { IndianRupee, TrendingDown, Receipt, Banknote, Landmark, Calculator } from 'lucide-react';
import { KPICard } from './KPICard';
import { DashboardGridLayout } from './DashboardLayout';
import type { DashboardMetrics } from '@/types/dashboard';

interface FinancialKPIGridProps {
  data?: DashboardMetrics['financial'];
  isLoading?: boolean;
}

export function FinancialKPIGrid({ data, isLoading }: FinancialKPIGridProps) {
  return (
    <DashboardGridLayout>
      <KPICard
        title="Total Asset Value"
        value={data?.totalValue.current ?? 0}
        trend={data?.totalValue.trend}
        icon={Landmark}
        colorStatus="info"
        isLoading={isLoading}
        isCurrency
        tooltipText="Original purchase value of all registered assets."
      />
      <KPICard
        title="Current Value (Post-Depreciation)"
        value={data?.currentValue.current ?? 0}
        icon={IndianRupee}
        colorStatus="healthy"
        isLoading={isLoading}
        isCurrency
        tooltipText="Estimated current value of assets after applying depreciation."
      />
      <KPICard
        title="Monthly Maintenance Cost"
        value={data?.monthlyMaintenance.current ?? 0}
        trend={data?.monthlyMaintenance.trend}
        icon={Receipt}
        colorStatus="warning"
        isLoading={isLoading}
        isCurrency
        tooltipText="Total spent on maintenance and repairs this month."
      />
      <KPICard
        title="Total Depreciation"
        value={data?.depreciation.current ?? 0}
        icon={TrendingDown}
        colorStatus="critical"
        isLoading={isLoading}
        isCurrency
      />
      <KPICard
        title="Avg. Asset Cost"
        value={data?.avgAssetCost.current ?? 0}
        icon={Calculator}
        colorStatus="info"
        isLoading={isLoading}
        isCurrency
      />
      <KPICard
        title="Avg. Repair Cost"
        value={data?.avgRepairCost.current ?? 0}
        icon={Banknote}
        colorStatus="warning"
        isLoading={isLoading}
        isCurrency
      />
    </DashboardGridLayout>
  );
}
