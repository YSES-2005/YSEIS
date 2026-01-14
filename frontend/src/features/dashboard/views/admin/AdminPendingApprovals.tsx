import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, getCustodianDisplay } from '@/lib/utils';
import type { ItemWithTransactionId } from '../../viewmodels/useDashboardViewModel';
import { useState } from 'react';
import { ConfirmUpdateBorrowModal } from '@/features/transactions/views/ConfirmUpdateBorrowModal';

type Props = {
  items: ItemWithTransactionId[];
  className: string;
  disapprove: (transactionId: string) => void;
  approve: (transactionId: string) => void;
};

const columns: ColumnDef<ItemWithTransactionId>[] = [
  {
    accessorKey: 'item',
    header: 'Item',
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="rounded-sm">
            <AvatarImage src={item.avatar} className="object-cover" />
          </Avatar>
          <div className="flex flex-col">
            <div className="truncate max-w-[20ch]">{item.name}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'borrower',
    header: 'Borrower',
    cell: ({ row }) => {
      const custodian = row.original.custodian;

      if (!custodian) return;

      return (
        <Badge variant={'outline'} className="pl-0.5 pr-1.5 font-normal">
          <Avatar className="size-4 rounded-full">
            <AvatarImage src={custodian.avatar} />
            <AvatarFallback className="rounded-lg text-[0.6rem]">
              {custodian.name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {getCustodianDisplay(custodian)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const transaction = row.original;
      const meta = table.options.meta as {
        disapprove: (transaction: ItemWithTransactionId) => void;
        approve: (transaction: ItemWithTransactionId) => void;
      };

      if (!transaction) return;

      return (
        <div className="flex gap-0.5 place-items-center">
          <Button
            size="icon-sm"
            variant="destructive"
            className="rounded-full"
            onClick={() => meta.disapprove(transaction)}
          >
            <X />
          </Button>

          <Button
            size="icon-sm"
            variant="success"
            className="rounded-full"
            onClick={() => meta.approve(transaction)}
          >
            <CheckCheck />
          </Button>
        </div>
      );
    },
  },
];

export function AdminPendingApprovals({
  items,
  className,
  disapprove,
  approve,
}: Props) {
  const [selectedItem, setSelectedItem] =
    useState<ItemWithTransactionId | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    'approved' | 'disapproved' | null
  >('approved');

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      approve: (transaction: ItemWithTransactionId) => {
        setSelectedItem(transaction);
        setApprovalStatus('approved');
      },
      disapprove: (transaction: ItemWithTransactionId) => {
        setSelectedItem(transaction);
        setApprovalStatus('disapproved');
      },
    },
  });

  return (
    <div
      className={cn(
        ' p-4 flex flex-col bg-muted/40 dark:bg-muted/10',
        className
      )}
    >
      <div className="overflow-hidden">
        <div className="flex place-items-center justify-between mb-4">
          <h2 className="text-xl font-light tracking-tighter">
            Pending Approvals
          </h2>
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

      <ConfirmUpdateBorrowModal
        open={!!selectedItem}
        approvalStatus={approvalStatus!}
        borrow={selectedItem}
        onClose={() => {
          setSelectedItem(null);
        }}
        onConfirm={() => {
          if (!selectedItem) return;
          if (!selectedItem.id) return;

          if (approvalStatus === 'approved') {
            approve(selectedItem.id);
          } else if (approvalStatus === 'disapproved') {
            disapprove(selectedItem.id);
          }
        }}
      />
    </div>
  );
}
