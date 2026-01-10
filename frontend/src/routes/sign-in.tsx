import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginView } from '../features/auth/views/LoginView';

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(''),
});

export const Route = createFileRoute('/sign-in')({
  validateSearch: loginSearchSchema,
  beforeLoad: async ({ context, search }) => {
    try {
      const user = await context.getUser();

      if (user) {
        throw redirect({
          to: search.redirect || '/',
        });
      }
    } catch (error) {
      if (error instanceof Response) throw error;
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
