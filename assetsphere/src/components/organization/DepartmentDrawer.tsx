"use client"

import { useState, useEffect } from "react"
import { X, Building2, Save } from "lucide-react"
import { createDepartment, updateDepartment } from "@/app/actions/organization"
import toast from "react-hot-toast"

export default function DepartmentDrawer({ 
  isOpen, 
  onClose, 
  department, 
  departments, 
  employees 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  department?: any,
  departments: any[],
  employees: any[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      if (department) {
        await updateDepartment(department.id, formData)
        toast.success("Department updated successfully")
      } else {
        await createDepartment(formData)
        toast.success("Department created successfully")
      }
      onClose()
    } catch (error: any) {
      toast.error(error.message || "An error occurred while saving the department")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {department ? "Edit Department" : "New Department"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="departmentForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department Name <span className="text-red-500">*</span></label>
              <input name="name" type="text" required defaultValue={department?.name} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm" placeholder="e.g. Human Resources" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department Code <span className="text-red-500">*</span></label>
              <input name="code" type="text" required defaultValue={department?.code} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm font-mono text-sm uppercase" placeholder="e.g. HR-001" />
              <p className="text-xs text-slate-500 mt-1.5">Must be a unique identifier for the department.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department Head</label>
              <select name="headId" defaultValue={department?.headId || ""} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white shadow-sm appearance-none cursor-pointer">
                <option value="">Unassigned</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Parent Department</label>
                <select name="parentId" defaultValue={department?.parentId || ""} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white shadow-sm appearance-none cursor-pointer">
                  <option value="">None (Top Level)</option>
                  {departments.filter(d => d.id !== department?.id).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                <select name="active" defaultValue={department ? (department.active ? "true" : "false") : "true"} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white shadow-sm appearance-none cursor-pointer">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea name="description" rows={3} defaultValue={department?.description} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none shadow-sm" placeholder="Brief description of the department's function..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                <input name="location" type="text" defaultValue={department?.location} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm" placeholder="e.g. Floor 3, HQ" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Email</label>
                <input name="email" type="email" defaultValue={department?.email} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm" placeholder="dept@company.com" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Phone</label>
              <input name="phone" type="tel" defaultValue={department?.phone} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm" placeholder="+1 (555) 000-0000" />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shadow-sm">
          <button type="button" onClick={onClose} className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-white focus:ring-2 focus:ring-slate-200 transition-all shadow-sm">
            Cancel
          </button>
          <button 
            type="submit" 
            form="departmentForm" 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {department ? "Update Department" : "Create Department"}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
