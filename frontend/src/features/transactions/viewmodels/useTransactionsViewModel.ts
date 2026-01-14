import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import { useUser } from '@/hooks/useUser';

export function useTransactionsViewModel() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Filters
    const [borrowerFilter, setBorrowerFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { user } = useUser();
    const isAdmin = user?.role === 'admin';

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [
            'transactions',
            {
                search: debouncedSearch,
                typeFilter,
                statusFilter,
                borrowerFilter,
                startDateFilter,
                endDateFilter,
                currentPage,
            },
        ],
        queryFn: async () => {
            if (isAdmin) {
                return transactionService.getTransactions({
                    status: statusFilter || undefined,
                    type: typeFilter || undefined,
                    borrower: borrowerFilter || undefined,
                    ...({
                        search: debouncedSearch || undefined,
                        startDate: startDateFilter || undefined,
                        endDate: endDateFilter || undefined,
                        page: currentPage,
                        limit: itemsPerPage,
                    } as any)
                });
            } else {
                return transactionService.getTransactionsForMe({
                    status: statusFilter || undefined,
                    type: typeFilter || undefined,
                    search: debouncedSearch || undefined,
                    startDate: startDateFilter || undefined,
                    endDate: endDateFilter || undefined,
                });
            }
        },
    });

    const transactions = useMemo(() => data?.transactions || [], [data?.transactions]);
    // Safely access pagination if it exists (it won't exist for regular users' getTransactionsForMe)
    const pagination = (data as any)?.pagination;
    const totalPages = pagination?.totalPages || 1;
    const totalItems = pagination?.totalItems || 0;

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
        return () => clearTimeout(t);
    }, [search]);

    const uniqueTypes = ['Property', 'Supplies'];

    return {
        transactions,
        isLoading,
        error,
        refetch,
        // Controls
        search,
        setSearch,
        borrowerFilter,
        setBorrowerFilter,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        startDateFilter,
        setStartDateFilter,
        endDateFilter,
        setEndDateFilter,
        uniqueTypes,
        // Pagination
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
    } as const;
}
