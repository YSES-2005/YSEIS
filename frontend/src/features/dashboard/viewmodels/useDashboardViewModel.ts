import { useTransactionItems } from '@/hooks/useTransactionItems';
import { queryClient } from '@/lib/queryClient';
import { transactionService } from '@/services/transactionService';
import type { ItemPopulated } from '@yseis/shared/itemSchema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

export type ItemWithReturnDate = ItemPopulated & {
  returnDate: Date;
};

export type ItemWithTransactionId = ItemPopulated & {
  transactionId: string;
};

export function useDashboardViewModel() {
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactionsForMe(),
  });

  const {
    releasedTransactions,
    approvedTransactions,
    otherTransactions,
    transactionCounts,
  } = useMemo(() => {
    if (!transactions) {
      return {
        releasedTransactions: [],
        approvedTransactions: [],
        otherTransactions: [],
        transactionCounts: {},
      };
    }

    const counts: Record<string, number> = {};
    const released = [];
    const approved = [];
    const other = [];

    for (const t of transactions.transactions) {
      counts[t.approvalStatus] = (counts[t.approvalStatus] || 0) + 1;

      if (t.approvalStatus === 'released') {
        released.push(t);
      } else if (t.approvalStatus === 'approved') {
        approved.push(t);
      } else {
        other.push(t);
      }
    }

    return {
      releasedTransactions: released,
      approvedTransactions: approved,
      otherTransactions: other,
      transactionCounts: counts,
    };
  }, [transactions]);

  const transactionsToFetch = useMemo(
    () => [...releasedTransactions, ...approvedTransactions],
    [releasedTransactions, approvedTransactions]
  );

  const {
    itemMap,
    isLoading: itemsLoading,
    getItemId,
  } = useTransactionItems(transactionsToFetch);

  const currentlyInUseItems: ItemWithReturnDate[] = useMemo(() => {
    return releasedTransactions
      .map(t => {
        const id = getItemId(t);
        const item = id ? itemMap.get(id) : undefined;
        if (!item) return undefined;
        return { ...item, returnDate: new Date(t.returnDate) };
      })
      .filter((i): i is ItemWithReturnDate => i !== undefined);
  }, [releasedTransactions, getItemId, itemMap]);

  const readyForPickupItems: ItemWithTransactionId[] = useMemo(() => {
    return approvedTransactions
      .map(t => {
        const id = getItemId(t);
        if (!id) return undefined;
        const item = itemMap.get(id);
        if (!item) return undefined;
        return { ...item, transactionId: t.id };
      })
      .filter((i): i is ItemWithTransactionId => i !== undefined);
  }, [approvedTransactions, getItemId, itemMap]);

  const { mutate: markAsReleased } = useMutation({
    mutationFn: async (transactionId: string) => {
      return transactionService.updateTransaction(transactionId, {
        approvalStatus: 'released',
      });
    },
    onSuccess: () => {
      toast.success('Item marked as released');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const { mutate: cancelRequest } = useMutation({
    mutationFn: async (transactionId: string) => {
      return transactionService.updateTransaction(transactionId, {
        approvalStatus: 'cancelled',
      });
    },
    onSuccess: () => {
      toast.success('Request cancelled.');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  return {
    transactions: otherTransactions,
    currentlyInUseItems,
    readyForPickupItems,
    transactionCounts,
    isLoading: transactionsLoading || itemsLoading,
    markAsReleased,
    cancelRequest,
  } as const;
}
