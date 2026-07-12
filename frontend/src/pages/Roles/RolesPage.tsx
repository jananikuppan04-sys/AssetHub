import React, { useState } from 'react';
import { ShieldCheck, Plus, Users } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoles } from '@/hooks/useAdmin';
import type { RoleDefinition, TableColumn } from '@/types';

export default function RolesPage() {
  const [search, setSearch] = useState('');
  const { data, total, isLoading, error, refresh } = useRoles({ search });

  const columns: TableColumn<RoleDefinition>[] = [
    { key: 'name', header: 'Role Name', sortable: true, render: (v, r) => (
      <div>
        <p className="font-semibold text-primary">{String(v)}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[250px]">{r.description}</p>
      </div>
    )},
    { key: 'isCustom', header: 'Type', sortable: true, render: (v) => (
      <Badge variant={v ? 'outline' : 'secondary'} className={!v ? 'bg-primary/10 text-primary' : ''}>
        {v ? 'Custom Role' : 'System Default'}
      </Badge>
    )},
    { key: 'userCount', header: 'Assigned Users', sortable: true, render: (v) => (
      <div className="flex items-center gap-1.5 font-medium"><Users className="h-3.5 w-3.5 text-muted-foreground"/> {Number(v)}</div>
    )},
    { key: 'actions', header: 'Actions', render: (v, r) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-700">View Matrix</Button>
        {r.isCustom && <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive">Delete</Button>}
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Roles & Permissions" 
        description="Manage Role-Based Access Control (RBAC) and security policies."
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Role
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Roles</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{total}</div></CardContent>
        </Card>
      </div>

      <DataTable 
        columns={columns}
        data={data}
        total={total}
        isLoading={isLoading}
        error={error}
        searchValue={search}
        onSearchChange={setSearch}
        emptyModule="roles"
        emptyTitle="No roles found"
        emptyActionLabel="Create Role"
        onEmptyAction={() => {}}
      />
    </div>
  );
}
