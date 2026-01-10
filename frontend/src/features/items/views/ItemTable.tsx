'use client';

import type { ItemPopulated as Item } from '@schemas/itemSchema';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  items: Item[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBorrow: (item: Item) => void;
  selectedItems: Set<string>;
  onToggleSelection: (itemId: string) => void;
  onToggleAll: () => void;
  showCheckboxes: boolean;
};

export function ItemTable({
  items,
  currentPage,
  totalPages,
  onPageChange,
  onBorrow,
  selectedItems,
  onToggleSelection,
  onToggleAll,
  showCheckboxes,
}: Props) {
  // helper to safely get custodian name
  const getCustodianDisplay = (custodian: Item['custodian']) => {
    if (!custodian) return '—';
    if (typeof custodian === 'string') return custodian;
    return custodian.name || custodian.email || '—';
  };

  const isAllAvailableSelected =
    items.length > 0 &&
    items
      .filter(item => item.status === 'available')
      .every(item => selectedItems.has(item.id!));

  return (
    <div className="space-y-4 bg-sidebar p-2 rounded-md">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {showCheckboxes && (
                <TableHead className="w-12.5 text-center">
                  <Checkbox
                    checked={isAllAvailableSelected}
                    onCheckedChange={() => onToggleAll()}
                    aria-label="Select all available"
                  />
                </TableHead>
              )}
              <TableHead>Asset</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Custodian</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => {
              const isAvailable = item.status === 'available';
              const itemId = item.id!;

              const typeLower = (item.type || '').toLowerCase();
              const typeVariant = typeLower.includes('suppl')
                ? 'secondary'
                : typeLower.includes('prop')
                  ? 'outline'
                  : 'default';

              return (
                <TableRow
                  key={itemId}
                  data-state={selectedItems.has(itemId) && 'selected'}
                >
                  {showCheckboxes && (
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedItems.has(itemId)}
                        onCheckedChange={() => onToggleSelection(itemId)}
                        disabled={!isAvailable}
                        aria-label={`Select ${item.name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* show initials for broken avatar links */}
                      <Avatar className="h-9 w-9 rounded-sm">
                        <AvatarImage
                          src={item.avatar}
                          alt={item.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-sm uppercase">
                          {item.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[20ch]">
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[20ch]">
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={typeVariant}
                      className="capitalize shadow-none"
                    >
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getCustodianDisplay(item.custodian)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={isAvailable ? 'outline' : 'destructive'}
                      className="shadow-none"
                    >
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      size="sm"
                      disabled={!isAvailable}
                      onClick={() => onBorrow(item)}
                    >
                      Borrow
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
            </PaginationItem>

            {/* mapping for <10 pages  */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default ItemTable;
