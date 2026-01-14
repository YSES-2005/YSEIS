import { itemService } from '@/services/itemService';
import type { ItemPopulated } from '@schemas/itemSchema';
import type { TransactionPopulated } from '@schemas/transactionSchema';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useTransactionItems(transactions: TransactionPopulated[]) {
  const getItemId = (t: TransactionPopulated): string | null => {
    if (!t.item) return null;
    return typeof t.item === 'object' ? t.item.id! : String(t.item);
  };

  const allItemIds = useMemo(() => {
    const ids = new Set<string>();
    transactions.forEach(t => {
      const id = getItemId(t);
      if (id) ids.add(id);
    });
    return Array.from(ids);
  }, [transactions]);

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

  const isLoading = itemQueries.some(q => q.isLoading);

  return { itemMap, isLoading, getItemId };
}
