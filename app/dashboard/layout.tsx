'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAssetStore } from '@/lib/store'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const store = useAssetStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/assets', label: 'Assets', icon: '📦' },
    { href: '/dashboard/allocations', label: 'Allocations', icon: '👤' },
    { href: '/dashboard/transfers', label: 'Transfers', icon: '🔄' },
    { href: '/dashboard/maintenance', label: 'Maintenance', icon: '🔧' },
    { href: '/dashboard/bookings', label: 'Bookings', icon: '📅' },
    { href: '/dashboard/audit', label: 'Audits', icon: '✓' },
    { href: '/dashboard/reports', label: 'Reports', icon: '📈' },
    ...(store.currentUser.role === 'admin' ? [
      { href: '/dashboard/admin', label: 'Admin', icon: '⚙️' }
    ] : [])
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sidebar-foreground">AssetSphere</h1>
          <p className="text-xs text-sidebar-accent-foreground mt-1">ERP System</p>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 mx-6 bg-sidebar-accent rounded-lg mb-6">
          <p className="text-sm font-semibold text-sidebar-accent-foreground">{store.currentUser.name}</p>
          <p className="text-xs text-sidebar-accent-foreground/70 mt-1">{store.currentUser.role}</p>
          <p className="text-xs text-sidebar-accent-foreground/60 mt-2">{store.currentUser.department}</p>
        </div>

        {/* Menu */}
        <nav className="px-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground text-sm"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-sidebar-border">
          <button
            onClick={() => {
              store.logout()
              router.push('/')
            }}
            className="w-full py-2 text-sm font-medium text-sidebar-accent-foreground hover:text-sidebar-primary transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
