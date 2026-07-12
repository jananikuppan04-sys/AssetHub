import { calculateAssetHealthScore, getPredictiveMaintenanceRisk } from "@/lib/ai"

export default function AssetHealthCard({ asset }: { asset: any }) {
  const healthScore = calculateAssetHealthScore(asset)
  const risk = getPredictiveMaintenanceRisk(asset)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
        Asset Health & Prediction
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">AI Insights</span>
      </h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-slate-500">Health Score</span>
            <span className={`text-2xl font-bold ${healthScore > 75 ? 'text-emerald-600' : healthScore > 40 ? 'text-amber-600' : 'text-red-600'}`}>
              {healthScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${healthScore > 75 ? 'bg-emerald-500' : healthScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm font-medium text-slate-500 mb-2">Predictive Maintenance Risk</p>
          <div className={`p-3 rounded-lg border ${
            risk === 'Low' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
            risk === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="font-semibold mb-1">{risk} Risk</div>
            <p className="text-xs">
              {risk === 'Low' ? 'Asset is operating normally. Routine checks only.' :
               risk === 'Medium' ? 'Asset condition is degrading. Consider scheduling preventative maintenance.' :
               'Asset is highly likely to fail soon. Immediate maintenance recommended.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
