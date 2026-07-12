import React from 'react';
import { CalendarClock, Wrench, ShieldCheck } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/Skeletons';
import type { Maintenance, Audit } from '@/types';
import { formatDate, getStatusColor } from '@/utils';
import { Badge } from '@/components/ui/badge';

interface UpcomingTasksProps {
  maintenance?: Maintenance[];
  audits?: Audit[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function UpcomingTasks({ maintenance = [], audits = [], isLoading, onRefresh }: UpcomingTasksProps) {
  // Combine and sort by date
  const tasks = [
    ...maintenance.map(m => ({ 
      id: m._id, 
      type: 'maintenance', 
      title: 'Maintenance Request', 
      date: m.scheduledDate || m.createdAt,
      status: m.status,
      desc: m.issueDescription 
    })),
    ...audits.map(a => ({ 
      id: a._id, 
      type: 'audit', 
      title: a.auditName, 
      date: a.scheduledDate,
      status: a.status,
      desc: 'Asset Audit' 
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  return (
    <WidgetContainer
      title="Upcoming Tasks"
      subtitle="Scheduled maintenance & audits"
      icon={CalendarClock}
      isLoading={isLoading}
      onRefresh={onRefresh}
      className="md:col-span-2 lg:col-span-1 h-96"
    >
      {isLoading ? (
        <ListSkeleton items={4} />
      ) : tasks.length === 0 ? (
        <EmptyState title="No upcoming tasks" description="Your schedule is clear." className="py-10" />
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={`${task.type}-${task.id}`} className="flex gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
              <div className="flex mt-0.5 h-8 w-8 items-center justify-center rounded-md bg-muted">
                {task.type === 'maintenance' ? <Wrench className="h-4 w-4 text-orange-600" /> : <ShieldCheck className="h-4 w-4 text-blue-600" />}
              </div>
              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium leading-none truncate">{task.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{task.desc}</p>
                <p className="text-xs font-medium text-foreground">{formatDate(task.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </WidgetContainer>
  );
}
