import { Card, CardContent } from '@/components/ui/card';
import { cn, getCustodianDisplay } from '@/lib/utils';
import { Check, CheckCircle, MapPin, X } from 'lucide-react';
import {
  Item,
  ItemGroup,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  ItemContent,
  ItemActions,
} from '@/components/ui/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import type { ItemWithTransactionId } from '../viewmodels/useDashboardViewModel';
import { EmptyIndicatorWithMessage } from '@/components/EmptyIndicatorWithMessage';

type Props = {
  className: string;
  approvedItems: ItemWithTransactionId[];
  markAsReleased: (transactionId: string) => void;
  cancelRequest: (transactionId: string) => void;
};

export function ApprovedItems({
  className,
  approvedItems,
  markAsReleased,
  cancelRequest,
}: Props) {
  return (
    <Card
      className={cn(
        'relative h-full flex flex-col p-0 overflow-hidden ring-0 bg-muted/40',
        className
      )}
    >
      {approvedItems.length ? (
        <>
          <CardContent className="flex w-full flex-col gap-1 px-0 overflow-y-scroll">
            <div className="p-2 mt-1">
              <Badge
                variant="success"
                className="shadow shadow-success-foreground dark:shadow-none"
              >
                <CheckCircle />
                You have {approvedItems.length} items ready for pick up!
              </Badge>
            </div>
            <ItemGroup className="overflow-y-scroll gap-y-1">
              {approvedItems.map(item => (
                <Item
                  key={item.id}
                  variant="outline"
                  role="listitem"
                  className="border-none"
                >
                  <ItemMedia>
                    <div className="flex -space-x-2 ">
                      <Avatar className="hidden sm:flex">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                    </div>
                  </ItemMedia>
                  <ItemContent className="shrink">
                    <ItemTitle className="font-normal">{item.name}</ItemTitle>
                    <ItemDescription className="flex gap-2 ">
                      <Badge
                        variant={'outline'}
                        className="pl-0.5 pr-1.5 font-normal"
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
                        className="pl-0.5 pr-1.5 font-normal"
                      >
                        <MapPin />
                        {item.location}
                      </Badge>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="shrink-0">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            size="icon-sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => markAsReleased(item.transactionId)}
                          />
                        }
                      >
                        <Check />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-[0.6rem]">
                          I already picked this up.
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            size="icon-sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => cancelRequest(item.transactionId)}
                          />
                        }
                      >
                        <X />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-[0.6rem]">
                          I don't want this item anymore. :(
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </>
      ) : (
        <EmptyIndicatorWithMessage message="Awit, ayaw nila i-approve." />
      )}
    </Card>
  );
}
