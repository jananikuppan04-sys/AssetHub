import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { Notification } from '@/types';

// Mocked data – will be replaced with real API hook
const MOCK_NOTIFICATIONS: Notification[] = [
  { _id: '1', recipient: 'user', title: 'Asset Allocated', message: 'Laptop Dell XPS was allocated to you.', category: 'asset', type: 'asset_assigned', priority: 'medium', status: 'unread', createdAt: new Date(Date.now() - 120000).toISOString() },
  { _id: '2', recipient: 'user', title: 'Maintenance Due', message: 'Server A maintenance is overdue.', category: 'asset', type: 'maintenance_due', priority: 'high', status: 'unread', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: '3', recipient: 'user', title: 'Security Alert', message: 'New login detected.', category: 'system', type: 'security_alert', priority: 'critical', status: 'read', createdAt: new Date(Date.now() - 10800000).toISOString() },
];

export default function NotificationDropdown() {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.status === 'unread').length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="font-normal text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-64">
          <DropdownMenuGroup>
            {MOCK_NOTIFICATIONS.map((n) => (
              <DropdownMenuItem key={n._id} className="flex flex-col items-start gap-0.5 px-4 py-3 cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <span className={cn('text-sm font-medium', n.status === 'unread' && 'text-foreground')}>
                    {n.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
                {n.status === 'unread' && (
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary self-end" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center text-primary text-sm font-medium cursor-pointer">
          <Link to="/notifications">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
