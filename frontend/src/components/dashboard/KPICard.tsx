import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import type { TrendData } from '@/types/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export interface KPICardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: TrendData;
  colorStatus?: 'healthy' | 'warning' | 'critical' | 'info' | 'inactive';
  isLoading?: boolean;
  isCurrency?: boolean;
  isPercent?: boolean;
  tooltipText?: string;
  onClickRoute?: string;
  lastUpdated?: string;
}

const colorStyles = {
  healthy: 'text-green-600 bg-green-50 border-green-100',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-100',
  critical: 'text-red-600 bg-red-50 border-red-100',
  info: 'text-blue-600 bg-blue-50 border-blue-100',
  inactive: 'text-gray-600 bg-gray-50 border-gray-100',
};

const iconColorStyles = {
  healthy: 'text-green-600',
  warning: 'text-yellow-600',
  critical: 'text-red-600',
  info: 'text-blue-600',
  inactive: 'text-gray-600',
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorStatus = 'info',
  isLoading,
  isCurrency,
  isPercent,
  tooltipText,
  onClickRoute,
  lastUpdated,
}: KPICardProps) {
  const navigate = useNavigate();

  const handleFormat = (val: number) => {
    if (isCurrency) return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    if (isPercent) return `${Math.round(val)}%`;
    return Math.round(val).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-3 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      onClick={() => onClickRoute && navigate(onClickRoute)}
      className={cn(
        "relative overflow-hidden transition-all duration-200 group h-full flex flex-col",
        onClickRoute ? "cursor-pointer hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5" : ""
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </CardTitle>
          {tooltipText && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", colorStyles[colorStatus])}>
          <Icon className={cn("h-4 w-4", iconColorStyles[colorStatus])} />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="text-2xl font-bold tracking-tight">
          <AnimatedCounter value={value} formatFn={handleFormat} />
        </div>
        
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>
        )}

        {trend && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md",
              trend.isPositive === undefined 
                ? "text-muted-foreground bg-muted/50" 
                : trend.isPositive 
                  ? "text-green-700 bg-green-50" 
                  : "text-red-700 bg-red-50"
            )}>
              {trend.isPositive === undefined ? (
                <Minus className="h-3 w-3" />
              ) : trend.isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}%
              {trend.label && <span className="ml-1 text-muted-foreground/80 font-normal hidden sm:inline-block">{trend.label}</span>}
            </div>
            
            {lastUpdated && (
              <span className="text-[10px] text-muted-foreground/60 hidden sm:inline-block">
                {lastUpdated}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
