import { Button } from '@/components/ui/button';
import { BellIcon, UserIcon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ModeToggle';

export function Header() {
  return (
    <header className="border-b border-border py-1">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
        </div>

        <div className="flex items-center space-x-1">
          <ModeToggle />
          <Button variant="outline" className="p-2 hover:bg-muted relative">
            <BellIcon />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
          </Button>

          <Button variant="outline" className="p-2 hover:bg-muted">
            <UserIcon />
          </Button>
        </div>
      </div>
    </header>
  );
}
