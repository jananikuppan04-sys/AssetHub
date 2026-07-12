'use client'

import { useAssetStore } from '@/lib/store'
import { useState, useMemo } from 'react'
import { AssetCondition, AssetStatus } from '@/lib/types'
import Link from 'next/link'

export default function AssetsPage() {
  const store = useAssetStore()
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all')
  const [filterCondition, setFilterCondition] = useState<AssetCondition | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)

  const filteredAssets = useMemo(() => {
    return store.assets.filter(asset => {
      const matchStatus = filterStatus === 'all' || asset.status === filterStatus
      const matchCondition = filterCondition === 'all' || asset.condition === filterCondition
      const matchSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.assetId.toLowerCase().includes(searchQuery.toLowerCase())
      return matchStatus && matchCondition && matchSearch
    })
  }, [store.assets, filterStatus, filterCondition, searchQuery])

  const statusColors = {
    active: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/20',
    maintenance: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    retired: 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/20',
    damaged: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/20',
    lost: 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/20'
  }

  const conditionColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    fair: 'bg-yellow-500',
    poor: 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Directory</h1>
          <p className="text-muted-foreground mt-1">Manage and track all organizational assets</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Asset
        </button>
      </div>

      {/* New Asset Form */}
      {showNewForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Register New Asset</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Asset Name" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
            <input type="text" placeholder="Category" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
            <input type="text" placeholder="Serial Number" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
            <input type="number" placeholder="Purchase Price" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
            <input type="date" placeholder="Purchase Date" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
            <select className="bg-input border border-border rounded px-3 py-2 text-foreground">
              <option>Select Department</option>
              {store.departments.map(d => (
                <option key={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
              Register Asset
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-input border border-border rounded px-3 py-2 text-foreground"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
            <option value="damaged">Damaged</option>
            <option value="lost">Lost</option>
          </select>
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value as any)}
            className="bg-input border border-border rounded px-3 py-2 text-foreground"
          >
            <option value="all">All Conditions</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded px-3 py-2 font-medium transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Health</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-primary">{asset.assetId}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{asset.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{asset.category}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{asset.department}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[asset.status]}`}>
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className={`${conditionColors[asset.condition]} h-2 rounded-full`}
                            style={{ width: `${asset.healthScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">{asset.healthScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/assets/${asset.id}`} className="text-primary hover:underline text-sm font-medium">
                          View
                        </Link>
                        <button className="text-primary/60 hover:text-primary text-sm">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No assets found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{filteredAssets.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Assets Found</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{filteredAssets.filter(a => a.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground mt-1">Active</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{filteredAssets.filter(a => a.status === 'maintenance').length}</p>
          <p className="text-sm text-muted-foreground mt-1">Maintenance</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary">{Math.round(filteredAssets.reduce((sum, a) => sum + a.healthScore, 0) / Math.max(filteredAssets.length, 1))}</p>
          <p className="text-sm text-muted-foreground mt-1">Avg Health %</p>
        </div>
      </div>
    </div>
  )
}
