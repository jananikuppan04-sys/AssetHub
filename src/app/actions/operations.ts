"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function requestAllocation(assetId: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  await prisma.assetAllocation.create({
    data: {
      assetId,
      userId: session.user.id,
      departmentId: session.user.departmentId,
      status: "Pending"
    }
  })
  
  await prisma.asset.update({
    where: { id: assetId },
    data: { status: "Allocated" }
  })
  
  await prisma.activityLog.create({
    data: { userId: session.user.id, assetId, action: "Requested Allocation" }
  })

  revalidatePath("/dashboard/assets")
}

export async function requestMaintenance(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const assetId = formData.get("assetId") as string
  const issueDescription = formData.get("issueDescription") as string
  const priority = formData.get("priority") as string

  await prisma.maintenanceRequest.create({
    data: {
      assetId,
      requesterId: session.user.id,
      issueDescription,
      priority,
      status: "Pending"
    }
  })

  await prisma.asset.update({
    where: { id: assetId },
    data: { status: "Under Maintenance" }
  })

  revalidatePath("/dashboard/maintenance")
}

export async function bookResource(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const assetId = formData.get("assetId") as string
  const startDate = new Date(formData.get("startDate") as string)
  const endDate = new Date(formData.get("endDate") as string)

  await prisma.resourceBooking.create({
    data: {
      assetId,
      userId: session.user.id,
      startDate,
      endDate,
      status: "Upcoming"
    }
  })

  revalidatePath("/dashboard/bookings")
}
