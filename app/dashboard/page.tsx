'use client'

import { useAssetStore } from '@/lib/store'
import { useMemo } from 'react'

interface StatCard {
  label: string
  value: string | number
  icon: string
  trend?: string
  color: string
}

export default function DashboardPage() {
  const store = useAssetStore()

  const stats = useMemo(() => {
    const totalAssets = store.assets.length
    const activeAssets = store.assets.filter(a => a.status === 'active').length
    const maintenanceAssets = store.assets.filter(a => a.status === 'maintenance').length
    const retiredAssets = store.assets.filter(a => a.status === 'retired').length
    const avgHealth = Math.round(store.assets.reduce((sum, a) => sum + a.healthScore, 0) / Math.max(totalAssets, 1))
    const pendingAllocations = store.allocations.filter(a => a.status === 'pending').length
    const pendingTransfers = store.transfers.filter(t => t.status === 'pending_approval').length
    const maintenanceRequests = store.maintenance.filter(m => m.status === 'pending' || m.status === 'in_progress').length

    return [
      { label: 'Total Assets', value: totalAssets, icon: '📦', color: 'from-blue-500 to-blue-600' },
      { label: 'Active Assets', value: activeAssets, icon: '✓', color: 'from-green-500 to-green-600' },
      { label: 'Under Maintenance', value: maintenanceAssets, icon: '🔧', color: 'from-yellow-500 to-yellow-600' },
      { label: 'Avg Health Score', value: `${avgHealth}%`, icon: '📊', color: 'from-purple-500 to-purple-600' },
      { label: 'Pending Allocations', value: pendingAllocations, icon: '👤', color: 'from-orange-500 to-orange-600' },
      { label: 'Pending Transfers', value: pendingTransfers, icon: '🔄', color: 'from-pink-500 to-pink-600' },
      { label: 'Maintenance Tasks', value: maintenanceRequests, icon: '📝', color: 'from-indigo-500 to-indigo-600' },
      { label: 'Total Bookings', value: store.bookings.filter(b => b.status === 'confirmed').length, icon: '📅', color: 'from-cyan-500 to-cyan-600' }
    ] as StatCard[]
  }, [store])

  const recentActivities = store.activities.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {store.currentUser?.name}. Here's your system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-lg font-medium transition-colors">
            + Register Asset
          </button>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-3 rounded-lg font-medium transition-colors border border-primary/20">
            Request Allocation
          </button>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-3 rounded-lg font-medium transition-colors border border-primary/20">
            View Reports
          </button>
        </div>
      </div>

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Status Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Asset Status Distribution</h2>
          <div className="space-y-3">
            {[
              { label: 'Active', count: store.assets.filter(a => a.status === 'active').length, color: 'bg-green-500' },
              { label: 'Maintenance', count: store.assets.filter(a => a.status === 'maintenance').length, color: 'bg-yellow-500' },
              { label: 'Retired', count: store.assets.filter(a => a.status === 'retired').length, color: 'bg-gray-500' },
              { label: 'Damaged', count: store.assets.filter(a => a.status === 'damaged').length, color: 'bg-red-500' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${(item.count / Math.max(store.assets.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Assets */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Assets by Department</h2>
          <div className="space-y-3">
            {store.departments.map((dept) => {
              const deptAssets = store.assets.filter(a => a.department === dept.name).length
              return (
                <div key={dept.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{dept.name}</span>
                    <span className="text-sm font-medium text-foreground">{deptAssets}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(deptAssets / Math.max(store.assets.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                <div className="text-xl mt-1">📝</div>
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  )
}
