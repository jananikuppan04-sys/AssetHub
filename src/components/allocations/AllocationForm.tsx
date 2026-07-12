"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { allocateAsset, requestTransfer } from "@/app/actions/allocations"
import toast from "react-hot-toast"
import { Building2, User, Calendar, FileText, ArrowRightLeft } from "lucide-react"

type Asset = {
  id: string
  name: string
  assetTag: string
  status: string
  allocations: { userId: string | null, user: { name: string } | null, expectedReturnDate: Date | null, requestDate: Date, status: string }[]
}

type UserType = {
  id: string
  name: string
}

type Department = {
  id: string
  name: string
}

export default function AllocationForm({
  assets,
  users,
  departments
}: {
  assets: Asset[]
  users: UserType[]
  departments: Department[]
}) {
  const router = useRouter()
  const [selectedAssetId, setSelectedAssetId] = useState("")
  const [assigneeType, setAssigneeType] = useState<"user" | "department">("user")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedAsset = assets.find(a => a.id === selectedAssetId)
  const isAllocated = selectedAsset?.status !== "Available"
  const activeAllocation = selectedAsset?.allocations.find(a => a.status === "Active")

  async function handleAllocate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      await allocateAsset(formData)
      toast.success("Asset successfully allocated")
      router.push("/dashboard/allocations")
    } catch (error: any) {
      toast.error(error.message || "Failed to allocate asset")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleTransferRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      await requestTransfer(formData)
      toast.success("Transfer request submitted for approval")
      router.push("/dashboard/allocations")
    } catch (error: any) {
      toast.error(error.message || "Failed to request transfer")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Select Asset</h2>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
          <select 
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            <option value="">-- Select an Asset --</option>
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.assetTag} - {asset.name} ({asset.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedAsset && isAllocated && activeAllocation && (
        <div className="p-6 bg-amber-50 border-b border-slate-200">
          <div className="flex items-start">
            <ArrowRightLeft className="h-6 w-6 text-amber-600 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-amber-900">Asset Already Allocated</h3>
              <p className="mt-1 text-sm text-amber-700">
                {selectedAsset.name} is currently allocated to <strong>{activeAllocation.user?.name || "a department"}</strong>.
              </p>
              <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                <li>Allocated On: {new Date(activeAllocation.requestDate).toLocaleDateString()}</li>
                <li>Expected Return: {activeAllocation.expectedReturnDate ? new Date(activeAllocation.expectedReturnDate).toLocaleDateString() : "Indefinite"}</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleTransferRequest} className="mt-6 border-t border-amber-200 pt-6">
            <input type="hidden" name="assetId" value={selectedAsset.id} />
            <h4 className="text-md font-medium text-amber-900 mb-4">Request a Transfer Instead</h4>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transfer To User</label>
                <select name="toUserId" required className="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                  <option value="">-- Select User --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select name="priority" className="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Transfer</label>
                <input type="text" name="reason" required className="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Comments (Optional)</label>
                <textarea name="comments" rows={3} className="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"></textarea>
              </div>
            </div>
            
            <div className="mt-6">
              <button disabled={isSubmitting} type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                {isSubmitting ? "Submitting..." : "Submit Transfer Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedAsset && !isAllocated && (
        <form onSubmit={handleAllocate} className="p-6 space-y-6">
          <input type="hidden" name="assetId" value={selectedAsset.id} />
          
          <div className="flex space-x-4 mb-4">
            <button type="button" onClick={() => setAssigneeType("user")} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center ${assigneeType === "user" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              <User className="h-4 w-4 mr-2" /> Assign to User
            </button>
            <button type="button" onClick={() => setAssigneeType("department")} className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center ${assigneeType === "department" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              <Building2 className="h-4 w-4 mr-2" /> Assign to Department
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {assigneeType === "user" ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                <select name="userId" required className="w-full border-slate-300 rounded-lg shadow-sm p-2 border">
                  <option value="">-- Select Employee --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select name="departmentId" required className="w-full border-slate-300 rounded-lg shadow-sm p-2 border">
                  <option value="">-- Select Department --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-slate-400" /> Expected Return Date (Optional)
              </label>
              <input type="date" name="expectedReturnDate" className="w-full border-slate-300 rounded-lg shadow-sm p-2 border" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Purpose of Allocation</label>
              <input type="text" name="purpose" required className="w-full border-slate-300 rounded-lg shadow-sm p-2 border" placeholder="e.g., Project X Development" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                <FileText className="h-4 w-4 mr-1 text-slate-400" /> Additional Notes
              </label>
              <textarea name="notes" rows={3} className="w-full border-slate-300 rounded-lg shadow-sm p-2 border"></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button disabled={isSubmitting} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              {isSubmitting ? "Allocating..." : "Allocate Asset"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
