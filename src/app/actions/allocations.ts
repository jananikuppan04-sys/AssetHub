"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function allocateAsset(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const assetId = formData.get("assetId") as string
  const userId = formData.get("userId") as string | null
  const departmentId = formData.get("departmentId") as string | null
  const purpose = formData.get("purpose") as string | null
  const notes = formData.get("notes") as string | null
  const expectedReturnDateStr = formData.get("expectedReturnDate") as string | null

  // Duplicate Check
  const asset = await prisma.asset.findUnique({ where: { id: assetId } })
  if (!asset || asset.status !== "Available") {
    throw new Error("Asset is not available for allocation.")
  }

  const expectedReturnDate = expectedReturnDateStr ? new Date(expectedReturnDateStr) : null

  const allocation = await prisma.assetAllocation.create({
    data: {
      assetId,
      userId,
      departmentId,
      purpose,
      notes,
      expectedReturnDate,
      status: "Active",
      approvalDate: new Date(),
    }
  })

  // Update Asset Status
  await prisma.asset.update({
    where: { id: assetId },
    data: {
      status: "Allocated",
      departmentId: departmentId || asset.departmentId,
      currentLocation: userId ? "Assigned to User" : (departmentId ? "Assigned to Dept" : asset.currentLocation)
    }
  })

  // Log Activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      assetId,
      action: "Allocated",
      updatedValue: "Allocated"
    }
  })

  revalidatePath("/dashboard/allocations")
  revalidatePath(`/dashboard/assets/${assetId}`)
  
  return allocation
}

export async function requestTransfer(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const assetId = formData.get("assetId") as string
  const toUserId = formData.get("toUserId") as string
  const reason = formData.get("reason") as string
  const priority = formData.get("priority") as string || "Medium"
  const comments = formData.get("comments") as string | null

  const activeAllocation = await prisma.assetAllocation.findFirst({
    where: { assetId, status: "Active" }
  })

  if (!activeAllocation || !activeAllocation.userId) {
    throw new Error("Cannot transfer an asset that is not actively allocated to a user.")
  }

  const transfer = await prisma.assetTransferRequest.create({
    data: {
      assetId,
      fromUserId: activeAllocation.userId,
      toUserId,
      reason,
      priority,
      comments,
      status: "Requested"
    }
  })

  // Log Activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      assetId,
      action: "Transfer Requested",
    }
  })

  revalidatePath("/dashboard/allocations")
  revalidatePath(`/dashboard/assets/${assetId}`)
  return transfer
}

export async function approveTransfer(transferId: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const transfer = await prisma.assetTransferRequest.findUnique({
    where: { id: transferId },
    include: { asset: true, toUser: true }
  })

  if (!transfer || transfer.status !== "Requested") {
    throw new Error("Invalid transfer request")
  }

  // 1. Close current allocation
  const activeAllocation = await prisma.assetAllocation.findFirst({
    where: { assetId: transfer.assetId, status: "Active", userId: transfer.fromUserId }
  })

  if (activeAllocation) {
    await prisma.assetAllocation.update({
      where: { id: activeAllocation.id },
      data: { status: "Returned", returnDate: new Date(), returnRemarks: "Transferred" }
    })
  }

  // 2. Create new allocation
  await prisma.assetAllocation.create({
    data: {
      assetId: transfer.assetId,
      userId: transfer.toUserId,
      departmentId: transfer.toUser.departmentId,
      purpose: transfer.reason,
      notes: transfer.comments,
      status: "Active",
      approvalDate: new Date()
    }
  })

  // 3. Update Transfer Status
  await prisma.assetTransferRequest.update({
    where: { id: transferId },
    data: { status: "Approved", approvalDate: new Date() }
  })

  // 4. Update Asset
  await prisma.asset.update({
    where: { id: transfer.assetId },
    data: { departmentId: transfer.toUser.departmentId }
  })

  // Log Activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      assetId: transfer.assetId,
      action: "Transfer Approved",
    }
  })

  revalidatePath("/dashboard/allocations")
  revalidatePath(`/dashboard/assets/${transfer.assetId}`)
}

export async function rejectTransfer(transferId: string, comments: string = "") {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const transfer = await prisma.assetTransferRequest.update({
    where: { id: transferId },
    data: { status: "Rejected", comments: comments }
  })

  // Log Activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      assetId: transfer.assetId,
      action: "Transfer Rejected",
    }
  })

  revalidatePath("/dashboard/allocations")
  return transfer
}

export async function requestReturn(allocationId: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const returnCondition = formData.get("returnCondition") as string
  const returnRemarks = formData.get("returnRemarks") as string | null

  const allocation = await prisma.assetAllocation.update({
    where: { id: allocationId },
    data: { 
      status: "Return Requested",
      returnCondition,
      returnRemarks
    }
  })

  // Log Activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      assetId: allocation.assetId,
      action: "Return Requested",
    }
  })

  revalidatePath("/dashboard/allocations")
  return allocation
}

export async function approveReturn(allocationId: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const allocation = await prisma.assetAllocation.update({
    where: { id: allocationId },
    data: { 
      status: "Returned",
      returnDate: new Date()
    }
  })

  await prisma.asset.update({
    where: { id: allocation.assetId },
    data: {
      status: "Available",
      currentCondition: allocation.returnCondition || "Good",
    }
  })

  // Log Activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      assetId: allocation.assetId,
      action: "Asset Returned",
      updatedValue: "Available"
    }
  })

  revalidatePath("/dashboard/allocations")
  revalidatePath(`/dashboard/assets/${allocation.assetId}`)
  return allocation
}

export async function getAllocations() {
  return await prisma.assetAllocation.findMany({
    include: { asset: true, user: true, department: true },
    orderBy: { requestDate: 'desc' }
  })
}

export async function getTransfers() {
  return await prisma.assetTransferRequest.findMany({
    include: { asset: true, fromUser: true, toUser: true },
    orderBy: { requestDate: 'desc' }
  })
}
