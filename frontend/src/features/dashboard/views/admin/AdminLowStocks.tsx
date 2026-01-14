import { EmptyIndicator } from '@/components/EmptyIndicator';
import { Badge } from '@/components/ui/badge';
import { cn, getCustodianDisplay } from '@/lib/utils';
import type { ItemPopulated } from '@schemas/itemSchema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useEffect, useMemo, useState } from 'react';
import GradientBlur from '@/components/GradientBlur';
import { TriangleAlert, TriangleIcon } from 'lucide-react';

type Props = {
  items: ItemPopulated[];
  className: string;
};
export function AdminLowStocks({ items, className }: Props) {
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

  const selectedItem = useMemo(
    () => items[currentItemIndex],
    [currentItemIndex, items]
  );

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
      {items.length ? (
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
                {items.map(item => (
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

              <Badge
                variant="warning"
                className="absolute top-2 left-2 text-xs"
              >
                <TriangleAlert />
                Only {selectedItem.quantity} left.
              </Badge>

              <div className="**:z-50! absolute  w-full bottom-0 left-0 z-50 p-4 flex place-items-end">
                <div className="text-5xl font-extralight -tracking-widest  overflow-x-scroll overflow-y-hidden text-white">
                  {selectedItem.name}
                </div>
                <Badge variant="outline" className="text-white pl-0.5 shrink-0">
                  <Avatar className="rounded-full" size="sm">
                    <AvatarImage src={selectedItem.custodian.avatar} />
                    <AvatarFallback className="rounded-lg text-[0.6rem]">
                      {selectedItem && selectedItem.custodian.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {getCustodianDisplay(selectedItem.custodian)}
                </Badge>
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
