import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Building2, Tags, Users,
  ArrowRightLeft, CalendarRange, Wrench, ClipboardCheck,
  BarChart3, Bell, Settings, LogOut, ChevronLeft,
  ChevronRight, LayoutGrid, ChevronDown, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';
import { usePermissions } from '@/hooks/usePermissions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Permission } from '@/constants/routes';

// ---- Nav Item Definition ----
interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  permission?: Permission;
  badge?: number;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'view:dashboard' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, permission: 'view:analytics' },
  {
    label: 'Assets', icon: Package, permission: 'view:assets',
    children: [
      { label: 'All Assets', href: '/assets', icon: Package, permission: 'view:assets' },
      { label: 'Add Asset', href: '/assets/new', icon: Package, permission: 'manage:assets' },
    ],
  },
  { label: 'Departments', href: '/departments', icon: Building2, permission: 'view:departments' },
  { label: 'Categories', href: '/categories', icon: Tags, permission: 'view:categories' },
  { label: 'Employees', href: '/employees', icon: Users, permission: 'view:employees' },
  { label: 'Roles & Permissions', href: '/roles', icon: Shield, permission: 'view:roles' },
  { label: 'Allocations', href: '/allocations', icon: ArrowRightLeft, permission: 'view:allocations' },
  { label: 'Bookings', href: '/bookings', icon: CalendarRange, permission: 'view:bookings' },
  { label: 'Maintenance', href: '/maintenance', icon: Wrench, permission: 'view:maintenance' },
  { label: 'Audits', href: '/audits', icon: ClipboardCheck, permission: 'view:audits' },
  { label: 'Notifications', href: '/notifications', icon: Bell, permission: 'view:notifications' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings, permission: 'manage:settings' },
];

// ---- Single Nav Item ----
function NavItemButton({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}) {
  const location = useLocation();
  const { can } = usePermissions();
  const [open, setOpen] = useState(false);

  if (item.permission && !can(item.permission)) return null;

  const isActive =
    item.href === '/'
      ? location.pathname === '/'
      : item.href
        ? location.pathname.startsWith(item.href)
        : item.children?.some((c) => c.href && location.pathname.startsWith(c.href));

  const hasChildren = item.children && item.children.length > 0;

  const buttonClass = cn(
    'w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
    depth > 0 && 'pl-8',
    isActive
      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
  );

  const icon = (
    <item.icon
      className={cn('shrink-0', collapsed && depth === 0 ? 'h-5 w-5' : 'h-4 w-4')}
    />
  );

  const content = (
    <>
      {icon}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="ml-auto text-xs bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 leading-none">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
            />
          )}
        </>
      )}
    </>
  );

  if (hasChildren) {
    return (
      <>
        <button className={buttonClass} onClick={() => setOpen((o) => !o)}>
          {collapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center justify-center w-full">{icon}</span>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            content
          )}
        </button>
        {open && !collapsed && (
          <div className="mt-0.5 space-y-0.5">
            {item.children!.map((child) => (
              <NavItemButton key={child.label} item={child} collapsed={collapsed} depth={depth + 1} />
            ))}
          </div>
        )}
      </>
    );
  }

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={item.href!} className={buttonClass}>
              {icon}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link to={item.href!} className={buttonClass}>
      {content}
    </Link>
  );
}

// ---- Main Sidebar ----
export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-full border-r bg-sidebar transition-all duration-300 shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-14 items-center border-b px-3 shrink-0',
          sidebarCollapsed ? 'justify-center' : 'justify-between px-5'
        )}
      >
        {!sidebarCollapsed && (
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-sidebar-primary">
            <LayoutGrid className="h-5 w-5" />
            AssetHub
          </Link>
        )}
        {sidebarCollapsed && (
          <Link to="/" className="text-sidebar-primary">
            <LayoutGrid className="h-6 w-6" />
          </Link>
        )}
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => (
            <NavItemButton key={item.label} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        <Separator className="my-3 mx-2" />

        <nav className="space-y-0.5 px-2">
          {BOTTOM_ITEMS.map((item) => (
            <NavItemButton key={item.label} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>
      </ScrollArea>

      {/* User footer */}
      <div className="border-t p-3 shrink-0">
        {sidebarCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="flex w-full justify-center rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-xs">
                {user?.name?.slice(0, 2).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name ?? 'User'}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <button
              onClick={logout}
              className="shrink-0 rounded-md p-1 text-sidebar-foreground/60 hover:text-destructive hover:bg-sidebar-accent transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
