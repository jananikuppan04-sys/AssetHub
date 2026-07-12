"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "Admin") throw new Error("Unauthorized")
}

// Departments
export async function getDepartments() {
  return await prisma.department.findMany({
    include: { head: true, _count: { select: { members: true, assets: true } } }
  })
}

export async function createDepartment(formData: FormData) {
  await checkAdmin()
  const name = formData.get("name") as string
  await prisma.department.create({ data: { name, active: true } })
  revalidatePath("/dashboard/organization")
}

export async function toggleDepartment(id: string, active: boolean) {
  await checkAdmin()
  await prisma.department.update({ where: { id }, data: { active } })
  revalidatePath("/dashboard/organization")
}

// Categories
export async function getCategories() {
  return await prisma.assetCategory.findMany({
    include: { _count: { select: { assets: true } } }
  })
}

export async function createCategory(formData: FormData) {
  await checkAdmin()
  const name = formData.get("name") as string
  const warrantyPeriodMonths = parseInt(formData.get("warrantyPeriodMonths") as string) || 12
  const defaultMaintenanceFrequency = parseInt(formData.get("defaultMaintenanceFrequency") as string) || 6
  
  await prisma.assetCategory.create({
    data: { name, warrantyPeriodMonths, defaultMaintenanceFrequency }
  })
  revalidatePath("/dashboard/organization")
}

// Employees
export async function getEmployees() {
  return await prisma.user.findMany({
    include: { department: true }
  })
}

export async function promoteUser(userId: string, role: string) {
  await checkAdmin()
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })
  revalidatePath("/dashboard/organization")
}

export async function assignDepartment(userId: string, departmentId: string) {
  await checkAdmin()
  await prisma.user.update({
    where: { id: userId },
    data: { departmentId: departmentId || null }
  })
  revalidatePath("/dashboard/organization")
}
