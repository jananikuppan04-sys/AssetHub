import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import BookingForm from "@/components/bookings/BookingForm"

export default async function NewBookingPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const bookableAssets = await prisma.asset.findMany({
    where: { bookable: true, status: { notIn: ["Lost", "Under Maintenance"] } },
    include: { category: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link href="/dashboard/bookings" className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Book a Resource</h1>
        <p className="mt-1 text-sm text-slate-500">Schedule a time to use a shared resource like a meeting room or vehicle.</p>
      </div>

      <BookingForm bookableAssets={bookableAssets} />
    </div>
  )
}
