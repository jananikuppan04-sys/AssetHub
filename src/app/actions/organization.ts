"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function getAdminUser() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "Admin") throw new Error("Unauthorized")
  
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (user) return user
  }
  throw new Error("User not found")
}

async function logActivity(userId: string, action: string, assetId?: string, previousValue?: string, updatedValue?: string) {
  await prisma.activityLog.create({
    data: { userId, action, assetId, previousValue, updatedValue }
  })
}

// ----------------------------------------------------
// STATS & INSIGHTS
// ----------------------------------------------------

export async function getOrganizationStats() {
  const [totalDepartments, activeDepartments, totalEmployees, totalCategories] = await Promise.all([
    prisma.department.count(),
    prisma.department.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.assetCategory.count()
  ])

  return { totalDepartments, activeDepartments, totalEmployees, totalCategories }
}

export async function getRecentActivity() {
  return await prisma.activityLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true, asset: true }
  })
}

// ----------------------------------------------------
// DEPARTMENTS
// ----------------------------------------------------

export async function getDepartments() {
  return await prisma.department.findMany({
    include: { 
      head: true, 
      parent: true,
      _count: { select: { members: true, assets: true } } 
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getDepartmentById(id: string) {
  return await prisma.department.findUnique({
    where: { id },
    include: {
      head: true,
      parent: true,
      children: true,
      members: true,
      assets: {
        include: { category: true }
      },
      _count: { select: { members: true, assets: true, allocations: true } }
    }
  })
}

export async function createDepartment(formData: FormData) {
  const admin = await getAdminUser()
  const name = formData.get("name") as string
  const code = formData.get("code") as string || null
  const description = formData.get("description") as string || null
  const location = formData.get("location") as string || null
  const email = formData.get("email") as string || null
  const phone = formData.get("phone") as string || null
  const headId = formData.get("headId") as string || null
  const parentId = formData.get("parentId") as string || null
  const active = formData.get("active") === "true"
  
  if (code) {
    const existing = await prisma.department.findUnique({ where: { code } })
    if (existing) throw new Error("Department Code must be unique")
  }
  
  const dept = await prisma.department.create({ 
    data: { name, code, description, location, email, phone, headId, parentId, active } 
  })
  
  await logActivity(admin.id, `Created department: ${name}`)
  revalidatePath("/dashboard/organization")
  return dept
}

export async function updateDepartment(id: string, formData: FormData) {
  const admin = await getAdminUser()
  const name = formData.get("name") as string
  const code = formData.get("code") as string || null
  const description = formData.get("description") as string || null
  const location = formData.get("location") as string || null
  const email = formData.get("email") as string || null
  const phone = formData.get("phone") as string || null
  const headId = formData.get("headId") as string || null
  const parentId = formData.get("parentId") as string || null
  const active = formData.get("active") === "true"
  
  if (parentId === id) {
    throw new Error("Parent Department cannot be itself")
  }

  if (code) {
    const existing = await prisma.department.findUnique({ where: { code } })
    if (existing && existing.id !== id) throw new Error("Department Code must be unique")
  }
  
  await prisma.department.update({ 
    where: { id },
    data: { name, code, description, location, email, phone, headId, parentId, active } 
  })

  await logActivity(admin.id, `Updated department: ${name}`)
  revalidatePath("/dashboard/organization")
  revalidatePath(`/dashboard/organization/departments/${id}`)
}

export async function deleteDepartment(id: string) {
  const admin = await getAdminUser()
  const dept = await prisma.department.findUnique({ where: { id } })
  if (!dept) throw new Error("Not found")

  // Soft delete instead of hard delete
  await prisma.department.update({ where: { id }, data: { active: false } })
  await logActivity(admin.id, `Deactivated department: ${dept.name}`)
  revalidatePath("/dashboard/organization")
}

export async function toggleDepartment(id: string, active: boolean) {
  const admin = await getAdminUser()
  const dept = await prisma.department.findUnique({ where: { id } })
  if (!dept) throw new Error("Not found")

  await prisma.department.update({ where: { id }, data: { active } })
  await logActivity(admin.id, `${active ? "Reactivated" : "Deactivated"} department: ${dept.name}`)
  revalidatePath("/dashboard/organization")
}

// ----------------------------------------------------
// CATEGORIES
// ----------------------------------------------------

export async function getCategories() {
  return await prisma.assetCategory.findMany({
    include: { _count: { select: { assets: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createCategory(formData: FormData) {
  const admin = await getAdminUser()
  const name = formData.get("name") as string
  const code = formData.get("code") as string || null
  const warrantyPeriodMonths = parseInt(formData.get("warrantyPeriodMonths") as string) || 12
  const defaultMaintenanceFrequency = parseInt(formData.get("defaultMaintenanceFrequency") as string) || 6
  const icon = formData.get("icon") as string || null
  const metadata = formData.get("metadata") as string || null
  const active = formData.get("active") === "true"
  
  if (code) {
    const existing = await prisma.assetCategory.findUnique({ where: { code } })
    if (existing) throw new Error("Category Code must be unique")
  }

  await prisma.assetCategory.create({
    data: { name, code, warrantyPeriodMonths, defaultMaintenanceFrequency, icon, metadata, active }
  })

  await logActivity(admin.id, `Created asset category: ${name}`)
  revalidatePath("/dashboard/organization")
}

export async function updateCategory(id: string, formData: FormData) {
  const admin = await getAdminUser()
  const name = formData.get("name") as string
  const code = formData.get("code") as string || null
  const warrantyPeriodMonths = parseInt(formData.get("warrantyPeriodMonths") as string) || 12
  const defaultMaintenanceFrequency = parseInt(formData.get("defaultMaintenanceFrequency") as string) || 6
  const icon = formData.get("icon") as string || null
  const metadata = formData.get("metadata") as string || null
  const active = formData.get("active") === "true"
  
  if (code) {
    const existing = await prisma.assetCategory.findUnique({ where: { code } })
    if (existing && existing.id !== id) throw new Error("Category Code must be unique")
  }

  await prisma.assetCategory.update({
    where: { id },
    data: { name, code, warrantyPeriodMonths, defaultMaintenanceFrequency, icon, metadata, active }
  })

  await logActivity(admin.id, `Updated asset category: ${name}`)
  revalidatePath("/dashboard/organization")
}

export async function deleteCategory(id: string) {
  const admin = await getAdminUser()
  
  const category = await prisma.assetCategory.findUnique({
    where: { id },
    include: { _count: { select: { assets: true } } }
  })

  if (!category) throw new Error("Category not found")

  if (category._count.assets > 0) {
    throw new Error("Categories assigned to assets cannot be deleted.")
  }

  await prisma.assetCategory.delete({ where: { id } })
  await logActivity(admin.id, `Deleted asset category: ${category.name}`)
  revalidatePath("/dashboard/organization")
}

// ----------------------------------------------------
// EMPLOYEES
// ----------------------------------------------------

export async function getEmployees() {
  return await prisma.user.findMany({
    include: { 
      department: true,
      allocations: { include: { asset: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getEmployeeById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      department: true,
      allocations: { include: { asset: true } },
      bookings: { include: { asset: true } },
      maintenanceReqs: { include: { asset: true } },
      activityLogs: { orderBy: { createdAt: 'desc' }, take: 20 }
    }
  })
}

export async function promoteUser(userId: string, role: string) {
  const admin = await getAdminUser()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")

  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })

  await logActivity(admin.id, `Promoted ${user.name} to ${role}`)
  revalidatePath("/dashboard/organization")
  revalidatePath(`/dashboard/organization/employees/${userId}`)
}

export async function assignDepartment(userId: string, departmentId: string | null) {
  const admin = await getAdminUser()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")

  if (departmentId) {
    const dept = await prisma.department.findUnique({ where: { id: departmentId } })
    if (dept && !dept.active) throw new Error("Inactive departments cannot receive new employees.")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { departmentId: departmentId || null }
  })

  await logActivity(admin.id, `Assigned ${user.name} to department`)
  revalidatePath("/dashboard/organization")
  revalidatePath(`/dashboard/organization/employees/${userId}`)
}

export async function toggleEmployeeStatus(userId: string, status: string) {
  const admin = await getAdminUser()
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")

  await prisma.user.update({
    where: { id: userId },
    data: { status }
  })

  await logActivity(admin.id, `Changed ${user.name} status to ${status}`)
  revalidatePath("/dashboard/organization")
  revalidatePath(`/dashboard/organization/employees/${userId}`)
}

export async function updateEmployee(id: string, formData: FormData) {
  const admin = await getAdminUser()
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const employeeId = formData.get("employeeId") as string || null
  const role = formData.get("role") as string
  const status = formData.get("status") as string
  const departmentId = formData.get("departmentId") as string || null
  
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error("User not found")

  await prisma.user.update({
    where: { id },
    data: { name, email, employeeId, role, status, departmentId }
  })

  await logActivity(admin.id, `Updated employee profile for ${name}`)
  revalidatePath("/dashboard/organization")
  revalidatePath(`/dashboard/organization/employees/${id}`)
}
