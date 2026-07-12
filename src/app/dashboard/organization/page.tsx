import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDepartments, getCategories, getEmployees, getOrganizationStats, getRecentActivity } from "@/app/actions/organization"
import OrganizationDashboard from "@/components/organization/OrganizationDashboard"

export const dynamic = 'force-dynamic';

export default async function OrganizationPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard")
  }

  const [departments, categories, employees, stats, activities] = await Promise.all([
    getDepartments(),
    getCategories(),
    getEmployees(),
    getOrganizationStats(),
    getRecentActivity()
  ])

  return (
    <OrganizationDashboard 
      departments={departments}
      categories={categories}
      employees={employees}
      stats={stats}
      activities={activities}
    />
  )
}
