import { prisma } from "@/lib/prisma"

export default async function ActivityLogsPage() {
  const logs = await prisma.activityLog.findMany({
    include: { user: true, asset: true },
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activity Logs</h1>
        <p className="mt-1 text-sm text-slate-500">System-wide audit trail of all actions.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{log.user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{log.asset?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {log.previousValue && `${log.previousValue} → `}{log.updatedValue || ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
