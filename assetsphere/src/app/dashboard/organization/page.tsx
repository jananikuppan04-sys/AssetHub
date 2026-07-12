import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getDepartments, getCategories, getEmployees } from "@/app/actions/organization"
import OrganizationTabs from "@/components/organization/OrganizationTabs"

export default async function OrganizationPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard")
  }

  const [departments, categories, employees] = await Promise.all([
    getDepartments(),
    getCategories(),
    getEmployees()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Organization Setup</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage departments, asset categories, and employees.
        </p>
      </div>

      <OrganizationTabs 
        initialDepartments={departments}
        initialCategories={categories}
        initialEmployees={employees}
      />
    </div>
  )
}
