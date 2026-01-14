import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import type { InventoryStats } from '@/services/itemService';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';

type Props = {
  stats: InventoryStats;
  isLoading: boolean;
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
    return [
      {
        status: 'inField',
        items: stats.inField,
        fill: 'var(--color-in-field)',
      },
      {
        status: 'inShelf',
        items: stats.inShelf,
        fill: 'var(--color-in-shelf)',
      },
    ];
  }, [stats]);

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="items"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {stats.inShelf + stats.inField}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
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
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
