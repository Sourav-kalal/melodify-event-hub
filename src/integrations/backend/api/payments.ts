import { apiClient } from '../client';
import { Payment, ListResponse } from '../types';

export const paymentsApi = {
  // Get all payments (admin/instructor only)
  list: async (): Promise<ListResponse<Payment>> => {
    const response = await apiClient
      .getClient()
      .get<ListResponse<Payment>>('/payments');
    return response.data;
  },

  // Get single payment by ID
  get: async (id: string): Promise<Payment> => {
    const response = await apiClient.getClient().get<Payment>(`/payments/${id}`);
    return response.data;
  },

  // Create a new payment record (admin only)
  create: async (payment: Omit<Payment, 'id' | 'createdAt'>): Promise<Payment> => {
    const response = await apiClient.getClient().post<Payment>('/payments', payment);
    return response.data;
  },

  // Update a payment (admin only)
  update: async (id: string, payment: Partial<Payment>): Promise<Payment> => {
    const response = await apiClient
      .getClient()
      .put<Payment>(`/payments/${id}`, payment);
    return response.data;
  },

  // Delete a payment (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/payments/${id}`);
  },

  // Update payment status
  updateStatus: async (id: string, status: string): Promise<Payment> => {
    return paymentsApi.update(id, { status });
  },
};
