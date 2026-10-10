import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import type { TransactionPopulated } from '@yseis/shared/transactionSchema';
import { Badge } from '@/components/ui/badge';
import { type BadgeVariantKey } from '@/components/ui/badge.variants';
import { ChevronLeft, ChevronRight, CircleX, Clock2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  transactions: TransactionPopulated[];
  className: string;
  cancelRequest: (transactionId: string) => void;
};

const columns: ColumnDef<TransactionPopulated>[] = [
  {
    accessorKey: 'item',
    header: 'Item',
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-sm">
            <AvatarImage
              src={transaction.item.avatar}
              className="object-cover"
            />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium truncate max-w-[20ch]">
              {transaction.item.name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.approvalStatus;

      const statusVariantMap: Record<string, BadgeVariantKey> = {
        pending: 'soft-warning',
        disapproved: 'soft-destructive',
        cancelled: 'soft-secondary',
      };

      return (
        <Badge className="capitalize" variant={statusVariantMap[status]}>
          {status === 'pending' ? <Clock2 /> : <CircleX />}
          <span className="text-[0.6rem]">{status}</span>
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const transactionId = row.original.id;
      const meta = table.options.meta as {
        cancelRequest: (id: string) => void;
      };

      if (!transactionId) return;

      return (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                onClick={() => meta.cancelRequest(transactionId)}
              />
            }
          >
            <X />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[0.6rem]">I don't want this item anymore. :(</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
];

export function MyTransactionsTable({
  transactions,
  className,
  cancelRequest,
}: Props) {
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      cancelRequest,
    },
  });

  return (
    <div className={cn(' p-4 flex flex-col', className)}>
      <div className="overflow-hidden">
        <div className="flex place-items-center justify-between mb-4">
          <h2 className="text-xl font-light tracking-tighter">Your Requests</h2>
          <div className="flex items-center justify-end space-x-1 mt-auto">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow className="border-none" key={headerGroup.id}>
                {headerGroup.headers.map(header => {
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
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-none"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
