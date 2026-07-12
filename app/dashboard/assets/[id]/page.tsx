'use client'

import { useAssetStore } from '@/lib/store'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

export default function AssetDetailPage() {
  const params = useParams()
  const store = useAssetStore()
  const assetId = params.id as string

  const asset = useMemo(() => {
    return store.assets.find(a => a.id === assetId)
  }, [store.assets, assetId])

  const allocations = useMemo(() => {
    return store.allocations.filter(a => a.assetId === assetId)
  }, [store.allocations, assetId])

  const maintenanceRecords = useMemo(() => {
    return store.maintenance.filter(m => m.assetId === assetId)
  }, [store.maintenance, assetId])

  const bookings = useMemo(() => {
    return store.bookings.filter(b => b.assetId === assetId)
  }, [store.bookings, assetId])

  if (!asset) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Asset not found</p>
      </div>
    )
  }

  const owner = store.users.find(u => u.id === asset.owner)
  const conditionColors = { excellent: 'text-green-500', good: 'text-blue-500', fair: 'text-yellow-500', poor: 'text-red-500' }
  const statusColors = { active: 'bg-green-500/20 text-green-700 dark:text-green-400', maintenance: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400', retired: 'bg-gray-500/20 text-gray-700 dark:text-gray-400', damaged: 'bg-red-500/20 text-red-700 dark:text-red-400', lost: 'bg-orange-500/20 text-orange-700 dark:text-orange-400' }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{asset.name}</h1>
          <p className="text-muted-foreground mt-1">{asset.assetId} • {asset.category}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
            Edit
          </button>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-medium transition-colors border border-primary/20">
            More Actions
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Status</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[asset.status]}`}>
              {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Condition</p>
          <p className={`text-2xl font-bold mt-3 ${conditionColors[asset.condition]}`}>
            {asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Health Score</p>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">{asset.healthScore}%</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className={`${asset.healthScore >= 80 ? 'bg-green-500' : asset.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'} h-2 rounded-full`}
                style={{ width: `${asset.healthScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Asset Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Asset Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Asset ID</p>
              <p className="text-sm font-mono text-primary mt-1">{asset.assetId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="text-sm text-foreground mt-1">{asset.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="text-sm text-foreground mt-1">{asset.serialNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="text-sm text-foreground mt-1">{asset.department}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Owner</p>
              <p className="text-sm text-foreground mt-1">{owner?.name || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-sm text-foreground mt-1">{asset.location}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Financial Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Purchase Date</p>
              <p className="text-sm text-foreground mt-1">{new Date(asset.purchaseDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Purchase Price</p>
              <p className="text-sm font-bold text-foreground mt-1">${asset.purchasePrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warranty Expiry</p>
              <p className="text-sm text-foreground mt-1">
                {asset.warrantyExpiry 
                  ? new Date(asset.warrantyExpiry).toLocaleDateString()
                  : 'No warranty'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Maintenance</p>
              <p className="text-sm text-foreground mt-1">
                {asset.lastMaintenance 
                  ? new Date(asset.lastMaintenance).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Maintenance Due</p>
              <p className="text-sm text-foreground mt-1">
                {asset.nextMaintenanceDate 
                  ? new Date(asset.nextMaintenanceDate).toLocaleDateString()
                  : 'Not scheduled'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Description */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Description</h2>
        <p className="text-sm text-muted-foreground">{asset.description}</p>
      </div>

      {/* QR Code & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">QR Code</h2>
          <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
            <div className="text-6xl">🔗</div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">{asset.qrCode}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Tags</h2>
          <div className="flex gap-2 flex-wrap">
            {asset.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Allocations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Allocation History</h2>
        {allocations.length > 0 ? (
          <div className="space-y-3">
            {allocations.map((alloc) => {
              const employee = store.users.find(u => u.id === alloc.employeeId)
              return (
                <div key={alloc.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{employee?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alloc.startDate).toLocaleDateString()} {alloc.endDate ? `- ${new Date(alloc.endDate).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alloc.status === 'assigned' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                      alloc.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                      'bg-gray-500/20 text-gray-700 dark:text-gray-400'
                    }`}>
                      {alloc.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No allocations</p>
        )}
      </div>

      {/* Maintenance Records */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Maintenance Records</h2>
        {maintenanceRecords.length > 0 ? (
          <div className="space-y-3">
            {maintenanceRecords.map((maint) => (
              <div key={maint.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{maint.type} Maintenance</p>
                    <p className="text-xs text-muted-foreground">{maint.description}</p>
                  </div>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                    {maint.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No maintenance records</p>
        )}
      </div>
    </div>
  )
}
