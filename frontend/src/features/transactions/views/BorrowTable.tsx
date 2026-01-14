'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  TransactionPopulated as Transaction,
  TransactionPopulated,
} from '@schemas/transactionSchema';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';

type Props = {
  borrows: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenBorrowDetails: (borrow: TransactionPopulated) => void;
  onApproveBorrow: (borrow: TransactionPopulated) => void;
  onDisapproveBorrow: (borrow: TransactionPopulated) => void;
};

export function BorrowTable({
  borrows,
  currentPage,
  totalPages,
  onPageChange,
  onOpenBorrowDetails,
  onApproveBorrow,
  onDisapproveBorrow,
}: Props) {
  return (
    <div className="space-y-4 bg-card p-2 rounded-2xl">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Quantity Borrowed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrows.map(borrow => {
              const isAvailable =
                borrow.item.status === 'available' && borrow.item.quantity > 0;
              return (
                <TableRow
                  key={borrow.id}
                  onClick={() => {
                    onOpenBorrowDetails(borrow);
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* show initials for broken avatar links */}
                      <Avatar className="h-9 w-9 rounded-sm">
                        <AvatarImage
                          src={borrow.item.avatar}
                          alt={borrow.item.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-sm uppercase">
                          {borrow.item.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[20ch]">
                          {borrow.item.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[20ch]">
                          {borrow.item.location}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{borrow.borrower.name}</TableCell>
                  <TableCell className="capitalize">
                    {borrow.quantity}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={isAvailable ? 'success' : 'destructive'}
                      className="shadow-none"
                    >
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Show borrow button for non-admins, edit/delete for admins */}
                    <div className="flex justify-end gap-2">
                      <Button
                        disabled={!isAvailable}
                        size="icon"
                        variant="success"
                        onClick={() => {
                          onApproveBorrow(borrow);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                          onDisapproveBorrow(borrow);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
