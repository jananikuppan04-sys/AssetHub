import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { DashboardAlert } from '@/types/dashboard';

interface PriorityAlertsProps {
  alerts?: DashboardAlert[];
  isLoading?: boolean;
}

export function PriorityAlerts({ alerts, isLoading }: PriorityAlertsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2"><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent>
      </Card>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center">
        <EmptyState title="No Active Alerts" description="All systems are operating normally." className="scale-90" />
      </Card>
    );
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <Card className="h-full border-red-500/20 bg-gradient-to-br from-red-500/5 via-background to-background">
      <CardHeader className="pb-2 border-b border-red-500/10">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          Priority Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            onClick={() => navigate(alert.route)}
            className="flex items-center gap-3 bg-background border rounded-lg p-2.5 cursor-pointer hover:border-red-300 transition-colors"
          >
            <div className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0", priorityColor(alert.priority))}>
              {alert.priority}
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {alert.message}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
