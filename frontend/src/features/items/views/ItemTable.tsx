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

export function ItemTable({ items, currentPage, totalPages, onPageChange, onBorrow, selectedItems, onToggleSelection, onToggleAll, showCheckboxes }: Props) {
  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {showCheckboxes && (
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={items.length > 0 && items.filter(item => item.status === 'available').every(item => selectedItems.has(item.id!))}
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
            const isSelected = selectedItems.has(itemId);
            const typeLower = (item.type || '').toLowerCase();
            const typeVariant: 'info' | 'warning' | 'default' = typeLower.includes('suppl')
              ? 'info'
              : typeLower.includes('prop')
                ? 'warning'
                : 'default';

            return (
              <TableRow key={itemId}>
                {showCheckboxes && (
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(itemId)}
                      disabled={!isAvailable}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} alt="" className="w-10 h-10 rounded object-cover" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.location ?? ''}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Badge variant={typeVariant} className="font-medium text-[11px] px-3 py-1">
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {typeof item.custodian === 'object'
                    ? item.custodian?.name ?? item.custodian?.email ?? '—'
                    : item.custodian ?? '—'}
                </TableCell>
                <TableCell>
                  {item.status === 'available' ? (
                    <Badge variant="success" className="text-xs font-semibold px-3 py-1">Available</Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs font-semibold px-3 py-1">Unavailable</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button
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
        <div className="flex items-center justify-center gap-2 py-4 border-t border-border">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ItemTable;
