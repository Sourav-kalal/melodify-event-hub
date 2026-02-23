import { apiClient } from '../client';
import { UserRole, ListResponse, AppRole } from '../types';

export const userRolesApi = {
  // Get all user roles (admin/instructor only)
  list: async (): Promise<ListResponse<UserRole>> => {
    const response = await apiClient
      .getClient()
      .get<ListResponse<UserRole>>('/userroles');
    return response.data;
  },

  // Get single user role by ID
  get: async (id: string): Promise<UserRole> => {
    const response = await apiClient.getClient().get<UserRole>(`/userroles/${id}`);
    return response.data;
  },

  // Create a new user role (admin only)
  create: async (userRole: Omit<UserRole, 'id' | 'createdAt'>): Promise<UserRole> => {
    const response = await apiClient.getClient().post<UserRole>('/userroles', userRole);
    return response.data;
  },

  // Update a user role (admin only)
  update: async (id: string, userRole: Partial<UserRole>): Promise<UserRole> => {
    const response = await apiClient
      .getClient()
      .put<UserRole>(`/userroles/${id}`, userRole);
    return response.data;
  },

  // Delete a user role (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/userroles/${id}`);
  },

  // Assign role to user
  assignRole: async (userId: string, role: AppRole): Promise<UserRole> => {
    return userRolesApi.create({ userId, role, createdAt: new Date().toISOString() });
  },
};
