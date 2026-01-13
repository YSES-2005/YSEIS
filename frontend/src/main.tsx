import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { queryClient } from './lib/queryClient.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import AutoLogoutProvider from './features/auth/components/AutoLogoutProvider.tsx';
import { RouterProvider } from '@tanstack/react-router';
import { router, userQueryConfig } from './router/router.ts';
import type { RouterContext } from './router/context.ts';
import { useAuthViewModel } from './features/auth/viewmodels/useAuthViewModel.ts';

export function AppRouter() {
  const auth = useAuthViewModel();

  if (auth.isLoading) {
    return null;
  }

  return (
    <RouterProvider
      router={router}
      context={
        {
          queryClient,
          authUser: auth.user,
          getUser: () => queryClient.ensureQueryData(userQueryConfig),
        } as RouterContext
      }
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AutoLogoutProvider>
        <AppRouter />
      </AutoLogoutProvider>
    </QueryClientProvider>
  </StrictMode>
);

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
