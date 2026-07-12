import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, MoreVertical, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';
import type { ChartDataPoint } from '@/types/analytics';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  dataForExport?: ChartDataPoint[];
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  isLoading,
  isEmpty,
  error,
  onRefresh,
  dataForExport = [],
  children,
  className,
}: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportCSV = () => {
    if (!dataForExport || dataForExport.length === 0) return;
    const keys = Object.keys(dataForExport[0]);
    const csvContent = [
      keys.join(','),
      ...dataForExport.map(row => keys.map(k => `"${row[k]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`;
    link.click();
  };

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-full w-full rounded-md" />;
    }
    if (error) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-center p-4">
          <p className="text-sm text-destructive mb-3">{error}</p>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>Retry</Button>
          )}
        </div>
      );
    }
    if (isEmpty) {
      return (
        <EmptyState 
          title="No data available" 
          description="There is not enough data to render this chart for the selected period." 
          className="h-full py-4 scale-90"
        />
      );
    }
    return children;
  };

  return (
    <Card className={cn('flex flex-col h-[400px]', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b px-5 pt-5">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {subtitle && <CardDescription className="text-xs">{subtitle}</CardDescription>}
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading || isEmpty || !!error}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
              </DropdownMenuItem>
              {/* Note: SVG/PNG export would require html2canvas or similar, omitting for complexity but UI is ready */}
              <DropdownMenuItem onClick={() => alert("PNG Export requires additional setup (e.g. html2canvas).")}>
                <ImageIcon className="mr-2 h-4 w-4" /> Download PNG
              </DropdownMenuItem>
              {onRefresh && (
                <DropdownMenuItem onClick={onRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-5 min-h-[0] relative" ref={chartRef}>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
