import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClient } from '@tanstack/react-query';
import { type User } from '@schemas/userSchema';
import { ThemeProvider } from '@/components/ThemeProvider';

interface MyRouterContext {
  queryClient: QueryClient;
  getUser: () => Promise<User | null>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      {/* Your Navbar would go here */}
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>

      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  ),
});
