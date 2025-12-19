import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  HomeIcon,
  PackageIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReplaceIcon,
} from 'lucide-react';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Inventory', href: '/inventory', icon: PackageIcon },
    { name: 'Borrow Requests', href: '/borrow', icon: ReplaceIcon },
    {
      name: 'Transaction History',
      href: '/transactions',
      icon: ShoppingCartIcon,
    },
  ];

  return (
    <div
      className={`${expanded ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {expanded && (
          <h2 className="text-xl font-semibold text-gray-800">Inventory</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2 hover:bg-gray-100"
        >
          {expanded ? (
            <ChevronLeftIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map(item => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                activeProps={{
                  className: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                }}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {expanded && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
