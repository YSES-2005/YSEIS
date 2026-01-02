import { useState } from 'react';
import type { Item as SchemaItem, ItemPopulated as Item } from '@schemas/itemSchema';
import { useItemsViewModel } from '../viewmodels/useItemsViewModel';
import ItemTable from './ItemTable';
import { BorrowModal } from './BorrowModal';
import { MultiBorrowModal } from './MultiBorrowModal';
import type { BorrowFormData, MultiBorrowFormState } from '../validation/borrowValidation';

export function ItemsView() {
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
  const [tempStatus, setTempStatus] = useState<"available" | "unavailable" | null>('available');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const [borrowOpen, setBorrowOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [multiBorrowOpen, setMultiBorrowOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [multiBorrowForm, setMultiBorrowForm] = useState<MultiBorrowFormState>({
    fullName: '',
    items: [],
    returnDate: '',
    purpose: '',
    urgent: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const normalizeToSchemaItem = (item: Item): SchemaItem => ({
    ...item,
    custodian: typeof item.custodian === 'string' ? item.custodian : item.custodian?.name || '',
  });

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

  const handleOpenBorrow = (item: Item) => {
    setSelectedItem(item);
    setBorrowOpen(true);
  };

  const handleCloseBorrow = () => {
    setBorrowOpen(false);
    setSelectedItem(null);
  };

  const handleBorrowSubmit = (data: BorrowFormData) => {
    console.log('Borrow request:', data);
    // TODO: Send to API
    handleCloseBorrow();
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
    const availableItems = items.filter(item => item.status === 'available');
    const allSelected = availableItems.every(item => selectedItems.has(item.id!));
    
    if (allSelected) {
      // unselect all
      setSelectedItems(new Set());
    } else {
      // select all available items
      const allIds = new Set(availableItems.map(item => item.id!));
      setSelectedItems(allIds);
    }
  };

  const handleOpenMultiBorrow = () => {
    const selected = items.filter(item => selectedItems.has(item.id!));
    setMultiBorrowForm({
      fullName: '',
      items: selected.map(item => ({ item: normalizeToSchemaItem(item), quantity: 1 })),
      returnDate: '',
      purpose: '',
      urgent: false,
    });
    setCurrentImageIndex(0);
    setMultiBorrowOpen(true);
  };

  const handleCloseMultiBorrow = () => {
    setMultiBorrowOpen(false);
    setShowCheckboxes(false);
    setSelectedItems(new Set());
  };

  const handleMultiBorrowSubmit = (data: MultiBorrowFormState) => {
    // TODO: Send multi-borrow data to API
    void data; // placeholder to avoid unused warning until wired
    handleCloseMultiBorrow();
  };

  const handleUpdateItemQuantity = (itemId: string, delta: number) => {
    setMultiBorrowForm(prev => ({
      ...prev,
      items: prev.items.map(entry =>
        entry.item.id! === itemId
          ? { ...entry, quantity: Math.max(1, entry.quantity + delta) }
          : entry
      ),
    }));
  };

  const handleAddItemToMultiBorrow = (item: Item) => {
    const itemId = item.id!;
    const normalizedItem = normalizeToSchemaItem(item);
    setSelectedItems(prev => new Set(prev).add(itemId));
    setShowCheckboxes(true);
    
    setMultiBorrowForm(prev => {
      const exists = prev.items.some(entry => entry.item.id! === itemId);
      if (!exists) {
        return {
          ...prev,
          items: [...prev.items, { item: normalizedItem, quantity: 1 }]
        };
      }
      return prev;
    });
    
    // close modal to show inventory list with checkboxes
    setMultiBorrowOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg 
            className="w-6 h-6" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          <h1 className="text-2xl font-semibold">Inventory</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="w-[400px] border border-input rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => showFilterPanel ? setShowFilterPanel(false) : handleOpenFilterPanel()}
              className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
              </svg>
              Filter
            </button>
            
            {showFilterPanel && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-4 z-10">
                <h3 className="text-lg font-semibold mb-4">Filter</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Custodian
                  </label>
                  <input
                    type="text"
                    value={tempCustodian}
                    onChange={(e) => setTempCustodian(e.target.value)}
                    placeholder="Enter custodian name"
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={tempType || ''}
                    onChange={(e) => setTempType(e.target.value || null)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Any</option>
                    {uniqueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={tempStatus || ''}
                    onChange={(e) => setTempStatus((e.target.value as 'available' | 'unavailable') || null)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Any</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Last Updated
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-muted-foreground text-sm shrink-0">to</span>
                    <input
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-foreground border border-input rounded-lg hover:bg-muted transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleOpenMultiBorrow}
            disabled={items.filter(item => item.status === 'available').length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-opacity hover:opacity-90 ${
              items.filter(item => item.status === 'available').length === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Multi Borrow {selectedItems.size > 0 && `(${selectedItems.size})`}
          </button>
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
          selectedItems={selectedItems}
          onToggleSelection={handleToggleSelection}
          onToggleAll={handleToggleAll}
          showCheckboxes={showCheckboxes}
        />
      )}

      <BorrowModal
        open={borrowOpen}
        item={selectedItem}
        onSubmit={handleBorrowSubmit}
        onClose={handleCloseBorrow}
      />

      <MultiBorrowModal
        open={multiBorrowOpen}
        availableItems={items.filter(item => item.status === 'available')}
        form={multiBorrowForm}
        currentImageIndex={currentImageIndex}
        onFormChange={setMultiBorrowForm}
        onImageIndexChange={setCurrentImageIndex}
        onAddItem={handleAddItemToMultiBorrow}
        onUpdateItemQuantity={handleUpdateItemQuantity}
        onSubmit={handleMultiBorrowSubmit}
        onClose={handleCloseMultiBorrow}
      />
    </div>
  );
}

export default ItemsView;
