import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { BreadcrumbItem } from '@/types';

const LABEL_MAP: Record<string, string> = {
  '': 'Dashboard',
  assets: 'Assets',
  new: 'Add New',
  edit: 'Edit',
  departments: 'Departments',
  categories: 'Categories',
  employees: 'Employees',
  allocations: 'Allocations',
  bookings: 'Bookings',
  maintenance: 'Maintenance',
  audits: 'Audits',
  reports: 'Reports',
  notifications: 'Notifications',
  settings: 'Settings',
  profile: 'Profile',
};

function isUUID(segment: string): boolean {
  return /^[0-9a-f]{24}$|^[0-9a-f-]{36}$/i.test(segment);
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const { pathname } = useLocation();

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/' }];

    let builtPath = '';
    for (const segment of segments) {
      builtPath += `/${segment}`;
      const label = isUUID(segment) ? 'Detail' : (LABEL_MAP[segment] ?? segment);
      crumbs.push({ label, href: builtPath });
    }

    return crumbs;
  }, [pathname]);
}
