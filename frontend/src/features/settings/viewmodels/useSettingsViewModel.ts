import { useUser } from '@/hooks/useUser';
import { useTheme } from '@/components/ThemeProvider';
import { useAutoLogout } from '@/features/auth/context/AutoLogoutContext';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export function useSettingsViewModel() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const autoLogout = useAutoLogout();

  const [displayName, setDisplayName] = useState(user?.name || '');
  const [emailAlerts, setEmailAlerts] = useState(
    user?.preferences?.emailAlerts ?? true
  );
  const [dueDateReminders, setDueDateReminders] = useState(
    user?.preferences?.dueDateReminders ?? true
  );

  const isDarkMode = theme === 'dark';

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const saveProfile = () => {
    if (!user) return;
    updateProfileMutation.mutate({
      name: displayName,
      preferences: {
        emailAlerts,
        dueDateReminders,
      },
    });
  };

  return {
    user,
    displayName,
    setDisplayName,
    emailAlerts,
    setEmailAlerts,
    dueDateReminders,
    setDueDateReminders,
    isDarkMode,
    toggleTheme,
    autoLogout,
    saveProfile,
    isSaving: updateProfileMutation.isPending,
  };
}
