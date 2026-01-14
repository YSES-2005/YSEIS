import { useTimeAgo } from '@/hooks/useTimeAgo';
import { cn } from '@/lib/utils';

export function ReturnTimeAgo({ date }: { date: Date | undefined }) {
  const { timeDiff, category } = useTimeAgo(date);

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
