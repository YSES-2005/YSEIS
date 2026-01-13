import { createFileRoute } from '@tanstack/react-router'
import { useAutoLogout } from '@/features/auth/components/AutoLogoutProvider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

export const Route = createFileRoute('/_auth/_dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const autoLogout = useAutoLogout();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1>Settings</h1>
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