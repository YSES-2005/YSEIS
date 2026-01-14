import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import type {
  TransactionPopulated as Transaction,
  TransactionUpdate as TransactionUpdatePayload,
} from '@schemas/transactionSchema';
import { toast } from 'sonner';
import { useState } from 'react';

export function useUpdateTransactionViewModel({
  transaction,
  onSuccess,
}: {
  transaction: Transaction | null;
  onSuccess?: (t: Transaction) => void;
}) {
  console.log(transaction);
  const queryClient = useQueryClient();
  const [approvalStatus, setApprovalStatus] = useState<
    'approved' | 'disapproved'
  >('approved');
  const updateTransactionMutation = useMutation({
    mutationFn: (data: { id: string; payload: TransactionUpdatePayload }) =>
      transactionService.updateTransaction(data.id, data.payload),
    onSuccess: (data: Transaction) => {
      // refresh related queries so UI updates (lists, dashboards, etc.)
      void queryClient.refetchQueries({ queryKey: ['borrows'], type: 'all' });
      toast.success('Transaction updated successfully');
      onSuccess?.(data);
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any).message
          : 'Failed to update transaction';
      toast.error(message);
    },
  });

  const updateTransaction = () => {
    if (!transaction?.id) return;
    updateTransactionMutation.mutate({
      id: transaction.id,
      payload: {
        approvalStatus: approvalStatus,
      },
    });
  };

  return {
    updateTransaction,
    isUpdating: updateTransactionMutation.isPending,
    approvalStatus,
    setApprovalStatus,
  } as const;
}
