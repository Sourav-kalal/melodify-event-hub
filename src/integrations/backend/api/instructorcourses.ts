import { apiClient } from '../client';
import { InstructorCourse, ListResponse } from '../types';

export const instructorCoursesApi = {
  // Get all instructor course assignments (admin/instructor only)
  list: async (): Promise<ListResponse<InstructorCourse>> => {
    const response = await apiClient
      .getClient()
      .get<ListResponse<InstructorCourse>>('/instructorcourses');
    return response.data;
  },

  // Get single instructor course by ID
  get: async (id: string): Promise<InstructorCourse> => {
    const response = await apiClient
      .getClient()
      .get<InstructorCourse>(`/instructorcourses/${id}`);
    return response.data;
  },

  // Create a new instructor course assignment (admin only)
  create: async (
    assignment: Omit<InstructorCourse, 'id' | 'assignedAt'>
  ): Promise<InstructorCourse> => {
    const response = await apiClient
      .getClient()
      .post<InstructorCourse>('/instructorcourses', assignment);
    return response.data;
  },

  // Update an instructor course assignment (admin only)
  update: async (
    id: string,
    assignment: Partial<InstructorCourse>
  ): Promise<InstructorCourse> => {
    const response = await apiClient
      .getClient()
      .put<InstructorCourse>(`/instructorcourses/${id}`, assignment);
    return response.data;
  },

  // Delete an instructor course assignment (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/instructorcourses/${id}`);
  },

  // Assign instructor to course
  assignInstructor: async (instructorId: string, courseId: string): Promise<InstructorCourse> => {
    return instructorCoursesApi.create({ instructorId, courseId });
  },
};
