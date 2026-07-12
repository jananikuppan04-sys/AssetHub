import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, PlusCircle, CalendarCheck, FileText, CheckSquare, Wrench } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { TodaySummary } from '@/types/dashboard';

interface TodaySummaryCardProps {
  summary?: TodaySummary;
  isLoading?: boolean;
}

export function TodaySummaryCard({ summary, isLoading }: TodaySummaryCardProps) {
  if (isLoading || !summary) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = [
    { label: 'Assets Added', value: summary.assetsAdded, icon: PlusCircle, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Allocated', value: summary.assetsAllocated, icon: CheckSquare, color: 'text-green-500 bg-green-500/10' },
    { label: 'Bookings', value: summary.bookings, icon: CalendarCheck, color: 'text-purple-500 bg-purple-500/10' },
    { label: 'Pending Approvals', value: summary.pendingApprovals, icon: Clock, color: 'text-yellow-500 bg-yellow-500/10' },
    { label: 'Maintenance Done', value: summary.maintenanceCompleted, icon: Wrench, color: 'text-teal-500 bg-teal-500/10' },
    { label: 'Reports Gen', value: summary.reportsGenerated, icon: FileText, color: 'text-indigo-500 bg-indigo-500/10' },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Today's Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-lg border border-border/50">
                <div className={`p-2 rounded-md ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium leading-none mb-1">{item.label}</p>
                  <p className="text-lg font-bold leading-none">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
