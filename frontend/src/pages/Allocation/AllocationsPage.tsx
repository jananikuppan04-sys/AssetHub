import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock,
  RefreshCw, MoreHorizontal, Trash2, Eye
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import type { AllocationRequest } from '@/features/workflow/types/workflow.types';
import type { TableColumn } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------
const allocateSchema = z.object({
  assetId: z.string().min(1, 'Asset is required'),
  employeeId: z.string().min(1, 'Employee is required'),
  departmentId: z.string().min(1, 'Department is required'),
  allocationDate: z.string().min(1, 'Allocation date is required'),
  expectedReturnDate: z.string().optional(),
  purpose: z.string().min(3, 'Purpose must be at least 3 characters'),
  remarks: z.string().optional(),
});

const returnSchema = z.object({
  allocationId: z.string(),
  condition: z.enum(['Excellent', 'Good', 'Average', 'Poor', 'Damaged']),
  remarks: z.string().optional(),
});

const approvalSchema = z.object({
  comment: z.string().optional(),
});

type AllocateFormValues = z.infer<typeof allocateSchema>;
type ReturnFormValues = z.infer<typeof returnSchema>;
type ApprovalFormValues = z.infer<typeof approvalSchema>;

// ---------------------------------------------------------------
// Approval Status Badge
// ---------------------------------------------------------------
function ApprovalBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    ChangesRequested: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };
  const icons: Record<string, React.ReactNode> = {
    Pending: <Clock className="h-3 w-3" />,
    Approved: <CheckCircle2 className="h-3 w-3" />,
    Rejected: <XCircle className="h-3 w-3" />,
    ChangesRequested: <RefreshCw className="h-3 w-3" />,
  };
  return (
    <Badge variant="outline" className={cn('gap-1 font-medium', variants[status] || 'bg-muted')}>
      {icons[status]}
      {status}
    </Badge>
  );
}

