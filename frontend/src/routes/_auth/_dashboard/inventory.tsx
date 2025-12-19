import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_dashboard/inventory')({
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Items</h1>
      <p className="text-gray-600 mt-2">Manage your inventory items here.</p>
    </div>
  ),
});
