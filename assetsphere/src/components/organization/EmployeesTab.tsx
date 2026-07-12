"use client"

import { useState, useMemo } from "react"
import { toggleEmployeeStatus, promoteUser, assignDepartment } from "@/app/actions/organization"
import { Users, Search, Edit2, ShieldAlert, Eye, Filter, ChevronLeft, ChevronRight, UserCog } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import EmployeeDrawer from "./EmployeeDrawer"

export default function EmployeesTab({ employees, departments }: { employees: any[], departments: any[] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [deptFilter, setDeptFilter] = useState("all")
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Confirm Dialog State
  const [dialogConfig, setDialogConfig] = useState<{isOpen: boolean, type: any, title: string, message: string, action: () => void}>({
    isOpen: false, type: "danger", title: "", message: "", action: () => {}
  })

  // Derived Data
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = (emp.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                            (emp.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (emp.employeeId && emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesRole = roleFilter === "all" ? true : emp.role === roleFilter
      const matchesDept = deptFilter === "all" ? true : deptFilter === "unassigned" ? !emp.departmentId : emp.departmentId === deptFilter
      
      return matchesSearch && matchesRole && matchesDept
    })
  }, [employees, searchQuery, roleFilter, deptFilter])

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const roleColors: Record<string, string> = {
    "Admin": "bg-purple-100 text-purple-800 border-purple-200",
    "Asset Manager": "bg-blue-100 text-blue-800 border-blue-200",
    "Department Head": "bg-amber-100 text-amber-800 border-amber-200",
    "Employee": "bg-slate-100 text-slate-700 border-slate-200"
  }

  const handleToggleStatus = (emp: any) => {
    const actionName = emp.status === 'Active' ? "Deactivate" : "Reactivate"
    setDialogConfig({
      isOpen: true,
      type: emp.status === 'Active' ? "warning" : "info",
      title: `${actionName} Employee`,
      message: `Are you sure you want to ${actionName.toLowerCase()} ${emp.name}? ${emp.status === 'Active' ? 'Inactive users cannot log in to the system.' : ''}`,
      action: async () => {
        try {
          await toggleEmployeeStatus(emp.id, emp.status === 'Active' ? 'Inactive' : 'Active')
          toast.success(`Employee ${actionName.toLowerCase()}d successfully`)
        } catch (error: any) {
          toast.error(error.message || `Failed to ${actionName.toLowerCase()} employee`)
        }
      }
    })
  }

  const handleRoleChange = (emp: any, newRole: string) => {
    setDialogConfig({
      isOpen: true,
      type: "info",
      title: "Promote Role",
      message: `Are you sure you want to change ${emp.name}'s role to ${newRole}? This will grant them new permissions.`,
      action: async () => {
        try {
          await promoteUser(emp.id, newRole)
          toast.success(`Role changed successfully`)
        } catch (error: any) {
          toast.error(error.message || `Failed to change role`)
        }
      }
    })
  }

  const handleDeptChange = (emp: any, newDeptId: string) => {
    const deptName = newDeptId ? departments.find(d => d.id === newDeptId)?.name : "Unassigned"
    setDialogConfig({
      isOpen: true,
      type: "info",
      title: "Assign Department",
      message: `Are you sure you want to assign ${emp.name} to ${deptName}?`,
      action: async () => {
        try {
          await assignDepartment(emp.id, newDeptId)
          toast.success(`Department assigned successfully`)
        } catch (error: any) {
          toast.error(error.message || `Failed to assign department`)
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-1 w-full gap-4 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="relative min-w-[150px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Employee">Employee</option>
              <option value="Department Head">Department Head</option>
              <option value="Asset Manager">Asset Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="relative min-w-[150px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="unassigned">Unassigned</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-center">Assets Assigned</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <UserCog className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900">No employees found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {emp.profilePicture ? (
                          <img src={emp.profilePicture} alt="" className="h-10 w-10 rounded-full object-cover shadow-sm border border-slate-200" />
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                            {emp.name.charAt(0)}
                          </div>
                        )}
                        <div className="ml-4">
                          <Link href={`/dashboard/organization/employees/${emp.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                            {emp.name}
                          </Link>
                          <div className="text-xs text-slate-500 mt-0.5">{emp.email}</div>
                          {emp.employeeId && <div className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">ID: {emp.employeeId}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={emp.role}
                        onChange={(e) => handleRoleChange(emp, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 outline-none cursor-pointer appearance-none border transition-colors hover:shadow-sm ${roleColors[emp.role] || roleColors["Employee"]}`}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Asset Manager">Asset Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={emp.departmentId || ""}
                        onChange={(e) => handleDeptChange(emp, e.target.value)}
                        className="bg-transparent text-slate-700 font-medium hover:bg-slate-100 border border-transparent hover:border-slate-300 rounded-lg px-2 py-1 outline-none text-sm transition-colors cursor-pointer w-40"
                      >
                        <option value="">Unassigned</option>
                        {departments.map((d: any) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 py-1 px-3 rounded-full font-medium text-xs">
                        {emp.allocations?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        emp.status === "Active" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/organization/employees/${emp.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { setEditingEmployee(emp); setIsDrawerOpen(true); }} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Edit User">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(emp)} 
                          className={`p-1.5 rounded-lg transition-colors ${emp.status === 'Active' ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                          title={emp.status === 'Active' ? "Deactivate" : "Activate"}
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> of <span className="font-medium text-slate-900">{filteredEmployees.length}</span> results
            </p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      <EmployeeDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        employee={editingEmployee}
        departments={departments}
      />

      <ConfirmDialog 
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        type={dialogConfig.type}
        onConfirm={dialogConfig.action}
        onCancel={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
