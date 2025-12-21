import type { Item } from '@schemas/itemSchema';

type Props = {
  items: Item[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBorrow: (item: Item) => void;
  selectedItems: Set<string>;
  onToggleSelection: (itemId: string) => void;
  onToggleAll: () => void;
  showCheckboxes: boolean;
};

export function ItemTable({ items, currentPage, totalPages, onPageChange, onBorrow, selectedItems, onToggleSelection, onToggleAll, showCheckboxes }: Props) {
  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-white rounded shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showCheckboxes && (
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={items.filter(item => item.status === 'available').every(item => selectedItems.has((item as any).id || (item as any)._id))}
                  onChange={onToggleAll}
                />
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custodian</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map(item => {
            const isAvailable = item.status === 'available';
            const itemId = (item as any).id || (item as any)._id;
            const isSelected = selectedItems.has(itemId);

            return (
              <tr key={itemId}>
                {showCheckboxes && (
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelection(itemId)}
                      disabled={!isAvailable}
                      className="rounded"
                    />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                  <img src={item.avatar} alt="" className="w-10 h-10 rounded object-cover" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.location ?? ''}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full" 
                  style={{ fontWeight: 550, backgroundColor: '#FFFD80', color: '#867D00' }}
                  >{item.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{(item.custodian as any)?.name ?? item.custodian ?? '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.status === 'available' ? (
                    <span className="text-xs px-2 py-1 rounded-full"
                    style={{ fontWeight: 550, backgroundColor: '#C1FFA0', color: '#116D11' }}
                    >Available</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full"
                    style={{ fontWeight: 550, backgroundColor: '#FF6987', color: '#6D1113' }}
                    >Unavailable</span>
                  )}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    type="button"
                    disabled={!isAvailable}
                    className={`px-3 py-1 rounded font-semibold text-white transition-colors ${
                      isAvailable
                        ? 'bg-sky-500 hover:bg-sky-600'
                        : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                    }`}
                    onClick={() => isAvailable && onBorrow(item)}
                  >
                    Borrow
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4 border-t">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemTable;
