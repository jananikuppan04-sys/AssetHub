"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  ArrowRightLeft, 
  CalendarDays, 
  Wrench, 
  ClipboardCheck, 
  BarChart3, 
  Activity,
  Bot
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role || "Employee"

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "Asset Manager", "Department Head", "Employee"] },
    { name: "Organization", href: "/dashboard/organization", icon: Building2, roles: ["Admin"] },
    { name: "Assets", href: "/dashboard/assets", icon: Package, roles: ["Admin", "Asset Manager", "Department Head", "Employee"] },
    { name: "Allocations", href: "/dashboard/allocations", icon: ArrowRightLeft, roles: ["Admin", "Asset Manager", "Department Head"] },
    { name: "Bookings", href: "/dashboard/bookings", icon: CalendarDays, roles: ["Admin", "Asset Manager", "Department Head", "Employee"] },
    { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench, roles: ["Admin", "Asset Manager", "Department Head", "Employee"] },
    { name: "Audits", href: "/dashboard/audits", icon: ClipboardCheck, roles: ["Admin", "Asset Manager"] },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["Admin", "Asset Manager", "Department Head"] },
    { name: "Activity Logs", href: "/dashboard/logs", icon: Activity, roles: ["Admin"] },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: Bot, roles: ["Admin", "Asset Manager", "Department Head", "Employee"] },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">AssetHub</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.filter(item => item.roles.includes(role)).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 shrink-0 ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
