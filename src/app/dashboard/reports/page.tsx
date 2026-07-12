import { BarChart3 } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Generate insights and export data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Asset Utilization', 'Department Allocation', 'Maintenance Trends', 'Retirement Forecast', 'Idle Assets', 'Audit Discrepancies'].map(report => (
          <div key={report} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">{report}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Export detailed CSV and PDF reports for {report.toLowerCase()}.</p>
            <div className="flex space-x-2">
              <button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">CSV</button>
              <button className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200">PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
