import React from 'react';
import { Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Maintenance, Audit } from '@/types';

interface CalendarWidgetProps {
  maintenance?: Maintenance[];
  audits?: Audit[];
  isLoading?: boolean;
}

export function CalendarWidget({ maintenance = [], audits = [], isLoading }: CalendarWidgetProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2"><Skeleton className="h-5 w-32" /></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
    );
  }

  // Very simplified active events for today
  const activeEvents = 2; // placeholder

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Schedule
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {activeEvents} Events Today
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col xl:flex-row gap-4 items-center xl:items-start justify-center">
        <div className="scale-90 origin-top">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm bg-background"
          />
        </div>
        
        <div className="flex-1 w-full space-y-3 pt-2 xl:pt-0">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Agenda</h4>
          
          <div className="space-y-2">
            <div className="flex gap-2 p-2 rounded-md bg-muted/50 border text-sm">
              <Clock className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium leading-none mb-1">Server Maintenance</p>
                <p className="text-xs text-muted-foreground">10:00 AM - 12:00 PM</p>
              </div>
            </div>
            <div className="flex gap-2 p-2 rounded-md bg-muted/50 border text-sm">
              <CalendarIcon className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium leading-none mb-1">IT Dept Audit</p>
                <p className="text-xs text-muted-foreground">02:00 PM - 04:00 PM</p>
              </div>
            </div>
            
            <button className="text-xs font-medium flex items-center gap-1 text-primary hover:underline mt-2 w-full justify-end">
              View Full Calendar <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
