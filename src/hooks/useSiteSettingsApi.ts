import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingsApi } from '../integrations/backend/api/sitesettings';
import { SiteSetting } from '../integrations/backend/types';

const SITE_SETTINGS_QUERY_KEY = ['siteSettings'];

export const useSiteSettings = () => {
  return useQuery({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: () => siteSettingsApi.list(),
  });
};

export const useSiteSetting = (id: string) => {
  return useQuery({
    queryKey: [...SITE_SETTINGS_QUERY_KEY, id],
    queryFn: () => siteSettingsApi.get(id),
    enabled: !!id,
  });
};

export const useSiteSettingByKey = (key: string) => {
  return useQuery({
    queryKey: [...SITE_SETTINGS_QUERY_KEY, 'key', key],
    queryFn: () => siteSettingsApi.getByKey(key),
    enabled: !!key,
  });
};

export const useCreateSiteSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (setting: Omit<SiteSetting, 'id' | 'updatedAt'>) =>
      siteSettingsApi.create(setting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    },
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, setting }: { id: string; setting: Partial<SiteSetting> }) =>
      siteSettingsApi.update(id, setting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    },
  });
};

export const useDeleteSiteSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => siteSettingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    },
  });
};
