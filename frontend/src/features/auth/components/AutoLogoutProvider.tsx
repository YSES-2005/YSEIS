import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLogout } from '@/hooks/useLogout';
import { toast } from 'sonner';
import { DEFAULT_USER_SETTINGS } from '@/types/userSettings';
import type { UserSettings } from '@/types/userSettings';
import { router } from '@/lib/router';
import { queryClient } from '@/lib/queryClient';
import { userQueryKey } from '@/services/authService';
import { AutoLogoutContext } from '../context/AutoLogoutContext';

const IDLE_TIMEOUT = Number(import.meta.env.VITE_IDLE_TIMEOUT) || 1800 * 1000; // logout in half an hour
const WARNING_DURATION =
  Number(import.meta.env.VITE_IDLE_WARNING) || 300 * 1000; // logout warning 5 mins from logout i.e 25 mins

export default function AutoLogoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const logout = useLogout();
  const warningTimer = useRef<number | null>(null);
  const logoutTimer = useRef<number | null>(null);

  const [settings, setSettings] = useState<UserSettings>(() => {
    const stored = localStorage.getItem('userSettings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_USER_SETTINGS;
      }
    }
    return DEFAULT_USER_SETTINGS;
  });

  const isEnabled = settings.autoLogout;

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const setIsEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, autoLogout: enabled }));
  };

  const clearTimers = useCallback(() => {
    if (warningTimer.current) {
      window.clearTimeout(warningTimer.current);
      warningTimer.current = null;
    }
    if (logoutTimer.current) {
      window.clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  }, []);

  const doLogout = useCallback(async () => {
    clearTimers();
    const currentUser = queryClient.getQueryData([userQueryKey]);
    if (!currentUser) return; // Only trigger logout if user is authenticated
    logout.mutate();
    router.navigate({ to: '/sign-in' });
  }, [clearTimers, logout]);

  const showWarning = useCallback(() => {
    const currentUser = queryClient.getQueryData([userQueryKey]);
    if (!currentUser) return;
    toast.warning('You will be logged out due to inactivity.');
  }, []);

  const resetTimers = useCallback(() => {
    if (!isEnabled) return;
    const currentUser = queryClient.getQueryData([userQueryKey]);
    if (!currentUser) return;

    clearTimers();
    warningTimer.current = window.setTimeout(
      showWarning,
      IDLE_TIMEOUT - WARNING_DURATION
    );
    logoutTimer.current = window.setTimeout(doLogout, IDLE_TIMEOUT);
  }, [isEnabled, clearTimers, showWarning, doLogout]);

  useEffect(() => {
    if (!isEnabled) {
      clearTimers();
      return;
    }

    resetTimers();

    const events = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
      'focus',
    ];

    const onActivity = () => resetTimers();

    for (const ev of events) window.addEventListener(ev, onActivity);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetTimers();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimers();
      for (const ev of events) window.removeEventListener(ev, onActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isEnabled, clearTimers, resetTimers]);

  return (
    <AutoLogoutContext.Provider value={{ isEnabled, setIsEnabled, settings }}>
      {children}
    </AutoLogoutContext.Provider>
  );
}
