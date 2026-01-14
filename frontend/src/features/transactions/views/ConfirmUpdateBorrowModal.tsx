import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { TransactionPopulated } from '@schemas/transactionSchema';

type Props = {
  open: boolean;
  approvalStatus: 'approved' | 'disapproved';
  borrow: TransactionPopulated | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmUpdateBorrowModal({
  open,
  approvalStatus,
  borrow,
  onClose,
  onConfirm,
}: Props) {
  console.log(borrow);
  if (!borrow) return null;
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
            borrow request for "{borrow.item.name}" by {borrow.borrower?.name}?
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
