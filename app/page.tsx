'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAssetStore } from '@/lib/store'

const DEMO_USERS = [
  {
    id: 'user_admin',
    email: 'admin@assetsphere.com',
    name: 'Sarah Chen',
    role: 'Administrator',
    description: 'Full system access, user management'
  },
  {
    id: 'user_manager',
    email: 'manager@assetsphere.com',
    name: 'James Wilson',
    role: 'Asset Manager',
    description: 'Asset oversight, allocations, transfers'
  },
  {
    id: 'user_head',
    email: 'head@assetsphere.com',
    name: 'Michelle Rodriguez',
    role: 'Department Head',
    description: 'Department asset allocation approval'
  },
  {
    id: 'user_emp',
    email: 'emp@assetsphere.com',
    name: 'David Kumar',
    role: 'Employee',
    description: 'Asset requests and bookings'
  }
]

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const store = useAssetStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = (userId: string) => {
    store.login(userId)
    router.push('/dashboard')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">AssetSphere ERP</h1>
          <p className="text-lg text-muted-foreground">Enterprise Asset Management & Lifecycle Tracking</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Demo Login Cards */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Demo Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user.id)}
                className="group relative bg-card hover:bg-card/80 border border-border hover:border-primary/50 rounded-lg p-6 transition-all duration-300 text-left"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
                    <p className="text-sm text-primary font-medium">{user.role}</p>
                  </div>
                  <div className="text-2xl">→</div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{user.description}</p>
                <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-3">{user.email}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-card border border-border rounded-lg p-8 mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="text-2xl">📦</div>
              <h3 className="font-semibold text-foreground">Asset Management</h3>
              <p className="text-sm text-muted-foreground">Register, track, and manage your organization&apos;s assets with real-time status updates and lifecycle tracking.</p>
            </div>
            <div className="space-y-3">
              <div className="text-2xl">🔄</div>
              <h3 className="font-semibold text-foreground">Workflows</h3>
              <p className="text-sm text-muted-foreground">Streamline allocations, transfers, maintenance requests, and bookings with approval workflows.</p>
            </div>
            <div className="space-y-3">
              <div className="text-2xl">📊</div>
              <h3 className="font-semibold text-foreground">Analytics</h3>
              <p className="text-sm text-muted-foreground">Gain insights with dashboards, reports, and metrics across departments and asset categories.</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Demo System • All data is stored locally • No external connectivity required</p>
        </div>
      </div>
    </div>
  )
}
