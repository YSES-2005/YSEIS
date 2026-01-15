import { useAdminDashboardViewModel } from '../../viewmodels/useAdminDashboardViewModel';
import { AdminScheduledPickups } from './AdminScheduledPickups';
import { AdminScheduledReturns } from './AdminScheduledReturns';
import { AdminPendingApprovals } from './AdminPendingApprovals';
import { AdminLowStocks } from './AdminLowStocks';
import { AdminInventoryStats } from './AdminInventoryStats';
import { AdminMostBorrowedItem } from './AdminMostBorrowedItem';
import { AdminBorrowingTrends } from './AdminBorrowingTrends';

export function AdminDashboardView() {
  const {
    pendingItems,
    toPickupItems,
    lowStockItems,
    pickupDate,
    toReturnItems,
    mostBorrowedItem,
    borrowingTrends,
    borrowingTrendsGroupBy,
    inventoryStats,
    setPickupDate,
    approveRequest,
    disapproveRequest,
    setBorrowingTrendsGroupBy,
  } = useAdminDashboardViewModel();

  return (
    <div className="flex flex-col xl:grid grid-cols-12 grid-rows-18  p-6 gap-2 *:rounded-2xl xl:h-full">
      <AdminBorrowingTrends
        borrowingTrends={borrowingTrends}
        groupBy={borrowingTrendsGroupBy}
        setGroupBy={setBorrowingTrendsGroupBy}
        className="col-span-8 row-span-9 row-start-2 col-start-1  not-xl:p-2 not-xl:pt-0 not-xl:bg-card/40"
      />
      <div className="col-span-8 row-span-1 col-start-1 row-start-1">
        <AdminMostBorrowedItem item={mostBorrowedItem} />
      </div>
      <AdminLowStocks
        items={lowStockItems}
        className=" xs:max-xl:aspect-video col-span-4 row-span-6 col-start-9 border-b"
      />
      <AdminInventoryStats
        stats={inventoryStats}
        className="col-span-4 row-span-8 col-start-5 row-start-11"
      />
      <AdminPendingApprovals
        className="col-span-4 row-span-8 col-start-1 row-start-11"
        items={pendingItems}
        disapprove={disapproveRequest}
        approve={approveRequest}
      />
      <AdminScheduledPickups
        className="col-span-4 row-span-6 col-start-9 border-b rounded-none!"
        approvedItems={toPickupItems}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
      />
      <AdminScheduledReturns
        className="col-span-4 row-span-6 col-start-9 rounded-none!"
        toReturnItems={toReturnItems}
      />
    </div>
  );
}
