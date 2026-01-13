import { createFileRoute } from '@tanstack/react-router';
import { SettingsView } from '@/features/settings/views/SettingsView';

export const Route = createFileRoute('/_auth/_dashboard/settings')({
  component: SettingsView,
});
