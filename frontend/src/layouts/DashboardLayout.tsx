import { Header } from './Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex flex-col flex-1 overflow-hidden max-h-dvh">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto max-h-[calc(100dvh-69px)]">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
