import {
  HomeIcon,
  PackageIcon,
  ShoppingCartIcon,
  ReplaceIcon,
  Command,
  GalleryVerticalEndIcon,
  SettingsIcon,
  Send,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { NavItems } from './NavItems';
import { NavUser } from './NavUser';
import { useUser } from '@/hooks/useUser';
import logo from '@/assets/logo.png';

const data = {
  orgs: [
    {
      name: 'YSES',
      logo: GalleryVerticalEndIcon,
      plan: 'Enterprise',
    },
    {
      name: 'Kupal Org',
      logo: Command,
      plan: 'Enterprise',
    },
  ],
  navMain: [
    { title: 'Dashboard', url: '/dashboard', icon: HomeIcon },
    { title: 'Inventory', url: '/inventory', icon: PackageIcon },
    {
      title: 'Borrow Requests',
      url: '/borrow',
      icon: ReplaceIcon,
      adminOnly: true,
    },
    {
      title: 'Transaction History',
      url: '/transactions',
      icon: ShoppingCartIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: SettingsIcon,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
};

export function AppSidebar() {
  const { user } = useUser();

  const filteredNavMain = data.navMain.filter(
    item => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <Sidebar collapsible="icon" className="overflow-y-hidden">
      <SidebarHeader className="w-full px-2 pb-4">
        <div className="flex place-items-center">
          <img
            src={logo}
            alt="YSES Logo"
            className="size-10 w-auto drop-shadow-md"
          />
          <div className="text-xl font-light tracking-tighter">YSEIS</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={filteredNavMain} />
        <NavItems items={data.navSecondary} className="mt-auto" />
        <NavUser />
      </SidebarContent>
    </Sidebar>
  );
}
