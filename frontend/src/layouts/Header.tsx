import { Button } from '@/components/ui/button';
import { BellIcon, UserIcon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ModeToggle';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { NotificationSidebar } from '@/features/notification/views/NotificationSidebar';
import { useNotificationViewModel } from '@/features/notification/viewmodels/useNotificationViewModel';

export function Header() {
  const { unreadCount } = useNotificationViewModel();

  return (
    <header className="border-b border-border py-1">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
        </div>

        <div className="flex items-center space-x-1">
          <ModeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  className="p-2 hover:bg-muted relative"
                >
                  <BellIcon />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              }
            />
            <NotificationSidebar />
          </Sheet>

          <Button variant="outline" className="p-2 hover:bg-muted">
            <UserIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
