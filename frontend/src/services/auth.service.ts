import api from '@/api/axios';
import type { ApiResponse, AuthResponse, User } from '@/types';
import { API } from '@/constants/api';

class AuthService {
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(API.AUTH.LOGIN, { email, password });
    return data;
  }

  async register(payload: { name: string; email: string; password: string; department?: string }): Promise<ApiResponse<User>> {
    const { data } = await api.post<ApiResponse<User>>(API.AUTH.REGISTER, payload);
    return data;
  }

  async logout(): Promise<void> {
    await api.post(API.AUTH.LOGOUT).catch(() => {/* ignore server errors on logout */});
  }

  async getMe(): Promise<ApiResponse<User>> {
    const { data } = await api.get<ApiResponse<User>>(API.AUTH.ME);
    return data;
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const { data } = await api.post<ApiResponse<null>>(API.AUTH.FORGOT_PASSWORD, { email });
    return data;
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    const { data } = await api.post<ApiResponse<null>>(API.AUTH.RESET_PASSWORD, { token, password });
    return data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    const { data } = await api.post<ApiResponse<null>>(API.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });
    return data;
  }
}

export const authService = new AuthService();
