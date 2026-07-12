"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createAsset(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  // Generate Asset Tag
  const lastAsset = await prisma.asset.findFirst({
    orderBy: { createdAt: 'desc' }
  })
  let newTagNumber = 1
  if (lastAsset && lastAsset.assetTag.startsWith("AF-")) {
    const num = parseInt(lastAsset.assetTag.replace("AF-", ""))
    if (!isNaN(num)) newTagNumber = num + 1
  }
  const assetTag = `AF-${newTagNumber.toString().padStart(4, '0')}`

  const data = {
    assetTag,
    name: formData.get("name") as string,
    categoryId: formData.get("categoryId") as string,
    serialNumber: formData.get("serialNumber") as string || null,
    acquisitionDate: new Date(formData.get("acquisitionDate") as string),
    acquisitionCost: parseFloat(formData.get("acquisitionCost") as string),
    warranty: formData.get("warranty") as string || null,
    currentCondition: formData.get("currentCondition") as string || "Good",
    currentLocation: formData.get("currentLocation") as string || null,
    departmentId: formData.get("departmentId") as string || null,
    bookable: formData.get("bookable") === "on",
    status: "Available",
  }

  const asset = await prisma.asset.create({ data })

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      assetId: asset.id,
      action: "Registered Asset",
      updatedValue: "Available"
    }
  })

  revalidatePath("/dashboard/assets")
  return asset
}

export async function getAssets(searchParams?: any) {
  const where: any = {}
  
  if (searchParams?.q) {
    where.OR = [
      { assetTag: { contains: searchParams.q } },
      { name: { contains: searchParams.q } },
      { serialNumber: { contains: searchParams.q } },
    ]
  }
  if (searchParams?.category) where.categoryId = searchParams.category
  if (searchParams?.department) where.departmentId = searchParams.department
  if (searchParams?.status) where.status = searchParams.status

  return await prisma.asset.findMany({
    where,
    include: { category: true, department: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getAssetDetails(id: string) {
  return await prisma.asset.findUnique({
    where: { id },
    include: {
      category: true,
      department: true,
      allocations: { include: { user: true, department: true }, orderBy: { requestDate: 'desc' } },
      maintenanceReqs: { include: { requester: true, technician: true }, orderBy: { requestDate: 'desc' } },
      activityLogs: { include: { user: true }, orderBy: { createdAt: 'desc' } }
    }
  })
}
