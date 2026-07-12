'use client'

import { useAssetStore } from '@/lib/store'
import { useState, useMemo } from 'react'

export default function TransfersPage() {
  const store = useAssetStore()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredTransfers = useMemo(() => {
    return store.transfers.filter(transfer => {
      if (filterStatus === 'all') return true
      return transfer.status === filterStatus
    })
  }, [store.transfers, filterStatus])

  const statusColors = {
    pending_approval: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    approved: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    completed: 'bg-green-500/20 text-green-700 dark:text-green-400',
    rejected: 'bg-red-500/20 text-red-700 dark:text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Transfers</h1>
          <p className="text-muted-foreground mt-1">Manage inter-department asset transfers</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
          + Request Transfer
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Transfers</p>
          <p className="text-2xl font-bold text-foreground mt-2">{store.transfers.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-500 mt-2">{store.transfers.filter(t => t.status === 'pending_approval').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-green-500 mt-2">{store.transfers.filter(t => t.status === 'completed').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-500 mt-2">{store.transfers.filter(t => t.status === 'rejected').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-input border border-border rounded px-3 py-2 text-foreground"
        >
          <option value="all">All Status</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Transfers Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Asset</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">From Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">To Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Initiated</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransfers.length > 0 ? (
                filteredTransfers.map((transfer) => {
                  const asset = store.assets.find(a => a.id === transfer.assetId)
                  const initiator = store.users.find(u => u.id === transfer.initiatedBy)
                  return (
                    <tr key={transfer.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{asset?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{transfer.fromDepartment}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{transfer.toDepartment}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(transfer.initiatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[transfer.status]}`}>
                          {transfer.status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {transfer.status === 'pending_approval' && (
                            <>
                              <button className="text-green-500 hover:text-green-600 text-sm font-medium">Approve</button>
                              <button className="text-red-500 hover:text-red-600 text-sm font-medium">Reject</button>
                            </>
                          )}
                          {transfer.status === 'approved' && (
                            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">Complete</button>
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
                    No transfers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Workflow Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Transfer Workflow</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <p className="font-medium text-foreground">Initiate Request</p>
              <p className="text-sm text-muted-foreground">Employee or asset manager initiates a transfer request</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <p className="font-medium text-foreground">Department Head Approval</p>
              <p className="text-sm text-muted-foreground">Department head from source department approves</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <p className="font-medium text-foreground">Asset Manager Approval</p>
              <p className="text-sm text-muted-foreground">Asset manager verifies and approves transfer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-green-foreground flex items-center justify-center text-sm font-bold">✓</div>
            <div>
              <p className="font-medium text-foreground">Transfer Complete</p>
              <p className="text-sm text-muted-foreground">Asset location and ownership updated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
