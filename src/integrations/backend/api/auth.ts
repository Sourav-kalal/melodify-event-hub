import { apiClient } from '../client';
import { AuthRequest, AuthResponse, RegisterRequest, AppRole } from '../types';

export const authApi = {
  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.getClient().post<AuthResponse>('/auth/register', {
      email: request.email,
      password: request.password,
      roles: request.roles || [AppRole.STUDENT],
    });
    return response.data;
  },

  login: async (request: AuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.getClient().post<AuthResponse>('/auth/login', request);
    return response.data;
  },

  logout: () => {
    apiClient.setAuthToken(null);
    localStorage.removeItem('user');
  },

  setToken: (token: string) => {
    apiClient.setAuthToken(token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};
