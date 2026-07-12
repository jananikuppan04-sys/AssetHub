import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import type { ExecutiveSummary } from '@/types';

export function useExecutiveSummary(autoRefreshInterval = 0) {
  const [data, setData] = useState<ExecutiveSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getExecutiveSummary();
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch executive summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (autoRefreshInterval > 0) {
      const interval = setInterval(() => fetchSummary(true), autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval, fetchSummary]);

  return { data, isLoading, error, refresh: () => fetchSummary(false) };
}
