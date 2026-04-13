import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SiteSettingRecord {
  id: string;
  settingKey: string;
  settingValue: string;
}

interface SiteContentContextType {
  settings: Record<string, SiteSettingRecord>;
  getContent: (key: string, defaultValue: string) => string;
  updateContent: (key: string, value: string) => Promise<void>;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  isLoading: boolean;
  isSaving: boolean;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, SiteSettingRecord>>({});
  const [isEditMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user, role } = useAuth();

  // Fetch all site settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sitesettings`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data: SiteSettingRecord[] = await response.json();
        const mapped = data.reduce((acc, item) => {
          acc[item.settingKey] = item;
          return acc;
        }, {} as Record<string, SiteSettingRecord>);
        setSettings(mapped);
      } catch (error) {
        console.error("Failed to load site settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getContent = useCallback(
    (key: string, defaultValue: string): string => {
      return settings[key]?.settingValue ?? defaultValue;
    },
    [settings]
  );

  const updateContent = useCallback(
    async (key: string, value: string) => {
      if (!user?.access_token) {
        toast.error("You must be logged in to edit content");
        return;
      }

      setIsSaving(true);
      try {
        const existing = settings[key];
        const url = existing
          ? `${import.meta.env.VITE_API_URL}/api/sitesettings/${existing.id}`
          : `${import.meta.env.VITE_API_URL}/api/sitesettings`;
        const method = existing ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
          body: JSON.stringify({
            id: existing?.id,
            settingKey: key,
            settingValue: value,
          }),
        });

        if (!response.ok) throw new Error(`Failed to save setting: ${key}`);

        const saved: SiteSettingRecord = await response.json();
        setSettings((prev) => ({
          ...prev,
          [key]: saved,
        }));

        toast.success("Content updated successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to save content");
      } finally {
        setIsSaving(false);
      }
    },
    [settings, user]
  );

  // Only admins can enable edit mode
  const handleSetEditMode = useCallback(
    (mode: boolean) => {
      if (mode && role !== "admin") {
        toast.error("Only admins can edit content");
        return;
      }
      setEditMode(mode);
    },
    [role]
  );

  return (
    <SiteContentContext.Provider
      value={{
        settings,
        getContent,
        updateContent,
        isEditMode,
        setEditMode: handleSetEditMode,
        isLoading,
        isSaving,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }
  return context;
}
