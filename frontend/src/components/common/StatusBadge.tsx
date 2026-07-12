import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, XCircle, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'Available' | 'Allocated' | 'Maintenance' | 'Lost' | 'Retired'
  | 'Pending' | 'Approved' | 'Rejected'
  | 'Active' | 'Inactive';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  let colorClass = 'bg-muted text-muted-foreground hover:bg-muted';
  let Icon: LucideIcon = Info;

  switch (status?.toString().toLowerCase()) {
    case 'available':
    case 'active':
    case 'approved':
      colorClass = 'bg-status-available/15 text-status-available hover:bg-status-available/25 border-status-available/20';
      Icon = CheckCircle2;
      break;
    case 'allocated':
      colorClass = 'bg-status-allocated/15 text-status-allocated hover:bg-status-allocated/25 border-status-allocated/20';
      Icon = CheckCircle2;
      break;
    case 'maintenance':
    case 'pending':
      colorClass = 'bg-status-maintenance/15 text-status-maintenance hover:bg-status-maintenance/25 border-status-maintenance/20';
      Icon = Clock;
      break;
    case 'lost':
    case 'rejected':
    case 'inactive':
      colorClass = 'bg-status-lost/15 text-status-lost hover:bg-status-lost/25 border-status-lost/20';
      Icon = XCircle;
      break;
    case 'retired':
      colorClass = 'bg-status-retired/15 text-status-retired hover:bg-status-retired/25 border-status-retired/20';
      Icon = AlertCircle;
      break;
  }

  return (
    <Badge variant="outline" className={cn('gap-1 font-medium', colorClass, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {status}
    </Badge>
  );
}
