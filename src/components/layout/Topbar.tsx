"use client"

import { useState, useRef, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { LogOut, User, Bell, Settings, KeyRound, Building2 } from "lucide-react"

export function Topbar() {
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex flex-1 items-center justify-end space-x-6">
        <button className="text-slate-500 hover:text-slate-700 relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="relative border-l border-slate-200 pl-6" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 text-left focus:outline-none"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-medium text-slate-900 leading-tight">{session?.user?.name || 'User'}</span>
              <span className="text-xs text-slate-500">{session?.user?.role || 'Employee'}</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 border border-blue-200 transition-transform hover:scale-105 active:scale-95">
              <User className="h-5 w-5" />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-slate-100 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{session?.user?.name}</span>
                    <span className="text-xs text-slate-500">{session?.user?.email}</span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Role</span>
                    <span className="text-xs font-medium text-slate-700 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {session?.user?.role}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Department</span>
                    <span className="text-xs font-medium text-slate-700 flex items-center truncate" title={session?.user?.departmentId || 'Unassigned'}>
                      <Building2 className="w-3 h-3 mr-1 shrink-0" />
                      <span className="truncate">{session?.user?.departmentId ? 'Assigned' : 'Unassigned'}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="py-1">
                <a href="#" className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  Your Profile
                </a>
                <a href="#" className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Settings className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  Settings
                </a>
                <a href="#" className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <KeyRound className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  Change Password
                </a>
              </div>
              
              <div className="py-1">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
