import { apiClient } from '../client';
import { User, ListResponse } from '../types';

export const usersApi = {
  // Get all users (admin only)
  list: async (): Promise<ListResponse<User>> => {
    const response = await apiClient.getClient().get<ListResponse<User>>('/users');
    return response.data;
  },

  // Get single user by ID (admin only)
  get: async (id: string): Promise<User> => {
    const response = await apiClient.getClient().get<User>(`/users/${id}`);
    return response.data;
  },

  // Delete a user (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/users/${id}`);
  },
};
