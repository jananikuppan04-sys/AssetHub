import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/admin.service';
import type { FilterState, Department, Category, Employee, RoleDefinition } from '@/types';

export function useDepartments(filters?: FilterState) {
  const [data, setData] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getDepartments(filters);
      setData(res.data.data);
      setTotal(res.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch departments');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, total, isLoading, error, refresh: fetch };
}

export function useCategories(filters?: FilterState) {
  const [data, setData] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getCategories(filters);
      setData(res.data.data);
      setTotal(res.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, total, isLoading, error, refresh: fetch };
}

export function useEmployees(filters?: FilterState) {
  const [data, setData] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getEmployees(filters);
      setData(res.data.data);
      setTotal(res.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, total, isLoading, error, refresh: fetch };
}

export function useRoles(filters?: FilterState) {
  const [data, setData] = useState<RoleDefinition[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getRoles(filters);
      setData(res.data.data);
      setTotal(res.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch roles');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);
  return { data, total, isLoading, error, refresh: fetch };
}
