'use client'

import { useAssetStore } from '@/lib/store'

export default function MaintenancePage() {
  const store = useAssetStore()

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    in_progress: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-500/20 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-500/20 text-red-700 dark:text-red-400'
  }

  const typeColors = {
    routine: 'bg-blue-500',
    preventive: 'bg-green-500',
    corrective: 'bg-yellow-500',
    emergency: 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Maintenance</h1>
          <p className="text-muted-foreground mt-1">Track and manage asset maintenance requests</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
          + New Request
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-2xl font-bold text-foreground mt-2">{store.maintenance.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-500 mt-2">{store.maintenance.filter(m => m.status === 'pending').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold text-blue-500 mt-2">{store.maintenance.filter(m => m.status === 'in_progress').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-green-500 mt-2">{store.maintenance.filter(m => m.status === 'completed').length}</p>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Asset</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Scheduled</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {store.maintenance.length > 0 ? (
                store.maintenance.map((maint) => {
                  const asset = store.assets.find(a => a.id === maint.assetId)
                  return (
                    <tr key={maint.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{asset?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${typeColors[maint.type]}`}>
                          {maint.type.charAt(0).toUpperCase() + maint.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{maint.description}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[maint.status]}`}>
                          {maint.status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {maint.scheduledDate ? new Date(maint.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {maint.status === 'pending' && (
                            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">Schedule</button>
                          )}
                          {maint.status === 'in_progress' && (
                            <button className="text-green-500 hover:text-green-600 text-sm font-medium">Complete</button>
                          )}
                          <button className="text-primary hover:underline text-sm font-medium">Details</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No maintenance requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Upcoming Maintenance</h2>
        <div className="space-y-3">
          {store.assets
            .filter(a => a.nextMaintenanceDate && new Date(a.nextMaintenanceDate) > new Date())
            .sort((a, b) => new Date(a.nextMaintenanceDate!).getTime() - new Date(b.nextMaintenanceDate!).getTime())
            .slice(0, 5)
            .map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">Next maintenance: {new Date(asset.nextMaintenanceDate!).toLocaleDateString()}</p>
                </div>
                <button className="text-primary hover:underline text-sm font-medium">Schedule</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
