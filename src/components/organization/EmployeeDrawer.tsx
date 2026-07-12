"use client"

import { useState, useEffect } from "react"
import { X, UserCog, Save } from "lucide-react"
import { updateEmployee } from "@/app/actions/organization"
import toast from "react-hot-toast"

export default function EmployeeDrawer({ 
  isOpen, 
  onClose, 
  employee,
  departments
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  employee?: any,
  departments: any[]
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

  if (!isOpen || !employee) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      await updateEmployee(employee.id, formData)
      toast.success("Employee updated successfully")
      onClose()
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating the employee")
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
              <UserCog className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Edit Employee
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="employeeForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input name="name" type="text" required defaultValue={employee.name} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
              <input name="email" type="email" required defaultValue={employee.email} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee ID</label>
              <input name="employeeId" type="text" defaultValue={employee.employeeId || ""} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm font-mono text-sm uppercase" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role <span className="text-red-500">*</span></label>
                <select name="role" defaultValue={employee.role} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white shadow-sm appearance-none">
                  <option value="Employee">Employee</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Asset Manager">Asset Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                <select name="status" defaultValue={employee.status} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white shadow-sm appearance-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
              <select name="departmentId" defaultValue={employee.departmentId || ""} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white shadow-sm appearance-none">
                <option value="">Unassigned</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shadow-sm">
          <button type="button" onClick={onClose} className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-white focus:ring-2 focus:ring-slate-200 transition-all shadow-sm">
            Cancel
          </button>
          <button 
            type="submit" 
            form="employeeForm" 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Employee
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
