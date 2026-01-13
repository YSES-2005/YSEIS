import { userQueryConfig } from '@/lib/router';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useUser() {
  const { data, refetch } = useSuspenseQuery(userQueryConfig);

  return {
    user: data,
    refetch,
  };
}
