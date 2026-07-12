import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/analytics.service';
import type { AnalyticsResponse, DateRangeType } from '@/types/analytics';

export function useAnalytics(initialDateRange: DateRangeType = '30d') {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeType>(initialDateRange);

  const fetchAnalytics = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getAnalytics(dateRange);
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch analytics data.');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    isLoading,
    error,
    dateRange,
    setDateRange,
    refresh: () => fetchAnalytics(false),
  };
}
