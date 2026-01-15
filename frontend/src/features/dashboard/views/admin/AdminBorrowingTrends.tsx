import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { BorrowingTrendItem, GroupBy } from '@/services/analyticsService';
import { cn } from '@/lib/utils';

const chartConfig = {
  borrowedTransactions: {
    label: 'Borrow ',
    color: 'var(--chart-3)',
  },
  returnedTransactions: {
    label: 'Return',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

type Props = {
  borrowingTrends: BorrowingTrendItem[];
  groupBy: GroupBy;
  setGroupBy: (value: GroupBy) => void;
  className: string;
};

export function AdminBorrowingTrends({
  borrowingTrends,
  groupBy,
  setGroupBy,
  className,
}: Props) {
  return (
    <Card className={cn('pt-0 ring-0 bg-background', className)}>
      <CardHeader className="flex items-center gap-2 space-y-0 py-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-xl font-light tracking-tighter">
            Borrow v. Returns
          </CardTitle>
          <CardDescription>
            Showing transaction volume for this {groupBy}.
          </CardDescription>
        </div>
        <Select
          value={groupBy}
          onValueChange={value => {
            if (!value) return;
            setGroupBy(value);
          }}
        >
          <SelectTrigger
            className="hidden w-24 rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue className="capitalize" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="day" className="rounded-lg">
              Day
            </SelectItem>
            <SelectItem value="week" className="rounded-lg">
              Week
            </SelectItem>
            <SelectItem value="month" className="rounded-lg">
              Month
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto w-full not-xl:h-56 xl:h-full  xl:min-h-48  stroke-none"
        >
          <AreaChart data={borrowingTrends}>
            <defs>
              <linearGradient id="fillReturn" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-4)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-4)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBorrow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="borrowedTransactions"
              type="natural"
              fill="url(#fillBorrow)"
              stroke="var(--color-chart-3)"
              stackId="a"
            />
            <Area
              dataKey="returnedTransactions"
              type="natural"
              fill="url(#fillReturn)"
              stroke="var(--color-chart-4)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
