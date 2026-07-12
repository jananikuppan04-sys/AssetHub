"use client"

import { useState } from "react"
import { Building2, Tags, Users } from "lucide-react"
import DepartmentsTab from "./DepartmentsTab"
import AssetCategoriesTab from "./AssetCategoriesTab"
import EmployeesTab from "./EmployeesTab"

export default function OrganizationTabs({ 
  initialDepartments, 
  initialCategories, 
  initialEmployees,
}: { 
  initialDepartments: any[], 
  initialCategories: any[], 
  initialEmployees: any[],
}) {
  const [activeTab, setActiveTab] = useState("departments")

  const tabs = [
    { id: "departments", name: "Departments", icon: Building2 },
    { id: "categories", name: "Asset Categories", icon: Tags },
    { id: "employees", name: "Employee Directory", icon: Users },
  ]

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b border-slate-200 bg-white px-6 pt-2 flex justify-between items-center">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 border-b-2 font-medium text-sm transition-all
                ${activeTab === tab.id 
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }
              `}
            >
              <tab.icon className={`mr-2 h-5 w-5 transition-colors ${activeTab === tab.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"}`} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 bg-slate-50/50 flex-1">
        {activeTab === "departments" && (
          <DepartmentsTab departments={initialDepartments} employees={initialEmployees} />
        )}

        {activeTab === "categories" && (
          <AssetCategoriesTab categories={initialCategories} />
        )}

        {activeTab === "employees" && (
          <EmployeesTab employees={initialEmployees} departments={initialDepartments} />
        )}
      </div>
    </div>
  )
}
