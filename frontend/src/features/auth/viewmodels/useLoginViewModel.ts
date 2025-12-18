import { queryClient } from '@/lib/queryClient';
import { userQueryKey } from '@/main';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { authService } from '../services/authService';
import { loginSchema } from '../../../../../shared/dist/loginSchema';

export function useLoginViewModel({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: data => {
      queryClient.setQueryData([userQueryKey], data);
      onSuccess();
    },
    onError: () => setError('Invalid email or password'),
  });

  const submit = (payload: unknown) => {
    setError(''); // Reset error

    const result = loginSchema.safeParse(payload);

    if (!result.success) {
      setError('Please enter a valid email and password.');
      return;
    }

    loginMutation.mutate(result.data);
  };

  return {
    submit,
    isLoading: loginMutation.isPending,
    error,
  };
}
