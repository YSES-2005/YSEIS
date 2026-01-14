import { createFileRoute } from '@tanstack/react-router';
import { TransactionsView } from '@/features/transactions/views/TransactionsView';

export const Route = createFileRoute('/_auth/_dashboard/transactions')({
  component: TransactionsView,
});
