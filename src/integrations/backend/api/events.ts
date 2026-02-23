import { apiClient } from '../client';
import { Event, ListResponse } from '../types';

export const eventsApi = {
  // Get all events
  list: async (): Promise<ListResponse<Event>> => {
    const response = await apiClient.getClient().get<ListResponse<Event>>('/events');
    return response.data;
  },

  // Get single event by ID
  get: async (id: string): Promise<Event> => {
    const response = await apiClient.getClient().get<Event>(`/events/${id}`);
    return response.data;
  },

  // Create a new event (admin only)
  create: async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
    const response = await apiClient.getClient().post<Event>('/events', event);
    return response.data;
  },

  // Update an event (admin only)
  update: async (id: string, event: Partial<Event>): Promise<Event> => {
    const response = await apiClient.getClient().put<Event>(`/events/${id}`, event);
    return response.data;
  },

  // Delete an event (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/events/${id}`);
  },

  // Toggle event active status
  toggleActive: async (id: string, isActive: boolean): Promise<Event> => {
    return eventsApi.update(id, { isActive });
  },
};
