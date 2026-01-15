import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MostBorrowedItem } from '@/services/transactionService';

type Props = {
  item: MostBorrowedItem | null;
};

export function AdminMostBorrowedItem({ item }: Props) {
  return (
    <div
      className={cn(
        'h-full flex place-items-center p-4 text-sm bg-accent-foreground rounded-2xl xl:w-fit ml-auto'
      )}
    >
      {item && (
        <>
          <div className="flex place-items-center gap-2">
            <div className="flex place-items-center gap-2">
              <span className="text-xl">🏆</span> Your most borrowed item
              is{' '}
            </div>
            <Badge
              variant="outline"
              className="font-normal pl-0.5 pr-1.5 text-xs"
            >
              <Avatar className="rounded-full size-4">
                <AvatarImage src={item.avatar} className="object-cover" />
              </Avatar>
              {item.name}
            </Badge>
            with <Badge variant={'soft'}>{item.totalBorrowed} borrows.</Badge>
          </div>
        </>
      )}
    </div>
  );
}
