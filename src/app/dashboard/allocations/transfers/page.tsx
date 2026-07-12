import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTransfers } from "@/app/actions/allocations"
import Link from "next/link"
import { ArrowLeft, ArrowRightLeft } from "lucide-react"
import { format } from "date-fns"
import TransferApprovalButtons from "@/components/allocations/TransferApprovalButtons"

export default async function TransfersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const transfers = await getTransfers()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/allocations" className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Allocations
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <ArrowRightLeft className="h-6 w-6 mr-2 text-amber-600" />
          Transfer Requests
        </h1>
        <p className="mt-1 text-sm text-slate-500">Review and approve asset transfer requests.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">From User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">To User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{transfer.asset.name}</div>
                    <div className="text-sm text-slate-500">{transfer.asset.assetTag}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {transfer.fromUser.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {transfer.toUser.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 font-medium">{transfer.reason}</div>
                    {transfer.comments && <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{transfer.comments}</div>}
                    <div className="text-xs text-slate-400 mt-1">Requested: {format(new Date(transfer.requestDate), 'MMM d, yyyy')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${transfer.status === 'Requested' ? 'bg-amber-100 text-amber-800' : 
                        transfer.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {transfer.status === 'Requested' ? (
                      <TransferApprovalButtons transferId={transfer.id} />
                    ) : (
                      <span className="text-slate-500 italic text-xs">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
              {transfers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No transfer requests found.
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
