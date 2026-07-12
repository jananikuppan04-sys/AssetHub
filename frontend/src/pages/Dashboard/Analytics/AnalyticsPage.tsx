import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ChartCard } from '@/components/dashboard/charts/ChartCard';
import { BaseBarChart } from '@/components/dashboard/charts/BaseBarChart';
import { BaseLineChart } from '@/components/dashboard/charts/BaseLineChart';
import { BaseAreaChart } from '@/components/dashboard/charts/BaseAreaChart';
import { BasePieChart } from '@/components/dashboard/charts/BasePieChart';
import { BaseRadarChart } from '@/components/dashboard/charts/BaseRadarChart';
import { HeatMap } from '@/components/dashboard/charts/HeatMap';
import { PageHeader } from '@/components/common/PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DateRangeType } from '@/types/analytics';

export default function AnalyticsPage() {
  const { data, isLoading, error, refresh, dateRange, setDateRange } = useAnalytics('30d');

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Enterprise Analytics" 
        description="Comprehensive insights across all operational domains."
      >
        <Select value={dateRange} onValueChange={(val) => setDateRange(val as DateRangeType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Asset Distribution */}
        <ChartCard title="Assets by Department" subtitle="Distribution across organization" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.assetsByDepartment}>
          <BaseBarChart data={data?.assetsByDepartment ?? []} dataKey="value" colors={['#3b82f6']} />
        </ChartCard>

        <ChartCard title="Asset Categories" subtitle="Breakdown by type" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.assetsByCategory}>
          <BasePieChart data={data?.assetsByCategory ?? []} donut />
        </ChartCard>

        <ChartCard title="Asset Status" subtitle="Current state of inventory" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.assetsByStatus}>
          <BasePieChart data={data?.assetsByStatus ?? []} />
        </ChartCard>

        {/* Trends */}
        <ChartCard title="Asset Growth" subtitle="Net asset acquisitions over time" className="xl:col-span-2" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.assetGrowth}>
          <BaseAreaChart data={data?.assetGrowth ?? []} dataKey="value" />
        </ChartCard>

        <ChartCard title="Asset Utilization Trend" subtitle="Percentage of allocated assets" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.assetUtilization}>
          <BaseLineChart data={data?.assetUtilization ?? []} dataKey="value" colors={['#10b981']} />
        </ChartCard>

        {/* Financial */}
        <ChartCard title="Monthly Cost vs Revenue" subtitle="Operational financial impact" className="xl:col-span-2" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.financialMonthlyCost}>
          <BaseBarChart data={data?.financialMonthlyCost ?? []} dataKey="cost, revenue" colors={['#ef4444', '#10b981']} />
        </ChartCard>

        <ChartCard title="Financial ROI" subtitle="Quarterly return on assets" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.financialROI}>
          <BaseLineChart data={data?.financialROI ?? []} dataKey="value" colors={['#f59e0b']} />
        </ChartCard>

        {/* Maintenance & Bookings */}
        <ChartCard title="Maintenance Efficiency" subtitle="Department performance" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.maintenanceEfficiency}>
          <BaseRadarChart data={data?.maintenanceEfficiency ?? []} dataKey="value" />
        </ChartCard>

        <ChartCard title="Maintenance Cost Trend" subtitle="Monthly expenditure" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.maintenanceCostTrend}>
          <BaseAreaChart data={data?.maintenanceCostTrend ?? []} dataKey="value" colors={['#ef4444']} />
        </ChartCard>

        <ChartCard title="Booking Request Status" subtitle="Outcome of booking requests" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.bookingStatus}>
          <BasePieChart data={data?.bookingStatus ?? []} donut colors={['#10b981', '#f59e0b', '#ef4444']} />
        </ChartCard>

        {/* Employees & Audits */}
        <ChartCard title="Employees by Department" subtitle="Current headcount" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.employeesByDepartment}>
          <BaseBarChart data={data?.employeesByDepartment ?? []} dataKey="value" colors={['#8b5cf6']} />
        </ChartCard>

        <ChartCard title="Audit Compliance Score" subtitle="Quarterly compliance percentages" isLoading={isLoading} error={error} onRefresh={refresh} dataForExport={data?.auditsCompliance}>
          <BaseLineChart data={data?.auditsCompliance ?? []} dataKey="value" colors={['#06b6d4']} />
        </ChartCard>

        {/* Heatmap */}
        <ChartCard title="Platform Activity Map" subtitle="System engagement density" isLoading={isLoading} error={error} onRefresh={refresh}>
          <HeatMap data={data?.heatmapData ?? []} />
        </ChartCard>

      </div>
    </div>
  );
}
