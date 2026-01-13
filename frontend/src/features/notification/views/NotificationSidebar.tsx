import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCheck } from 'lucide-react';
import { NotificationItem } from './NotificationView';
import { useNotificationViewModel } from '../viewmodels/useNotificationViewModel';

export function NotificationSidebar() {
  const {
    allNotifications,
    unreadNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationViewModel();

  return (
    <SheetContent className="p-0 flex flex-col w-[350px] sm:w-[400px]">
      <SheetHeader className="p-6 pb-2">
        <SheetTitle className="flex items-center justify-between gap-2 pr-6">
          Notifications
          <div className="flex items-center gap-1.5">
            {/* unread ount indicator */}
            {unreadCount > 0 && (
              <span className="text-[10px] sm:text-xs font-medium bg-muted px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}

            {/* mark all as read button */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] sm:text-xs font-medium bg-secondary/60 hover:bg-primary hover:text-primary-foreground px-2 py-0.5 rounded-full transition-all flex items-center gap-1 animate-in fade-in slide-in-from-right-1"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
        </SheetTitle>
      </SheetHeader>

      {/* tabs for All and Unread */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 mt-4 border-t overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* all notifications */}
          <TabsContent value="all" className="m-0 outline-none">
            {allNotifications.length > 0 ? (
              allNotifications.map(n => (
                <NotificationItem
                  key={`all-${n.id}`}
                  id={n.id}
                  type={n.type}
                  title={n.title}
                  message={n.message}
                  timestamp={n.created_at}
                  isRead={!n.isRead}
                  onClick={() => markAsRead(n.id)}
                  onDelete={() => deleteNotification(n.id)}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          {/* unread notifications */}
          <TabsContent value="unread" className="m-0 outline-none">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map(n => (
                <NotificationItem
                  key={`unread-${n.id}`}
                  id={n.id}
                  type={n.type}
                  title={n.title}
                  message={n.message}
                  timestamp={n.created_at}
                  isRead={false}
                  onClick={() => markAsRead(n.id)}
                  onDelete={() => deleteNotification(n.id)}
                />
              ))
            ) : (
              <EmptyState message="No unread notifications" />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </SheetContent>
  );
}

function EmptyState({
  message = 'No notifications yet',
}: {
  message?: string;
}) {
  return (
    <div className="p-8 text-center text-sm text-muted-foreground animate-in fade-in duration-500">
      {message}
    </div>
  );
}
