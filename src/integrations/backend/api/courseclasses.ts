import { apiClient } from '../client';
import { CourseClass, ListResponse } from '../types';

export const courseClassesApi = {
  // Get all course classes (admin/instructor only)
  list: async (): Promise<ListResponse<CourseClass>> => {
    const response = await apiClient
      .getClient()
      .get<ListResponse<CourseClass>>('/classes');
    return response.data;
  },

  // Get single course class by ID
  get: async (id: string): Promise<CourseClass> => {
    const response = await apiClient.getClient().get<CourseClass>(`/classes/${id}`);
    return response.data;
  },

  // Create a new course class (admin only)
  create: async (courseClass: Omit<CourseClass, 'id' | 'createdAt'>): Promise<CourseClass> => {
    const response = await apiClient
      .getClient()
      .post<CourseClass>('/classes', courseClass);
    return response.data;
  },

  // Update a course class (admin only)
  update: async (id: string, courseClass: Partial<CourseClass>): Promise<CourseClass> => {
    const response = await apiClient
      .getClient()
      .put<CourseClass>(`/classes/${id}`, courseClass);
    return response.data;
  },

  // Delete a course class (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/classes/${id}`);
  },
};
