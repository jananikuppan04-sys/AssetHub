import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Search, 
  actionLabel, 
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed shadow-sm ${className}`}>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6 ring-8 ring-muted/30">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
