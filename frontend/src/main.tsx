import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { routeTree } from './routeTree.gen.ts';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { queryClient } from './lib/queryClient.ts';
import { QueryClientProvider, queryOptions } from '@tanstack/react-query';
import { authService } from './services/authService.ts';
import AutoLogoutProvider from './features/auth/components/AutoLogoutProvider.tsx';
import { isAxiosError } from 'axios';

export const userQueryKey = 'user';

export const userQueryConfig = queryOptions({
  queryKey: [userQueryKey],
  queryFn: async ({ signal }) => {
    return await authService.getCurrentUser({ signal });
  },
  staleTime: Infinity,
  retry: (failureCount, error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      return false;
    }
    return failureCount < 3;
  },
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
