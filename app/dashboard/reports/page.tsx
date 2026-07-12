'use client'

import { useAssetStore } from '@/lib/store'
import { useMemo } from 'react'

export default function ReportsPage() {
  const store = useAssetStore()

  const reportData = useMemo(() => {
    const totalAssets = store.assets.length
    const activeAssets = store.assets.filter(a => a.status === 'active').length
    const totalValue = store.assets.reduce((sum, a) => sum + a.purchasePrice, 0)
    const avgAge = store.assets.length > 0 
      ? Math.round(store.assets.reduce((sum, a) => sum + (new Date().getTime() - new Date(a.purchaseDate).getTime()), 0) / store.assets.length / (1000 * 60 * 60 * 24 * 365))
      : 0

    return { totalAssets, activeAssets, totalValue, avgAge }
  }, [store.assets])

  const reports = [
    {
      id: 'asset-inventory',
      name: 'Asset Inventory Report',
      description: 'Complete inventory with status, condition, and location',
      icon: '📦',
      metrics: [`${reportData.totalAssets} Total Assets`, `${reportData.activeAssets} Active`]
    },
    {
      id: 'asset-utilization',
      name: 'Asset Utilization',
      description: 'Track asset usage patterns and allocation rates',
      icon: '📊',
      metrics: [`${store.allocations.length} Allocations`, `${store.bookings.length} Bookings`]
    },
    {
      id: 'maintenance-analytics',
      name: 'Maintenance Analytics',
      description: 'Maintenance history, costs, and scheduling',
      icon: '🔧',
      metrics: [`${store.maintenance.length} Total`, `${store.maintenance.filter(m => m.status === 'completed').length} Completed`]
    },
    {
      id: 'asset-value',
      name: 'Asset Value Report',
      description: 'Asset purchase value and depreciation analysis',
      icon: '💰',
      metrics: [`$${(reportData.totalValue / 1000).toFixed(1)}k Total Value`, `${reportData.avgAge} yrs Avg Age`]
    },
    {
      id: 'warranty-expiry',
      name: 'Warranty Expiry Report',
      description: 'Assets with expiring or expired warranties',
      icon: '⚠️',
      metrics: [`${store.assets.filter(a => a.warrantyExpiry && new Date(a.warrantyExpiry) < new Date()).length} Expired`, `${store.assets.filter(a => a.warrantyExpiry && new Date(a.warrantyExpiry) > new Date() && new Date(a.warrantyExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length} Expiring Soon`]
    },
    {
      id: 'department-assets',
      name: 'Department Assets Report',
      description: 'Asset distribution and allocation by department',
      icon: '🏢',
      metrics: [`${store.departments.length} Departments`, `${store.assets.length} Total Assets`]
    },
    {
      id: 'asset-conditions',
      name: 'Asset Condition Report',
      description: 'Health scores and condition distribution analysis',
      icon: '❤️',
      metrics: [`${Math.round(store.assets.reduce((sum, a) => sum + a.healthScore, 0) / Math.max(store.assets.length, 1))}% Avg Health`, `${store.assets.filter(a => a.condition === 'excellent').length} Excellent`]
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Audit findings and compliance status tracking',
      icon: '✓',
      metrics: [`${store.assets.length} Verified`, `0 Issues`]
    },
    {
      id: 'transfer-history',
      name: 'Transfer History Report',
      description: 'Asset transfers and inter-department movements',
      icon: '🔄',
      metrics: [`${store.transfers.length} Total Transfers`, `${store.transfers.filter(t => t.status === 'completed').length} Completed`]
    },
    {
      id: 'employee-allocations',
      name: 'Employee Allocations Report',
      description: 'Assets assigned to individual employees',
      icon: '👤',
      metrics: [`${store.allocations.filter(a => a.status === 'assigned').length} Active`, `${store.allocations.length} Total`]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and view comprehensive asset management reports</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Total Assets</p>
          <p className="text-3xl font-bold text-foreground mt-3">{reportData.totalAssets}</p>
          <p className="text-xs text-green-500 mt-2">✓ {reportData.activeAssets} active</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Total Asset Value</p>
          <p className="text-3xl font-bold text-foreground mt-3">${(reportData.totalValue / 1000).toFixed(1)}k</p>
          <p className="text-xs text-muted-foreground mt-2">Across all assets</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Average Health</p>
          <p className="text-3xl font-bold text-foreground mt-3">{Math.round(store.assets.reduce((sum, a) => sum + a.healthScore, 0) / Math.max(store.assets.length, 1))}%</p>
          <p className="text-xs text-green-500 mt-2">Fleet average</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Avg Asset Age</p>
          <p className="text-3xl font-bold text-foreground mt-3">{reportData.avgAge} yrs</p>
          <p className="text-xs text-muted-foreground mt-2">From purchase date</p>
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <button
              key={report.id}
              className="bg-card border border-border hover:border-primary/50 rounded-lg p-6 text-left transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{report.icon}</div>
                <span className="text-primary/60 group-hover:text-primary transition-colors">→</span>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">{report.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <div className="flex gap-2 flex-wrap">
                {report.metrics.map((metric, idx) => (
                  <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {metric}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Export */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Export Data</h2>
        <div className="flex gap-3 flex-wrap">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
            Export as PDF
          </button>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-medium transition-colors border border-primary/20">
            Export as CSV
          </button>
          <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-medium transition-colors border border-primary/20">
            Export as Excel
          </button>
        </div>
      </div>
    </div>
  )
}
