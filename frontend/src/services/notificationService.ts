import { apiClient } from '@/lib/apiClient';

export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const notificationService = {
  
  // fetch all notifications
  async getNotifications(): Promise<NotificationsResponse> {
    const response = await apiClient.get('/notifications');
    return {
      notifications: response.data.notifications.map((n: any) => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        time: new Date(n.createdAt).toLocaleString(),
        unread: !n.isRead,
      })),
      unreadCount: response.data.unreadCount,
    };
  },

  // mark a notification as read
  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  // mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  },

  // delete a notification
  async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },
};