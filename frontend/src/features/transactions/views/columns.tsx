import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpDown } from 'lucide-react';
import type { TransactionPopulated } from '@schemas/transactionSchema';
import type { BadgeVariantKey } from '@/components/ui/badge.variants';

export type Transaction = TransactionPopulated;

const getStatusVariant = (
  status: string,
  isReturned: boolean
): BadgeVariantKey => {
  if (isReturned) return 'secondary';

  switch (status) {
    case 'approved':
      return 'success';
    case 'disapproved':
      return 'destructive';
    case 'pending':
      return 'warning';
    case 'released':
      return 'soft';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const getColumns = (
  onView: (transaction: Transaction) => void
): ColumnDef<Transaction>[] => [
  {
    accessorKey: 'item',
    header: 'Asset',
    cell: ({ row }) => {
      const item = row.original.item;

      if (!item) {
        return (
          <span className="text-muted-foreground italic">Item Deleted</span>
        );
      }

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-md border">
            <AvatarImage
              src={item.avatar}
              alt={item.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-md">
              {item.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{item.name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'item.type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.item?.type || 'Unknown';
      const isProperty = type === 'Property';
      return (
        <Badge
          variant={isProperty ? 'secondary' : 'outline'}
          className="capitalize font-normal"
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'borrower.name',
    header: 'Borrower',
    cell: ({ row }) => {
      return (
        row.original.borrower?.name || (
          <span className="text-muted-foreground">Unknown User</span>
        )
      );
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-ml-4 h-8 data-[state=open]:bg-accent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.original.updated_at || row.original.created_at;
      if (!dateStr)
        return <div className="text-muted-foreground text-xs">N/A</div>;

      const date = new Date(dateStr);
      return (
        <div className="text-sm">
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.approvalStatus;
      const isReturned = row.original.returned;
      const variant = getStatusVariant(status, isReturned);

      let displayText = status.charAt(0).toUpperCase() + status.slice(1);
      if (isReturned) {
        displayText = 'Returned';
      }

      return <Badge variant={variant}>{displayText}</Badge>;
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          size="xs"
          onClick={() => onView(row.original)}
        >
          View
        </Button>
      );
    },
  },
];
