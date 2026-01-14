import { useAdminDashboardViewModel } from '../../viewmodels/useAdminDashboardViewModel';
import { AdminScheduledPickups } from './AdminScheduledPickups';
import { AdminScheduledReturns } from './AdminScheduledReturns';
import { AdminPendingApprovals } from './AdminPendingApprovals';
import { AdminLowStocks } from './AdminLowStocks';
import { AdminInventoryStats } from './AdminInventoryStats';
import { AdminMostBorrowedItem } from './AdminMostBorrowedItem';

export function AdminDashboardView() {
  const {
    pendingItems,
    toPickupItems,
    lowStockItems,
    pickupDate,
    toReturnItems,
    mostBorrowedItem,
    setPickupDate,
    approveRequest,
    disapproveRequest,
    inventoryStats,
    isLoading,
  } = useAdminDashboardViewModel();

  return (
    <div className="flex flex-col xl:grid grid-cols-12 grid-rows-18 h-full p-6 gap-2 *:rounded-2xl">
      <AdminLowStocks
        items={lowStockItems}
        className="col-span-4 row-span-8 col-start-1 row-start-1"
      />
      <AdminInventoryStats
        stats={inventoryStats}
        isLoading={isLoading}
        className="col-span-4 row-span-6 col-start-5 row-start-3"
      />
      <AdminMostBorrowedItem
        item={mostBorrowedItem}
        className="col-span-4 row-span-2 col-start-5 row-start-1"
      />
      <AdminPendingApprovals
        className="col-span-4 row-span-4 col-start-9 border-b rounded-none! "
        items={pendingItems}
        disapprove={disapproveRequest}
        approve={approveRequest}
      />
      <AdminScheduledPickups
        className="col-span-4 row-span-7 col-start-9 border-b rounded-none! ml-auto min-w-80"
        approvedItems={toPickupItems}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
      />
      <AdminScheduledReturns
        className="col-span-4 row-span-7 col-start-9 rounded-none! ml-auto min-w-80"
        toReturnItems={toReturnItems}
      />
    </div>
  );
}
