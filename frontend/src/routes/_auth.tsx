import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, location }) => {
    try {
      const user = await context.getUser();

      if (!user) {
        throw new Error('No user found');
      }

      return { user };
    } catch {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
