import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCheck, Loader2 } from 'lucide-react';
import { NotificationItem } from './NotificationView';
import { useNotificationViewModel } from '../viewmodels/useNotificationViewModel';

export function NotificationSidebar() {
  const {
    allNotifications,
    unreadNotifications,
    unreadCount,
    isLoading,
    isMarkingAllRead,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationViewModel();

  return (
    <SheetContent className="p-0 flex flex-col w-[350px] sm:w-[400px]">
      <SheetHeader className="p-6 pb-2">
        <SheetTitle className="flex items-center justify-between gap-2 pr-6">
          <span>Notifications</span>

          <div className="flex items-center gap-2">
            {/* Unread Indicator */}
            {unreadCount > 0 && (
              <span className="text-[10px] sm:text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] sm:text-xs hover:bg-secondary/80"
                onClick={e => {
                  e.preventDefault();
                  markAllAsRead();
                }}
                disabled={isMarkingAllRead}
              >
                {isMarkingAllRead ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <CheckCheck className="h-3 w-3 mr-1" />
                )}
                Mark all read
              </Button>
            )}
          </div>
        </SheetTitle>
      </SheetHeader>
      <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 mt-4 border-t overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* All Notifications */}
              <TabsContent value="all" className="m-0 outline-none pb-4">
                {allNotifications?.length > 0 ? (
                  allNotifications.map(n => (
                    <NotificationItem
                      key={`all-${n.id}`}
                      id={n.id}
                      type={n.type}
                      title={n.title}
                      message={n.message}
                      timestamp={n.created_at}
                      isRead={n.isRead}
                      onClick={() => markAsRead(n.id)}
                      onDelete={() => deleteNotification(n.id)}
                    />
                  ))
                ) : (
                  <EmptyState />
                )}
              </TabsContent>

              {/* Unread Notifications */}
              <TabsContent value="unread" className="m-0 outline-none pb-4">
                {unreadNotifications?.length > 0 ? (
                  unreadNotifications.map(n => (
                    <NotificationItem
                      key={`unread-${n.id}`}
                      id={n.id}
                      type={n.type}
                      title={n.title}
                      message={n.message}
                      timestamp={n.created_at}
                      isRead={false} // Always false in this tab visually
                      onClick={() => markAsRead(n.id)}
                      onDelete={() => deleteNotification(n.id)}
                    />
                  ))
                ) : (
                  <EmptyState message="No unread notifications" />
                )}
              </TabsContent>
            </>
          )}
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
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in duration-500">
      <div className="bg-muted/50 p-3 rounded-full mb-3">
        <CheckCheck className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
