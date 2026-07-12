import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatMapProps {
  data: { date: string; count: number }[];
}

export function HeatMap({ data }: HeatMapProps) {
  // A simplistic grid-based heatmap, mimicking GitHub contribution graph
  // Assuming data is passed sorted ascending by date
  
  const getLevel = (count: number) => {
    if (count === 0) return 'bg-muted/30 border border-border/50';
    if (count < 5) return 'bg-primary/30';
    if (count < 10) return 'bg-primary/60';
    if (count < 15) return 'bg-primary/80';
    return 'bg-primary';
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid grid-flow-col grid-rows-7 gap-1">
        {data.map((day) => (
          <TooltipProvider key={day.date} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn("w-3 h-3 sm:w-4 sm:h-4 rounded-sm transition-colors", getLevel(day.count))} 
                />
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                {day.count} items on {day.date}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
