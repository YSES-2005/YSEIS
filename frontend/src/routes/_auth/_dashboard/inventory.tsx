import { createFileRoute } from '@tanstack/react-router';
import ItemsView from '@/features/items/views/ItemsView';

export const Route = createFileRoute('/_auth/_dashboard/inventory')({
  component: ItemsView,
});
