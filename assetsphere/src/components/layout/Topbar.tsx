"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut, User, Bell } from "lucide-react"

export function Topbar() {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex flex-1 items-center justify-end space-x-6">
        <button className="text-slate-500 hover:text-slate-700 relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-slate-900">{session?.user?.name || 'User'}</span>
            <span className="text-xs text-slate-500">{session?.user?.role || 'Employee'}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User className="h-5 w-5" />
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="ml-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
