import GradientBlur from '@/components/GradientBlur';
import { ReturnTimeAgo } from '@/components/ReturnTimeAgo';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn, getCustodianDisplay } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { ItemWithReturnDate } from '../viewmodels/useDashboardViewModel';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EmptyIndicator } from '@/components/EmptyIndicator';

type Props = {
  className: string;
  releasedItems: ItemWithReturnDate[];
  currentItemIndex: number;
  setCurrentItemIndex: (index: number) => void;
};

export function ReleasedItems({
  className,
  releasedItems,
  currentItemIndex,
  setCurrentItemIndex,
}: Props) {
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrentItemIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api, setCurrentItemIndex]);

  return (
    <Card
      className={cn(
        'bg-muted/40 ring-0 relative h-full flex flex-col p-0 overflow-hidden',
        className
      )}
    >
      {releasedItems.length ? (
        <>
          <CardContent className="relative flex-1 min-h-0 h-full p-0">
            <Carousel
              setApi={setApi}
              opts={{
                align: 'start',
              }}
              className="h-full"
            >
              <CarouselContent className="h-full ml-0">
                {releasedItems.map(item => (
                  <CarouselItem key={item.id} className="h-full pl-0">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="object-cover size-full "
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                size="icon-lg"
                variant="secondary"
                className="left-4 border-none"
              />
              <CarouselNext
                size="icon-lg"
                variant="secondary"
                className="right-4 border-none"
              />

              <Badge variant="outline" className="absolute top-4 left-4 pr-0.5">
                Return to{' '}
                <Badge
                  variant={'outline'}
                  className="pl-px pr-1.5 text-[0.5rem] h-3!"
                >
                  <Avatar className="size-3 rounded-full">
                    <AvatarImage
                      src={releasedItems[currentItemIndex].custodian.avatar}
                    />
                    <AvatarFallback className="rounded-lg text-[0.6rem]">
                      {releasedItems[currentItemIndex].custodian.name?.slice(
                        0,
                        2
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {getCustodianDisplay(
                    releasedItems[currentItemIndex].custodian
                  )}
                </Badge>
              </Badge>

              <div className="**:z-50! absolute  w-full bottom-0 left-0 z-50 p-4 flex place-items-end gap-4">
                <div className="text-5xl font-extralight -tracking-widest max-w-1/2 overflow-x-scroll overflow-y-hidden text-white">
                  {releasedItems[currentItemIndex] &&
                    releasedItems[currentItemIndex].name}
                </div>
                <ReturnTimeAgo
                  date={
                    releasedItems[currentItemIndex] &&
                    releasedItems[currentItemIndex].returnDate
                  }
                />
              </div>
            </Carousel>
          </CardContent>
          <GradientBlur className="h-full!" />
        </>
      ) : (
        <EmptyIndicator />
      )}
    </Card>
  );
}
