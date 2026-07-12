import { getAssetDetails } from "@/app/actions/assets"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, QrCode } from "lucide-react"
import AssetHealthCard from "@/components/assets/AssetHealthCard"

export default async function AssetProfilePage({ params }: { params: { id: string } }) {
  const asset = await getAssetDetails(params.id)
  
  if (!asset) notFound()

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/assets" className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{asset.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{asset.assetTag} • {asset.category.name}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
            <Edit className="h-4 w-4 mr-2" />
            Edit Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">General Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-slate-500">Status</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asset.status === 'Available' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                    {asset.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Condition</dt>
                <dd className="mt-1 text-sm text-slate-900">{asset.currentCondition}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Serial Number</dt>
                <dd className="mt-1 text-sm text-slate-900">{asset.serialNumber || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Location</dt>
                <dd className="mt-1 text-sm text-slate-900">{asset.currentLocation || asset.department?.name || 'Unassigned'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Acquisition Date</dt>
                <dd className="mt-1 text-sm text-slate-900">{new Date(asset.acquisitionDate).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Acquisition Cost</dt>
                <dd className="mt-1 text-sm text-slate-900">${asset.acquisitionCost.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Warranty</dt>
                <dd className="mt-1 text-sm text-slate-900">{asset.warranty || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Activity Logs</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {asset.activityLogs.map((log, idx) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {idx !== asset.activityLogs.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-slate-500">
                              <span className="font-medium text-slate-900">{log.user.name}</span> {log.action}
                              {log.updatedValue && <span className="font-medium text-slate-900"> to {log.updatedValue}</span>}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-slate-500">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium py-2 px-4 rounded-lg transition-colors">
                Allocate Asset
              </button>
              <button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-medium py-2 px-4 rounded-lg transition-colors">
                Request Maintenance
              </button>
            </div>
          </div>
          
          <AssetHealthCard asset={asset} />
        </div>
      </div>
    </div>
  )
}
