import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '../integrations/backend/api/enrollments';
import { Enrollment } from '../integrations/backend/types';

const ENROLLMENTS_QUERY_KEY = ['enrollments'];

export const useEnrollments = () => {
  return useQuery({
    queryKey: ENROLLMENTS_QUERY_KEY,
    queryFn: () => enrollmentsApi.list(),
  });
};

export const useEnrollment = (id: string) => {
  return useQuery({
    queryKey: [...ENROLLMENTS_QUERY_KEY, id],
    queryFn: () => enrollmentsApi.get(id),
    enabled: !!id,
  });
};

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollment: Omit<Enrollment, 'id' | 'enrolledAt'>) =>
      enrollmentsApi.create(enrollment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENTS_QUERY_KEY });
    },
  });
};

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enrollment }: { id: string; enrollment: Partial<Enrollment> }) =>
      enrollmentsApi.update(id, enrollment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENTS_QUERY_KEY });
    },
  });
};

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enrollmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENTS_QUERY_KEY });
    },
  });
};
