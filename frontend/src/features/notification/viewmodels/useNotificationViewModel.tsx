import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import type { NotificationsResponse } from '@/services/notificationService';

export function useNotificationViewModel() {
  const queryClient = useQueryClient();

  //get notifications using TanStack Query
  const { data, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    refetchInterval: 5000, // refetch every 5 seconds
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // filter for tabs (all and unread)
  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => n.isRead);

  // mark as read
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      // refresh notifications after marking as read
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const deleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  return {
    isLoading,
    unreadCount,
    allNotifications,
    unreadNotifications,
    deleteNotification,
    markAsRead,
    markAllAsRead,
  };
}
