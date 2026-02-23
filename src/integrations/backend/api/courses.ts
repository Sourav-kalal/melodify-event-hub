import { apiClient } from '../client';
import { Course, ListResponse } from '../types';

export const coursesApi = {
  // Get all courses
  list: async (): Promise<ListResponse<Course>> => {
    const response = await apiClient.getClient().get<ListResponse<Course>>('/courses');
    return response.data;
  },

  // Get single course by ID
  get: async (id: string): Promise<Course> => {
    const response = await apiClient.getClient().get<Course>(`/courses/${id}`);
    return response.data;
  },

  // Create a new course (admin only)
  create: async (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    const response = await apiClient.getClient().post<Course>('/courses', course);
    return response.data;
  },

  // Update a course (admin only)
  update: async (id: string, course: Partial<Course>): Promise<Course> => {
    const response = await apiClient.getClient().put<Course>(`/courses/${id}`, course);
    return response.data;
  },

  // Delete a course (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/courses/${id}`);
  },

  // Toggle course active status
  toggleActive: async (id: string, isActive: boolean): Promise<Course> => {
    return coursesApi.update(id, { isActive });
  },
};
