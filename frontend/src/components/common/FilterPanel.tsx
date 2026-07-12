import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { FilterState, SelectOption } from '@/types';

interface FilterConfig {
  key: keyof FilterState;
  label: string;
  type: 'select' | 'date';
  options?: SelectOption[];
}

interface FilterPanelProps {
  filters: Partial<FilterState>;
  config: FilterConfig[];
  onChange: (key: keyof FilterState, value: string | undefined) => void;
  onClear: () => void;
  hasActive?: boolean;
}

export function FilterPanel({ filters, config, onChange, onClear, hasActive }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {config.map((f) =>
        f.type === 'select' && f.options ? (
          <Select
            key={String(f.key)}
            value={(filters[f.key] as string) ?? ''}
            onValueChange={(v) => onChange(f.key, v === '__all__' ? undefined : v)}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All {f.label}</SelectItem>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : f.type === 'date' ? (
          <Input
            key={String(f.key)}
            type="date"
            value={(filters[f.key] as string) ?? ''}
            onChange={(e) => onChange(f.key, e.target.value || undefined)}
            className="h-9 w-40"
            title={f.label}
          />
        ) : null
      )}
      {hasActive && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-9 gap-1">
          <X className="h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
