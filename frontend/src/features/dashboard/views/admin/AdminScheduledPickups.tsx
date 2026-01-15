import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, getCustodianDisplay } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import {
  Item,
  ItemGroup,
  ItemDescription,
  ItemTitle,
  ItemContent,
} from '@/components/ui/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyIndicatorWithMessage } from '@/components/EmptyIndicatorWithMessage';
import { DatePicker } from '@/components/ui/date-picker';
import type { ItemPopulated } from '@schemas/itemSchema';
import { formatRelative } from 'date-fns';

type Props = {
  approvedItems: ItemPopulated[];
  pickupDate: Date;
  setPickupDate: (date: Date) => void;
  className: string;
};

export function AdminScheduledPickups({
  approvedItems,
  pickupDate,
  setPickupDate,
  className,
}: Props) {
  return (
    <Card
      className={cn(
        'relative h-full flex flex-col overflow-hidden bg-background ring-0 ',
        className
      )}
    >
      <CardHeader>
        <CardTitle className=" flex justify-between w-full">
          <div className="text-xl font-light tracking-tighter">
            Scheduled Pickups
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-full h-full flex-col gap-1  overflow-y-scroll max-h-80   overflow-x-hidden">
        <div className="flex ml-4">
          <DatePicker
            value={pickupDate}
            onChange={date => setPickupDate(date)}
            disabled={{ before: new Date() }}
            relative
            render={<Badge variant="soft" />}
          ></DatePicker>
        </div>
        {approvedItems.length ? (
          <ItemGroup className="overflow-y-scroll gap-y-0 ml-4 h-full min-h-0">
            {approvedItems.map(item => (
              <Item key={item.id} role="listitem" className=" relative">
                <div className="flex flex-col items-center mt-auto relative">
                  <div className="size-2 rounded-full bg-primary-foreground"></div>
                  <div className="h-8 w-0.5 border border-dashed"></div>
                  <div className="absolute -bottom-4 h-4 w-0.5 border border-dashed "></div>
                </div>
                <ItemContent className="shrink">
                  <ItemTitle className="font-normal mb-1">
                    {item.name}
                  </ItemTitle>
                  <ItemDescription className="flex gap-1">
                    <Badge
                      variant={'outline'}
                      className="pl-0.5 pr-1.5 font-normal text-[0.55rem]"
                    >
                      <Avatar className="size-4 rounded-full">
                        <AvatarImage src={item.custodian.avatar} />
                        <AvatarFallback className="rounded-lg text-[0.6rem]">
                          {item.custodian.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {getCustodianDisplay(item.custodian)}
                    </Badge>

                    <Badge
                      variant={'outline'}
                      className="pl-0.5 pr-1.5 font-normal text-[0.55rem]"
                    >
                      <MapPin />
                      {item.location}
                    </Badge>
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <EmptyIndicatorWithMessage
            className="max-h-30"
            message={`No scheduled pickups for ${formatRelative(pickupDate, new Date()).split(' ')[0]}`}
          />
        )}
      </CardContent>
    </Card>
  );
}
