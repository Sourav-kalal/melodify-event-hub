import { apiClient } from '../client';
import { Admission, ListResponse } from '../types';

export const admissionsApi = {
  // Get all admissions (admin/instructor only)
  list: async (): Promise<ListResponse<Admission>> => {
    const response = await apiClient
      .getClient()
      .get<ListResponse<Admission>>('/admissions');
    return response.data;
  },

  // Get single admission by ID
  get: async (id: string): Promise<Admission> => {
    const response = await apiClient.getClient().get<Admission>(`/admissions/${id}`);
    return response.data;
  },

  // Create a new admission application
  create: async (admission: Omit<Admission, 'id' | 'createdAt'>): Promise<Admission> => {
    const response = await apiClient.getClient().post<Admission>('/admissions', admission);
    return response.data;
  },

  // Update an admission (admin only)
  update: async (id: string, admission: Partial<Admission>): Promise<Admission> => {
    const response = await apiClient
      .getClient()
      .put<Admission>(`/admissions/${id}`, admission);
    return response.data;
  },

  // Delete an admission (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/admissions/${id}`);
  },

  // Update admission status (pending, approved, rejected)
  updateStatus: async (id: string, status: string): Promise<Admission> => {
    return admissionsApi.update(id, { status });
  },
};
