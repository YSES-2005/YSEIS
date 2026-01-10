import React, { useEffect, useRef } from 'react';
import { router } from '@/main';
import { useLogout } from '@/hooks/useLogout';
import { toast } from 'sonner';

const IDLE_TIMEOUT = Number(import.meta.env.VITE_IDLE_TIMEOUT) || 1800 * 1000; //logout in half an hour
const WARNING_DURATION =
  Number(import.meta.env.VITE_IDLE_WARNING) || 300 * 1000; //logout warning 5 mins from logout i.e 25 mins

export default function AutoLogoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const logout = useLogout();
  const warningTimer = useRef<number | null>(null);
  const logoutTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (warningTimer.current) {
      window.clearTimeout(warningTimer.current);
      warningTimer.current = null;
    }
    if (logoutTimer.current) {
      window.clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const doLogout = async () => {
    clearTimers();
    logout.mutate();
    router.navigate({ to: '/sign-in' });
  };

  const showWarning = () => {
    toast.warning('You will be logged out due to inactivity.');
  };

  const resetTimers = () => {
    clearTimers();
    warningTimer.current = window.setTimeout(
      showWarning,
      IDLE_TIMEOUT - WARNING_DURATION
    );
    logoutTimer.current = window.setTimeout(doLogout, IDLE_TIMEOUT);
  };

  useEffect(() => {
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

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        resetTimers();
      }
    });

    return () => {
      clearTimers();
      for (const ev of events) window.removeEventListener(ev, onActivity);
    };
  }, []);

  return <>{children}</>;
}
