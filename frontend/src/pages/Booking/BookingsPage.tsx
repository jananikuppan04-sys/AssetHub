import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus, RefreshCw, Calendar, List, CheckCircle2, XCircle,
  Clock, MoreHorizontal, Eye
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { DataTable } from '@/components/data-table/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { workflowService } from '@/features/workflow/services/workflowService';
import type { Booking } from '@/types';
import type { TableColumn } from '@/types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------
// Booking Status Badge
// ---------------------------------------------------------------
function BookingStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
    Cancelled: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    Completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };
  const icons: Record<string, React.ReactNode> = {
    Pending: <Clock className="h-3 w-3" />,
    Approved: <CheckCircle2 className="h-3 w-3" />,
    Rejected: <XCircle className="h-3 w-3" />,
    Cancelled: <XCircle className="h-3 w-3" />,
    Completed: <CheckCircle2 className="h-3 w-3" />,
  };
  return (
    <Badge variant="outline" className={cn('gap-1 font-medium', styles[status] || 'bg-muted')}>
      {icons[status]}
      {status}
    </Badge>
  );
}

// ---------------------------------------------------------------
// Booking Form Dialog
// ---------------------------------------------------------------
const bookingSchema = z.object({
  resource: z.string().min(1, 'Resource is required'),
  startDate: z.string().min(1, 'Start date/time is required'),
  endDate: z.string().min(1, 'End date/time is required'),
  purpose: z.string().min(3, 'Purpose is required'),
});
type BookingFormValues = z.infer<typeof bookingSchema>;

function BookingFormDialog({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: BookingFormValues) => {
    setLoading(true);
    try {
      await workflowService.createBooking({
        asset: data.resource as any,
        startDate: data.startDate,
        endDate: data.endDate,
        purpose: data.purpose,
      });
      onSuccess();
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Resource Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Resource <span className="text-destructive">*</span></Label>
            <Input {...register('resource')} placeholder="e.g. Conference Room A" />
            {errors.resource && <p className="text-xs text-destructive">{errors.resource.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start Date & Time <span className="text-destructive">*</span></Label>
              <Input {...register('startDate')} type="datetime-local" />
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>End Date & Time <span className="text-destructive">*</span></Label>
              <Input {...register('endDate')} type="datetime-local" />
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Purpose <span className="text-destructive">*</span></Label>
            <Textarea {...register('purpose')} placeholder="What is the booking for?" rows={3} />
            {errors.purpose && <p className="text-xs text-destructive">{errors.purpose.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" type="button">Cancel</Button></DialogClose>
            <Button type="submit" disabled={loading}>{loading ? 'Booking...' : 'Confirm Booking'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------
// Calendar Grid View (Simple Month View)
// ---------------------------------------------------------------
function BookingCalendarView({ bookings }: { bookings: Booking[] }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const getBookingsForDay = (day: number) => {
    return bookings.filter(b => {
      const d = new Date(b.startDate);
      return d.getDate() === day && d.getMonth() === currentMonth;
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{monthNames[currentMonth]} {currentYear}</CardTitle>
        <CardDescription>Monthly booking overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[70px]" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dayBookings = getBookingsForDay(day);
            const isToday = day === today.getDate();
            return (
              <div
                key={day}
                className={cn(
                  'min-h-[70px] p-1.5 rounded-md border text-xs transition-colors hover:bg-muted/50',
                  isToday ? 'border-primary/50 bg-primary/5' : 'border-border/50'
                )}
              >
                <span className={cn('text-xs font-semibold block mb-1', isToday ? 'text-primary' : 'text-foreground')}>
                  {day}
                </span>
                {dayBookings.slice(0, 2).map(b => (
                  <div key={b._id} className={cn(
                    'text-[10px] rounded px-1 py-0.5 truncate mb-0.5',
                    b.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-700' :
                    b.status === 'Pending' ? 'bg-amber-500/20 text-amber-700' :
                    'bg-red-500/20 text-red-700'
                  )}>
                    {String(b.asset)}
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <div className="text-[10px] text-muted-foreground">+{dayBookings.length - 2} more</div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------
export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: workflowService.getBookings,
  });

  const refresh = useCallback(() => queryClient.invalidateQueries({ queryKey: ['bookings'] }), [queryClient]);

  const columns: TableColumn<Booking>[] = [
    {
      key: 'asset',
      header: 'Resource',
      sortable: true,
      render: (val) => <span className="font-medium">{String(val)}</span>,
    },
    {
      key: 'requestedBy',
      header: 'Requested By',
      render: (val) => String(val),
    },
    {
      key: 'startDate',
      header: 'Start',
      sortable: true,
      render: (val) => new Date(String(val)).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    },
    {
      key: 'endDate',
      header: 'End',
      render: (val) => new Date(String(val)).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    },
    {
      key: 'purpose',
      header: 'Purpose',
      render: (val) => <span className="text-muted-foreground text-xs">{String(val)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <BookingStatusBadge status={String(val)} />,
    },
    {
      key: '_id',
      header: 'Actions',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            {row.status === 'Pending' && (
              <>
                <DropdownMenuItem onClick={() => workflowService.approveBooking(row._id, true).then(refresh)} className="text-emerald-600">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => workflowService.approveBooking(row._id, false).then(refresh)} className="text-destructive">
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const stats = [
    { label: 'Total Bookings', value: bookings.length },
    { label: 'Pending', value: bookings.filter((b: Booking) => b.status === 'Pending').length },
    { label: 'Approved', value: bookings.filter((b: Booking) => b.status === 'Approved').length },
    { label: 'Rejected', value: bookings.filter((b: Booking) => b.status === 'Rejected').length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Resource Booking"
        description="Book conference rooms, projectors, and shared equipment."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
              aria-label="Toggle view"
            >
              {viewMode === 'list' ? <Calendar className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button onClick={() => setBookingOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Booking
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-5 pb-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        <BookingCalendarView bookings={bookings} />
      ) : (
        <DataTable
          columns={columns}
          data={bookings}
          isLoading={isLoading}
          emptyTitle="No bookings found"
          emptyActionLabel="New Booking"
          onEmptyAction={() => setBookingOpen(true)}
          searchKey="asset"
        />
      )}

      <BookingFormDialog open={bookingOpen} onClose={() => setBookingOpen(false)} onSuccess={refresh} />
    </div>
  );
}
