import type { AxiosRequestConfig } from 'axios';
import api from '@/api/axios';
import type { ApiResponse, PaginatedResponse, FilterState } from '@/types';
import { buildQueryString } from '@/utils';

/**
 * BaseService — all entity services extend this.
 * Provides getAll, getById, create, update, delete, search.
 */
export class BaseService<T> {
  protected basePath: string;
  constructor(basePath: string) { this.basePath = basePath; }

  async getAll(filters?: FilterState): Promise<PaginatedResponse<T>> {
    const qs = buildQueryString((filters ?? {}) as Record<string, unknown>);
    const { data } = await api.get<PaginatedResponse<T>>(`${this.basePath}${qs}`);
    return data;
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const { data } = await api.get<ApiResponse<T>>(`${this.basePath}/${id}`);
    return data;
  }

  async create(payload: Partial<T> | FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const { data } = await api.post<ApiResponse<T>>(this.basePath, payload, config);
    return data;
  }

  async update(id: string, payload: Partial<T> | FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const { data } = await api.patch<ApiResponse<T>>(`${this.basePath}/${id}`, payload, config);
    return data;
  }

  async remove(id: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete<ApiResponse<null>>(`${this.basePath}/${id}`);
    return data;
  }

  async search(query: string, extra?: FilterState): Promise<PaginatedResponse<T>> {
    return this.getAll({ ...extra, search: query });
  }
}
