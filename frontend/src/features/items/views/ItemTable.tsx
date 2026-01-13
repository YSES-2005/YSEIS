'use client';

import type { ItemPopulated as Item, ItemPopulated } from '@schemas/itemSchema';
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
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  Trash,
  SquarePen,
} from 'lucide-react';
import { getCustodianDisplay } from '@/lib/utils';
import { useUser } from '@/hooks/useUser';

type Props = {
  items: ItemPopulated[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBorrow: (item: Item) => void;
  onEdit: (item: Item) => void;
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
  onEdit,
  selectedItems,
  onToggleSelection,
  onToggleAll,
  showCheckboxes,
}: Props) {
  const { user } = useUser();
  const isAllAvailableSelected =
    items.length > 0 &&
    items
      .filter(item => item.status === 'available' && item.quantity > 0)
      .every(item => selectedItems.has(item.id!));

  return (
    <div className="space-y-4 bg-card p-2 rounded-2xl">
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
              const isAvailable =
                item.status === 'available' && item.quantity > 0;
              const itemId = item.id!;

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
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <Badge variant={'outline'} className="pl-0.5 pr-1.5">
                      {/* <Avatar className="size-4 rounded-full">
                        <AvatarImage src={item.custodian.avatar} />
                        <AvatarFallback className="rounded-lg text-[0.6rem]">
                          {item.custodian.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar> */}
                      {getCustodianDisplay(item.custodian)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={isAvailable ? 'success' : 'destructive'}
                      className="shadow-none"
                    >
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Show borrow button for non-admins, edit/delete for admins */}
                    {user?.role === 'admin' ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onEdit(item)}
                        >
                          <SquarePen className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        disabled={!isAvailable}
                        onClick={() => onBorrow(item)}
                      >
                        <CircleArrowDown />
                        Borrow
                      </Button>
                    )}
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
