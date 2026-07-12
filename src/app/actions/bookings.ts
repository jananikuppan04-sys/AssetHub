"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createBooking(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const assetId = formData.get("assetId") as string
  const purpose = formData.get("purpose") as string
  const date = formData.get("date") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string
  const participants = formData.get("participants") as string
  const notes = formData.get("notes") as string

  if (!assetId || !date || !startTime || !endTime || !purpose) {
    throw new Error("Missing required fields")
  }

  // Parse dates
  const startDateTime = new Date(`${date}T${startTime}:00`)
  const endDateTime = new Date(`${date}T${endTime}:00`)

  if (startDateTime >= endDateTime) {
    throw new Error("End time must be after start time")
  }

  if (startDateTime < new Date()) {
    throw new Error("Cannot book in the past")
  }

  // Check for overlap
  const overlappingBooking = await prisma.resourceBooking.findFirst({
    where: {
      assetId,
      status: { in: ["Upcoming", "Ongoing"] },
      OR: [
        {
          startDate: { lt: endDateTime },
          endDate: { gt: startDateTime }
        }
      ]
    }
  })

  if (overlappingBooking) {
    throw new Error("This resource is already booked during the selected time slot.")
  }

  // Create booking
  await prisma.resourceBooking.create({
    data: {
      assetId,
      userId: session.user.id,
      startDate: startDateTime,
      endDate: endDateTime,
      purpose,
      participants: participants || null,
      notes: notes || null,
      status: "Upcoming"
    }
  })

  revalidatePath("/dashboard/bookings")
  revalidatePath(`/dashboard/assets/${assetId}`)
}

export async function cancelBooking(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const booking = await prisma.resourceBooking.findUnique({
    where: { id },
    include: { asset: true }
  })

  if (!booking) throw new Error("Booking not found")

  if (booking.userId !== session.user.id && session.user.role !== "Admin") {
    throw new Error("You do not have permission to cancel this booking")
  }

  await prisma.resourceBooking.update({
    where: { id },
    data: { status: "Cancelled" }
  })

  revalidatePath("/dashboard/bookings")
  revalidatePath(`/dashboard/assets/${booking.assetId}`)
}

export async function getBookings(filters?: { assetId?: string, status?: string }) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const where: any = {}
  if (filters?.assetId) where.assetId = filters.assetId
  if (filters?.status) where.status = filters.status

  const bookings = await prisma.resourceBooking.findMany({
    where,
    include: {
      asset: true,
      user: true
    },
    orderBy: { startDate: 'asc' }
  })

  return bookings
}
