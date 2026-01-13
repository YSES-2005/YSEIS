import { createFileRoute } from '@tanstack/react-router'
import { useAutoLogout } from '@/features/auth/components/AutoLogoutProvider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/_auth/_dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const autoLogout = useAutoLogout();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences here.
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-logout" className="text-base font-medium">
              Auto Logout
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically log out after 30 minutes of inactivity
            </p>
          </div>
          <Switch
            id="auto-logout"
            checked={autoLogout?.isEnabled}
            onCheckedChange={autoLogout?.setIsEnabled}
          />
        </div>
      </div>
    </div>
  );
}