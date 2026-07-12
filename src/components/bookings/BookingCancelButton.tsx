"use client"

import { useState } from "react"
import { cancelBooking } from "@/app/actions/bookings"
import toast from "react-hot-toast"
import { XCircle } from "lucide-react"

export default function BookingCancelButton({ bookingId }: { bookingId: string }) {
  const [isProcessing, setIsProcessing] = useState(false)

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    
    setIsProcessing(true)
    try {
      await cancelBooking(bookingId)
      toast.success("Booking cancelled successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button 
      onClick={handleCancel} 
      disabled={isProcessing}
      className="inline-flex items-center px-3 py-1 bg-white text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
    >
      <XCircle className="h-4 w-4 mr-1" /> Cancel
    </button>
  )
}
