import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../integrations/backend/api/payments';
import { Payment } from '../integrations/backend/types';

const PAYMENTS_QUERY_KEY = ['payments'];

export const usePayments = () => {
  return useQuery({
    queryKey: PAYMENTS_QUERY_KEY,
    queryFn: () => paymentsApi.list(),
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, id],
    queryFn: () => paymentsApi.get(id),
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payment: Omit<Payment, 'id' | 'createdAt'>) => paymentsApi.create(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payment }: { id: string; payment: Partial<Payment> }) =>
      paymentsApi.update(id, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      paymentsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    },
  });
};
