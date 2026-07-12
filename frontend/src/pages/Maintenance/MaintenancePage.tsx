import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus, RefreshCw, AlertTriangle, CheckCircle2, Clock,
  Wrench, MoreHorizontal, User, ArrowRight
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { workflowService } from '@/features/workflow/services/workflowService';
import type { Maintenance } from '@/types';
import type { TableColumn } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------
// Priority & Status Badges
// ---------------------------------------------------------------
function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Low: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    Medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    High: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    Critical: 'bg-red-500/10 text-red-600 border-red-500/20',
  };
  return <Badge variant="outline" className={cn('font-medium', styles[priority] || '')}>{priority}</Badge>;
}

function MaintenanceStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { cls: string; icon: React.ReactNode }> = {
    Pending: { cls: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: <Clock className="h-3 w-3" /> },
    Approved: { cls: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: <CheckCircle2 className="h-3 w-3" /> },
    Assigned: { cls: 'bg-violet-500/10 text-violet-600 border-violet-500/20', icon: <User className="h-3 w-3" /> },
    InProgress: { cls: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: <Wrench className="h-3 w-3" /> },
    Resolved: { cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: <CheckCircle2 className="h-3 w-3" /> },
    Cancelled: { cls: 'bg-gray-500/10 text-gray-600 border-gray-500/20', icon: null },
  };
  const s = styles[status] || { cls: 'bg-muted', icon: null };
  return (
    <Badge variant="outline" className={cn('gap-1 font-medium', s.cls)}>
      {s.icon}
      {status}
    </Badge>
  );
}

// ---------------------------------------------------------------
// Raise Request Dialog
// ---------------------------------------------------------------
const raiseSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  issueType: z.enum(['Hardware', 'Software', 'Network', 'Peripheral', 'Other']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  description: z.string().min(10, 'Please provide more detail'),
});
type RaiseFormValues = z.infer<typeof raiseSchema>;

function RaiseRequestDialog({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<RaiseFormValues>({
    resolver: zodResolver(raiseSchema) as any,
    defaultValues: { issueType: 'Hardware', priority: 'Medium' },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RaiseFormValues) => {
    setLoading(true);
    try {
      await workflowService.createMaintenanceRequest(data);
      onSuccess();
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Raise Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Asset ID / Tag <span className="text-destructive">*</span></Label>
            <Input {...register('assetId')} placeholder="e.g. AST-0042" />
            {errors.assetId && <p className="text-xs text-destructive">{errors.assetId.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Issue Type</Label>
              <Select defaultValue="Hardware" onValueChange={(v) => setValue('issueType', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Hardware', 'Software', 'Network', 'Peripheral', 'Other'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select defaultValue="Medium" onValueChange={(v) => setValue('priority', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Low', 'Medium', 'High', 'Critical'].map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Issue Description <span className="text-destructive">*</span></Label>
            <Textarea {...register('description')} placeholder="Describe the issue in detail..." rows={4} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
            <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------
// Status Pipeline (Kanban)
// ---------------------------------------------------------------
const STATUSES = ['Pending', 'Approved', 'Assigned', 'InProgress', 'Resolved'];

function KanbanPipeline({ items }: { items: Maintenance[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {STATUSES.map((status) => {
        const statusItems = items.filter(i => i.status === status);
        return (
          <div key={status} className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{status}</span>
              <Badge variant="secondary" className="text-xs">{statusItems.length}</Badge>
            </div>
            <div className="space-y-2">
              {statusItems.map(item => (
                <Card key={item._id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3 space-y-2">
                    <p className="text-xs font-mono text-muted-foreground">{String(item.asset)}</p>
                    <p className="text-sm font-medium line-clamp-2">{item.issueDescription}</p>
                    <PriorityBadge priority={item.priority} />
                  </CardContent>
                </Card>
              ))}
              {statusItems.length === 0 && (
                <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
                  No items
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------
export default function MaintenancePage() {
  const queryClient = useQueryClient();
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: workflowService.getMaintenanceRequests,
  });

  const refresh = useCallback(() => queryClient.invalidateQueries({ queryKey: ['maintenance'] }), [queryClient]);

  const columns: TableColumn<Maintenance>[] = [
    {
      key: 'asset',
      header: 'Asset',
      sortable: true,
      render: (val) => <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{String(val)}</span>,
    },
    {
      key: 'issueDescription',
      header: 'Issue',
      render: (val) => <span className="text-sm line-clamp-1">{String(val)}</span>,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (val) => <PriorityBadge priority={String(val)} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <MaintenanceStatusBadge status={String(val)} />,
    },
    {
      key: 'assignedTo',
      header: 'Technician',
      render: (val) => val ? <span className="text-sm">{String(val)}</span> : <span className="text-muted-foreground text-xs">Unassigned</span>,
    },
    {
      key: 'createdAt',
      header: 'Raised On',
      sortable: true,
      render: (val) => new Date(String(val)).toLocaleDateString(),
    },
    {
      key: '_id',
      header: 'Actions',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Wrench className="mr-2 h-4 w-4" /> Assign Technician
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArrowRight className="mr-2 h-4 w-4" /> Update Status
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Mark Resolved
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const critical = requests.filter((r: Maintenance) => r.priority === 'Critical').length;
  const stats = [
    { label: 'Total', value: requests.length },
    { label: 'Pending', value: requests.filter((r: Maintenance) => r.status === 'Pending').length },
    { label: 'In Progress', value: requests.filter((r: Maintenance) => r.status === 'InProgress').length },
    { label: 'Critical', value: critical },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Maintenance Management"
        description="Track and manage asset maintenance requests from submission to resolution."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}>
              {viewMode === 'table' ? 'Kanban View' : 'Table View'}
            </Button>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button onClick={() => setRaiseOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Raise Request
            </Button>
          </div>
        }
      />

      {critical > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{critical} critical maintenance request{critical > 1 ? 's' : ''} require immediate attention.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-5 pb-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewMode === 'kanban' ? (
        <KanbanPipeline items={requests} />
      ) : (
        <DataTable
          columns={columns}
          data={requests}
          isLoading={isLoading}
          emptyTitle="No maintenance requests"
          emptyActionLabel="Raise Request"
          onEmptyAction={() => setRaiseOpen(true)}
          searchKey="asset"
        />
      )}

      <RaiseRequestDialog open={raiseOpen} onClose={() => setRaiseOpen(false)} onSuccess={refresh} />
    </div>
  );
}
