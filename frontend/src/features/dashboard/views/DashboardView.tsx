import { useDashboardViewModel } from '../viewmodels/useDashboardViewModel';
import { MyTransactionsTable } from './MyTransactionsTable';
import { Greetings } from './Greetings';
import { ReleasedItems } from './ReleasedItems';
import { ApprovedItems } from './ApprovedItems';
import { Calendar } from './Calendar';

export function DashboardView() {
  const {
    transactions,
    transactionCounts,
    currentlyInUseItems,
    readyForPickupItems,
    currentItemIndex,
    setCurrentItemIndex,
    markAsReleased,
  } = useDashboardViewModel();

  return (
    <div className="flex flex-col xl:grid grid-cols-12 grid-rows-12 h-full p-6 gap-2 *:rounded-2xl">
      <Greetings
        counts={transactionCounts}
        className="row-span-2 col-start-1 row-start-1 col-span-8 pb-6"
      />
      <div className="flex flex-col sm:flex-row gap-1 col-span-8 row-span-5 col-start-1 row-start-3 sm:max-xl:aspect-video sm:max-h-80">
        <ReleasedItems
          className="w-full min-h-60"
          releasedItems={currentlyInUseItems}
          currentItemIndex={currentItemIndex}
          setCurrentItemIndex={setCurrentItemIndex}
        />
        <ApprovedItems
          className="w-full min-h-60"
          approvedItems={readyForPickupItems}
          markAsReleased={markAsReleased}
        />
      </div>
      <Calendar
        items={currentlyInUseItems}
        className="col-span-8 row-span-6 col-start-1 row-start-8"
      />
      <MyTransactionsTable
        className="col-span-4 row-span-12 col-start-9"
        transactions={transactions}
      />
    </div>
  );
}
