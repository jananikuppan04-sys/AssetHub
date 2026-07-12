import api from '@/api/axios';
import type { Maintenance, ApiResponse } from '@/types';
import { API } from '@/constants/api';
import { BaseService } from './base.service';

class MaintenanceService extends BaseService<Maintenance> {
  constructor() { super(API.MAINTENANCE.BASE); }

  async approve(id: string): Promise<ApiResponse<Maintenance>> {
    const { data } = await api.patch<ApiResponse<Maintenance>>(API.MAINTENANCE.APPROVE(id));
    return data;
  }

  async assignTechnician(id: string, technicianId: string): Promise<ApiResponse<Maintenance>> {
    const { data } = await api.patch<ApiResponse<Maintenance>>(API.MAINTENANCE.ASSIGN(id), { technician: technicianId });
    return data;
  }

  async startWork(id: string): Promise<ApiResponse<Maintenance>> {
    const { data } = await api.patch<ApiResponse<Maintenance>>(API.MAINTENANCE.START(id));
    return data;
  }

  async resolve(id: string, payload: { resolutionNotes: string; actualCost?: number; condition: string }): Promise<ApiResponse<Maintenance>> {
    const { data } = await api.patch<ApiResponse<Maintenance>>(API.MAINTENANCE.RESOLVE(id), payload);
    return data;
  }
}

export const maintenanceService = new MaintenanceService();
