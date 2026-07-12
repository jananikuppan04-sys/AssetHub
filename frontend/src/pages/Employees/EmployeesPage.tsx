import React, { useState } from 'react';
import { Users, Plus, Shield, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/components/avatars/UserAvatar';
import { useEmployees } from '@/hooks/useAdmin';
import type { Employee, TableColumn } from '@/types';

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const { data, total, isLoading, error, refresh } = useEmployees({ search });

  const columns: TableColumn<Employee>[] = [
    { key: 'name', header: 'Employee', sortable: true, render: (v, r) => (
      <div className="flex items-center gap-3">
        <UserAvatar name={String(v)} src={r.avatar} size="sm" />
        <div>
          <p className="font-semibold">{String(v)}</p>
          <p className="text-xs text-muted-foreground">{r.email}</p>
        </div>
      </div>
    )},
    { key: 'department', header: 'Department', sortable: true, render: (v, r) => (
      <div>
        <p className="font-medium text-sm flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-muted-foreground"/> {String(v)}</p>
        {r.designation && <p className="text-xs text-muted-foreground pl-5">{r.designation}</p>}
      </div>
    )},
    { key: 'role', header: 'System Role', sortable: true, render: (v) => (
      <div className="flex items-center gap-1.5 capitalize text-sm">
        <Shield className="h-3.5 w-3.5 text-muted-foreground"/> {String(v).replace('_', ' ')}
      </div>
    )},
    { key: 'status', header: 'Status', render: (v) => (
      <Badge variant={v === 'active' ? 'default' : 'secondary'} className="capitalize">{String(v)}</Badge>
    )},
    { key: 'actions', header: 'Actions', render: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-700">View Profile</Button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Employee Directory" 
        description="Manage organizational staff, roles, and access controls."
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-primary" />
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
        emptyModule="employees"
        emptyTitle="No employees found"
        emptyActionLabel="Add Employee"
        onEmptyAction={() => {}}
      />
    </div>
  );
}
