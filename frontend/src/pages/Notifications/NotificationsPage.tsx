import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle2, Trash2, Bell, AlertTriangle, Info, Clock, AlertOctagon } from 'lucide-react';
import type { Notification } from '@/types';
import { cn } from '@/lib/utils';

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  { _id: '1', recipient: 'user1', title: 'Critical Security Alert', message: 'New login from unknown device.', category: 'system', type: 'security_alert', priority: 'critical', status: 'unread', createdAt: new Date().toISOString() },
  { _id: '2', recipient: 'user1', title: 'Asset Assigned', message: 'MacBook Pro has been assigned to you.', category: 'asset', type: 'asset_assigned', priority: 'high', status: 'unread', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: '3', recipient: 'user1', title: 'Approval Required', message: 'John Doe requested a new monitor.', category: 'workflow', type: 'approval_pending', priority: 'medium', status: 'read', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: '4', recipient: 'user1', title: 'System Update', message: 'AssetHub v2.4.1 is now live.', category: 'system', type: 'system_update', priority: 'low', status: 'read', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'text-destructive bg-destructive/10';
    case 'high': return 'text-orange-500 bg-orange-500/10';
    case 'medium': return 'text-blue-500 bg-blue-500/10';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'system': return <AlertTriangle className="h-4 w-4" />;
    case 'workflow': return <Clock className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, status: 'read' } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n._id !== id));
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.status !== 'unread') return false;
    if (filter === 'system' && n.category !== 'system') return false;
    if (filter === 'asset' && n.category !== 'asset') return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader 
        title="Notification Center" 
        description="Stay updated on asset assignments, system alerts, and workflow approvals."
        action={
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{unreadCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="asset">Assets</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search notifications..." className="pl-8 bg-background" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">All caught up!</h3>
              <p className="text-muted-foreground max-w-sm mt-1">You don't have any notifications that match the current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <Card key={notif._id} className={cn('transition-all hover:shadow-sm', notif.status === 'unread' ? 'border-primary/20 bg-primary/5' : 'bg-background')}>
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className={cn('shrink-0 h-10 w-10 rounded-full flex items-center justify-center', getPriorityColor(notif.priority))}>
                  {notif.priority === 'critical' ? <AlertOctagon className="h-5 w-5" /> : getCategoryIcon(notif.category)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={cn("text-base font-semibold", notif.status === 'read' && 'text-muted-foreground')}>{notif.title}</h4>
                    {notif.status === 'unread' && <Badge variant="default" className="text-[10px] h-4 px-1.5">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                    <span className="capitalize font-medium">{notif.category}</span>
                    <span className="opacity-50">•</span>
                    <span>{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 sm:ml-auto self-end sm:self-auto mt-4 sm:mt-0">
                  {notif.status === 'unread' && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notif._id)}>
                      Mark Read
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(notif._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
