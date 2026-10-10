import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Bell, Sun, Shield, User } from 'lucide-react';
import { useSettingsViewModel } from '../viewmodels/useSettingsViewModel';
import { Loader2 } from 'lucide-react';

export function SettingsView() {
  const {
    user,
    isDarkMode,
    toggleTheme,
    autoLogout,
    displayName,
    setDisplayName,
    emailAlerts,
    setEmailAlerts,
    dueDateReminders,
    setDueDateReminders,
    saveProfile,
    isSaving,
  } = useSettingsViewModel();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your account settings and set preferences.
        </p>
      </div>

      <Separator />

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>My Profile</CardTitle>
          </div>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity border">
              <AvatarImage
                src={user?.avatar || 'https://github.com/shadcn.png'}
              />
              <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-[10px] text-muted-foreground">
                JPG, GIF or PNG. 1MB max.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={user?.email}
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how you receive alerts for borrow requests and due dates.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="email-alerts"
                className="font-medium cursor-pointer"
              >
                Email Alerts
              </Label>
              <span className="font-normal text-muted-foreground">
                Receive emails about your account activity.
              </span>
            </div>
            <Switch
              id="email-alerts"
              checked={emailAlerts}
              onCheckedChange={setEmailAlerts}
            />
          </div>
          <div className="grid gap-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="due-date" className="font-normal cursor-pointer">
                Due Date Reminders (1 day before)
              </Label>
              <Switch
                id="due-date"
                checked={dueDateReminders}
                onCheckedChange={setDueDateReminders}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance & Security Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the interface theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="dark-mode"
                className="flex flex-col space-y-1 cursor-pointer items-start text-left"
              >
                <span>Dark Mode</span>
                <span className="font-normal text-muted-foreground">
                  Switch between light and dark themes.
                </span>
              </Label>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your session security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label
                htmlFor="auto-logout"
                className="flex flex-col space-y-1 cursor-pointer items-start text-left"
              >
                <span>Auto Logout</span>
                <span className="font-normal text-muted-foreground">
                  Automatically log out after 30 minutes of inactivity.
                </span>
              </Label>
              <Switch
                id="auto-logout"
                checked={autoLogout?.isEnabled}
                onCheckedChange={autoLogout?.setIsEnabled}
              />
            </div>
            <Separator />

            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={saveProfile} disabled={isSaving} size="lg">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
