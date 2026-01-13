import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen.ts';
import { queryClient } from '../lib/queryClient.ts';
import { queryOptions } from '@tanstack/react-query';
import { authService } from '../services/authService.ts';
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

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
