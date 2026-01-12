import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn, getCustodianDisplay } from '@/lib/utils';
import { useState } from 'react';
import type { ItemWithReturnDate } from '../viewmodels/useDashboardViewModel';
import { isSameDay } from 'date-fns';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

type Props = {
  className: string;
  items: ItemWithReturnDate[];
};

export function Calendar({ items, className }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const startOfWeek = getStartOfWeek(new Date(currentDate));
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek, i);
    return {
      name: day.toLocaleString('default', { weekday: 'short' }),
      date: day.getDate(),
      fullDate: day,
      isToday: day.toDateString() === new Date().toDateString(),
    };
  });

  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const prevMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const nextMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );

  return (
    <div className={cn('bg-muted/40  size-full flex flex-col', className)}>
      <div className="flex justify-between items-center mb-4 p-4">
        <Button
          onClick={prevWeek}
          className="font-normal bg-background"
          variant="ghost"
        >
          {getMonthName(prevMonthDate)}
        </Button>

        <div className="tracking-tight font-light">
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </div>

        <Button
          onClick={nextWeek}
          className="font-normal bg-background"
          variant="ghost"
        >
          {getMonthName(nextMonthDate)}
        </Button>
      </div>

      <div className="grid grid-cols-7 h-full">
        {weekDays.map(day => (
          <div
            key={day.name}
            className="flex flex-col items-center group relative text-xs font-light"
          >
            <span
              className={`mb-2  leading-none ${day.isToday ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {day.name}
            </span>

            <span
              className={`
                  mb-6 flex items-center justify-center rounded-full transition-colors leading-none
                ${day.isToday ? 'text-foreground' : 'text-muted-foreground'}
              `}
            >
              {day.date}
            </span>

            <div className="space-y-0.5">
              {!!items &&
                items.map(item => {
                  if (!isSameDay(item.returnDate, day.fullDate)) {
                    return;
                  }

                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger
                        render={
                          <div className="bg-muted text-neutral flex p-2 rounded-lg gap-4 max-w-40" />
                        }
                      >
                        <div className="flex flex-col gap-1">
                          <div className="line-clamp-1">{item.name}</div>
                          <div className="text-[0.6rem] text-muted-foreground">
                            {item.location + ''}
                          </div>
                        </div>
                        <Avatar className="rounded-full size-6">
                          <AvatarImage src={item.custodian.avatar} />
                          <AvatarFallback>
                            {item.custodian.name?.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <Item key={item.name}>
                          <ItemHeader>
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="aspect-square w-full rounded-sm object-cover"
                            />
                          </ItemHeader>
                          <ItemContent>
                            <ItemTitle>{item.name}</ItemTitle>
                            <ItemDescription>
                              Return to{'   '}
                              <Badge
                                variant={'outline'}
                                className="pl-0.5 pr-1.5 text-neutral-foreground border-neutral-foreground"
                              >
                                <Avatar className="size-4 rounded-full">
                                  <AvatarImage src={item.custodian.avatar} />
                                  <AvatarFallback className="rounded-lg text-[0.6rem]">
                                    {item.custodian.name?.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                {getCustodianDisplay(item.custodian)}
                              </Badge>
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
            </div>

            <div className="h-full border-l-2 border-dotted border-border opacity-50 shrink"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
