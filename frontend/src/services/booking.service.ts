import api from '@/api/axios';
import type { Booking, ApiResponse } from '@/types';
import { API } from '@/constants/api';
import { BaseService } from './base.service';

class BookingService extends BaseService<Booking> {
  constructor() { super(API.BOOKINGS.BASE); }

  async approve(id: string): Promise<ApiResponse<Booking>> {
    const { data } = await api.patch<ApiResponse<Booking>>(API.BOOKINGS.APPROVE(id));
    return data;
  }

  async reject(id: string, reason: string): Promise<ApiResponse<Booking>> {
    const { data } = await api.patch<ApiResponse<Booking>>(API.BOOKINGS.REJECT(id), { rejectionReason: reason });
    return data;
  }
}

export const bookingService = new BookingService();
