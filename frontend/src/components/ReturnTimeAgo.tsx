import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years';
type TimeCategory = 'near' | 'soon' | 'far' | 'overdue';

interface TimeDiff {
  value: number;
  unit: TimeUnit;
  isOverdue: boolean;
}

const getTimeAgo = (targetDate: Date): TimeDiff => {
  const targetTime = new Date(targetDate).getTime();
  const now = Date.now();

  const isOverdue = now > targetTime;

  const diffInMs = Math.abs(targetTime - now);

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  let result: { value: number; unit: TimeUnit };

  if (diffInMs < minute) {
    result = { value: Math.floor(diffInMs / 1000), unit: 'seconds' };
  } else if (diffInMs < hour) {
    result = { value: Math.floor(diffInMs / minute), unit: 'minutes' };
  } else if (diffInMs < day) {
    result = { value: Math.floor(diffInMs / hour), unit: 'hours' };
  } else if (diffInMs < month) {
    result = { value: Math.floor(diffInMs / day), unit: 'days' };
  } else if (diffInMs < year) {
    result = { value: Math.floor(diffInMs / month), unit: 'months' };
  } else {
    result = { value: Math.floor(diffInMs / year), unit: 'years' };
  }

  return { ...result, isOverdue };
};

const categorizeUnit = (unit: TimeUnit, isOverdue: boolean): TimeCategory => {
  if (isOverdue) return 'overdue';

  switch (unit) {
    case 'seconds':
    case 'minutes':
      return 'near';
    case 'hours':
    case 'days':
      return 'soon';
    case 'months':
    case 'years':
    default:
      return 'far';
  }
};

export function ReturnTimeAgo({ date }: { date: Date | undefined }) {
  const [timeDiff, setTimeDiff] = useState<TimeDiff | null>(null);
  const [category, setCategory] = useState<TimeCategory>('far');

  useEffect(() => {
    if (!date) return;

    const updateTime = () => {
      const diff = getTimeAgo(date);
      setTimeDiff(diff);
      setCategory(categorizeUnit(diff.unit, diff.isOverdue));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000 * 60);

    return () => clearInterval(intervalId);
  }, [date]);

  if (!date || !timeDiff) return null;

  const styles = {
    near: {
      bg: 'bg-neutral/70 dark:bg-destructive/70 dark:shadow-md dark:shadow-destructive',
      text: 'text-destructive dark:text-destructive-foreground',
      label: 'text-muted-foreground dark:text-destructive-foreground/80',
    },
    soon: {
      bg: 'bg-neutral/70 dark:bg-warning/70 dark:shadow-md dark:shadow-warning',
      text: 'text-warning dark:text-warning-foreground',
      label: 'text-muted-foreground dark:text-warning-foreground/80',
    },
    far: {
      bg: 'bg-neutral/70',
      text: 'text-neutral-foreground',
      label: 'text-muted-foreground',
    },
    overdue: {
      bg: 'bg-destructive/30 dark:bg-destructive dark:shadow-sm dark:shadow-destructive/20 brightness-90 dark:brightness-75',
      text: 'text-destructive-foreground/70 dark:text-destructive-foreground',
      label: 'text-destructive-foreground/60',
    },
  }[category];

  return (
    <div className="relative ml-auto inline-flex">
      <div
        className={cn(
          'relative flex place-items-center py-2 px-4 gap-4 rounded-full transition-colors duration-300',
          styles.bg
        )}
      >
        <span className={cn('text-[0.6rem]', styles.label)}>
          {category === 'overdue' ? 'overdue by' : 'return in'}
        </span>

        <div
          className={cn(
            'flex flex-col place-items-center leading-none transition-colors duration-300',
            styles.text
          )}
        >
          <div className="text-center text-2xl font-extralight leading-none">
            {timeDiff.value}
          </div>
          <div className="text-[0.6rem] leading-none">{timeDiff.unit}</div>
        </div>
      </div>
    </div>
  );
}
