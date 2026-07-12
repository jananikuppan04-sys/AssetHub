import React from 'react';
import { Activity } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/Skeletons';
import type { ActivityLog } from '@/types';
import { formatRelativeTime } from '@/utils';
import { UserAvatar } from '@/components/avatars/UserAvatar';

interface RecentActivityProps {
  activities?: ActivityLog[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function RecentActivity({ activities, isLoading, onRefresh }: RecentActivityProps) {
  return (
    <WidgetContainer
      title="Recent Activity"
      subtitle="Latest actions across the platform"
      icon={Activity}
      isLoading={isLoading}
      onRefresh={onRefresh}
      className="md:col-span-2 lg:col-span-1 h-96"
    >
      {isLoading ? (
        <ListSkeleton items={4} />
      ) : !activities || activities.length === 0 ? (
        <EmptyState title="No recent activity" description="There are no recent actions to display." className="py-10" />
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const userName = typeof activity.user === 'string' ? 'User' : activity.user?.name;
            const avatar = typeof activity.user === 'string' ? undefined : activity.user?.avatar;
            
            return (
              <div key={activity._id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <UserAvatar name={userName} src={avatar} size="sm" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold">{userName}</span> {activity.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <span className="capitalize bg-muted px-1.5 py-0.5 rounded text-[10px] font-semibold">{activity.module}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetContainer>
  );
}
