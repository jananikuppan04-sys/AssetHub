import React, { useState } from 'react';
import { Tags, Plus, MonitorSmartphone } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories } from '@/hooks/useAdmin';
import type { Category, TableColumn } from '@/types';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const { data, total, isLoading, error, refresh } = useCategories({ search });

  const columns: TableColumn<Category>[] = [
    { key: 'code', header: 'Code', sortable: true, render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: 'name', header: 'Category Name', sortable: true, render: (v, r) => (
      <div>
        <p className="font-semibold">{String(v)}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{r.description}</p>
      </div>
    )},
    { key: 'assetCount', header: 'Total Assets', sortable: true, render: (v) => (
      <div className="flex items-center gap-1.5"><MonitorSmartphone className="h-3.5 w-3.5 text-muted-foreground"/> {Number(v)}</div>
    )},
    { key: 'status', header: 'Status', render: (v) => (
      <Badge variant={v === 'active' ? 'default' : 'secondary'} className="capitalize">{String(v)}</Badge>
    )},
    { key: 'actions', header: 'Actions', render: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-700">Edit</Button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Asset Categories" 
        description="Manage equipment categories and classification tags."
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            <Tags className="h-4 w-4 text-primary" />
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
        emptyModule="categories"
        emptyTitle="No categories found"
        emptyActionLabel="Add Category"
        onEmptyAction={() => {}}
      />
    </div>
  );
}
