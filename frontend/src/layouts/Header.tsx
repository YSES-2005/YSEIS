import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuIcon, BellIcon, SearchIcon, UserIcon } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 hover:bg-muted lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-foreground w-48"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-muted relative"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
          </Button>

          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted">
            <UserIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
