import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { ItemWithTransactionId } from '@/features/dashboard/viewmodels/useDashboardViewModel';
import type { TransactionPopulated } from '@schemas/transactionSchema';

type Props = {
  open: boolean;
  approvalStatus: 'approved' | 'disapproved';
  borrow: TransactionPopulated | ItemWithTransactionId | null;
  onClose: () => void;
  onConfirm: () => void;
};

const getItemFromBorrow = (
  borrow: TransactionPopulated | ItemWithTransactionId | null
) => {
  if (!borrow) return null;

  if ('item' in borrow) {
    return borrow.item;
  }

  return borrow;
};

export function ConfirmUpdateBorrowModal({
  open,
  approvalStatus,
  borrow,
  onClose,
  onConfirm,
}: Props) {
  const targetItem = getItemFromBorrow(borrow);

  if (!borrow || !targetItem) return null;

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <div className="grid gap-4">
          <DialogTitle>
            {approvalStatus === 'approved' ? 'Approve' : 'Disapprove'} Borrow
            Request
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to{' '}
            {approvalStatus === 'approved' ? 'approve' : 'disapprove'} the
            borrow request for "<strong>{targetItem.name}</strong>" by{' '}
            {'borrower' in borrow ? borrow.borrower?.name : 'User'}?
          </DialogDescription>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={
                approvalStatus === 'approved' ? 'success' : 'destructive'
              }
              onClick={onConfirm}
            >
              {approvalStatus === 'approved' ? 'Approve' : 'Disapprove'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
