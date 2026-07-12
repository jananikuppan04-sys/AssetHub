import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AllocationForm from "@/components/allocations/AllocationForm"

export default async function NewAllocationPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const assets = await prisma.asset.findMany({
    include: {
      allocations: {
        where: { status: "Active" },
        include: { user: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  const users = await prisma.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })

  const departments = await prisma.department.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link href="/dashboard/allocations" className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Allocations
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Allocate Asset</h1>
        <p className="mt-1 text-sm text-slate-500">Assign an asset to an employee or department.</p>
      </div>

      <AllocationForm assets={assets} users={users} departments={departments} />
    </div>
  )
}
