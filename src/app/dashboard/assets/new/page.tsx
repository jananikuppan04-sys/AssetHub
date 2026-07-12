import { getCategories, getDepartments } from "@/app/actions/organization"
import { createAsset } from "@/app/actions/assets"
import Link from "next/link"

export default async function NewAssetPage() {
  const [categories, departments] = await Promise.all([
    getCategories(),
    getDepartments()
  ])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Register New Asset</h1>
          <p className="mt-1 text-sm text-slate-500">Fill in the details to add an asset to the inventory.</p>
        </div>
        <Link href="/dashboard/assets" className="text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form action={createAsset} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name *</label>
              <input name="name" type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select name="categoryId" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
              <input name="serialNumber" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Date *</label>
              <input name="acquisitionDate" type="date" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Cost ($) *</label>
              <input name="acquisitionCost" type="number" step="0.01" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warranty Details</label>
              <input name="warranty" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. 2 Years Manufacturer" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Condition *</label>
              <select name="currentCondition" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white">
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Department</label>
              <select name="departmentId" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 bg-white">
                <option value="">Unassigned</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Location</label>
              <input name="currentLocation" type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. Server Room A" />
            </div>

            <div className="flex items-center space-x-3 mt-8">
              <input name="bookable" type="checkbox" id="bookable" className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
              <label htmlFor="bookable" className="text-sm font-medium text-slate-700">Allow Resource Booking</label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
