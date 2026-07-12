import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User, AuthTokens } from '@/types';
import { ROLE_PERMISSIONS, type Permission } from '@/constants/routes';
import api from '@/api/axios';

// ============================================================
// Context Interfaces
// ============================================================

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  hasPermission: (permission: Permission) => boolean;
}

// ============================================================
// Context
// ============================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userRaw = localStorage.getItem('user');
    if (token && userRaw) {
      try {
        const user: User = JSON.parse(userRaw);
        setState({ user, accessToken: token, isAuthenticated: true, isLoading: false });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.clear();
        setState((s) => ({ ...s, isLoading: false }));
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ data: { user: User; tokens: AuthTokens } }>(
      '/auth/login',
      { email, password }
    );
    const { user, tokens } = res.data.data;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
    setState({ user, accessToken: tokens.accessToken, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  const refreshToken = useCallback(async () => {
    const stored = localStorage.getItem('refreshToken');
    if (!stored) { logout(); return; }
    const res = await api.post<{ data: AuthTokens }>('/auth/refresh', { refreshToken: stored });
    const { accessToken, refreshToken: newRefresh } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setState((s) => ({ ...s, accessToken }));
  }, [logout]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState((s) => {
      if (!s.user) return s;
      const updated = { ...s.user, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return { ...s, user: updated };
    });
  }, []);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!state.user) return false;
      const perms = ROLE_PERMISSIONS[state.user.role] ?? [];
      return perms.includes(permission);
    },
    [state.user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout, refreshToken, updateUser, hasPermission }),
    [state, login, logout, refreshToken, updateUser, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================
// Hook
// ============================================================

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
