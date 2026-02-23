import { apiClient } from '../client';
import { Profile, ListResponse } from '../types';

export const profilesApi = {
  // Get all profiles (admin/instructor only)
  list: async (): Promise<ListResponse<Profile>> => {
    const response = await apiClient
      .getClient()
      .get<ListResponse<Profile>>('/profiles');
    return response.data;
  },

  // Get single profile by ID
  get: async (id: string): Promise<Profile> => {
    const response = await apiClient.getClient().get<Profile>(`/profiles/${id}`);
    return response.data;
  },

  // Create a new profile (admin only)
  create: async (profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> => {
    const response = await apiClient.getClient().post<Profile>('/profiles', profile);
    return response.data;
  },

  // Update a profile (admin only)
  update: async (id: string, profile: Partial<Profile>): Promise<Profile> => {
    const response = await apiClient
      .getClient()
      .put<Profile>(`/profiles/${id}`, profile);
    return response.data;
  },

  // Delete a profile (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/profiles/${id}`);
  },
};
