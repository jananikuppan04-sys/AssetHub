"use client"

import OrganizationTabs from "./OrganizationTabs"
import OrganizationStats from "./OrganizationStats"
import OrganizationInsights from "./OrganizationInsights"
import OrganizationActivity from "./OrganizationActivity"
import OrganizationAIAssistant from "./OrganizationAIAssistant"
import { ChevronRight } from "lucide-react"

export default function OrganizationDashboard({ 
  departments, 
  categories, 
  employees,
  stats,
  activities
}: { 
  departments: any[], 
  categories: any[], 
  employees: any[],
  stats: any,
  activities: any[]
}) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <nav className="flex items-center text-sm text-slate-500 mb-2">
          <span>Home</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-medium text-slate-900">Organization Setup</span>
        </nav>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Setup</h1>
        <p className="mt-2 text-slate-500 max-w-3xl">
          Manage organizational structure, departments, categories, employees, and system master data.
        </p>
      </div>

      {/* Stats */}
      <OrganizationStats stats={stats} />

      {/* Analytics & AI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <OrganizationInsights departments={departments} />
        </div>
        <div className="lg:col-span-1 min-h-[320px] h-full flex flex-col">
          <OrganizationAIAssistant departments={departments} />
        </div>
      </div>

      {/* Main Tabs Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 min-h-[500px]">
          <OrganizationTabs 
            initialDepartments={departments}
            initialCategories={categories}
            initialEmployees={employees}
          />
        </div>
        <div className="lg:col-span-1 min-h-[500px]">
          <OrganizationActivity activities={activities} />
        </div>
      </div>
    </div>
  )
}
