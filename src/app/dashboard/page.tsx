import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { 
  Package, 
  ArrowRightLeft, 
  Wrench, 
  AlertTriangle,
  CalendarDays
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Fetch KPI data
  const [
    totalAssets,
    allocatedAssets,
    maintenanceAssets,
    lostAssets,
    activeBookings,
    pendingMaintenance
  ] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "Allocated" } }),
    prisma.asset.count({ where: { status: "Under Maintenance" } }),
    prisma.asset.count({ where: { status: "Lost" } }),
    prisma.resourceBooking.count({ where: { status: "Ongoing" } }),
    prisma.maintenanceRequest.count({ where: { status: "Pending" } })
  ])

  const kpis = [
    { title: "Total Assets", value: totalAssets, icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Allocated", value: allocatedAssets, icon: ArrowRightLeft, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Under Maintenance", value: maintenanceAssets, icon: Wrench, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Lost Assets", value: lostAssets, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
    { title: "Active Bookings", value: activeBookings, icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Pending Fixes", value: pendingMaintenance, icon: Wrench, color: "text-orange-600", bg: "bg-orange-100" },
  ]

  const recentActivity = await prisma.activityLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, asset: true }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {session.user?.name}. Here's the current state of your assets.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500 truncate">{kpi.title}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-lg shrink-0 ${kpi.bg}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Asset Distribution</h2>
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
             <p className="text-slate-500 text-sm">Interactive Charts would be rendered here using Recharts.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard/assets/new" className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Register Asset
              </Link>
              <Link href="/dashboard/bookings" className="block text-center w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium py-2 px-4 rounded-lg transition-colors">
                Book Resource
              </Link>
              <Link href="/dashboard/maintenance" className="block text-center w-full bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-medium py-2 px-4 rounded-lg transition-colors">
                Raise Maintenance Request
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((log, idx) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {idx !== recentActivity.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center ring-8 ring-white">
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-slate-500">
                              <span className="font-medium text-slate-900">{log.user.name}</span> {log.action} {log.asset?.name || ''}
                            </p>
                          </div>
                          <div className="text-right text-xs whitespace-nowrap text-slate-500">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                {recentActivity.length === 0 && (
                  <p className="text-sm text-slate-500 text-center pb-8">No recent activity.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
