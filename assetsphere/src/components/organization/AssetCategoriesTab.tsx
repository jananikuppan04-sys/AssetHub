"use client"

import { useState, useMemo } from "react"
import { Tags, Plus, Edit2, Ban, CheckCircle2, Trash2, Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown, Box } from "lucide-react"
import toast from "react-hot-toast"
import CategoryDrawer from "./CategoryDrawer"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { deleteCategory, updateCategory } from "@/app/actions/organization"

export default function AssetCategoriesTab({ categories }: { categories: any[] }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Dialog
  const [dialogConfig, setDialogConfig] = useState<{isOpen: boolean, type: any, title: string, message: string, action: () => void}>({
    isOpen: false, type: "danger", title: "", message: "", action: () => {}
  })

  // Derived Data
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = (cat.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
                            (cat.code?.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? cat.active : !cat.active
      return matchesSearch && matchesStatus
    })
  }, [categories, searchQuery, statusFilter])

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleEdit = (cat: any) => {
    setEditingCategory(cat)
    setIsDrawerOpen(true)
  }

  const handleToggleStatus = (cat: any) => {
    const actionName = cat.active ? "Deactivate" : "Reactivate"
    setDialogConfig({
      isOpen: true,
      type: cat.active ? "warning" : "info",
      title: `${actionName} Category`,
      message: `Are you sure you want to ${actionName.toLowerCase()} ${cat.name}? Only active categories can be used when registering new assets.`,
      action: async () => {
        try {
          const formData = new FormData()
          formData.append("name", cat.name)
          if(cat.code) formData.append("code", cat.code)
          formData.append("warrantyPeriodMonths", cat.warrantyPeriodMonths.toString())
          formData.append("defaultMaintenanceFrequency", cat.defaultMaintenanceFrequency.toString())
          if(cat.icon) formData.append("icon", cat.icon)
          if(cat.metadata) formData.append("metadata", cat.metadata)
          formData.append("active", (!cat.active).toString())

          await updateCategory(cat.id, formData)
          toast.success(`Category ${actionName.toLowerCase()}d successfully`)
        } catch (error: any) {
          toast.error(error.message || `Failed to ${actionName.toLowerCase()} category`)
        }
      }
    })
  }

  const handleDelete = (cat: any) => {
    if (cat._count.assets > 0) {
      toast.error("Cannot delete a category that has assets assigned to it.")
      return
    }
    
    setDialogConfig({
      isOpen: true,
      type: "danger",
      title: "Delete Category",
      message: `Are you sure you want to permanently delete the ${cat.name} category? This cannot be undone.`,
      action: async () => {
        try {
          await deleteCategory(cat.id)
          toast.success("Category deleted successfully")
        } catch (error: any) {
          toast.error(error.message || "Failed to delete category")
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
              placeholder="Search categories by name or code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null)
            setIsDrawerOpen(true)
          }}
          className="w-full sm:w-auto flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center">Category Name <ArrowUpDown className="w-3 h-3 ml-2 text-slate-400" /></div>
                </th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4 text-right">Default Warranty</th>
                <th className="px-6 py-4 text-right">Maint. Freq</th>
                <th className="px-6 py-4 text-right">Total Assets</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Tags className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-900">No categories found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Box className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{cat.code || '-'}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{cat.warrantyPeriodMonths} mos</td>
                    <td className="px-6 py-4 text-right text-slate-600">{cat.defaultMaintenanceFrequency} mos</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">{cat._count.assets}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cat.active ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {cat.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(cat)} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggleStatus(cat)} className={`p-1.5 rounded-lg transition-colors ${cat.active ? 'text-slate-400 hover:text-yellow-600 hover:bg-yellow-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`} title={cat.active ? "Deactivate" : "Reactivate"}>
                          {cat.active ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(cat)} 
                          disabled={cat._count.assets > 0}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent" 
                          title={cat._count.assets > 0 ? "Cannot delete category in use" : "Delete"}
                        >
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
              Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredCategories.length)}</span> of <span className="font-medium text-slate-900">{filteredCategories.length}</span> results
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

      <CategoryDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        category={editingCategory}
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
