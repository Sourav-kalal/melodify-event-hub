import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../integrations/backend/api/courses';
import { Course } from '../integrations/backend/types';

const COURSES_QUERY_KEY = ['courses'];

export const useCourses = () => {
  return useQuery({
    queryKey: COURSES_QUERY_KEY,
    queryFn: () => coursesApi.list(),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: [...COURSES_QUERY_KEY, id],
    queryFn: () => coursesApi.get(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) =>
      coursesApi.create(course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, course }: { id: string; course: Partial<Course> }) =>
      coursesApi.update(id, course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY });
    },
  });
};

export const useToggleCourseActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      coursesApi.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY });
    },
  });
};
