import { AdminDashboardView } from '@/features/dashboard/views/admin/AdminDashboardView';
import { DashboardView } from '@/features/dashboard/views/DashboardView';
import { useUser } from '@/hooks/useUser';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_dashboard/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useUser();

  // 3. Conditional Rendering
  if (user?.role === 'admin') {
    return <AdminDashboardView />;
  }

  return <DashboardView />;
}
