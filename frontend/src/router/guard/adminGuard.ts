import { redirect } from '@tanstack/react-router';
import { ROUTE_PATHS } from '../path';
import { router } from '../router';

// Admin guard to protect admin routes
export const adminGuard = async ({
  context,
}: {
  context: (typeof router)['options']['context']; // Router context
}) => {
  const user = await context.getUser(); // Fetch the current user

  // Redirect to sign-in if not authenticated
  if (!user) {
    throw redirect({ to: ROUTE_PATHS.SIGN_IN });
  }

  if (user.role !== 'admin') {
    throw redirect({ to: ROUTE_PATHS.HOME });
  }
};
