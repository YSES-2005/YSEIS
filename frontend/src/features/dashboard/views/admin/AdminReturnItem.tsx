import { useTimeAgo } from '@/hooks/useTimeAgo';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ItemWithReturnDate } from '../../viewmodels/useDashboardViewModel';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

type Props = {
  item: ItemWithReturnDate;
};

export function AdminReturnItem({ item }: Props) {
  const { timeDiff, category } = useTimeAgo(item.returnDate);

  if (!timeDiff) return null;

  const styles = {
    near: 'bg-destructive/40',
    soon: 'bg-warning/70 dark:bg-warning/30',
    far: 'bg-accent-foreground',
    overdue: 'bg-destructive-foreground text-destructive ',
  }[category];

  return (
    <div className={cn('p-2 rounded-md flex w-fit h-fit gap-2', styles)}>
      <div>
        <div className="font-medium text-xs max-w-[8ch] text-[0.6rem]">
          {item.name}
        </div>
        <Badge
          variant="ghost"
          className="font-light text-[0.55rem] flex place-items-center px-0"
        >
          <Calendar size={2} />
          {formatDistanceToNow(item.returnDate)}
        </Badge>
      </div>
      <div className="flex -space-x-1 shrink-0">
        <Avatar className="rounded-full size-4">
          <AvatarImage src={item.custodian.avatar} />
          <AvatarFallback className="rounded-lg text-[0.6rem]">
            {item.custodian.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <Avatar className=" rounded-full size-4">
          <AvatarImage src={item.avatar} />
        </Avatar>
      </div>
    </div>
  );
}
