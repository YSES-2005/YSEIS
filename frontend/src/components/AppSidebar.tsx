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
import { OrgSwitcher } from './OrgSwitcher';
import { NavItems } from './NavItems';
import { NavUser } from './NavUser';

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
    { title: 'Borrow Requests', url: '/borrow', icon: ReplaceIcon },
    {
      title: 'Transaction History',
      url: '/transactions',
      icon: ShoppingCartIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
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
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="w-full px-2 pb-4">
        <OrgSwitcher orgs={data.orgs} />
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={data.navMain} />
        <NavItems items={data.navSecondary} className="mt-auto" />
        <NavUser />
      </SidebarContent>
    </Sidebar>
  );
}
