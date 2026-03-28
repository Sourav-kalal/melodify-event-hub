import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings-admin"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sitesettings`, {
        headers: { 'Authorization': `Bearer ${user?.access_token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      return data.reduce((acc: any, item: any) => {
        acc[item.settingKey] = item;
        return acc;
      }, {} as Record<string, any>);
    },
    enabled: !!user,
  });

  const [formData, setFormData] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      for (const [key, value] of Object.entries(data)) {
        const existing = settings?.[key];
        const url = existing
          ? `${import.meta.env.VITE_API_URL}/api/sitesettings/${existing.id}`
          : `${import.meta.env.VITE_API_URL}/api/sitesettings`;
        const method = existing ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.access_token}`
          },
          body: JSON.stringify({
            id: existing?.id,
            settingKey: key,
            settingValue: value
          })
        });
        if (!response.ok) throw new Error(`Failed to save setting: ${key}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings-admin"] });
      toast.success("Settings saved successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save settings");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const getValue = (key: string) => formData[key] ?? settings?.[key]?.settingValue ?? "";

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

        {/* Google Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Google Integration</CardTitle>
            <CardDescription>
              Configure Google OAuth credentials for Calendar integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="google_client_id">Google Client ID</Label>
              <Input
                id="google_client_id"
                value={getValue("google_client_id")}
                onChange={(e) => setValue("google_client_id", e.target.value)}
                placeholder="your-client-id.apps.googleusercontent.com"
              />
            </div>
            <div>
              <Label htmlFor="google_client_secret">Google Client Secret</Label>
              <Input
                id="google_client_secret"
                type="password"
                value={getValue("google_client_secret")}
                onChange={(e) => setValue("google_client_secret", e.target.value)}
                placeholder="your-client-secret"
              />
            </div>
            <div>
              <Label htmlFor="google_redirect_uri">Redirect URI</Label>
              <Input
                id="google_redirect_uri"
                value={getValue("google_redirect_uri")}
                onChange={(e) => setValue("google_redirect_uri", e.target.value)}
                placeholder="http://localhost:8080/api/auth/google/callback"
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
