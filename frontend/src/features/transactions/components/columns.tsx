import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { TransactionPopulated } from '@schemas/transactionSchema';

export type Transaction = TransactionPopulated;

export const getColumns = (onView: (transaction: Transaction) => void): ColumnDef<Transaction>[] => [
    {
        accessorKey: 'id', // Mongoose virtual 'id'
        header: 'ID',
        cell: ({ row }) => <div className="font-medium truncate w-24" title={row.getValue('id')}>ID: {row.getValue('id')}</div>,
    },
    {
        accessorKey: 'item',
        header: 'Asset',
        cell: ({ row }) => {
            const item = row.original.item;
            return (
                <div className="flex items-center gap-3">
                    <img
                        src={item.avatar || 'https://placehold.co/400'}
                        alt={item.name}
                        className="h-10 w-10 rounded-md object-cover"
                    />
                    <span className="font-medium">{item.name}</span>
                </div>
            )
        }
    },
    {
        accessorKey: 'item.type',
        id: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.original.item.type;
            const isProperty = type === 'Property';
            return (
                <Badge variant={isProperty ? 'secondary' : 'default'} className={isProperty ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 shadow-none' : 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 shadow-none'}>
                    {type}
                </Badge>
            )
        }
    },
    {
        accessorKey: 'borrower.name',
        header: 'Borrower',
    },
    {
        accessorKey: 'updated_at', // Use updated_at
        header: 'Last Updated',
        cell: ({ row }) => {
            const dateStr = row.original.updated_at || row.original.created_at;
            if (!dateStr) return <div>N/A</div>;
            const date = new Date(dateStr);
            return <div>{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        }
    },
    {
        accessorKey: 'approvalStatus',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.approvalStatus;
            let className = '';

            switch (status) {
                case 'approved':
                    className = 'bg-green-100 text-green-800 hover:bg-green-100/80 shadow-none';
                    break;
                case 'disapproved':
                    className = 'bg-red-100 text-red-800 hover:bg-red-100/80 shadow-none';
                    break;
                case 'pending':
                    className = 'bg-orange-100 text-orange-800 hover:bg-orange-100/80 shadow-none';
                    break;
                default:
                    className = 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 shadow-none';
            }

            // Logic to determine display text and style (using returned boolean)
            let displayText = status.charAt(0).toUpperCase() + status.slice(1);
            if (row.original.returned) {
                displayText = 'Returned';
                className = 'bg-gray-500 text-white hover:bg-gray-500/80 shadow-none';
            }

            return (
                <Badge className={className}>
                    {displayText}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: 'View',
        cell: ({ row }) => {
            return (
                <Button
                    variant="default"
                    size="sm"
                    className="bg-sky-500 hover:bg-sky-600 w-16"
                    onClick={() => onView(row.original)}
                >
                    View
                </Button>
            );
        },
    },
];
