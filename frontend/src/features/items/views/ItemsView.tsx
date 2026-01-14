'use client';

import { useState } from 'react';
import type { ItemPopulated as Item } from '@schemas/itemSchema';
import { useItemsViewModel } from '../viewmodels/useItemsViewModel';
import { useBorrowViewModel } from '../viewmodels/useBorrowViewModel';
import { useMultiBorrowViewModel } from '../viewmodels/useMultiBorrowViewModel';
import ItemTable from './ItemTable';
import { BorrowModal } from './BorrowModal';
import { MultiBorrowModal } from './MultiBorrowModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Package, Search, Filter, Layers, Plus } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useCreateItemViewModel } from '../viewmodels/useCreateItemViewModel';
import { CreateItemModal } from './CreateItemModal';
import { useEditItemViewModel } from '../viewmodels/useEditItemViewModel';
import { EditItemModal } from './EditItemModal';
import { useDeleteViewModel } from '../viewmodels/useDeleteViewModel';
import DeleteItemModal from './DeleteItemModal';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

export function ItemsView() {
  const { user } = useUser();
  const {
    items,
    isLoading,
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
    currentPage,
    setCurrentPage,
    totalPages,
  } = useItemsViewModel();

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [tempCustodian, setTempCustodian] = useState('');
  const [tempType, setTempType] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<
    'available' | 'unavailable' | null
  >(null);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const [borrowOpen, setBorrowOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [multiBorrowOpen, setMultiBorrowOpen] = useState(false);
  const [createItemOpen, setCreateItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const availableItems = items.filter(
    item => item.status === 'available' && item.quantity > 0
  );

  const handleBorrowSuccess = () => {
    setBorrowOpen(false);
    setSelectedItem(null);
  };

  const {
    form: borrowForm,
    errors: borrowErrors,
    setField: setBorrowField,
    submit: submitBorrow,
    reset: resetBorrow,
    isLoading: isBorrowing,
  } = useBorrowViewModel({
    item: selectedItem,
    onSuccess: handleBorrowSuccess,
  });

  const handleOpenBorrow = (item: Item) => {
    setSelectedItem(item);
    resetBorrow();
    setBorrowOpen(true);
  };

  const handleCloseBorrow = () => {
    setBorrowOpen(false);
    setSelectedItem(null);
    resetBorrow();
  };

  const handleMultiBorrowSuccess = () => {
    setMultiBorrowOpen(false);
    setShowCheckboxes(false);
    setSelectedItems(new Set());
  };

  const {
    form: multiBorrowForm,
    errors: multiBorrowErrors,
    setField: setMultiBorrowField,
    updateItemQuantity,
    addItem,
    submit: submitMultiBorrow,
    reset: resetMultiBorrow,
    currentImageIndex,
    setCurrentImageIndex,
    syncWithSelection,
  } = useMultiBorrowViewModel({
    onSuccess: handleMultiBorrowSuccess,
  });

  const handleOpenMultiBorrow = () => {
    const itemsToAdd = items.filter(item => selectedItems.has(item.id!));
    syncWithSelection(itemsToAdd);
    setMultiBorrowOpen(true);
  };

  const handleCloseMultiBorrow = () => {
    setMultiBorrowOpen(false);
    setShowCheckboxes(false);
    setSelectedItems(new Set());
    resetMultiBorrow();
  };

  const handleToggleSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleToggleAll = () => {
    const allSelected = availableItems.every(item =>
      selectedItems.has(item.id!)
    );
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(availableItems.map(item => item.id!)));
    }
  };

  const handleAddItemToMultiBorrow = (item: Item) => {
    addItem(item);
    setSelectedItems(prev => new Set(prev).add(item.id!));
    setShowCheckboxes(true);
  };

  const handleOpenFilterPanel = () => {
    setTempCustodian(custodianFilter);
    setTempType(typeFilter);
    setTempStatus(statusFilter);
    setTempStartDate(startDateFilter);
    setTempEndDate(endDateFilter);
    setShowFilterPanel(true);
  };

  const handleApplyFilters = () => {
    setCustodianFilter(tempCustodian);
    setTypeFilter(tempType);
    setStatusFilter(tempStatus);
    setStartDateFilter(tempStartDate);
    setEndDateFilter(tempEndDate);
    setShowFilterPanel(false);
  };

  const handleResetFilters = () => {
    setTempCustodian('');
    setTempType(null);
    setTempStatus('available');
    setTempStartDate('');
    setTempEndDate('');
  };

  const handleCreateItemSuccess = () => {
    setCreateItemOpen(false);
    resetCreateItem();
  };

  const {
    form: createItemForm,
    errors: createItemErrors,
    setField: setCreateItemField,
    submit: submitCreateItem,
    reset: resetCreateItem,
    isLoading: isCreatingItem,
  } = useCreateItemViewModel({
    onSuccess: handleCreateItemSuccess,
  });

  const handleOpenCreateItem = () => {
    resetCreateItem();
    setCreateItemOpen(true);
  };

  const handleCloseCreateItem = () => {
    setCreateItemOpen(false);
    resetCreateItem();
  };

  const editItemSuccess = () => {
    setEditItemOpen(false);
    resetEditItem();
  };

  const {
    form: editItemForm,
    errors: editItemErrors,
    setField: setEditItemField,
    submit: submitEditItem,
    reset: resetEditItem,
  } = useEditItemViewModel({
    item: selectedItem,
    onSuccess: editItemSuccess,
  });

  const handleOpenEditItem = (item: Item) => {
    setSelectedItem(item);
    resetEditItem();
    setEditItemOpen(true);
  };

  const handleCloseEditItem = () => {
    setEditItemOpen(false);
    setSelectedItem(null);
    resetEditItem();
  };

  const { deleteItem, isDeleting } = useDeleteViewModel();

  const handleDeleteItem = (item: Item) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteItem(itemToDelete.id!);
    setDeleteOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1>Inventory</h1>
        </div>

        <div className="flex items-center gap-3">
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
                  <FieldLabel htmlFor="custodian">Custodian</FieldLabel>
                  <Input
                    id="custodian"
                    value={tempCustodian}
                    onChange={e => setTempCustodian(e.target.value)}
                    placeholder="Enter custodian name"
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
                          {type.charAt(0).toUpperCase() +
                            type.slice(1).toLowerCase()}
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
                      setTempStatus(
                        val === 'any'
                          ? null
                          : (val as 'available' | 'unavailable')
                      )
                    }
                  >
                    <SelectTrigger id="status" size="sm">
                      <SelectValue className="capitalize" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
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

          {/* Show multi-borrow button for non-admin users */}
          {user?.role === 'admin' ? (
            <Button variant="neutral" onClick={handleOpenCreateItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          ) : (
            <Button
              onClick={handleOpenMultiBorrow}
              disabled={availableItems.length == 0}
              variant={availableItems.length === 0 ? 'ghost' : 'neutral'}
            >
              <Layers className="mr-2 h-4 w-4" />
              Multi Borrow {selectedItems.size > 0 && `(${selectedItems.size})`}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <ItemTable
          items={items}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onBorrow={handleOpenBorrow}
          onEdit={handleOpenEditItem}
          onDelete={handleDeleteItem}
          selectedItems={selectedItems}
          onToggleSelection={handleToggleSelection}
          onToggleAll={handleToggleAll}
          showCheckboxes={showCheckboxes}
        />
      )}

      <BorrowModal
        open={borrowOpen}
        item={selectedItem}
        form={borrowForm}
        errors={borrowErrors}
        isBorrowing={isBorrowing}
        onSubmit={submitBorrow}
        onClose={handleCloseBorrow}
        setField={setBorrowField}
      />

      <MultiBorrowModal
        open={multiBorrowOpen}
        availableItems={availableItems}
        form={multiBorrowForm}
        errors={multiBorrowErrors}
        onSubmit={submitMultiBorrow}
        onClose={handleCloseMultiBorrow}
        setField={setMultiBorrowField}
        addItem={handleAddItemToMultiBorrow}
        updateItemQuantity={updateItemQuantity}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
      />

      <CreateItemModal
        open={createItemOpen}
        form={createItemForm}
        errors={createItemErrors}
        isCreating={isCreatingItem}
        onClose={handleCloseCreateItem}
        onSubmit={submitCreateItem}
        setField={setCreateItemField}
      />

      <EditItemModal
        open={editItemOpen}
        form={editItemForm}
        errors={editItemErrors}
        isCreating={false}
        onClose={handleCloseEditItem}
        onSubmit={submitEditItem}
        setField={setEditItemField}
      />

      <DeleteItemModal
        open={deleteOpen}
        item={itemToDelete}
        onClose={() => {
          setDeleteOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ItemsView;
