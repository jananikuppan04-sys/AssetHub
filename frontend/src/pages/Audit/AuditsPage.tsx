import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus, RefreshCw, ClipboardCheck, CheckCircle2, XCircle,
  AlertTriangle, MoreHorizontal, Shield
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { workflowService } from '@/features/workflow/services/workflowService';
import type { Audit } from '@/types';
import type { TableColumn } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------
// Audit Status Badge
// ---------------------------------------------------------------
function AuditStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Scheduled: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    InProgress: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Cancelled: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  };
  return <Badge variant="outline" className={cn('font-medium', styles[status] || '')}>{status}</Badge>;
}

// ---------------------------------------------------------------
// Create Audit Dialog
// ---------------------------------------------------------------
const auditSchema = z.object({
  auditName: z.string().min(3, 'Audit name is required'),
  department: z.string().min(1, 'Department is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  remarks: z.string().optional(),
});
type AuditFormValues = z.infer<typeof auditSchema>;

function CreateAuditDialog({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuditFormValues>({
    resolver: zodResolver(auditSchema) as any,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: AuditFormValues) => {
    setLoading(true);
    try {
      await workflowService.createAudit({
        auditName: data.auditName,
        department: data.department as any,
        scheduledDate: data.scheduledDate,
        remarks: data.remarks,
      });
      onSuccess();
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Audit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Audit Name <span className="text-destructive">*</span></Label>
            <Input {...register('auditName')} placeholder="e.g. Q3 IT Audit 2026" />
            {errors.auditName && <p className="text-xs text-destructive">{errors.auditName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Department <span className="text-destructive">*</span></Label>
            <Input {...register('department')} placeholder="e.g. Engineering" />
            {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled Date <span className="text-destructive">*</span></Label>
            <Input {...register('scheduledDate')} type="date" />
            {errors.scheduledDate && <p className="text-xs text-destructive">{errors.scheduledDate.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Remarks</Label>
            <Textarea {...register('remarks')} placeholder="Additional notes..." rows={2} />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Audit'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------
// Audit Verification Panel (inline mock)
// ---------------------------------------------------------------
type VerificationStatus = 'Verified' | 'Missing' | 'Damaged' | 'Mismatch';

const MOCK_ASSETS_TO_VERIFY: Array<{ id: string; tag: string; name: string; status: VerificationStatus }> = [
  { id: 'a1', tag: 'AST-0001', name: 'MacBook Pro M3', status: 'Verified' },
  { id: 'a2', tag: 'AST-0002', name: 'Dell 4K Monitor', status: 'Missing' },
  { id: 'a3', tag: 'AST-0003', name: 'Logitech MX Keys', status: 'Damaged' },
  { id: 'a4', tag: 'AST-0004', name: 'Samsung SSD 2TB', status: 'Verified' },
];

const verificationColors = {
  Verified: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Missing: 'bg-red-500/10 text-red-600 border-red-500/20',
  Damaged: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  Mismatch: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
};

function VerificationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [verifications, setVerifications] = useState(MOCK_ASSETS_TO_VERIFY);

  const cycle = (id: string) => {
    const statuses: Array<VerificationStatus> = ['Verified', 'Missing', 'Damaged', 'Mismatch'];
    setVerifications(prev => prev.map(a => {
      if (a.id !== id) return a;
      const idx = statuses.indexOf(a.status);
      return { ...a, status: statuses[(idx + 1) % statuses.length] };
    }));
  };

  const verified = verifications.filter(a => a.status === 'Verified').length;
  const issues = verifications.filter(a => a.status !== 'Verified').length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Verify Assets</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{verified}</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
            <div className="flex-1 rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{issues}</p>
              <p className="text-xs text-muted-foreground">Issues Found</p>
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {verifications.map(asset => (
              <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-sm">{asset.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{asset.tag}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn('text-xs', verificationColors[asset.status])}
                  onClick={() => cycle(asset.id)}
                >
                  {asset.status}
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button>Save Verification</Button></DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------
export default function AuditsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['audits'],
    queryFn: workflowService.getAudits,
  });

  const refresh = useCallback(() => queryClient.invalidateQueries({ queryKey: ['audits'] }), [queryClient]);

  const columns: TableColumn<Audit>[] = [
    {
      key: 'auditName',
      header: 'Audit Name',
      sortable: true,
      render: (val) => <span className="font-semibold">{String(val)}</span>,
    },
    {
      key: 'department',
      header: 'Department',
      render: (val) => String(val),
    },
    {
      key: 'auditor',
      header: 'Lead Auditor',
      render: (val) => String(val),
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled',
      sortable: true,
      render: (val) => new Date(String(val)).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <AuditStatusBadge status={String(val)} />,
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
            <DropdownMenuItem onClick={() => setVerifyOpen(true)}>
              <ClipboardCheck className="mr-2 h-4 w-4" /> Verify Assets
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" /> Assign Auditors
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlertTriangle className="mr-2 h-4 w-4" /> Discrepancy Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const stats = [
    { label: 'Total Audits', value: audits.length },
    { label: 'Scheduled', value: audits.filter((a: Audit) => a.status === 'Scheduled').length },
    { label: 'In Progress', value: audits.filter((a: Audit) => a.status === 'InProgress').length },
    { label: 'Completed', value: audits.filter((a: Audit) => a.status === 'Completed').length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Audit Management"
        description="Create and track asset audits, assign auditors, and report discrepancies."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Audit
            </Button>
          </div>
        }
      />

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

      <DataTable
        columns={columns}
        data={audits}
        isLoading={isLoading}
        emptyTitle="No audits found"
        emptyActionLabel="Create Audit"
        onEmptyAction={() => setCreateOpen(true)}
        searchKey="auditName"
      />

      <CreateAuditDialog open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={refresh} />
      <VerificationDialog open={verifyOpen} onClose={() => setVerifyOpen(false)} />
    </div>
  );
}
