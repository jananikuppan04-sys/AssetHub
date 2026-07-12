import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/hooks/useSidebar';
import { ThemeToggle } from '@/components/design-system/ThemeToggle';
import NotificationDropdown from '@/components/navigation/NotificationDropdown';
import ProfileMenu from '@/components/navigation/ProfileMenu';

export default function Navbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
      {/* Mobile/Collapse toggle */}
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets, employees..."
            className="pl-8 h-9 bg-muted/40 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-1">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Settings quick link */}
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Profile */}
        <ProfileMenu />
      </div>
    </header>
  );
}
