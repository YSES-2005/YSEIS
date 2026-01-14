import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MostBorrowedItem } from '@/services/transactionService';

type Props = {
  item: MostBorrowedItem | null;
  className: string;
};

export function AdminMostBorrowedItem({ item, className }: Props) {
  return (
    <div
      className={cn(
        ' w-full h-full  flex place-items-center p-2 text-sm bg-muted/40',
        className
      )}
    >
      {item && (
        <>
          <div className="flex place-items-center gap-2">
            <div className="flex place-items-center gap-2">
              <span className="text-xl">🏆</span> Your most borrowed item
              is{' '}
            </div>
            <Badge variant="outline" className="font-normal pl-0.5 pr-1.5">
              <Avatar className="rounded-full size-4">
                <AvatarImage src={item.avatar} className="object-cover" />
              </Avatar>
              {item.name}
            </Badge>
          </div>
        </>
      )}
    </div>
  );
}
