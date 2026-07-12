import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from './DashboardHeader';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { BusinessHealthCard } from '@/components/dashboard/BusinessHealthCard';
import { TodaySummaryCard } from '@/components/dashboard/TodaySummaryCard';
import { KeyInsights } from '@/components/dashboard/KeyInsights';
import { SmartRecommendations } from '@/components/dashboard/SmartRecommendations';
import { PriorityAlerts } from '@/components/dashboard/PriorityAlerts';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DashboardSearch } from '@/components/dashboard/DashboardSearch';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { NotificationPanel } from '@/components/dashboard/NotificationPanel';
import { UpcomingTasks } from '@/components/dashboard/UpcomingTasks';
import { DashboardContent } from '@/components/dashboard/DashboardLayout';
import { PrimaryKPIGrid } from '@/components/dashboard/PrimaryKPIGrid';
import { FinancialKPIGrid } from '@/components/dashboard/FinancialKPIGrid';
import { PerformanceKPIGrid } from '@/components/dashboard/PerformanceKPIGrid';
import { RiskKPIGrid } from '@/components/dashboard/RiskKPIGrid';

import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import { useExecutiveSummary } from '@/hooks/useExecutiveSummary';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: summaryData, isLoading: summaryLoading, error: summaryError, refresh: refreshSummary } = useDashboardSummary();
  const { data: execData, isLoading: execLoading, error: execError, refresh: refreshExec } = useExecutiveSummary();

  const handleRefresh = () => {
    refreshSummary();
    refreshExec();
  };

  const hasError = summaryError || execError;
  const isLoading = summaryLoading || execLoading;

  return (
    <DashboardContent>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <DashboardHeader onRefresh={handleRefresh} isRefreshing={isLoading} />
        <DashboardSearch />
      </div>
      
      {/* Error State */}
      {hasError && (
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{summaryError || execError}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="h-8">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* --- TOP AREA --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 space-y-6">
          <WelcomeCard />
          <TodaySummaryCard summary={execData?.today} isLoading={execLoading} />
        </div>
        <div className="xl:col-span-1">
          <BusinessHealthCard health={execData?.health} isLoading={execLoading} />
        </div>
      </div>

      {/* --- MIDDLE AREA (AI Insights & Alerts) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KeyInsights insights={execData?.insights} isLoading={execLoading} />
        <SmartRecommendations recommendations={execData?.recommendations} isLoading={execLoading} />
        <PriorityAlerts alerts={execData?.alerts} isLoading={execLoading} />
      </div>

      {/* --- BOTTOM AREA (Actions & Tasks) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 space-y-6">
          <QuickActions />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentActivity activities={summaryData?.recentActivities} isLoading={summaryLoading} onRefresh={refreshSummary} />
            <UpcomingTasks maintenance={summaryData?.upcomingTasks?.maintenance} audits={summaryData?.upcomingTasks?.audits} isLoading={summaryLoading} onRefresh={refreshSummary} />
          </div>
        </div>
        <div className="xl:col-span-1 space-y-6">
          <CalendarWidget maintenance={summaryData?.upcomingTasks?.maintenance} audits={summaryData?.upcomingTasks?.audits} isLoading={summaryLoading} />
          <NotificationPanel />
        </div>
      </div>

      {/* --- DEEP DIVE KPIs --- */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">KPI Deep Dive</h3>
        <Tabs defaultValue="primary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] mb-4">
            <TabsTrigger value="primary">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk & Security</TabsTrigger>
          </TabsList>
          <TabsContent value="primary" className="mt-0 outline-none">
            <PrimaryKPIGrid data={summaryData?.metrics?.primary} isLoading={summaryLoading} />
          </TabsContent>
          <TabsContent value="financial" className="mt-0 outline-none">
            <FinancialKPIGrid data={summaryData?.metrics?.financial} isLoading={summaryLoading} />
          </TabsContent>
          <TabsContent value="performance" className="mt-0 outline-none">
            <PerformanceKPIGrid data={summaryData?.metrics?.performance} isLoading={summaryLoading} />
          </TabsContent>
          <TabsContent value="risk" className="mt-0 outline-none">
            <RiskKPIGrid data={summaryData?.metrics?.risk} isLoading={summaryLoading} />
          </TabsContent>
        </Tabs>
      </div>

    </DashboardContent>
  );
}
