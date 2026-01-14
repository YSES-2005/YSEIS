import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn, pluralize } from '@/lib/utils';
import type { InventoryStats } from '@/services/itemService';
import { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';

type Props = {
  stats: InventoryStats | undefined;
  className: string;
};

const chartConfig = {
  items: {
    label: 'Items',
  },
  inField: {
    label: 'In Use',
    color: 'var(--chart-1)',
  },
  inShelf: {
    label: 'Available',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

export function AdminInventoryStats({ stats, className }: Props) {
  const chartData = useMemo(() => {
    if (!stats) return [];

    return [
      {
        status: 'inField',
        items: stats.inField,
        fill: 'var(--chart-1)',
      },
      {
        status: 'inShelf',
        items: stats.inShelf,
        fill: 'var(--chart-2)',
      },
    ];
  }, [stats]);

  if (!stats) return;

  return (
    <Card className={cn('flex flex-col ring-0 gap-0 bg-background', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-light tracking-tighter">
          Overall Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-36"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="items"
              nameKey="status"
              innerRadius={40}
              strokeWidth={10}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-light leading-none mb-0 pb-0"
                        >
                          {stats.totalQuantity}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-[0.6rem] leading-none"
                        >
                          Total Items
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-sm">
          There {stats.inField >= 2 ? 'are' : 'is'}
          {'   '}
          <Badge render={<span />}>{stats.inField}</Badge>
          {'   '}
          {pluralize('item', stats.inField)} currently in use, while
          {'   '}
          <Badge render={<span />}>{stats.inShelf}</Badge>
          {'   '}
          are on the shelf.
        </div>
      </CardFooter>
    </Card>
  );
}