// ---------------------------------------------------------------
// Allocate Asset Dialog
// ---------------------------------------------------------------
function AllocateDialog({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AllocateFormValues>({
    resolver: zodResolver(allocateSchema) as any,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: AllocateFormValues) => {
    setLoading(true);
    try {
      await workflowService.createAllocation({
        asset: data.assetId,
        employee: data.employeeId,
        department: data.departmentId,
        allocationDate: data.allocationDate,
        expectedReturnDate: data.expectedReturnDate,
        purpose: data.purpose,
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Allocate Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Asset ID / Tag <span className="text-destructive">*</span></Label>
              <Input {...register('assetId')} placeholder="e.g. AST-0042" />
              {errors.assetId && <p className="text-xs text-destructive">{errors.assetId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Employee ID <span className="text-destructive">*</span></Label>
              <Input {...register('employeeId')} placeholder="e.g. EMP-001" />
              {errors.employeeId && <p className="text-xs text-destructive">{errors.employeeId.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Department <span className="text-destructive">*</span></Label>
            <Input {...register('departmentId')} placeholder="e.g. Engineering" />
            {errors.departmentId && <p className="text-xs text-destructive">{errors.departmentId.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Allocation Date <span className="text-destructive">*</span></Label>
              <Input {...register('allocationDate')} type="date" />
            </div>
            <div className="space-y-1.5">
              <Label>Expected Return</Label>
              <Input {...register('expectedReturnDate')} type="date" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Purpose <span className="text-destructive">*</span></Label>
            <Input {...register('purpose')} placeholder="Describe the purpose" />
            {errors.purpose && <p className="text-xs text-destructive">{errors.purpose.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Remarks</Label>
            <Textarea {...register('remarks')} placeholder="Optional remarks" rows={2} />
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
// Approval Dialog
// ---------------------------------------------------------------
function ApprovalDialog({
  allocation, open, onClose, onSuccess
}: { allocation: AllocationRequest | null; open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { register, handleSubmit, reset } = useForm<ApprovalFormValues>();
  const [loading, setLoading] = useState(false);

  const handleDecision = async (data: ApprovalFormValues, approved: boolean) => {
    if (!allocation) return;
    setLoading(true);
    try {
      await workflowService.approveAllocation(allocation._id, approved, data.comment);
      onSuccess();
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!allocation) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Allocation Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asset</span>
              <span className="font-medium">{String(allocation.asset)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employee</span>
              <span className="font-medium">{String(allocation.employee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Purpose</span>
              <span className="font-medium">{allocation.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{allocation.allocationDate}</span>
            </div>
          </div>
          <form className="space-y-3">
            <div className="space-y-1.5">
              <Label>Comments (optional)</Label>
              <Textarea {...register('comment')} placeholder="Add your review comments..." rows={3} />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
                onClick={handleSubmit((d) => handleDecision(d, true)) as any}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                disabled={loading}
                onClick={handleSubmit((d) => handleDecision(d, false)) as any}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------
export default function AllocationsPage() {
  const queryClient = useQueryClient();
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [approvalTarget, setApprovalTarget] = useState<AllocationRequest | null>(null);

  const { data: allocations = [], isLoading } = useQuery({
    queryKey: ['allocations'],
    queryFn: workflowService.getAllocations,
  });

  const refresh = useCallback(() => queryClient.invalidateQueries({ queryKey: ['allocations'] }), [queryClient]);

  const pendingAllocations = allocations.filter(a => a.approvalStatus === 'Pending');
  const approvedAllocations = allocations.filter(a => a.approvalStatus === 'Approved');

  const columns: TableColumn<AllocationRequest>[] = [
    {
      key: 'asset',
      header: 'Asset',
      sortable: true,
      render: (val) => <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{String(val)}</span>,
    },
    {
      key: 'employee',
      header: 'Employee',
      render: (val) => <span className="font-medium">{String(val)}</span>,
    },
    {
      key: 'allocationDate',
      header: 'Allocated On',
      sortable: true,
      render: (val) => new Date(String(val)).toLocaleDateString(),
    },
    {
      key: 'expectedReturnDate',
      header: 'Return By',
      render: (val) => val ? new Date(String(val)).toLocaleDateString() : '—',
    },
    {
      key: 'purpose',
      header: 'Purpose',
      render: (val) => <span className="text-muted-foreground text-xs line-clamp-1">{String(val)}</span>,
    },
    {
      key: 'approvalStatus',
      header: 'Status',
      render: (val) => <ApprovalBadge status={String(val)} />,
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
            <DropdownMenuItem onClick={() => setApprovalTarget(row)}>
              <Eye className="mr-2 h-4 w-4" /> Review / Approve
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Summary stats
  const stats = [
    { label: 'Total Requests', value: allocations.length, color: 'text-foreground' },
    { label: 'Pending', value: pendingAllocations.length, color: 'text-amber-600' },
    { label: 'Approved', value: approvedAllocations.length, color: 'text-emerald-600' },
    { label: 'Rejected', value: allocations.filter(a => a.approvalStatus === 'Rejected').length, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Allocation Management"
        description="Manage asset allocation requests, approvals, returns, and transfers."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setAllocateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Allocation
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardContent className="pt-5 pb-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn('text-3xl font-bold mt-1', stat.color)}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed Table */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All <Badge variant="secondary" className="ml-2">{allocations.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <Badge variant="secondary" className="ml-2">{pendingAllocations.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <DataTable
            columns={columns}
            data={allocations}
            isLoading={isLoading}
            emptyTitle="No allocation records found"
            emptyActionLabel="Create Allocation"
            onEmptyAction={() => setAllocateOpen(true)}
            searchKey="asset"
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <DataTable
            columns={columns}
            data={pendingAllocations}
            isLoading={isLoading}
            emptyTitle="No pending requests"
            searchKey="asset"
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <DataTable
            columns={columns}
            data={approvedAllocations}
            isLoading={isLoading}
            emptyTitle="No approved allocations"
            searchKey="asset"
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AllocateDialog open={allocateOpen} onClose={() => setAllocateOpen(false)} onSuccess={refresh} />
      <ApprovalDialog
        allocation={approvalTarget}
        open={!!approvalTarget}
        onClose={() => setApprovalTarget(null)}
        onSuccess={refresh}
      />
    </div>
  );
}
