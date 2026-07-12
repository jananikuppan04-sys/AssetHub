"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBooking } from "@/app/actions/bookings"
import toast from "react-hot-toast"
import { Calendar as CalendarIcon, Clock, Users, FileText, Target } from "lucide-react"

type Asset = {
  id: string
  name: string
  assetTag: string
  category: { name: string }
}

export default function BookingForm({ bookableAssets }: { bookableAssets: Asset[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default to today
  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      await createBooking(formData)
      toast.success("Resource booked successfully")
      router.push("/dashboard/bookings")
    } catch (error: any) {
      toast.error(error.message || "Failed to book resource")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Resource Selection */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Resource</label>
            <select name="assetId" required className="w-full border-slate-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2 border">
              <option value="">-- Choose a bookable resource --</option>
              {bookableAssets.map(asset => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.category.name} - {asset.assetTag})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-slate-400" /> Date
            </label>
            <input type="date" name="date" required defaultValue={today} min={today} className="w-full border-slate-300 rounded-lg shadow-sm p-2 border focus:border-purple-500 focus:ring-purple-500" />
          </div>

          {/* Spacer */}
          <div className="hidden sm:block"></div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-slate-400" /> Start Time
            </label>
            <input type="time" name="startTime" required className="w-full border-slate-300 rounded-lg shadow-sm p-2 border focus:border-purple-500 focus:ring-purple-500" />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-slate-400" /> End Time
            </label>
            <input type="time" name="endTime" required className="w-full border-slate-300 rounded-lg shadow-sm p-2 border focus:border-purple-500 focus:ring-purple-500" />
          </div>

          {/* Purpose */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <Target className="h-4 w-4 mr-1 text-slate-400" /> Purpose of Booking
            </label>
            <input type="text" name="purpose" required className="w-full border-slate-300 rounded-lg shadow-sm p-2 border focus:border-purple-500 focus:ring-purple-500" placeholder="e.g., Q3 Planning Meeting" />
          </div>

          {/* Participants */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <Users className="h-4 w-4 mr-1 text-slate-400" /> Participants (Optional)
            </label>
            <input type="text" name="participants" className="w-full border-slate-300 rounded-lg shadow-sm p-2 border focus:border-purple-500 focus:ring-purple-500" placeholder="e.g., John Doe, Jane Smith, Engineering Team" />
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
              <FileText className="h-4 w-4 mr-1 text-slate-400" /> Additional Notes
            </label>
            <textarea name="notes" rows={3} className="w-full border-slate-300 rounded-lg shadow-sm p-2 border focus:border-purple-500 focus:ring-purple-500" placeholder="Any special requirements?"></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button disabled={isSubmitting} type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm">
            {isSubmitting ? "Checking Availability..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  )
}
