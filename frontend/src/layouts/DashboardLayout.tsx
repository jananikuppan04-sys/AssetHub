import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Sidebar from '@/components/navigation/Sidebar';
import Navbar from '@/components/navigation/Navbar';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-col flex-1 overflow-hidden transition-all duration-300',
          sidebarCollapsed ? 'md:ml-0' : 'md:ml-0'
        )}
      >
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-4">
            <Breadcrumb />
          </div>
          <main className="px-6 pb-6 pt-2">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
