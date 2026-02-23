import { apiClient } from '../client';
import { Enrollment, ListResponse } from '../types';

export const enrollmentsApi = {
  // Get all enrollments (admin/instructor only)
  list: async (): Promise<ListResponse<Enrollment>> => {
    const response = await apiClient
      .getClient()
      .get<ListResponse<Enrollment>>('/enrollments');
    return response.data;
  },

  // Get single enrollment by ID
  get: async (id: string): Promise<Enrollment> => {
    const response = await apiClient.getClient().get<Enrollment>(`/enrollments/${id}`);
    return response.data;
  },

  // Create a new enrollment (student enrolls in course)
  create: async (enrollment: Omit<Enrollment, 'id' | 'enrolledAt'>): Promise<Enrollment> => {
    const response = await apiClient.getClient().post<Enrollment>('/enrollments', enrollment);
    return response.data;
  },

  // Update an enrollment
  update: async (id: string, enrollment: Partial<Enrollment>): Promise<Enrollment> => {
    const response = await apiClient
      .getClient()
      .put<Enrollment>(`/enrollments/${id}`, enrollment);
    return response.data;
  },

  // Delete an enrollment
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/enrollments/${id}`);
  },
};
