'use client';

import { ReplaceIcon } from 'lucide-react';
import { useBorrowsViewModel } from '../viewmodels/useBorrowsViewModel';
import { BorrowTable } from './BorrowTable';
import { useState } from 'react';
import type { TransactionPopulated } from '@schemas/transactionSchema';
import { OpenBorrowModal } from './OpenBorrowModal';
import { useUpdateTransactionViewModel } from '../viewmodels/useUpdateTransactionViewModel';
import { ConfirmUpdateBorrowModal } from './ConfirmUpdateBorrowModal';

export function BorrowRequestsView() {
  const { borrows, isLoading, currentPage, setCurrentPage, totalPages } =
    useBorrowsViewModel();

  const [borrowDetailsOpen, setBorrowDetailsOpen] = useState(false);
  const [selectedBorrow, setSelectedBorrow] =
    useState<TransactionPopulated | null>(null);
  const [confirmUpdateBorrowOpen, setConfirmUpdateBorrowOpen] = useState(false);
  const handleOpenBorrowDetails = (borrow: TransactionPopulated) => {
    setSelectedBorrow(borrow);
    setBorrowDetailsOpen(true);
  };

  const handleCloseBorrowDetails = () => {
    setSelectedBorrow(null);
    setBorrowDetailsOpen(false);
  };

  const handleConfirmUpdateBorrowSuccess = () => {
    setConfirmUpdateBorrowOpen(false);
    handleCloseBorrowDetails();
  };

  const { updateTransaction, approvalStatus, setApprovalStatus } =
    useUpdateTransactionViewModel({
      transaction: selectedBorrow,
      onSuccess: handleConfirmUpdateBorrowSuccess,
    });

  const handleOpenApproveBorrow = (borrow: TransactionPopulated) => {
    setSelectedBorrow(borrow);
    setApprovalStatus('approved');
    setConfirmUpdateBorrowOpen(true);
  };

  const handleOpenDisapproveBorrow = (borrow: TransactionPopulated) => {
    setSelectedBorrow(borrow);
    setApprovalStatus('disapproved');
    setConfirmUpdateBorrowOpen(true);
  };

  const handleCloseBorrowUpdate = () => {
    setConfirmUpdateBorrowOpen(false);
    setSelectedBorrow(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReplaceIcon className="h-6 w-6" />
          <h1>Borrow Requests</h1>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <BorrowTable
          borrows={borrows}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onOpenBorrowDetails={handleOpenBorrowDetails}
          onApproveBorrow={handleOpenApproveBorrow}
          onDisapproveBorrow={handleOpenDisapproveBorrow}
        />
      )}
      <OpenBorrowModal
        open={borrowDetailsOpen}
        borrow={selectedBorrow!}
        onClose={handleCloseBorrowDetails}
      />
      <ConfirmUpdateBorrowModal
        open={confirmUpdateBorrowOpen}
        approvalStatus={approvalStatus!}
        borrow={selectedBorrow}
        onClose={handleCloseBorrowUpdate}
        onConfirm={() => {
          if (selectedBorrow) {
            updateTransaction();
          }
        }}
      />
    </div>
  );
}
