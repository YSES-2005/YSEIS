import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field';
import type { TransactionPopulated } from '@schemas/transactionSchema';

type Props = {
  open: boolean;
  borrow: TransactionPopulated;
  onClose: () => void;
};

export function OpenBorrowModal({ open, borrow, onClose }: Props) {
  if (!borrow) return null;

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg p-8">
        <DialogHeader>
          <div className="mb-4 w-full flex justify-center">
            <div className="w-40 sm:w-48 md:w-56 aspect-square relative overflow-hidden rounded-md border bg-muted">
              <img
                src={borrow.item.avatar}
                alt={borrow.item.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <DialogTitle>Borrow Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Borrower
            </div>
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                {borrow.borrower?.avatar ? (
                  <AvatarImage
                    src={borrow.borrower.avatar}
                    alt={borrow.borrower.name}
                  />
                ) : (
                  <AvatarFallback>
                    {borrow.borrower?.name?.charAt(0) ?? 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <div className="text-sm font-medium">
                  {borrow.borrower?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {borrow.borrower?.email}
                </div>
              </div>
            </div>
          </div>
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field className="col-span-2">
              <FieldLabel>Item Name</FieldLabel>
              <FieldContent>
                <div className="text-sm text-white">{borrow.item?.name}</div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Borrow Quantity</FieldLabel>
              <FieldContent>
                <div className="text-sm">{borrow.quantity}</div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Item Quantity</FieldLabel>
              <FieldContent>
                <div className="text-sm">{borrow.item?.quantity}</div>
              </FieldContent>
            </Field>

            <Field className="col-span-2">
              <FieldLabel>Purpose</FieldLabel>
              <FieldContent>
                <FieldDescription className="text-sm">
                  {borrow.purpose}
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Return Date</FieldLabel>
              <FieldContent>
                <div className="text-sm">
                  {borrow.returnDate
                    ? new Date(borrow.returnDate).toLocaleDateString()
                    : '—'}
                </div>
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
