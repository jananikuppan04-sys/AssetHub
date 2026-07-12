import { useState, useCallback, useRef } from 'react';
import type { PaginatedResponse, FilterState } from '@/types';
import type { BaseService } from '@/services/base.service';

interface UseApiState<T> {
  data: T[] | null;
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  fetch: (filters?: FilterState) => Promise<void>;
  reset: () => void;
}

/**
 * useApi — generic hook for any BaseService.getAll() call.
 * Handles loading, error, pagination metadata.
 */
export function useApi<T>(service: Pick<BaseService<T>, 'getAll'>): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    total: 0,
    totalPages: 0,
    isLoading: false,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(
    async (filters?: FilterState) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const res: PaginatedResponse<T> = await service.getAll(filters);
        setState({
          data: res.data.data ?? [],
          total: res.data.total,
          totalPages: res.data.totalPages,
          isLoading: false,
          error: null,
        });
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to load data';
        setState((s) => ({ ...s, isLoading: false, error: msg }));
      }
    },
    [service]
  );

  const reset = useCallback(() => {
    setState({ data: null, total: 0, totalPages: 0, isLoading: false, error: null });
  }, []);

  return { ...state, fetch, reset };
}
