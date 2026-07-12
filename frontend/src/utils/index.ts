import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// ================================================================
// Date Utilities
// ================================================================
export function formatDate(date: string | Date | null | undefined, pattern = 'MMM dd, yyyy'): string {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isValid(d) ? format(d, pattern) : '—';
  } catch {
    return '—';
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
}

// ================================================================
// Currency & Number Utilities
// ================================================================
export function formatCurrency(
  amount: number | null | undefined,
  currency = 'INR',
  locale = 'en-IN'
): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN').format(value);
}

// ================================================================
// File Utilities
// ================================================================
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function downloadFile(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}

// ================================================================
// String Utilities
// ================================================================
export function capitalize(str: string | null | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .split(/[\s_-]+/)
    .map(capitalize)
    .join(' ');
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

export function truncate(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str ?? '';
  return `${str.slice(0, maxLength)}…`;
}

// ================================================================
// Color & Status Utilities
// ================================================================
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    Available: 'bg-green-100 text-green-800',
    Active: 'bg-green-100 text-green-800',
    Approved: 'bg-green-100 text-green-800',
    Resolved: 'bg-green-100 text-green-800',
    Completed: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    InProgress: 'bg-blue-100 text-blue-800',
    Assigned: 'bg-blue-100 text-blue-800',
    Scheduled: 'bg-blue-100 text-blue-800',
    Allocated: 'bg-purple-100 text-purple-800',
    Returned: 'bg-slate-100 text-slate-800',
    Rejected: 'bg-red-100 text-red-800',
    Cancelled: 'bg-red-100 text-red-800',
    Lost: 'bg-red-100 text-red-800',
    Damaged: 'bg-orange-100 text-orange-800',
    Overdue: 'bg-red-100 text-red-800',
    Critical: 'bg-red-100 text-red-800',
    Maintenance: 'bg-orange-100 text-orange-800',
    Retired: 'bg-slate-100 text-slate-600',
    Disposed: 'bg-slate-100 text-slate-500',
  };
  return map[status] ?? 'bg-muted text-muted-foreground';
}

export function getHealthScoreColor(score: number | null | undefined): string {
  if (!score) return 'text-muted-foreground';
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

// ================================================================
// Query String Utilities
// ================================================================
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

// ================================================================
// ID Helpers
// ================================================================
export function extractId(entity: string | { _id: string } | null | undefined): string {
  if (!entity) return '';
  if (typeof entity === 'string') return entity;
  return entity._id;
}
