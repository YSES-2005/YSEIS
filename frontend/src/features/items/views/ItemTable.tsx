"use client";

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
  showCheckboxes 
}: Props) {
  
  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  };

  const isAllAvailableSelected = items.length > 0 && 
    items.filter(item => item.status === 'available').every(item => selectedItems.has(item.id!));

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {showCheckboxes && (
              <TableHead className="w-10 text-center">
                <Checkbox
                  checked={isAllAvailableSelected}
                  onCheckedChange={() => onToggleAll()}
                />
              </TableHead>
            )}
            <TableHead>Asset</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Custodian</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => {
            const isAvailable = item.status === 'available';
            const itemId = item.id!;
            const typeLower = (item.type || '').toLowerCase();
            const typeVariant = typeLower.includes('suppl') ? 'info' : typeLower.includes('prop') ? 'warning' : 'default';

            return (
              <TableRow key={itemId}>
                {showCheckboxes && (
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedItems.has(itemId)}
                      onCheckedChange={() => onToggleSelection(itemId)}
                      disabled={!isAvailable}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} alt="" className="size-8 rounded object-cover shrink-0" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground">{item.location}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Badge variant={typeVariant as any} className="capitalize">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {typeof item.custodian === 'object'
                    ? item.custodian?.name ?? item.custodian?.email ?? '—'
                    : item.custodian ?? '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={isAvailable ? "outline" : "destructive"}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4 border-t">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ItemTable;