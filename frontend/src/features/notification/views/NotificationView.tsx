import { cn } from '@/lib/utils';
import { Bell, Circle, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface NotificationItemProps {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  userAvatar?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export function NotificationItem({
  type,
  title,
  message,
  timestamp,
  isRead,
  userAvatar,
  onClick,
  onDelete,
}: NotificationItemProps) {
  //if user-type notifcation
  const isUserType = ['borrow-request', 'returned', 'urgent'].includes(type);

  return (
    <div
      onClick={onClick}
      // style changes based on isRead status
      className={cn(
        'relative flex flex-col gap-1 p-4 border-b transition-colors cursor-pointer',
        isRead
          ? 'bg-transparent hover:bg-muted/50'
          : 'bg-blue-500/5 hover:bg-blue-500/10'
      )}
    >
      {!isRead && (
        <span className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-500" />
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Avatar if user-type notification */}
          {isUserType ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} />
              <AvatarFallback className="bg-muted text-[10px]">
                {title[0]}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/30">
              <Bell className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          )}

          {/* notification title */}
          <span
            className={cn(
              'text-sm leading-tight',
              isRead
                ? 'font-medium text-foreground/80'
                : 'font-semibold text-foreground'
            )}
          >
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 pr-2">
          {/* timestamp */}
          <span className="text-[10px] text-muted-foreground whitespace-nowrap tabular-nums">
            {timestamp ? new Date(timestamp).toLocaleString() : ''}
          </span>

          {/* unread indicator */}
          {!isRead && (
            <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
          )}

          {/* delete notification button */}
          {onDelete && (
            <button
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* notification message */}
      <p
        className={cn(
          'text-xs line-clamp-2 ml-11',
          isRead ? 'text-muted-foreground' : 'text-foreground/70'
        )}
      >
        {message}
      </p>
    </div>
  );
}
