import React, { useState } from 'react';
import { Package, Plus, HeartPulse, ShieldAlert, MonitorOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssets } from '@/hooks/useAssets';
import type { Asset, TableColumn } from '@/types';
import { ROUTES } from '@/constants/routes';

export default function AssetsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data, total, isLoading, error } = useAssets({ search });

  const columns: TableColumn<Asset>[] = [
    { key: 'assetTag', header: 'Tag', sortable: true, render: (v) => <span className="font-mono text-xs text-primary">{String(v)}</span> },
    { key: 'assetName', header: 'Asset Name', sortable: true, render: (v, r) => (
      <div>
        <p className="font-semibold">{String(v)}</p>
        <p className="text-xs text-muted-foreground truncate">{typeof r.category === 'string' ? r.category : r.category.name} • {r.manufacturer}</p>
      </div>
    )},
    { key: 'department', header: 'Department', sortable: true, render: (v) => typeof v === 'string' ? v : (v as any).name },
    { key: 'assignedTo', header: 'Assigned To', sortable: true, render: (v) => typeof v === 'string' ? v : (v as any).name },
    { key: 'condition', header: 'Condition', sortable: true, render: (v) => {
      const cond = String(v);
      const color = cond === 'Excellent' || cond === 'Good' ? 'default' : cond === 'Average' ? 'secondary' : 'destructive';
      return <Badge variant={color as any}>{cond}</Badge>;
    }},
    { key: 'healthScore', header: 'Health', sortable: true, render: (v) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${Number(v)}%` }} />
        </div>
        <span className="text-xs font-medium">{Number(v)}%</span>
      </div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (v) => (
      <Badge variant={v === 'Available' ? 'default' : 'outline'}>{String(v)}</Badge>
    )},
    { key: 'actions', header: 'Actions', render: (_, r) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-700" onClick={() => navigate(ROUTES.ASSET_DETAIL(r._id))}>View</Button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Asset Inventory" 
        description="Manage, track, and maintain all organizational assets."
        action={
          <Button onClick={() => navigate(ROUTES.ASSET_NEW)}>
            <Plus className="h-4 w-4 mr-2" />
            Register Asset
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health</CardTitle>
            <HeartPulse className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">92%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Warranty</CardTitle>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-amber-600">12</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Maintenance</CardTitle>
            <MonitorOff className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">5</div></CardContent>
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
        emptyModule="assets"
        emptyTitle="No assets found"
        emptyActionLabel="Register Asset"
        onEmptyAction={() => navigate(ROUTES.ASSET_NEW)}
      />
    </div>
  );
}
