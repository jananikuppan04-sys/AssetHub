import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, ArrowRightLeft, Building2, Tags, UserPlus, 
  FileBarChart, CalendarCheck, Wrench, Pin, PinOff, Search 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePermissions } from '@/hooks/usePermissions';
import { ROUTES, type Permission } from '@/constants/routes';
import { Button } from '@/components/ui/button';

interface ActionItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  permission?: Permission;
  colorClass: string;
}

const ALL_ACTIONS: ActionItem[] = [
  { id: 'register_asset', label: 'Register Asset', icon: PlusCircle, href: ROUTES.ASSETS, permission: 'manage:assets', colorClass: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
  { id: 'allocate_asset', label: 'Allocate Asset', icon: ArrowRightLeft, href: ROUTES.ALLOCATIONS, permission: 'manage:allocations', colorClass: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
  { id: 'add_employee', label: 'Add Employee', icon: UserPlus, href: ROUTES.EMPLOYEES, permission: 'manage:employees', colorClass: 'text-green-600 bg-green-50 hover:bg-green-100' },
  { id: 'req_maintenance', label: 'Request Maintenance', icon: Wrench, href: ROUTES.MAINTENANCE, permission: 'manage:maintenance', colorClass: 'text-orange-600 bg-orange-50 hover:bg-orange-100' },
  { id: 'schedule_audit', label: 'Schedule Audit', icon: CalendarCheck, href: ROUTES.AUDITS, permission: 'manage:audits', colorClass: 'text-red-600 bg-red-50 hover:bg-red-100' },
  { id: 'gen_report', label: 'Generate Report', icon: FileBarChart, href: ROUTES.REPORTS, permission: 'view:reports', colorClass: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' },
  { id: 'create_dept', label: 'Create Department', icon: Building2, href: ROUTES.DEPARTMENTS, permission: 'manage:departments', colorClass: 'text-pink-600 bg-pink-50 hover:bg-pink-100' },
  { id: 'manage_cats', label: 'Manage Categories', icon: Tags, href: ROUTES.CATEGORIES, permission: 'manage:categories', colorClass: 'text-teal-600 bg-teal-50 hover:bg-teal-100' },
];

export function QuickActions() {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('assethub_pinned_actions');
    if (saved) {
      try { setPinnedIds(JSON.parse(saved)); } catch (e) {}
    } else {
      // Default pins
      setPinnedIds(['register_asset', 'allocate_asset', 'req_maintenance', 'gen_report']);
    }
  }, []);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let next: string[];
    if (pinnedIds.includes(id)) {
      next = pinnedIds.filter(pid => pid !== id);
    } else {
      next = [...pinnedIds, id];
    }
    setPinnedIds(next);
    localStorage.setItem('assethub_pinned_actions', JSON.stringify(next));
  };

  // Filter actions based on user permissions
  const availableActions = ALL_ACTIONS.filter(action => !action.permission || can(action.permission));
  
  if (availableActions.length === 0) return null;

  const displayedActions = showAll 
    ? availableActions 
    : availableActions.filter(a => pinnedIds.includes(a.id));

  // Fallback if no pins and showAll is false
  const renderActions = displayedActions.length > 0 ? displayedActions : availableActions.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
        <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Pinned Only' : 'Show All Actions'}
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {renderActions.map((action) => {
          const Icon = action.icon;
          const isPinned = pinnedIds.includes(action.id);
          return (
            <Card 
              key={action.id}
              className="group relative cursor-pointer hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden"
              onClick={() => navigate(action.href)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3">
                <button 
                  className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted ${isPinned ? 'text-primary opacity-100' : 'text-muted-foreground'}`}
                  onClick={(e) => togglePin(action.id, e)}
                  title={isPinned ? "Unpin action" : "Pin action"}
                >
                  {isPinned ? <Pin className="h-3 w-3 fill-current" /> : <Pin className="h-3 w-3" />}
                </button>
                <div className={`p-3 rounded-xl transition-colors ${action.colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
