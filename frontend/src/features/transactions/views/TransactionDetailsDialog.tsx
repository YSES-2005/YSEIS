import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Transaction } from './columns';
import { Calendar, User, Hash, FileText, Layers } from 'lucide-react';

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const { id, item, borrower, quantity, returnDate, purpose } = transaction;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(returnDate));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-3xl p-0 gap-0 border-border overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Details for {item.name}</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2">
          <div className="bg-muted/30 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
            <div className="w-full max-w-sm mx-auto">
              <AspectRatio ratio={4 / 3}>
                <Avatar className="h-full w-full border bg-background shadow-sm">
                  <AvatarImage
                    src={item.avatar}
                    alt={item.name}
                    className="object-cover"
                  />
                  <AvatarFallback className=" text-5xl font-semibold text-muted-foreground/50 bg-muted">
                    {item.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </AspectRatio>
            </div>
          </div>

          <ScrollArea className="max-h-[85vh] md:max-h-[600px]">
            <div className="p-8 flex flex-col h-full">
              <div className="mb-6 space-y-1">
                <h3 className="font-bold text-2xl tracking-tight text-foreground">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Current Transaction Status
                </p>
              </div>

              <Separator className="mb-6" />

              <div className="grid gap-5">
                {/* Transaction ID */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="flex items-center gap-2 text-muted-foreground col-span-1">
                    <Hash className="h-4 w-4" /> ID
                  </Label>
                  <div className="col-span-2">
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs rounded-md px-2"
                    >
                      {id}
                    </Badge>
                  </div>
                </div>

                {/* Borrower */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="flex items-center gap-2 text-muted-foreground col-span-1">
                    <User className="h-4 w-4" /> Borrower
                  </Label>
                  <div className="col-span-2 font-medium text-sm text-foreground">
                    {borrower.name}
                  </div>
                </div>

                {/* Quantity */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="flex items-center gap-2 text-muted-foreground col-span-1">
                    <Layers className="h-4 w-4" /> Quantity
                  </Label>
                  <div className="col-span-2 font-medium text-sm text-foreground">
                    {quantity} unit{quantity > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Return Date */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="flex items-center gap-2 text-muted-foreground col-span-1">
                    <Calendar className="h-4 w-4" /> Return By
                  </Label>
                  <div className="col-span-2 font-medium text-sm text-foreground">
                    {formattedDate}
                  </div>
                </div>

                {/* Purpose */}
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label className="flex items-center gap-2 text-muted-foreground col-span-1 mt-0.5">
                    <FileText className="h-4 w-4" /> Purpose
                  </Label>
                  <div className="col-span-2 text-sm text-foreground leading-relaxed text-pretty">
                    {purpose}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

