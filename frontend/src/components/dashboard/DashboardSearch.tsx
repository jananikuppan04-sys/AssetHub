import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export function DashboardSearch() {
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = e.currentTarget.value;
      if (q) navigate(`/assets?search=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search assets, departments, employees..."
        className="w-full pl-9 bg-background/50 border-primary/20 focus-visible:ring-primary/30"
        onKeyDown={handleSearch}
      />
    </div>
  );
}
