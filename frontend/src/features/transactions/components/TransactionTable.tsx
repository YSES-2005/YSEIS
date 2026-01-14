import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function TransactionTable<TData, TValue>({
    columns,
    data,
    currentPage,
    totalPages,
    onPageChange,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: !!totalPages, // Enable manual pagination if totalPages is provided
        pageCount: totalPages ?? -1,
    });

    return (
        <div className='space-y-4'>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (onPageChange && currentPage) {
                            onPageChange(currentPage - 1);
                        } else {
                            table.previousPage();
                        }
                    }}
                    disabled={onPageChange && currentPage ? currentPage <= 1 : !table.getCanPreviousPage()}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center text-sm font-medium">
                    <Button variant="default" size="sm" className="h-8 w-8 p-0">
                        {currentPage || (table.getState().pagination.pageIndex + 1)}
                    </Button>
                    {(totalPages || table.getPageCount()) > 1 && (
                        <span className="ml-2 text-muted-foreground">
                            / {totalPages || table.getPageCount()}
                        </span>
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        if (onPageChange && currentPage) {
                            onPageChange(currentPage + 1);
                        } else {
                            table.nextPage();
                        }
                    }}
                    disabled={
                        onPageChange && currentPage && totalPages
                            ? currentPage >= totalPages
                            : !table.getCanNextPage()
                    }
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
