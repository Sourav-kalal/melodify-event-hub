import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '../integrations/backend/api/admissions';
import { Admission } from '../integrations/backend/types';

const ADMISSIONS_QUERY_KEY = ['admissions'];

export const useAdmissions = () => {
  return useQuery({
    queryKey: ADMISSIONS_QUERY_KEY,
    queryFn: () => admissionsApi.list(),
  });
};

export const useAdmission = (id: string) => {
  return useQuery({
    queryKey: [...ADMISSIONS_QUERY_KEY, id],
    queryFn: () => admissionsApi.get(id),
    enabled: !!id,
  });
};

export const useCreateAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (admission: Omit<Admission, 'id' | 'createdAt'>) =>
      admissionsApi.create(admission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSIONS_QUERY_KEY });
    },
  });
};

export const useUpdateAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, admission }: { id: string; admission: Partial<Admission> }) =>
      admissionsApi.update(id, admission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSIONS_QUERY_KEY });
    },
  });
};

export const useDeleteAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => admissionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSIONS_QUERY_KEY });
    },
  });
};

export const useUpdateAdmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      admissionsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSIONS_QUERY_KEY });
    },
  });
};
