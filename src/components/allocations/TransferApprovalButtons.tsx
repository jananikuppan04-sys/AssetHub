"use client"

import { useState } from "react"
import { approveTransfer, rejectTransfer } from "@/app/actions/allocations"
import toast from "react-hot-toast"
import { Check, X } from "lucide-react"

export default function TransferApprovalButtons({ transferId }: { transferId: string }) {
  const [isProcessing, setIsProcessing] = useState(false)

  async function handleApprove() {
    if (!confirm("Are you sure you want to approve this transfer? The asset will be immediately reallocated.")) return
    
    setIsProcessing(true)
    try {
      await approveTransfer(transferId)
      toast.success("Transfer approved successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to approve transfer")
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleReject() {
    const reason = prompt("Enter a reason for rejection (optional):")
    if (reason === null) return // Cancelled

    setIsProcessing(true)
    try {
      await rejectTransfer(transferId, reason)
      toast.success("Transfer rejected")
    } catch (error: any) {
      toast.error(error.message || "Failed to reject transfer")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex space-x-2">
      <button 
        onClick={handleApprove} 
        disabled={isProcessing}
        className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-md text-sm font-medium transition-colors"
      >
        <Check className="h-4 w-4 mr-1" /> Approve
      </button>
      <button 
        onClick={handleReject} 
        disabled={isProcessing}
        className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-md text-sm font-medium transition-colors"
      >
        <X className="h-4 w-4 mr-1" /> Reject
      </button>
    </div>
  )
}
