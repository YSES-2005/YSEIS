import { useState } from 'react';
import { Header } from './Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto  p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
