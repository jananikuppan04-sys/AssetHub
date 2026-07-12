import React from 'react';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/utils';
import { STATUS_VARIANT } from '@/constants/api';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * StatusBadge — renders a colored badge for any entity status string.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = STATUS_VARIANT[status] ?? 'outline';
  return (
    <Badge variant={variant} className={cn('text-xs font-medium', className)}>
      {status}
    </Badge>
  );
}

interface HealthScoreBadgeProps {
  score: number | null | undefined;
}

export function HealthScoreBadge({ score }: HealthScoreBadgeProps) {
  if (score == null) return <span className="text-muted-foreground text-sm">—</span>;

  const color =
    score >= 80 ? 'bg-green-100 text-green-800' :
    score >= 60 ? 'bg-yellow-100 text-yellow-800' :
    score >= 40 ? 'bg-orange-100 text-orange-800' :
    'bg-red-100 text-red-800';

  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', color)}>
      {score}/100
    </span>
  );
}

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colorMap: Record<string, string> = {
    Low: 'bg-blue-50 text-blue-700',
    Medium: 'bg-yellow-50 text-yellow-700',
    High: 'bg-orange-50 text-orange-700',
    Critical: 'bg-red-50 text-red-700',
  };
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
      colorMap[priority] ?? 'bg-muted text-muted-foreground'
    )}>
      {priority}
    </span>
  );
}
