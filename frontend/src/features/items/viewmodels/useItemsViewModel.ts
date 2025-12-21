import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { itemService } from '../services/itemService';
import type { Item } from '@schemas/itemSchema';

export function useItemsViewModel() {
  const { data: items = [], isLoading, error, refetch } = useQuery({
    queryKey: ['items'],
    queryFn: itemService.getItems,
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  // filter default state
  const [custodianFilter, setCustodianFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>('available');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filteredItems = useMemo(() => {
    if (!items) return [] as Item[];

    return items.filter(item => {
      // exclude deleted items
      if (item.status === 'deleted') return false;

      // search filter
      const matchesSearch = debouncedSearch
        ? (item.name || '')
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        : true;

      // custodian filter
      const matchesCustodian = custodianFilter
        ? (item.custodian || '')
            .toLowerCase()
            .includes(custodianFilter.toLowerCase())
        : true;

      // type filter
      const matchesType = typeFilter ? item.type === typeFilter : true;

      // status filter
      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      // date range filter
      let matchesDateRange = true;
      if (startDateFilter || endDateFilter) {
        const dateValue = item.updated_at || item.created_at;
        if (!dateValue) return true; // skip items without dates
        const itemDate = new Date(dateValue);
        if (startDateFilter) {
          const startDate = new Date(startDateFilter);
          matchesDateRange = matchesDateRange && itemDate >= startDate;
        }
        if (endDateFilter) {
          const endDate = new Date(endDateFilter);
          endDate.setHours(23, 59, 59, 999); // include the entire end date
          matchesDateRange = matchesDateRange && itemDate <= endDate;
        }
      }

      return matchesSearch && matchesCustodian && matchesType && matchesStatus && matchesDateRange;
    });
  }, [items, debouncedSearch, custodianFilter, typeFilter, statusFilter, startDateFilter, endDateFilter]);
  
  const uniqueTypes = useMemo(() => {
    const s = new Set<string>();
    items.forEach(i => i.type && s.add(i.type));
    return Array.from(s);
  }, [items]);

  // pagination 
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  // reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, custodianFilter, typeFilter, statusFilter, startDateFilter, endDateFilter]);

  return {
    items: paginatedItems,
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
    totalItems: filteredItems.length,
  } as const;
}
