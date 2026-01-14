import { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';

export function useBorrowsViewModel() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['borrows', { status: 'pending', currentPage }], // stable key
    queryFn: () =>
      transactionService.getTransactions({
        status: 'pending',
        page: currentPage,
        limit: itemsPerPage,
      }),
  });

  // Memoize transactions array for convenience, optional
  const borrows = useMemo(() => data?.transactions ?? [], [data?.transactions]);

  const queryClient = useQueryClient();

  // Refetch borrows when items query changes (e.g. status or quantity updates)
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event: any) => {
      const key = event?.query?.queryKey;
      if (Array.isArray(key) && key[0] === 'items') {
        void refetch();
      }
    });
    return () => unsubscribe();
  }, [queryClient, refetch]);

  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalBorrows = data?.pagination?.totalItems ?? 0;

  return {
    borrows,
    isLoading,
    error,
    refetch,
    totalPages,
    totalBorrows,
    currentPage,
    setCurrentPage,
  } as const;
}
