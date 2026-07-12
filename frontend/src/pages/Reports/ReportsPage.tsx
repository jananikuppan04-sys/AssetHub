import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Download, FileBarChart2, FileText, CalendarDays, ClipboardCheck } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { workflowService } from '@/features/workflow/services/workflowService';
import { TableSkeleton } from '@/components/common/Skeletons';

// ---------------------------------------------------------------
// Chart Colors
// ---------------------------------------------------------------
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b', '#ef4444'];
const TOOLTIP_STYLE = {
  borderRadius: '8px',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--foreground))',
};

// ---------------------------------------------------------------
// Export Button
// ---------------------------------------------------------------
function ExportButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // In production: generate CSV/Excel via a library like xlsx
    const blob = new Blob([`${label} Report - ${new Date().toISOString()}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${label.replace(/\s/g, '_')}_Report.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  };
  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading}>
      <Download className="mr-2 h-4 w-4" />
      {loading ? 'Exporting...' : 'Export CSV'}
    </Button>
  );
}

// ---------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------
function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-5 pb-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------
// Asset Report Tab
// ---------------------------------------------------------------
function AssetReportTab() {
  const { data, isLoading } = useQuery({ queryKey: ['report-assets'], queryFn: workflowService.getAssetReport });

  if (isLoading || !data) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Asset Inventory Report</h3>
        <ExportButton label="Asset" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Assets" value={data.totalAssets} />
        <StatCard label="Available" value={data.byStatus.find((s: { name: string; value: number }) => s.name === 'Available')?.value ?? 0} />
        <StatCard label="Allocated" value={data.byStatus.find((s: { name: string; value: number }) => s.name === 'Allocated')?.value ?? 0} />
        <StatCard label="Under Maintenance" value={data.byStatus.find((s: { name: string; value: number }) => s.name === 'Maintenance')?.value ?? 0} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.byStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    {data.byStatus.map((_entry: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Assets by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byCategory} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byDepartment} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="count" name="Assets" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="cost" name="Cost (USD)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Maintenance Report Tab
// ---------------------------------------------------------------
function MaintenanceReportTab() {
  const { data, isLoading } = useQuery({ queryKey: ['report-maintenance'], queryFn: workflowService.getMaintenanceReport });
  if (isLoading || !data) return <TableSkeleton />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Maintenance Analytics</h3>
        <ExportButton label="Maintenance" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={data.totalRequests} />
        <StatCard label="Resolved" value={data.resolved} sub={`${Math.round(data.resolved / data.totalRequests * 100)}% completion`} />
        <StatCard label="Pending" value={data.pending} />
        <StatCard label="Total Cost" value={`$${data.totalCost.toLocaleString()}`} />
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Monthly Maintenance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.byMonth} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="maintGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="count" name="Requests" stroke="#3b82f6" fill="url(#maintGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------
// Booking Report Tab
// ---------------------------------------------------------------
function BookingReportTab() {
  const { data, isLoading } = useQuery({ queryKey: ['report-bookings'], queryFn: workflowService.getBookingReport });
  if (isLoading || !data) return <TableSkeleton />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Booking Analytics</h3>
        <ExportButton label="Booking" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Bookings" value={data.totalBookings} />
        <StatCard label="Approved" value={data.approved} sub={`${Math.round(data.approved / data.totalBookings * 100)}% approval rate`} />
        <StatCard label="Rejected" value={data.rejected} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Bookings by Department</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byDepartment} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base">Top Resources</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.byResource} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="name" stroke="none">
                    {data.byResource.map((_entry: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Audit Report Tab
// ---------------------------------------------------------------
function AuditReportTab() {
  const { data, isLoading } = useQuery({ queryKey: ['report-audits'], queryFn: workflowService.getAuditReport });
  if (isLoading || !data) return <TableSkeleton />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Audit Summary Report</h3>
        <ExportButton label="Audit" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Audits" value={data.totalAudits} />
        <StatCard label="Completed" value={data.completed} />
        <StatCard label="Assets Verified" value={data.totalVerified.toLocaleString()} />
        <StatCard label="Missing" value={data.totalMissing} />
        <StatCard label="Damaged" value={data.totalDamaged} />
      </div>
      {(data.totalMissing > 0 || data.totalDamaged > 0) && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
          <ClipboardCheck className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive">Discrepancies Detected</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {data.totalMissing} missing and {data.totalDamaged} damaged assets across completed audits. 
              Review and initiate recovery procedures.
            </p>
          </div>
        </div>
      )}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Audit Completion Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: data.completed },
                    { name: 'Pending', value: data.totalAudits - data.completed },
                  ]}
                  cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={4} dataKey="value" stroke="none"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------
// Main Reports Page
// ---------------------------------------------------------------
export default function ReportsPage() {
  const reportTabs = [
    { id: 'assets', label: 'Assets', icon: FileBarChart2 },
    { id: 'maintenance', label: 'Maintenance', icon: FileText },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'audits', label: 'Audits', icon: ClipboardCheck },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Reports & Analytics"
        description="Enterprise-wide insights into assets, operations, and workflows."
      />

      <Tabs defaultValue="assets">
        <TabsList className="h-auto flex-wrap gap-1 bg-transparent border-b rounded-none w-full justify-start pb-0">
          {reportTabs.map(t => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-10 bg-transparent gap-2 px-4"
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="assets"><AssetReportTab /></TabsContent>
          <TabsContent value="maintenance"><MaintenanceReportTab /></TabsContent>
          <TabsContent value="bookings"><BookingReportTab /></TabsContent>
          <TabsContent value="audits"><AuditReportTab /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
