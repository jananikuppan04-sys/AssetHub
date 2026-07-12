import { prisma } from "@/lib/prisma"

export default async function AllocationsPage() {
  const allocations = await prisma.assetAllocation.findMany({
    include: { asset: true, user: true, department: true },
    orderBy: { requestDate: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Asset Allocations</h1>
        <p className="mt-1 text-sm text-slate-500">Manage asset requests and transfers.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee / Dept</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Request Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {allocations.map((alloc) => (
              <tr key={alloc.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{alloc.asset.name} ({alloc.asset.assetTag})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{alloc.user?.name || alloc.department?.name || 'Unknown'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(alloc.requestDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${alloc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {alloc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
