import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableSkeleton } from '@/components/common/Skeletons';
import { EmptyState } from '@/components/common/EmptyState';
import { DataTablePagination } from './DataTablePagination';
import { DataTableToolbar } from './DataTableToolbar';
import type { TableColumn } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface DataTableProps<T extends { _id?: string; id?: string }> {
  columns: TableColumn<T>[];
  data: T[] | null;
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  className?: string;
  searchKey?: string; // which column to search on locally
  // Legacy backward-compatibility props
  total?: number;
  searchValue?: string;
  onSearchChange?: any;
  emptyModule?: string;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: any;
  onPageSizeChange?: any;
  onSortChange?: any;
}

export function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  isLoading = false,
  error,
  emptyTitle = 'No data found',
  emptyActionLabel,
  onEmptyAction,
  className,
  searchKey = 'assetName'
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Map legacy TableColumn to Tanstack ColumnDef
  const tanstackColumns = useMemo<ColumnDef<T, any>[]>(() => {
    return columns.map((col) => ({
      accessorKey: col.key as string,
      header: ({ column }) => {
        if (!col.sortable) return <span className={cn('text-xs font-semibold uppercase tracking-wide', col.className)}>{col.header}</span>;
        
        return (
          <div
            className={cn('flex items-center gap-1 cursor-pointer select-none text-xs font-semibold uppercase tracking-wide hover:text-foreground transition-colors', col.className)}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {col.header}
            {{
              asc: <ChevronUp className="h-3.5 w-3.5" />,
              desc: <ChevronDown className="h-3.5 w-3.5" />,
            }[column.getIsSorted() as string] ?? (
              <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
            )}
          </div>
        );
      },
      cell: ({ row, getValue }) => {
        if (col.render) {
          return col.render(getValue(), row.original);
        }
        return <div className={cn('text-sm', col.className)}>{String(getValue() ?? '—')}</div>;
      },
      enableSorting: !!col.sortable,
    }));
  }, [columns]);

  const table = useReactTable({
    data: data || [],
    columns: tanstackColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading && !data) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div className="rounded-lg border p-8 text-center text-sm text-destructive">{error}</div>;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <DataTableToolbar table={table} searchKey={searchKey} />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tanstackColumns.length}
                  className="h-24 text-center p-0"
                >
                  <EmptyState
                    title={emptyTitle}
                    description="No records found matching your filters."
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
