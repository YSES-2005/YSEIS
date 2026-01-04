import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_dashboard/borrow')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Borrow Request</h1>
      <p className="text-muted-foreground mt-2">Manage borrow requests.</p>
    </div>
  ),
});
