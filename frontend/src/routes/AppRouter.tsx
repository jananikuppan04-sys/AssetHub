import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { PublicOnlyRoute } from '@/components/guards/PublicOnlyRoute';
import { TableSkeleton } from '@/components/common/Skeletons';
import DashboardLayout from '@/layouts/DashboardLayout';
import AuthLayout from '@/layouts/AuthLayout';

// ---- Lazy-loaded Pages (PascalCase to match filesystem) ----
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/Auth/ForgotPasswordPage'));

const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'));
const AnalyticsPage = lazy(() => import('@/pages/Dashboard/Analytics/AnalyticsPage'));
const AssetsPage = lazy(() => import('@/pages/Assets/AssetsPage'));
const AssetDetails = lazy(() => import('@/pages/Assets/AssetDetails'));
const AssetRegistration = lazy(() => import('@/pages/Assets/AssetRegistration'));
const DepartmentsPage = lazy(() => import('@/pages/Departments/DepartmentsPage'));
const CategoriesPage = lazy(() => import('@/pages/Categories/CategoriesPage'));
const EmployeesPage = lazy(() => import('@/pages/Employees/EmployeesPage'));
const RolesPage = lazy(() => import('@/pages/Roles/RolesPage'));
const AllocationsPage = lazy(() => import('@/pages/Allocation/AllocationsPage'));
const BookingsPage = lazy(() => import('@/pages/Booking/BookingsPage'));
const MaintenancePage = lazy(() => import('@/pages/Maintenance/MaintenancePage'));
const AuditsPage = lazy(() => import('@/pages/Audit/AuditsPage'));
const ReportsPage = lazy(() => import('@/pages/Reports/ReportsPage'));
const NotificationsPage = lazy(() => import('@/pages/Notifications/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage'));
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'));
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage'));

function PageLoader() {
  return (
    <div className="flex-1 p-8">
      <TableSkeleton />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ---- Public / Auth Routes ---- */}
          <Route element={<AuthLayout />}>
            <Route
              path={ROUTES.LOGIN}
              element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>}
            />
            <Route
              path={ROUTES.REGISTER}
              element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>}
            />
            <Route
              path={ROUTES.FORGOT_PASSWORD}
              element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>}
            />
          </Route>

          {/* ---- Protected Dashboard Routes ---- */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path={ROUTES.ANALYTICS} element={<ProtectedRoute requiredPermission="view:analytics"><AnalyticsPage /></ProtectedRoute>} />
            <Route path={ROUTES.ASSETS} element={<ProtectedRoute requiredPermission="view:assets"><AssetsPage /></ProtectedRoute>} />
            <Route path="/assets/new" element={<ProtectedRoute requiredPermission="manage:assets"><AssetRegistration /></ProtectedRoute>} />
            <Route path="/assets/:id" element={<ProtectedRoute requiredPermission="view:assets"><AssetDetails /></ProtectedRoute>} />
            <Route path="/assets/:id/edit" element={<ProtectedRoute requiredPermission="manage:assets"><AssetRegistration /></ProtectedRoute>} />
            <Route path={ROUTES.DEPARTMENTS} element={<ProtectedRoute requiredPermission="view:departments"><DepartmentsPage /></ProtectedRoute>} />
            <Route path={ROUTES.CATEGORIES} element={<ProtectedRoute requiredPermission="view:categories"><CategoriesPage /></ProtectedRoute>} />
            <Route path={ROUTES.EMPLOYEES} element={<ProtectedRoute requiredPermission="view:employees"><EmployeesPage /></ProtectedRoute>} />
            <Route path={ROUTES.ROLES} element={<ProtectedRoute requiredPermission="view:roles"><RolesPage /></ProtectedRoute>} />
            <Route path={ROUTES.ALLOCATIONS} element={<ProtectedRoute requiredPermission="view:allocations"><AllocationsPage /></ProtectedRoute>} />
            <Route path={ROUTES.BOOKINGS} element={<ProtectedRoute requiredPermission="view:bookings"><BookingsPage /></ProtectedRoute>} />
            <Route path={ROUTES.MAINTENANCE} element={<ProtectedRoute requiredPermission="view:maintenance"><MaintenancePage /></ProtectedRoute>} />
            <Route path={ROUTES.AUDITS} element={<ProtectedRoute requiredPermission="view:audits"><AuditsPage /></ProtectedRoute>} />
            <Route path={ROUTES.REPORTS} element={<ProtectedRoute requiredPermission="view:reports"><ReportsPage /></ProtectedRoute>} />
            <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute requiredPermission="view:notifications"><NotificationsPage /></ProtectedRoute>} />
            <Route path={ROUTES.SETTINGS} element={<ProtectedRoute requiredPermission="manage:settings"><SettingsPage /></ProtectedRoute>} />
            <Route path={ROUTES.PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Route>

          {/* ---- Error Routes ---- */}
          <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
