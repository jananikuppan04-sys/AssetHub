import api from '@/api/axios';
import type { Notification, ApiResponse } from '@/types';
import { API } from '@/constants/api';
import { BaseService } from './base.service';

class NotificationService extends BaseService<Notification> {
  constructor() { super(API.NOTIFICATIONS.BASE); }

  async markRead(id: string): Promise<ApiResponse<Notification>> {
    const { data } = await api.patch<ApiResponse<Notification>>(API.NOTIFICATIONS.READ(id));
    return data;
  }

  async markAllRead(): Promise<ApiResponse<null>> {
    const { data } = await api.patch<ApiResponse<null>>(API.NOTIFICATIONS.READ_ALL);
    return data;
  }
}

export const notificationService = new NotificationService();
