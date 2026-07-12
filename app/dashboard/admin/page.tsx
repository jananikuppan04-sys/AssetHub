'use client'

import { useAssetStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const store = useAssetStore()
  const router = useRouter()

  useEffect(() => {
    if (store.currentUser?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [store.currentUser, router])

  if (store.currentUser?.role !== 'admin') {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Administration</h1>
        <p className="text-muted-foreground mt-1">Manage system configuration and user access</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold text-foreground mt-2">{store.users.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Assets</p>
          <p className="text-2xl font-bold text-foreground mt-2">{store.assets.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Departments</p>
          <p className="text-2xl font-bold text-foreground mt-2">{store.departments.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-2xl font-bold text-foreground mt-2">{store.categories.length}</p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {store.users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                      {user.role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-primary hover:underline text-sm font-medium">Edit</button>
                      <button className="text-red-500 hover:text-red-600 text-sm font-medium">Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Department Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input type="text" placeholder="Department Name" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
          <input type="text" placeholder="Department Head" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
        </div>
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors mb-6">
          + Add Department
        </button>
        <div className="space-y-2">
          {store.departments.map((dept) => (
            <div key={dept.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium text-foreground">{dept.name}</p>
                <p className="text-sm text-muted-foreground">Head: {dept.head}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-primary hover:underline text-sm">Edit</button>
                <button className="text-red-500 hover:text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Category Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input type="text" placeholder="Category Name" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
          <input type="text" placeholder="Icon" className="bg-input border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
            + Add Category
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {store.categories.map((cat) => (
            <div key={cat.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">{cat.icon}</div>
              <p className="font-medium text-foreground text-sm">{cat.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{cat.assetCount} assets</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Recent System Activity</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {store.activities.slice(0, 10).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-lg">📝</div>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">System Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">System Name</label>
            <input type="text" value="AssetSphere ERP" className="w-full bg-input border border-border rounded px-3 py-2 text-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Default Asset Status</label>
            <select className="w-full bg-input border border-border rounded px-3 py-2 text-foreground">
              <option>Active</option>
              <option>Maintenance</option>
              <option>Retired</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-foreground">Require approval for all allocations</span>
            </label>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
