import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { queryClient } from './lib/queryClient.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import AutoLogoutProvider from './features/auth/components/AutoLogoutProvider.tsx';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/lib/router.ts';

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
