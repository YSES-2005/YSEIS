import { createContext, useContext } from 'react';
import type { UserSettings } from '@/types/userSettings';

export interface AutoLogoutContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  settings: UserSettings;
}

export const AutoLogoutContext = createContext<
  AutoLogoutContextType | undefined
>(undefined);

export const useAutoLogout = () => {
  const context = useContext(AutoLogoutContext);
  return context;
};
