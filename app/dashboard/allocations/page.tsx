'use client'

import { useAssetStore } from '@/lib/store'
import { useState, useMemo } from 'react'

export default function AllocationsPage() {
  const store = useAssetStore()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredAllocations = useMemo(() => {
    return store.allocations.filter(alloc => {
      if (filterStatus === 'all') return true
      return alloc.status === filterStatus
    })
  }, [store.allocations, filterStatus])

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    approved: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    assigned: 'bg-green-500/20 text-green-700 dark:text-green-400',
    returned: 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Allocations</h1>
          <p className="text-muted-foreground mt-1">Manage employee asset assignments and requests</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
          + New Request
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Allocations</p>
          <p className="text-2xl font-bold text-foreground mt-2">{store.allocations.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-500 mt-2">{store.allocations.filter(a => a.status === 'pending').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active Assignments</p>
          <p className="text-2xl font-bold text-green-500 mt-2">{store.allocations.filter(a => a.status === 'assigned').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Returned</p>
          <p className="text-2xl font-bold text-gray-500 mt-2">{store.allocations.filter(a => a.status === 'returned').length}</p>
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
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="assigned">Active Assignment</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Allocations Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Asset</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Employee</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Requested</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Start Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((alloc) => {
                  const asset = store.assets.find(a => a.id === alloc.assetId)
                  const employee = store.users.find(u => u.id === alloc.employeeId)
                  const requester = store.users.find(u => u.id === alloc.requestedBy)
                  return (
                    <tr key={alloc.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{asset?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{employee?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{requester?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(alloc.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[alloc.status]}`}>
                          {alloc.status.charAt(0).toUpperCase() + alloc.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {alloc.status === 'pending' && (
                            <>
                              <button className="text-green-500 hover:text-green-600 text-sm font-medium">Approve</button>
                              <button className="text-red-500 hover:text-red-600 text-sm font-medium">Reject</button>
                            </>
                          )}
                          {alloc.status === 'assigned' && (
                            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">Process Return</button>
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
                    No allocations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
