import type { UserRole } from '@/types';

// ============================================================
// Route Path Constants
// ============================================================
export const ROUTES = {
  // Public
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected
  DASHBOARD: '/',
  ANALYTICS: '/analytics',
  ASSETS: '/assets',
  ASSET_NEW: '/assets/new',
  ASSET_DETAIL: (id: string) => `/assets/${id}`,
  ASSET_EDIT: (id: string) => `/assets/${id}/edit`,
  DEPARTMENTS: '/departments',
  CATEGORIES: '/categories',
  EMPLOYEES: '/employees',
  ROLES: '/roles',
  ALLOCATIONS: '/allocations',
  BOOKINGS: '/bookings',
  MAINTENANCE: '/maintenance',
  AUDITS: '/audits',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
} as const;

// ============================================================
// Role Permissions Map
// ============================================================
export type Permission =
  | 'view:dashboard'
  | 'view:analytics'
  | 'view:assets'
  | 'manage:assets'
  | 'view:departments'
  | 'manage:departments'
  | 'view:categories'
  | 'manage:categories'
  | 'view:employees'
  | 'manage:employees'
  | 'view:roles'
  | 'manage:roles'
  | 'view:allocations'
  | 'manage:allocations'
  | 'view:bookings'
  | 'manage:bookings'
  | 'view:maintenance'
  | 'manage:maintenance'
  | 'approve:maintenance'
  | 'view:audits'
  | 'manage:audits'
  | 'view:reports'
  | 'view:notifications'
  | 'manage:settings';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'view:dashboard', 'view:analytics', 'view:assets', 'manage:assets',
    'view:departments', 'manage:departments',
    'view:categories', 'manage:categories',
    'view:employees', 'manage:employees',
    'view:roles', 'manage:roles',
    'view:allocations', 'manage:allocations',
    'view:bookings', 'manage:bookings',
    'view:maintenance', 'manage:maintenance', 'approve:maintenance',
    'view:audits', 'manage:audits',
    'view:reports', 'view:notifications', 'manage:settings',
  ],
  asset_manager: [
    'view:dashboard', 'view:assets', 'manage:assets',
    'view:allocations', 'manage:allocations',
    'view:bookings', 'manage:bookings',
    'view:maintenance', 'manage:maintenance',
    'view:reports', 'view:notifications',
  ],
  department_head: [
    'view:dashboard', 'view:assets',
    'view:allocations',
    'view:bookings',
    'view:maintenance', 'approve:maintenance',
    'view:audits',
    'view:notifications',
  ],
  employee: [
    'view:dashboard', 'view:assets',
    'view:bookings', 'manage:bookings',
    'view:maintenance', 'manage:maintenance',
    'view:notifications',
  ],
};
