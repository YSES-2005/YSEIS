import { cn } from '@/lib/utils';
import Empty from '@/assets/empty.svg';

type Props = {
  message: string;
  className?: string;
};

export function EmptyIndicatorWithMessage({ message, className }: Props) {
  return (
    <div className="grid place-content-center size-full ">
      <div
        className={cn(' flex flex-col place-items-center gap-y-4', className)}
      >
        <img src={Empty} alt="Empty state" className="size-1/2 mt-4" />
        <div className="not-lg:text-center text-xs text-muted-foreground leading-none">
          {message}
        </div>
      </div>
    </div>
  );
}
