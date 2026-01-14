import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '@/services/itemService';
import { toast } from 'sonner';

export function useDeleteViewModel() {
  const queryClient = useQueryClient();

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => itemService.deleteItem(id),
    onSuccess: () => {
      // Refresh items list so UI updates pagination and counts
      void queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item deleted successfully');
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any).message
          : 'Failed to delete item';
      toast.error(message);
    },
  });

  return {
    deleteItem: (id: string) => deleteItemMutation.mutate(id),
    isDeleting: deleteItemMutation.isPending,
  } as const;
}
