'use client'

import { useAssetStore } from '@/lib/store'
import { useState } from 'react'

export default function AuditPage() {
  const store = useAssetStore()
  const [showNewAudit, setShowNewAudit] = useState(false)

  // Calculate discrepancies
  const allDiscrepancies = store.assets
    .filter(a => a.status === 'damaged' || a.status === 'lost')
    .map((asset) => ({
      assetId: asset.id,
      assetName: asset.name,
      type: asset.status === 'lost' ? 'missing' : 'damaged',
      status: 'pending' as const,
      description: asset.status === 'lost' ? 'Asset reported as lost' : 'Asset condition degraded',
      createdAt: asset.updatedAt
    }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Management</h1>
          <p className="text-muted-foreground mt-1">Verify asset inventory and track discrepancies</p>
        </div>
        <button
          onClick={() => setShowNewAudit(!showNewAudit)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Start Audit
        </button>
      </div>

      {/* New Audit Form */}
      {showNewAudit && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Start New Audit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="bg-input border border-border rounded px-3 py-2 text-foreground">
              <option>Full Inventory Audit</option>
              <option>Department Audit</option>
              <option>Category Audit</option>
            </select>
            <select className="bg-input border border-border rounded px-3 py-2 text-foreground">
              <option>Select Department...</option>
              {store.departments.map(d => (
                <option key={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              Start Audit
            </button>
            <button
              onClick={() => setShowNewAudit(false)}
              className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Audit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Discrepancies</p>
          <p className="text-2xl font-bold text-foreground mt-2">{allDiscrepancies.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending Resolution</p>
          <p className="text-2xl font-bold text-yellow-500 mt-2">{allDiscrepancies.filter(d => d.status === 'pending').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Verified Assets</p>
          <p className="text-2xl font-bold text-green-500 mt-2">{store.assets.length - allDiscrepancies.length}</p>
        </div>
      </div>

      {/* Discrepancies */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Identified Discrepancies</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Asset</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allDiscrepancies.length > 0 ? (
                allDiscrepancies.map((disc, idx) => (
                  <tr key={idx} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{disc.assetName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium text-white ${disc.type === 'missing' ? 'bg-red-500' : 'bg-orange-500'}`}>
                        {disc.type.charAt(0).toUpperCase() + disc.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{disc.description}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-green-500 hover:text-green-600 text-sm font-medium">Verify</button>
                        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">Investigate</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No discrepancies found. All assets verified.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Procedures */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Audit Procedures</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <p className="font-medium text-foreground">Physical Count</p>
              <p className="text-sm text-muted-foreground">Physically locate and count assets in the designated area</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <p className="font-medium text-foreground">Record Findings</p>
              <p className="text-sm text-muted-foreground">Mark each asset as verified, missing, or damaged</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <p className="font-medium text-foreground">Identify Discrepancies</p>
              <p className="text-sm text-muted-foreground">Compare findings with system records to identify differences</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
            <div>
              <p className="font-medium text-foreground">Resolution</p>
              <p className="text-sm text-muted-foreground">Investigate and resolve discrepancies with detailed notes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
