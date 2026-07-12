// ================================================================
// API Endpoint Constants
// ================================================================
export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  ASSETS: {
    BASE: '/assets',
    BY_ID: (id: string) => `/assets/${id}`,
    QR: (id: string) => `/assets/${id}/qr`,
    PASSPORT: (id: string) => `/assets/${id}/passport`,
    PREDICT: (id: string) => `/assets/${id}/predict`,
  },
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id: string) => `/departments/${id}`,
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },
  EMPLOYEES: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  ALLOCATIONS: {
    BASE: '/allocations',
    BY_ID: (id: string) => `/allocations/${id}`,
    RETURN: (id: string) => `/allocations/${id}/return`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    APPROVE: (id: string) => `/bookings/${id}/approve`,
    REJECT: (id: string) => `/bookings/${id}/reject`,
  },
  MAINTENANCE: {
    BASE: '/maintenance',
    BY_ID: (id: string) => `/maintenance/${id}`,
    APPROVE: (id: string) => `/maintenance/${id}/approve`,
    ASSIGN: (id: string) => `/maintenance/${id}/assign`,
    START: (id: string) => `/maintenance/${id}/start`,
    RESOLVE: (id: string) => `/maintenance/${id}/resolve`,
  },
  AUDITS: {
    BASE: '/audits',
    BY_ID: (id: string) => `/audits/${id}`,
    START: (id: string) => `/audits/${id}/start`,
    COMPLETE: (id: string) => `/audits/${id}/complete`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
  REPORTS: {
    GENERATE: (module: string) => `/reports/${module}`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
  },
  AI: {
    ASK: '/ai/ask',
  },
} as const;

// ================================================================
// Domain Constants
// ================================================================
import type { AssetStatus, AssetCondition, AllocationStatus, BookingStatus, MaintenanceStatus, MaintenancePriority, AuditStatus } from '@/types';

export const ASSET_STATUSES: AssetStatus[] = ['Available', 'Allocated', 'Maintenance', 'Lost', 'Retired', 'Disposed'];
export const ASSET_CONDITIONS: AssetCondition[] = ['Excellent', 'Good', 'Average', 'Poor', 'Damaged'];
export const ALLOCATION_STATUSES: AllocationStatus[] = ['Active', 'Returned', 'Overdue', 'Transferred'];
export const BOOKING_STATUSES: BookingStatus[] = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'];
export const MAINTENANCE_STATUSES: MaintenanceStatus[] = ['Pending', 'Approved', 'Assigned', 'InProgress', 'Resolved', 'Cancelled'];
export const MAINTENANCE_PRIORITIES: MaintenancePriority[] = ['Low', 'Medium', 'High', 'Critical'];
export const AUDIT_STATUSES: AuditStatus[] = ['Scheduled', 'InProgress', 'Completed', 'Cancelled'];

export const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Available: 'default',
  Active: 'default',
  Approved: 'default',
  Completed: 'default',
  Resolved: 'default',
  Excellent: 'default',
  Good: 'default',
  Pending: 'secondary',
  Assigned: 'secondary',
  InProgress: 'secondary',
  Scheduled: 'secondary',
  Average: 'secondary',
  Returned: 'outline',
  Allocated: 'outline',
  Rejected: 'destructive',
  Cancelled: 'destructive',
  Lost: 'destructive',
  Damaged: 'destructive',
  Critical: 'destructive',
  Overdue: 'destructive',
  Poor: 'destructive',
  Retired: 'outline',
  Disposed: 'outline',
};

export const PRIORITY_COLOR: Record<string, string> = {
  Low: 'text-blue-600 bg-blue-50',
  Medium: 'text-yellow-600 bg-yellow-50',
  High: 'text-orange-600 bg-orange-50',
  Critical: 'text-red-600 bg-red-50',
};

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;
