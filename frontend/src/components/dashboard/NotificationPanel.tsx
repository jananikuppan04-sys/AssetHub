import React from 'react';
import { Bell } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/Skeletons';
import { useNotification } from '@/hooks/useNotification';
import { formatRelativeTime } from '@/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function NotificationPanel() {
  const { notifications, isLoading, refresh, markAllRead, markRead } = useNotification();

  // Show only top 5 recent notifications
  const recentNotifs = notifications.slice(0, 5);

  return (
    <WidgetContainer
      title="Notifications"
      subtitle={`You have ${notifications.filter(n => n.status === 'unread').length} unread`}
      icon={Bell}
      isLoading={isLoading}
      onRefresh={refresh}
      className="md:col-span-2 lg:col-span-1 h-96"
    >
      {isLoading ? (
        <ListSkeleton items={4} />
      ) : recentNotifs.length === 0 ? (
        <EmptyState title="All caught up!" description="No new notifications at this time." className="py-10" />
      ) : (
        <div className="space-y-4">
          {recentNotifs.map((notif) => (
            <div 
              key={notif._id} 
              className={cn(
                "flex flex-col gap-1 border-b border-border/50 pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors",
                notif.status === 'unread' ? 'bg-primary/5' : ''
              )}
              onClick={() => notif.status === 'unread' && markRead(notif._id)}
            >
              <div className="flex items-start justify-between">
                <p className={cn("text-sm font-medium leading-tight", notif.status === 'unread' ? 'text-foreground' : 'text-muted-foreground')}>
                  {notif.title}
                </p>
                {notif.status === 'unread' && (
                  <span className="flex h-2 w-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{formatRelativeTime(notif.createdAt)}</p>
            </div>
          ))}
          
          {notifications.length > 0 && notifications.some(n => n.status === 'unread') && (
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={markAllRead}>
              Mark all as read
            </Button>
          )}
        </div>
      )}
    </WidgetContainer>
  );
}
