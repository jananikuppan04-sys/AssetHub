import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllocations, getTransfers } from "@/app/actions/allocations"
import Link from "next/link"
import { Plus, ArrowRightLeft, AlertCircle, Package } from "lucide-react"
import { format, differenceInDays } from "date-fns"

export default async function AllocationsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const allocations = await getAllocations()
  const transfers = await getTransfers()

  const activeAllocations = allocations.filter(a => a.status === "Active")
  const overdueAllocations = activeAllocations.filter(a => a.expectedReturnDate && new Date() > new Date(a.expectedReturnDate))
  const pendingTransfers = transfers.filter(t => t.status === "Requested")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Allocations & Transfers</h1>
          <p className="mt-1 text-sm text-slate-500">Manage asset assignments, transfers, and track returns.</p>
        </div>
        <Link href="/dashboard/allocations/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Allocate Asset
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Active</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{activeAllocations.length}</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Transfers</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{pendingTransfers.length}</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <ArrowRightLeft className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Overdue Returns</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{overdueAllocations.length}</p>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Pending Transfers Section */}
      {pendingTransfers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-amber-50">
            <h2 className="text-lg font-semibold text-amber-900 flex items-center">
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Pending Transfer Requests
            </h2>
            <Link href="/dashboard/allocations/transfers" className="text-sm text-amber-700 hover:text-amber-900 font-medium">
              Review All &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Active Allocations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Active Allocations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Allocation Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Expected Return</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {allocations.map((allocation) => {
                const isOverdue = allocation.expectedReturnDate && new Date() > new Date(allocation.expectedReturnDate) && allocation.status === "Active";
                const overdueDays = isOverdue ? differenceInDays(new Date(), new Date(allocation.expectedReturnDate!)) : 0;
                
                return (
                <tr key={allocation.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{allocation.asset.name}</div>
                    <div className="text-sm text-slate-500">{allocation.asset.assetTag}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {allocation.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {allocation.department?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {format(new Date(allocation.requestDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {allocation.expectedReturnDate ? format(new Date(allocation.expectedReturnDate), 'MMM d, yyyy') : "Indefinite"}
                    {isOverdue && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {overdueDays} days overdue
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${allocation.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        allocation.status === 'Return Requested' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-slate-100 text-slate-800'}`}>
                      {allocation.status}
                    </span>
                  </td>
                </tr>
              )})}
              {allocations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No allocations found.
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
