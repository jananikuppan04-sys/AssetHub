import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import type { DashboardData } from '@/types/dashboard';

export function useDashboardSummary(autoRefreshInterval = 0) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getSummary();
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (autoRefreshInterval > 0) {
      const interval = setInterval(() => fetchDashboard(true), autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval, fetchDashboard]);

  return { data, isLoading, error, refresh: () => fetchDashboard(false) };
}
