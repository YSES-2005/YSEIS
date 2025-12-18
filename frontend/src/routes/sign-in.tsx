import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginView } from '../features/auth/views/LoginView';

// 1. Define the search params schema
// We capture 'redirect' so we know where to send them back to
const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(''),
});

export const Route = createFileRoute('/sign-in')({
  // Validate the URL: /login?redirect=/items
  validateSearch: loginSearchSchema,

  // 2. Redirect Guard
  // If the user visits /login but is ALREADY logged in, send them home.
  beforeLoad: async ({ context, search }) => {
    const user = await context.getUser();

    if (user) {
      throw redirect({
        to: search.redirect || '/',
      });
    }
  },

  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const handleLoginSuccess = () => {
    navigate({ to: search.redirect || '/' });
  };

  return <LoginView onSuccess={handleLoginSuccess} />;
}
