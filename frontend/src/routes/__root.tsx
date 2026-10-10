import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClient } from '@tanstack/react-query';
import { type User } from '@yseis/shared/userSchema';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

interface MyRouterContext {
  queryClient: QueryClient;
  getUser: () => Promise<User | null>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-sm max-w-md">
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'An unexpected runtime error occurred.'}
        </p>
      </div>
      <Button onClick={reset} variant="default">
        Try again
      </Button>
    </div>
  ),
  component: () => (
    <>
      {/* Your Navbar would go here */}
      <ThemeProvider>
        <Outlet />
        <Toaster position="top-center" />
      </ThemeProvider>

      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  ),
});
