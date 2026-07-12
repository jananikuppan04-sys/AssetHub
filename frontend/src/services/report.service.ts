import api from '@/api/axios';
import { API } from '@/constants/api';
import { downloadBlob } from '@/utils';

type ReportModule = 'assets' | 'allocations' | 'transfers' | 'bookings' | 'maintenance' | 'audits';
type ReportFormat = 'csv' | 'excel' | 'pdf';

class ReportService {
  async generate(
    module: ReportModule,
    format: ReportFormat = 'excel',
    filter?: Record<string, unknown>
  ): Promise<void> {
    const response = await api.post(
      `${API.REPORTS.GENERATE(module)}?format=${format}`,
      filter ?? {},
      { responseType: 'blob' }
    );

    const ext = format === 'excel' ? 'xlsx' : format;
    const filename = `${module}-report-${Date.now()}.${ext}`;
    downloadBlob(response.data as Blob, filename);
  }
}

export const reportService = new ReportService();
