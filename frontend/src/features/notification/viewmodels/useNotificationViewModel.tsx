import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import type { NotificationsResponse } from '@/services/notificationService'; // Assuming NotificationItem type exists
import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { socket } from '@/lib/socket';
import { toast } from 'sonner';

export function useNotificationViewModel() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const userId = user && '_id' in user ? (user as any)._id : (user as any)?.id;

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_user_room', userId);

    const handleNewNotification = (notification: any) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      toast.info(notification.title, {
        description: notification.message,
        id: notification._id || notification.id,
      });
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [userId, queryClient]);

  const { data, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
    staleTime: Infinity,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const allNotifications = notifications;
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    isLoading,
    unreadCount,
    allNotifications,
    unreadNotifications,
    deleteNotification: (id: string) => deleteNotificationMutation.mutate(id),
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    isMarkingRead: markAsReadMutation.isPending,
    isMarkingAllRead: markAllAsReadMutation.isPending,
  };
}
