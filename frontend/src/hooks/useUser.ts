import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryConfig } from '@/main';

export function useUser() {
  const { data, refetch } = useSuspenseQuery(userQueryConfig);

  return {
    user: data,
    refetch,
  };
}
