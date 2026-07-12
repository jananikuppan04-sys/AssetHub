import api from '@/api/axios';
import type { Allocation, ApiResponse } from '@/types';
import { API } from '@/constants/api';
import { BaseService } from './base.service';

class AllocationService extends BaseService<Allocation> {
  constructor() { super(API.ALLOCATIONS.BASE); }

  async returnAsset(id: string, payload: { condition?: string; notes?: string }): Promise<ApiResponse<Allocation>> {
    const { data } = await api.patch<ApiResponse<Allocation>>(API.ALLOCATIONS.RETURN(id), payload);
    return data;
  }
}

export const allocationService = new AllocationService();
