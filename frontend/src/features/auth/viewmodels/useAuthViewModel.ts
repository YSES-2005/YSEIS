import { authService } from '@/services/authService';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@schemas/userSchema';

// ViewModel for authentication state
export const useAuthViewModel = () => {
  // Query to fetch the current authenticated user
  const query = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Return user data and authentication status
  return {
    user: query.data ?? null,
    isAuthenticated: !!query.data,
    isAdmin: query.data?.role === 'admin',
    isLoading: query.isLoading,
  };
};
