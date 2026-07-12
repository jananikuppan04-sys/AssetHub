import React from 'react';
import { cn } from '@/lib/utils';

export function DashboardGridLayout({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {children}
    </div>
  );
}

export function DashboardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
}
