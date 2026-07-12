import React from 'react';
import { RefreshCw, Expand, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface WidgetContainerProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  isLoading?: boolean;
  onRefresh?: () => void;
  onExpand?: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function WidgetContainer({
  title,
  subtitle,
  icon: Icon,
  isLoading,
  onRefresh,
  onExpand,
  children,
  className,
  contentClassName,
}: WidgetContainerProps) {
  return (
    <Card className={cn('flex flex-col h-full overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 px-5 pt-5 border-b">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {subtitle && <CardDescription className="text-xs">{subtitle}</CardDescription>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />}
          
          {(onRefresh || onExpand) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onRefresh && (
                  <DropdownMenuItem onClick={onRefresh} className="cursor-pointer">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Refresh</span>
                  </DropdownMenuItem>
                )}
                {onExpand && (
                  <DropdownMenuItem onClick={onExpand} className="cursor-pointer">
                    <Expand className="mr-2 h-4 w-4" />
                    <span>Fullscreen</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn('flex-1 p-5 relative overflow-y-auto', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
