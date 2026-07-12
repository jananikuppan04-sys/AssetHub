import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBox({
  value,
  onChange,
  placeholder = 'Search...',
  isLoading = false,
  className,
  autoFocus = false,
}: SearchBoxProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="absolute left-3 text-muted-foreground">
        {isLoading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <Search className="h-4 w-4" />
        }
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-9 pr-9 h-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
