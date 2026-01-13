import { authService } from '@/services/authService';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { router } from '@/lib/router';

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.invalidate();
      queryClient.clear();
      window.location.href = '/sign-in';
    },
    onError: error => toast.error(error.message),
  });
}
