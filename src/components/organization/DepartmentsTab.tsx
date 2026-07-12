"use client"

import { useState, useMemo } from "react"
import { Building2, Plus, MoreVertical, Edit2, Ban, CheckCircle2, Trash2, Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import toast from "react-hot-toast"
import DepartmentDrawer from "./DepartmentDrawer"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { toggleDepartment, deleteDepartment } from "@/app/actions/organization"

export default function DepartmentsTab({ departments, employees }: { departments: any[], employees: any[] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Confirm Dialog State
  const [dialogConfig, setDialogConfig] = useState<{isOpen: boolean, type: any, title: string, message: string, action: () => void}>({
    isOpen: false, type: "danger", title: "", message: "", action: () => {}
  })

  // Derived Data
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch = (dept.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
                            (dept.code?.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? dept.active : !dept.active
      return matchesSearch && matchesStatus
    })
  }, [departments, searchQuery, statusFilter])

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage)
  const paginatedDepartments = filteredDepartments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleEdit = (dept: any) => {
    setEditingDepartment(dept)
    setIsDrawerOpen(true)
  }

  const handleToggleStatus = (dept: any) => {
    const actionName = dept.active ? "Deactivate" : "Reactivate"
    setDialogConfig({
      isOpen: true,
      type: dept.active ? "warning" : "info",
      title: `${actionName} Department`,
      message: `Are you sure you want to ${actionName.toLowerCase()} ${dept.name}? ${dept.active ? 'Inactive departments cannot receive new assets or employees.' : ''}`,
      action: async () => {
        try {
          await toggleDepartment(dept.id, !dept.active)
          toast.success(`Department ${actionName.toLowerCase()}d successfully`)
        } catch (error: any) {
          toast.error(error.message || `Failed to ${actionName.toLowerCase()} department`)
        }
      }
    })
  }

  const handleDelete = (dept: any) => {
    setDialogConfig({
      isOpen: true,
      type: "danger",
      title: "Delete Department",
      message: `Are you sure you want to delete ${dept.name}? This action will soft-delete the department and it will no longer be available for assignment.`,
      action: async () => {
        try {
          await deleteDepartment(dept.id)
          toast.success("Department deleted successfully")
        } catch (error: any) {
          toast.error(error.message || "Failed to delete department")
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-1 w-full gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditingDepartment(null)
            setIsDrawerOpen(true)
          }}
          className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center">Department Name <ArrowUpDown className="w-3 h-3 ml-2 text-slate-400" /></div>
                </th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Department Head</th>
                <th className="px-6 py-4">Parent Dept</th>
                <th className="px-6 py-4 text-right">Employees</th>
                <th className="px-6 py-4 text-right">Assets</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedDepartments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900">No departments found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                paginatedDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/organization/departments/${dept.id}`} className="font-semibold text-blue-600 hover:underline">
                        {dept.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{dept.code || '-'}</td>
                    <td className="px-6 py-4">
                      {dept.head ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-2">
                            {dept.head.name.charAt(0)}
                          </div>
                          <span>{dept.head.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {dept.parent ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {dept.parent.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">{dept._count?.members || 0}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">{dept._count?.assets || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        dept.active ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {dept.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {format(new Date(dept.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(dept)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggleStatus(dept)} className={`p-1.5 rounded-lg transition-colors ${dept.active ? 'text-slate-400 hover:text-yellow-600 hover:bg-yellow-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`} title={dept.active ? "Deactivate" : "Reactivate"}>
                          {dept.active ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(dept)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
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
              Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredDepartments.length)}</span> of <span className="font-medium text-slate-900">{filteredDepartments.length}</span> results
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

      <DepartmentDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        department={editingDepartment}
        departments={departments}
        employees={employees}
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
