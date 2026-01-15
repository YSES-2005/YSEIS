import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AdminReturnItem } from './AdminReturnItem';
import type { ItemWithReturnDate } from '../../viewmodels/useDashboardViewModel';

type Props = {
  toReturnItems: ItemWithReturnDate[];
  className: string;
};

export function AdminScheduledReturns({ toReturnItems, className }: Props) {
  return (
    <Card
      className={cn(
        'relative h-full flex flex-col overflow-hidden bg-background ring-0 pr-0',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex w-full text-xl font-light tracking-tighter">
          For Return
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-full gap-1 overflow-y-scroll overflow-x-hidden flex-wrap pr-0">
        {toReturnItems.map(item => (
          <AdminReturnItem item={item} className="xl:w-[calc(33%-1rem)]" />
        ))}
      </CardContent>
    </Card>
  );
}
