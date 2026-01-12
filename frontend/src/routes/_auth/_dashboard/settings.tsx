import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_dashboard/settings')({
    component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground mt-2">Manage your account settings and preferences here.</p>
    </div>
  ),
})