"use client"

import { useState, useEffect } from "react"
import { X, Tags, Save } from "lucide-react"
import { createCategory, updateCategory } from "@/app/actions/organization"
import toast from "react-hot-toast"

export default function CategoryDrawer({ 
  isOpen, 
  onClose, 
  category 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  category?: any
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
      if (category) {
        await updateCategory(category.id, formData)
        toast.success("Category updated successfully")
      } else {
        await createCategory(formData)
        toast.success("Category created successfully")
      }
      onClose()
    } catch (error: any) {
      toast.error(error.message || "An error occurred while saving the category")
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
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shadow-inner">
              <Tags className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {category ? "Edit Category" : "New Category"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="categoryForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Name <span className="text-red-500">*</span></label>
              <input name="name" type="text" required defaultValue={category?.name} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all shadow-sm" placeholder="e.g. Laptops" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Code <span className="text-red-500">*</span></label>
              <input name="code" type="text" required defaultValue={category?.code} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all shadow-sm font-mono text-sm uppercase" placeholder="e.g. LAP-01" />
              <p className="text-xs text-slate-500 mt-1.5">Must be a unique identifier.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Default Warranty <span className="text-slate-400 font-normal">(Months)</span></label>
                <input name="warrantyPeriodMonths" type="number" min="0" required defaultValue={category?.warrantyPeriodMonths || 12} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maintenance Freq. <span className="text-slate-400 font-normal">(Months)</span></label>
                <input name="defaultMaintenanceFrequency" type="number" min="0" required defaultValue={category?.defaultMaintenanceFrequency || 6} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all shadow-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description / Metadata</label>
              <textarea name="metadata" rows={4} defaultValue={category?.metadata} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none shadow-sm" placeholder='{"brand": "Apple", "type": "Electronics"}' />
              <p className="text-xs text-slate-500 mt-1.5">Optional JSON metadata or simple description.</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
              <select name="active" defaultValue={category ? (category.active ? "true" : "false") : "true"} className="w-full px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-white shadow-sm appearance-none cursor-pointer">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
            form="categoryForm" 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
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
                {category ? "Update Category" : "Create Category"}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
