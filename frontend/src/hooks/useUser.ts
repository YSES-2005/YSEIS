import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryConfig } from '../router/router';

export function useUser() {
  const { data, refetch } = useSuspenseQuery(userQueryConfig);

  return {
    user: data,
    refetch,
  };
}
