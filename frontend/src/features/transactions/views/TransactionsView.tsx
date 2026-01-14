import { useState, useMemo } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { type Transaction, getColumns } from './columns';
import { TransactionTable } from './TransactionTable';
import { TransactionDetailsDialog } from './TransactionDetailsDialog';

import { useTransactionsViewModel } from '../viewmodels/useTransactionsViewModel';

export function TransactionsView() {
  const {
    transactions,
    isLoading,
    error,
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
    currentPage,
    setCurrentPage,
    totalPages,
  } = useTransactionsViewModel();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = useMemo(
    () =>
      getColumns(transaction => {
        setSelectedTransaction(transaction);
        setIsDialogOpen(true);
      }),
    []
  );

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Temp state for filter panel
  const [tempBorrower, setTempBorrower] = useState('');
  const [tempType, setTempType] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<string | null>(null);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const handleOpenFilterPanel = () => {
    setTempBorrower(borrowerFilter);
    setTempType(typeFilter);
    setTempStatus(statusFilter);
    setTempStartDate(startDateFilter);
    setTempEndDate(endDateFilter);
    setShowFilterPanel(true);
  };

  const handleApplyFilters = () => {
    setBorrowerFilter(tempBorrower);
    setTypeFilter(tempType);
    setStatusFilter(tempStatus);
    setStartDateFilter(tempStartDate);
    setEndDateFilter(tempEndDate);
    setShowFilterPanel(false);
  };

  const handleResetFilters = () => {
    setTempBorrower('');
    setTempType(null);
    setTempStatus(null);
    setTempStartDate('');
    setTempEndDate('');
    setBorrowerFilter('');
    setTypeFilter(null);
    setStatusFilter(null);
    setStartDateFilter('');
    setEndDateFilter('');
    setShowFilterPanel(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1>Transactions</h1>
        </div>

        <div className="flex items-center gap-4">
          <InputGroup>
            <InputGroupInput
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="text-xs"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Popover open={showFilterPanel} onOpenChange={setShowFilterPanel}>
            <PopoverTrigger
              render={<Button variant="outline" />}
              onClick={() => {
                if (!showFilterPanel) handleOpenFilterPanel();
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="borrower">Borrower</FieldLabel>
                  <Input
                    id="borrower"
                    value={tempBorrower}
                    onChange={e => setTempBorrower(e.target.value)}
                    placeholder="Enter borrower name"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="type">Type</FieldLabel>
                  <Select
                    value={tempType || 'any'}
                    onValueChange={val =>
                      setTempType(val === 'any' ? null : val)
                    }
                  >
                    <SelectTrigger id="type" size="sm">
                      <SelectValue className="capitalize" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    value={tempStatus || 'any'}
                    onValueChange={val =>
                      setTempStatus(val === 'any' ? null : val)
                    }
                  >
                    <SelectTrigger id="status" size="sm">
                      <SelectValue className="capitalize" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="disapproved">Declined</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Last Updated</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={tempStartDate}
                      onChange={e => setTempStartDate(e.target.value)}
                    />
                    <span className="text-muted-foreground text-sm">to</span>
                    <Input
                      type="date"
                      value={tempEndDate}
                      onChange={e => setTempEndDate(e.target.value)}
                    />
                  </div>
                </Field>
              </FieldGroup>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleResetFilters}>
                  Reset
                </Button>
                <Button onClick={handleApplyFilters}>Apply</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-destructive font-medium">
            Failed to load transactions. Please try again.
          </div>
        </div>
      ) : (
        <TransactionTable
          columns={columns}
          data={transactions}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
