import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { itemService } from '../services/itemService';

export function useItemsViewModel() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  // filter default state
  const [custodianFilter, setCustodianFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"available" | "unavailable" | null>('available');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['items', { search: debouncedSearch, typeFilter, statusFilter, custodianFilter, startDateFilter, endDateFilter, currentPage }],
    queryFn: () =>
      itemService.getItems({
        search: debouncedSearch || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        custodian: custodianFilter || undefined,
        startDate: startDateFilter || undefined,
        endDate: endDateFilter || undefined,
        page: currentPage,
        limit: itemsPerPage,
      }),
  });

  const items = useMemo(() => data?.data || [], [data?.data]);
  const totalPages = data?.pagination?.totalPages || 1;
  const totalItems = data?.pagination?.totalItems || 0;

  

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const uniqueTypes = useMemo(() => {
    const s = new Set<string>();
    items.forEach(i => i.type && s.add(i.type));
    return Array.from(s);
  }, [items]);

  return {
    items,
    isLoading,
    error,
    refetch,
    // controls
    search,
    setSearch,
    custodianFilter,
    setCustodianFilter,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    uniqueTypes,
    // pagination
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
  } as const;
}
