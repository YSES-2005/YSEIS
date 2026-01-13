import { queryClient } from '@/lib/queryClient';
import { userQueryKey } from '@/lib/router';
import { authService } from '@/services/authService';
import { loginSchema } from '@schemas/loginSchema';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

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
    setError('');
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
