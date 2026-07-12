"use client"

import { useState } from "react"
import { createDepartment, toggleDepartment, createCategory, promoteUser, assignDepartment } from "@/app/actions/organization"
import { Building2, Tags, Users } from "lucide-react"

export default function OrganizationTabs({ initialDepartments, initialCategories, initialEmployees }: any) {
  const [activeTab, setActiveTab] = useState("departments")

  const tabs = [
    { id: "departments", name: "Departments", icon: Building2 },
    { id: "categories", name: "Asset Categories", icon: Tags },
    { id: "employees", name: "Employees", icon: Users },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200">
        <nav className="flex -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm
                ${activeTab === tab.id 
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }
              `}
            >
              <tab.icon className={`mr-2 h-5 w-5 ${activeTab === tab.id ? "text-blue-500" : "text-slate-400 group-hover:text-slate-500"}`} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "departments" && (
          <div className="space-y-6">
            <form action={createDepartment} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">New Department Name</label>
                <input name="name" type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. Human Resources" />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">Create</button>
            </form>

            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Head</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Members</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {initialDepartments.map((dept: any) => (
                  <tr key={dept.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{dept.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">{dept.head?.name || "Unassigned"}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">{dept._count.members}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dept.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {dept.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right">
                      <button onClick={async () => await toggleDepartment(dept.id, !dept.active)} className="text-blue-600 hover:text-blue-900">
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6">
            <form action={createCategory} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                <input name="name" type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. Electronics" />
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1">Warranty (Months)</label>
                <input name="warrantyPeriodMonths" type="number" defaultValue={12} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance (Months)</label>
                <input name="defaultMaintenanceFrequency" type="number" defaultValue={6} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">Create</button>
            </form>

            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Warranty (mo)</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Maintenance Freq</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Assets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {initialCategories.map((cat: any) => (
                  <tr key={cat.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{cat.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">{cat.warrantyPeriodMonths}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">{cat.defaultMaintenanceFrequency}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">{cat._count.assets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "employees" && (
          <div>
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-slate-500 uppercase">Promote Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {initialEmployees.map((emp: any) => (
                  <tr key={emp.id}>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                      <div className="text-sm text-slate-500">{emp.email}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">{emp.role}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500">
                      <select 
                        value={emp.departmentId || ""}
                        onChange={async (e) => await assignDepartment(emp.id, e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 outline-none text-sm"
                      >
                        <option value="">Unassigned</option>
                        {initialDepartments.map((d: any) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right space-x-2">
                      <select
                        value={emp.role}
                        onChange={async (e) => await promoteUser(emp.id, e.target.value)}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 outline-none text-sm inline-block"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Asset Manager">Asset Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
