import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { routeTree } from './routeTree.gen.ts';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { queryClient } from './lib/queryClient.ts';
import { QueryClientProvider, queryOptions } from '@tanstack/react-query';
import { authService } from './features/auth/services/authService.ts';
import { AxiosError } from 'axios';
import AutoLogoutProvider from './features/auth/components/AutoLogoutProvider.tsx';

export const userQueryKey = 'auth-user';

const userQueryConfig = queryOptions({
  queryKey: [userQueryKey],
  queryFn: async ({ signal }) => {
    try {
      return await authService.getCurrentUser({ signal });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return null;
        }
      }

      throw error;
    }
  },
  staleTime: Infinity,
});

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    getUser: () => queryClient.ensureQueryData(userQueryConfig),
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AutoLogoutProvider>
        <RouterProvider router={router} />
      </AutoLogoutProvider>
    </QueryClientProvider>
  </StrictMode>
);

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
