import { authService } from '@/services/authService';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/main';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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
