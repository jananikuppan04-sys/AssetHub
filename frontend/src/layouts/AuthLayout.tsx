import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Brand header */}
      <header className="py-6 px-8">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-primary">
          <LayoutGrid className="h-6 w-6" />
          AssetHub
        </Link>
      </header>

      {/* Centered card */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border shadow-sm p-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} AssetHub. All rights reserved.
      </footer>
    </div>
  );
}
