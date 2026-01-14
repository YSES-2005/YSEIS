import { BorrowRequestsView } from '@/features/transactions/views/BorrowRequestsView';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_dashboard/borrow')({
  beforeLoad: async ({ context }) => {
    const user = await context.getUser();
    if (user?.role !== 'admin') {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: BorrowRequestsView,
});
