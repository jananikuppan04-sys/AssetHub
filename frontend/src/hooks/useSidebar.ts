import { useAppContext } from '@/contexts/AppContext';

export function useSidebar() {
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useAppContext();
  return { sidebarCollapsed, toggleSidebar, setSidebarCollapsed };
}
