'use client';

import { ReplaceIcon } from 'lucide-react';
import { useBorrowsViewModel } from '../viewmodels/useBorrowsViewModel';
import { BorrowTable } from './BorrowTable';
import { useState } from 'react';
import type { TransactionPopulated } from '@schemas/transactionSchema';
import { OpenBorrowModal } from './OpenBorrowModal';

export function BorrowRequestsView() {
  const { borrows, isLoading, currentPage, setCurrentPage, totalPages } =
    useBorrowsViewModel();

  const [borrowDetailsOpen, setBorrowDetailsOpen] = useState(false);
  const [selectedBorrow, setSelectedBorrow] =
    useState<TransactionPopulated | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<
    'approved' | 'rejected' | null
  >(null);

  const handleOpenBorrowDetails = (borrow: TransactionPopulated) => {
    setSelectedBorrow(borrow);
    setBorrowDetailsOpen(true);
  };

  const handleCloseBorrowDetails = () => {
    setSelectedBorrow(null);
    setBorrowDetailsOpen(false);
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
        />
      )}
      <OpenBorrowModal
        open={borrowDetailsOpen}
        borrow={selectedBorrow!}
        onClose={handleCloseBorrowDetails}
      />
    </div>
  );
}
