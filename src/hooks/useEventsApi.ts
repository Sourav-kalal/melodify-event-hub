import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../integrations/backend/api/events';
import { Event } from '../integrations/backend/types';

const EVENTS_QUERY_KEY = ['events'];

export const useEvents = () => {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: () => eventsApi.list(),
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: [...EVENTS_QUERY_KEY, id],
    queryFn: () => eventsApi.get(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) =>
      eventsApi.create(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: Partial<Event> }) =>
      eventsApi.update(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
};

export const useToggleEventActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      eventsApi.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
};
