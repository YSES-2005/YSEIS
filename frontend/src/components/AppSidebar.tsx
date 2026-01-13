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
import { useAuthViewModel } from '@/features/auth/viewmodels/useAuthViewModel';

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
      adminOnly: true, // Only visible to admin users
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
  const { isAdmin, isLoading } = useAuthViewModel();

  // Filter navigation items based on user role
  const filteredNavMain = data.navMain.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  // Show nothing while loading auth state
  if (isLoading) return null;

  return (
    <Sidebar collapsible="icon" className="overflow-y-hidden">
      <SidebarHeader className="w-full px-2 pb-4">
        <OrgSwitcher orgs={data.orgs} />
      </SidebarHeader>
      <SidebarContent>
        <NavItems items={filteredNavMain} />
        <NavItems items={data.navSecondary} className="mt-auto" />
        <NavUser />
      </SidebarContent>
    </Sidebar>
  );
}
