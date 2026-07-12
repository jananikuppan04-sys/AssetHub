import { useAuthContext } from '@/contexts/AuthContext';
import type { Permission } from '@/constants/routes';

export function usePermissions() {
  const { user, hasPermission } = useAuthContext();
  return {
    role: user?.role,
    hasPermission,
    can: (permission: Permission) => hasPermission(permission),
    isAdmin: user?.role === 'admin',
    isAssetManager: user?.role === 'asset_manager',
    isDepartmentHead: user?.role === 'department_head',
    isEmployee: user?.role === 'employee',
  };
}
