import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Database, Server, HardDrive, Cpu, Activity, ShieldCheck, Network, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { BusinessHealth, HealthStatus } from '@/types/dashboard';

interface BusinessHealthCardProps {
  health?: BusinessHealth;
  isLoading?: boolean;
}

const statusColor = (status: HealthStatus) => {
  if (status === 'healthy') return 'text-green-500 bg-green-500/10';
  if (status === 'warning') return 'text-yellow-500 bg-yellow-500/10';
  return 'text-red-500 bg-red-500/10';
};

const StatusBadge = ({ status }: { status: HealthStatus }) => {
  const Icon = status === 'healthy' ? CheckCircle2 : status === 'warning' ? AlertCircle : AlertCircle;
  return (
    <div className={cn('flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase', statusColor(status))}>
      <Icon className="h-3 w-3" />
      {status}
    </div>
  );
};

export function BusinessHealthCard({ health, isLoading }: BusinessHealthCardProps) {
  if (isLoading || !health) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-primary" />
          System Health
        </CardTitle>
        <span className="text-xl font-bold">{health.overallScore}%</span>
      </CardHeader>
      <CardContent className="flex-1 p-4 grid grid-cols-2 gap-4">
        
        {/* Status Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Server className="h-3.5 w-3.5" /> Core System</span>
            <StatusBadge status={health.systemStatus} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Database className="h-3.5 w-3.5" /> Database</span>
            <StatusBadge status={health.databaseStatus} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> API Services</span>
            <StatusBadge status={health.apiStatus} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Network className="h-3.5 w-3.5" /> Network</span>
            <StatusBadge status={health.networkStatus} />
          </div>
        </div>

        {/* Resource Usage Bars */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1"><HardDrive className="h-3 w-3" /> Storage</span>
              <span className="font-medium">{health.storageUsage}%</span>
            </div>
            <Progress value={health.storageUsage} className={cn("h-1.5", health.storageUsage > 80 ? "[&>div]:bg-red-500" : "[&>div]:bg-primary")} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1"><Server className="h-3 w-3" /> Memory</span>
              <span className="font-medium">{health.memoryUsage}%</span>
            </div>
            <Progress value={health.memoryUsage} className={cn("h-1.5", health.memoryUsage > 80 ? "[&>div]:bg-red-500" : "[&>div]:bg-primary")} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1"><Cpu className="h-3 w-3" /> CPU</span>
              <span className="font-medium">{health.cpuUsage}%</span>
            </div>
            <Progress value={health.cpuUsage} className={cn("h-1.5", health.cpuUsage > 80 ? "[&>div]:bg-red-500" : "[&>div]:bg-primary")} />
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Infra</span>
            <StatusBadge status={health.infrastructureStatus} />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
