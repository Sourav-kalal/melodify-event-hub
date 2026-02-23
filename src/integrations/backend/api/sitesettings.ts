import { apiClient } from '../client';
import { SiteSetting, ListResponse } from '../types';

export const siteSettingsApi = {
  // Get all settings
  list: async (): Promise<ListResponse<SiteSetting>> => {
    const response = await apiClient
      .getClient()
      .get<ListResponse<SiteSetting>>('/sitesettings');
    return response.data;
  },

  // Get single setting by ID
  get: async (id: string): Promise<SiteSetting> => {
    const response = await apiClient
      .getClient()
      .get<SiteSetting>(`/sitesettings/${id}`);
    return response.data;
  },

  // Get setting by key (convenience method)
  getByKey: async (key: string): Promise<SiteSetting | null> => {
    try {
      const settings = await siteSettingsApi.list();
      return settings.find((s) => s.settingKey === key) || null;
    } catch {
      return null;
    }
  },

  // Create a new setting (admin only)
  create: async (setting: Omit<SiteSetting, 'id' | 'updatedAt'>): Promise<SiteSetting> => {
    const response = await apiClient
      .getClient()
      .post<SiteSetting>('/sitesettings', setting);
    return response.data;
  },

  // Update a setting (admin only)
  update: async (id: string, setting: Partial<SiteSetting>): Promise<SiteSetting> => {
    const response = await apiClient
      .getClient()
      .put<SiteSetting>(`/sitesettings/${id}`, setting);
    return response.data;
  },

  // Delete a setting (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.getClient().delete(`/sitesettings/${id}`);
  },
};
