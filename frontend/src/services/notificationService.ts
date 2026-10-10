import { api } from '@/lib/apiClient';
import type { Notification } from '@yseis/shared/notificationSchema';

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const notificationService = {
  // fetch all notifications
  async getNotifications(): Promise<NotificationsResponse> {
    const { notifications, unreadCount } =
      await api.get<NotificationsResponse>('/notifications');

    return {
      notifications,
      unreadCount,
    };
  },

  // mark a notification as read
  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  // mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },

  // delete a notification
  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};
