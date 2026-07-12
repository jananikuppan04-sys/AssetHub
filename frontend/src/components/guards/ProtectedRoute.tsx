import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import type { Permission } from '@/constants/routes';
import { TableSkeleton } from '@/components/common/Skeletons';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

/**
 * ProtectedRoute
 * - Waits while auth is loading (shows skeleton)
 * - Redirects to /login if not authenticated
 * - Redirects to /401 if authenticated but lacks required permission
 */
export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-4xl p-8">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}
