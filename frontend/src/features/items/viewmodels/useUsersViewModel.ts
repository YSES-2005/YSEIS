import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import type { UserListItem } from '@schemas/userSchema';
import { useUser } from '@/hooks/useUser';

export function useUsersViewModel() {
  const { user } = useUser();
  const isAdmin = user?.role === 'admin';

  const { data, isLoading, error, refetch } = useQuery<UserListItem[]>({
    queryKey: ['users'],
    queryFn: authService.getAllUsers,
    staleTime: Infinity,
    enabled: isAdmin,
  });

  const users = data || [];

  const options = users.map(u => ({ value: u._id, label: u.name }));

  return {
    users,
    options,
    isLoading,
    error,
    refetch,
  } as const;
}

export default useUsersViewModel;
