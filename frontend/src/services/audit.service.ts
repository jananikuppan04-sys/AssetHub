import api from '@/api/axios';
import type { Audit, ApiResponse } from '@/types';
import { API } from '@/constants/api';
import { BaseService } from './base.service';

class AuditService extends BaseService<Audit> {
  constructor() { super(API.AUDITS.BASE); }

  async startAudit(id: string): Promise<ApiResponse<Audit>> {
    const { data } = await api.patch<ApiResponse<Audit>>(API.AUDITS.START(id));
    return data;
  }

  async completeAudit(id: string, payload: {
    missingAssets?: string[];
    damagedAssets?: string[];
    remarks?: string;
  }): Promise<ApiResponse<Audit>> {
    const { data } = await api.patch<ApiResponse<Audit>>(API.AUDITS.COMPLETE(id), payload);
    return data;
  }
}

export const auditService = new AuditService();
