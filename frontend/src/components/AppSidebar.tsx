import {
  HomeIcon,
  PackageIcon,
  ShoppingCartIcon,
  ReplaceIcon,
  Command,
  GalleryVerticalEndIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { OrgSwitcher } from './OrgSwitcher';
import { Link } from '@tanstack/react-router';

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
  nav: [
    { title: 'Dashboard', url: '/', icon: HomeIcon },
    { title: 'Inventory', url: '/inventory', icon: PackageIcon },
    { title: 'Borrow Requests', url: '/borrow', icon: ReplaceIcon },
    {
      title: 'Transaction History',
      url: '/transactions',
      icon: ShoppingCartIcon,
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="w-full">
        <OrgSwitcher orgs={data.orgs} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.nav.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link to={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
