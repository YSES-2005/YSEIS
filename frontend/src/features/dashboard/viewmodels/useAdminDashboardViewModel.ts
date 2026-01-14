import { useTransactionItems } from '@/hooks/useTransactionItems';
import { queryClient } from '@/lib/queryClient';
import { transactionService } from '@/services/transactionService';
import { LOW_STOCK_THRESHOLD, type ItemPopulated } from '@schemas/itemSchema';
import type { TransactionPopulated } from '@schemas/transactionSchema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';
import type {
  ItemWithTransactionId,
  ItemWithReturnDate,
} from './useDashboardViewModel';
import { itemService } from '@/services/itemService';
import { analyticsService, type GroupBy } from '@/services/analyticsService';

export function useAdminDashboardViewModel() {
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [borrowingTrendsGroupBy, setBorrowingTrendsGroupBy] =
    useState<GroupBy>('day');

  const { data: lowStockData } = useQuery({
    queryKey: ['items'],
    queryFn: () =>
      itemService.getItems({
        quantity: -LOW_STOCK_THRESHOLD,
      }),
  });

  const { data: inventoryStats, isLoading: isLoadingInventoryStats } = useQuery(
    {
      queryKey: ['items', 'analytics', 'inventory-stats', 'transactions'],
      queryFn: () => itemService.getInventoryStats(),
    }
  );

  const lowStockItems = useMemo(
    () => lowStockData?.data ?? [],
    [lowStockData?.data]
  );

  const { data: pendingData, isLoading: isLoadingPending } = useQuery({
    queryKey: ['transactions', 'borrows', 'pending'],
    queryFn: () => transactionService.getTransactions({ status: 'pending' }),
  });

  const { data: approvedData, isLoading: isLoadingApproved } = useQuery({
    queryKey: ['transactions', 'borrows', 'approved'],
    queryFn: () =>
      transactionService.getTransactions({
        status: 'approved',
      }),
  });

  const { data: releasedData, isLoading: isLoadingReleased } = useQuery({
    queryKey: ['transactions', 'borrows', 'released'],
    queryFn: () => transactionService.getTransactions({ status: 'released' }),
  });

  const { data: mostBorrowedData, isLoading: isLoadingMostBorrowed } = useQuery(
    {
      queryKey: ['transactions', 'analytics', 'most-borrowed'],
      queryFn: () => transactionService.getMostBorrowedItem(),
    }
  );

  const { data: borrowingTrendsData, isLoading: isLoadingBorrowingTrends } =
    useQuery({
      queryKey: ['analytics', 'borrowing-trends', borrowingTrendsGroupBy],
      queryFn: () =>
        analyticsService.getBorrowingTrends({
          groupBy: borrowingTrendsGroupBy,
        }),
    });

  const pendingTransactions = useMemo(
    () => pendingData?.transactions ?? [],
    [pendingData?.transactions]
  );
  const approvedTransactions = useMemo(
    () => approvedData?.transactions ?? [],
    [approvedData?.transactions]
  );
  const releasedTransactions = useMemo(
    () => releasedData?.transactions ?? [],
    [releasedData?.transactions]
  );

  const allTransactions = useMemo(
    () => [
      ...pendingTransactions,
      ...approvedTransactions,
      ...releasedTransactions,
    ],
    [pendingTransactions, approvedTransactions, releasedTransactions]
  );

  const { itemMap, getItemId } = useTransactionItems(allTransactions);

  const getPopulatedItems = useCallback(
    (transactions: TransactionPopulated[]) => {
      return transactions
        .map(t => {
          const id = getItemId(t);
          if (!id) return undefined;
          return itemMap.get(id);
        })
        .filter((i): i is ItemPopulated => i !== undefined);
    },
    [getItemId, itemMap]
  );

  const pendingItems = useMemo(() => {
    return pendingTransactions
      .map(t => {
        const id = getItemId(t);
        if (!id) return undefined;
        return { ...itemMap.get(id), transactionId: t.id };
      })
      .filter((i): i is ItemWithTransactionId => i !== undefined);
  }, [pendingTransactions, getItemId, itemMap]);

  const approvedItems = useMemo(
    () => getPopulatedItems(approvedTransactions),
    [approvedTransactions, getPopulatedItems]
  );

  const releasedItems = useMemo(() => {
    return releasedTransactions
      .map(t => {
        const id = getItemId(t);
        if (!id) return undefined;

        const item = itemMap.get(id);
        if (!item) return undefined;

        return { ...item, returnDate: t.returnDate };
      })
      .filter((i): i is ItemWithReturnDate => i !== undefined);
  }, [releasedTransactions, getItemId, itemMap]);

  // 7. Mutations
  const { mutate: disapproveRequest, isPending: isDisapproving } = useMutation({
    mutationFn: (transactionId: string) =>
      transactionService.updateTransaction(transactionId, {
        approvalStatus: 'disapproved',
      }),
    onSuccess: () => {
      toast.success('Request disapproved.');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: error => toast.error(error.message),
  });

  const { mutate: approveRequest, isPending: isApproving } = useMutation({
    mutationFn: (transactionId: string) =>
      transactionService.updateTransaction(transactionId, {
        approvalStatus: 'approved',
      }),
    onSuccess: () => {
      toast.success('Request approved.');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: error => toast.error(error.message),
  });

  return {
    // Data
    pendingItems,
    toPickupItems: approvedItems,
    toReturnItems: releasedItems,
    lowStockItems,
    inventoryStats,
    mostBorrowedItem: mostBorrowedData ?? null,
    borrowingTrends: borrowingTrendsData?.data ?? [],

    // State
    pickupDate,
    setPickupDate,
    borrowingTrendsGroupBy,
    setBorrowingTrendsGroupBy,

    // Actions
    disapproveRequest,
    approveRequest,

    // Loading States (New: Crucial for UI feedback)
    isLoading:
      isLoadingPending ||
      isLoadingApproved ||
      isLoadingReleased ||
      isLoadingInventoryStats ||
      isLoadingMostBorrowed ||
      isLoadingBorrowingTrends,
    isMutating: isApproving || isDisapproving,
  } as const;
}
