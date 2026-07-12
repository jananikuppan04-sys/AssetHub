import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className,
  delay = 300 
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync external value to local state
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the actual onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [localValue, delay, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={cn("relative flex items-center max-w-sm w-full", className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-9 pr-9 bg-background h-10 w-full focus-visible:ring-1 transition-shadow"
      />
      {localValue && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
