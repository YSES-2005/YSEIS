import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuIcon, BellIcon, SearchIcon, UserIcon } from 'lucide-react';

interface HeaderProps {
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarExpanded, onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
            <SearchIcon className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 w-48"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 relative"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
            <UserIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
