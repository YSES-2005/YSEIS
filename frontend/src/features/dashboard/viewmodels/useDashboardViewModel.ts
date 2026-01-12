import { queryClient } from '@/lib/queryClient';
import { itemService } from '@/services/itemService';
import { transactionService } from '@/services/transactionService';
import type { ItemPopulated } from '@schemas/itemSchema';
import type { TransactionPopulated } from '@schemas/transactionSchema';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export type ItemWithReturnDate = ItemPopulated & {
  returnDate: Date;
};

export type ItemWithTransactionId = ItemPopulated & {
  transactionId: string;
};

export function useDashboardViewModel() {
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);

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

    for (const t of transactions) {
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

  const getItemId = (t: TransactionPopulated): string | null => {
    if (!t.item) return null;
    return typeof t.item === 'object' ? t.item.id! : String(t.item);
  };

  const allItemIds = useMemo(() => {
    const ids = new Set<string>();
    [...releasedTransactions, ...approvedTransactions].forEach(t => {
      const id = getItemId(t);
      if (id) ids.add(id);
    });
    return Array.from(ids);
  }, [releasedTransactions, approvedTransactions]);

  const itemQueries = useQueries({
    queries: allItemIds.map(id => ({
      queryKey: ['item', id],
      queryFn: () => itemService.getItemById(id),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const itemMap = useMemo(() => {
    const map = new Map<string, ItemPopulated>();
    itemQueries.forEach(q => {
      if (q.data) map.set(q.data.id!, q.data);
    });
    return map;
  }, [itemQueries]);

  const currentlyInUseItems: ItemWithReturnDate[] = useMemo(() => {
    return releasedTransactions
      .map(t => {
        const id = getItemId(t);
        const item = id ? itemMap.get(id) : undefined;

        if (!item) return undefined;

        return {
          ...item,
          returnDate: new Date(t.returnDate),
        };
      })
      .filter((i): i is ItemWithReturnDate => i !== undefined);
  }, [releasedTransactions, itemMap]);

  const readyForPickupItems: ItemWithTransactionId[] = useMemo(() => {
    return approvedTransactions
      .map(t => {
        const id = getItemId(t);
        if (!id) return undefined;

        const item = itemMap.get(id);

        if (!item) return undefined;

        return {
          ...item,
          transactionId: t.id,
        };
      })
      .filter((i): i is ItemWithTransactionId => i !== undefined);
  }, [approvedTransactions, itemMap]);

  const itemsLoading = itemQueries.some(q => q.isLoading);

  const { mutate: markAsReleased } = useMutation({
    mutationFn: async (transactionId: string) => {
      console.log(transactionId);
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

  return {
    transactions: otherTransactions,
    currentlyInUseItems,
    readyForPickupItems,
    transactionCounts,
    isLoading: transactionsLoading || itemsLoading,
    currentItemIndex,
    setCurrentItemIndex,
    markAsReleased,
  } as const;
}
