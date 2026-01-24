import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value || "";
        return acc;
      }, {} as Record<string, string>);
    },
  });

  const [formData, setFormData] = useState<Record<string, string>>({});

  // Sync form with fetched settings
  useState(() => {
    if (settings) {
      setFormData(settings);
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      for (const [key, value] of Object.entries(data)) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ setting_key: key, setting_value: value }, { onConflict: "setting_key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings-admin"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Settings saved successfully");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const getValue = (key: string) => formData[key] ?? settings?.[key] ?? "";

  const setValue = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Site Settings">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Site Settings">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">General Settings</CardTitle>
            <CardDescription>
              Configure global settings for your website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about">About Text</Label>
              <Textarea
                id="about"
                value={getValue("about_text")}
                onChange={(e) => setValue("about_text", e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="hero_banner">Hero Banner URL</Label>
              <Input
                id="hero_banner"
                type="url"
                value={getValue("hero_banner_url")}
                onChange={(e) => setValue("hero_banner_url", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Contact Settings</CardTitle>
            <CardDescription>
              Configure WhatsApp number for course inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsapp">Global WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={getValue("global_whatsapp_number")}
                onChange={(e) => setValue("global_whatsapp_number", e.target.value)}
                placeholder="+919876543210"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for all courses unless overridden at course level.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Payment Settings</CardTitle>
            <CardDescription>
              Configure UPI payment details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="upi">UPI ID</Label>
              <Input
                id="upi"
                value={getValue("upi_id")}
                onChange={(e) => setValue("upi_id", e.target.value)}
                placeholder="yourname@upi"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" variant="hero" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </form>
    </DashboardLayout>
  );
};

export default AdminSettings;
