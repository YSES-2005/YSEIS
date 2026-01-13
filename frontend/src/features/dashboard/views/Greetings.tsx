import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import type { BadgeVariantKey } from '@/components/ui/badge.variants';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import {
  Backpack,
  BadgeIcon,
  CircleCheckBig,
  CircleX,
  Clock,
  type LucideIcon,
} from 'lucide-react';

type Props = {
  counts: Record<string, number>;
  className: string;
};

const statusVariant: Record<string, BadgeVariantKey> = {
  approved: 'success',
  pending: 'warning',
  disapproved: 'destructive',
};

const statusIcon: Record<string, LucideIcon> = {
  approved: CircleCheckBig,
  pending: Clock,
  disapproved: CircleX,
};

export function Greetings({ counts, className }: Props) {
  const { user } = useUser();
  return (
    <div
      className={cn(
        'w-full flex gap-6 place-items-center flex-wrap sm:flex-nowrap',
        className
      )}
    >
      <h1 className="text-5xl font-extralight -tracking-wider flex-1">
        Musta, {user?.name.split(' ')[0]}
      </h1>

      <div className="flex">
        <Backpack />
        <BadgeIcon />
      </div>

      <div className="flex justify-end ml-auto sm:size-full gap-4 sm:gap-0.5 shrink-0 w-fit!">
        {['approved', 'pending', 'disapproved'].map(status => {
          const Icon = statusIcon[status];

          return (
            <AspectRatio
              key={status}
              ratio={1}
              className={cn('sm:h-full rounded-full grid place-content-center')}
            >
              <div className="flex flex-col">
                <div className="flex items-end">
                  <Badge
                    variant={statusVariant[status]}
                    className="p-0.5 size-4 rounded-sm"
                  >
                    <Icon className="p-0! " />
                  </Badge>

                  <div className="text-4xl font-extralight text-center leading-none">
                    {counts[status] ?? 0}
                  </div>
                </div>
                <div className="text-[0.5rem] leading-none">{status}</div>
              </div>
            </AspectRatio>
          );
        })}
      </div>
    </div>
  );
}
