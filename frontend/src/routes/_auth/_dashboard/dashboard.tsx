import { DashboardView } from '@/features/dashboard/views/DashboardView';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_dashboard/dashboard')({
  component: DashboardView,
});
