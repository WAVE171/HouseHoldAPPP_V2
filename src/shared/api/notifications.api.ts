import { apiClient } from './client';

// Types
export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_DUE'
  | 'BILL_DUE'
  | 'LOW_STOCK'
  | 'EXPIRING_ITEM'
  | 'UPCOMING_EVENT'
  | 'VACCINATION_DUE'
  | 'MAINTENANCE_DUE'
  | 'GENERAL';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface NotificationQuery {
  type?: NotificationType;
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface NotificationResponse {
  data: Notification[];
  meta: {
    total: number;
    unreadCount: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
}

// API functions
export const notificationsApi = {
  getNotifications: async (query?: NotificationQuery): Promise<NotificationResponse> => {
    const params: Record<string, string> = {};
    if (query?.type) params.type = query.type;
    if (query?.unreadOnly) params.unreadOnly = 'true';
    if (query?.limit) params.limit = query.limit.toString();
    if (query?.offset) params.offset = query.offset.toString();

    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },

  createNotification: async (data: CreateNotificationData): Promise<Notification> => {
    const response = await apiClient.post('/notifications', data);
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  deleteAllRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.delete('/notifications/read/all');
    return response.data;
  },
};
