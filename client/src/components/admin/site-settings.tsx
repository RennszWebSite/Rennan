import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SiteSettings, UpdateSiteSettings } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export function SiteSettingsManager() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  const [formData, setFormData] = useState<{
    siteTitle: string;
    metaDescription: string;
    footerText: string;
    socialLinks: {
      twitchMain: string;
      twitchGaming: string;
      twitter: string;
      xCommunity: string;
      instagram: string;
      discord: string;
    };
    analyticsEnabled: boolean;
  }>({
    siteTitle: "",
    metaDescription: "",
    footerText: "",
    socialLinks: {
      twitchMain: "",
      twitchGaming: "",
      twitter: "",
      xCommunity: "",
      instagram: "",
      discord: ""
    },
    analyticsEnabled: false
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteTitle: settings.siteTitle || "RENNSZ - Premium Travel Streamer",
        metaDescription: settings.metaDescription || "Join RENNSZ on luxury travel adventures around the world. Premium travel streaming experiences from exotic destinations.",
        footerText: settings.footerText || "Made with ❤️ by sf.xen on discord",
        socialLinks: settings.socialLinks ? { ...settings.socialLinks } : {
          twitchMain: "https://www.twitch.tv/rennsz",
          twitchGaming: "https://www.twitch.tv/rennszino",
          twitter: "https://x.com/rennsz96?s=21",
          xCommunity: "https://x.com/i/communities/1823168507401634218",
          instagram: "https://www.instagram.com/rennsz?igsh=MWhjYjg2ZDV4dHc0bw==",
          discord: "https://discord.gg/hUTXCaSdKC"
        },
        analyticsEnabled: false // Placeholder for analytics toggle
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateSiteSettings) => {
      const response = await apiRequest("PUT", "/api/admin/site-settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/site-settings"]});
      toast({
        title: "Settings updated",
        description: "Site settings have been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update password");
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleAnalyticsToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      analyticsEnabled: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updateData: UpdateSiteSettings = {
      siteTitle: formData.siteTitle,
      metaDescription: formData.metaDescription,
      footerText: formData.footerText,
      socialLinks: formData.socialLinks
    };

    updateMutation.mutate(updateData);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Site Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-dark-light rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteTitle" className="block text-sm font-medium text-gray-400 mb-1">Site Title</Label>
              <Input
                id="siteTitle"
                name="siteTitle"
                value={formData.siteTitle}
                onChange={handleInputChange}
                className="bg-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="metaDescription" className="block text-sm font-medium text-gray-400 mb-1">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows={3}
                className="bg-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="footerText" className="block text-sm font-medium text-gray-400 mb-1">Footer Text</Label>
              <Input
                id="footerText"
                name="footerText"
                value={formData.footerText}
                onChange={handleInputChange}
                className="bg-dark border-gray-700"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="font-medium">Analytics Tracking</Label>
              <Switch
                id="analytics"
                checked={formData.analyticsEnabled}
                onCheckedChange={handleAnalyticsToggle}
              />
            </div>
          </div>
        </div>

        <div className="bg-dark-light rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="twitchMain" className="block text-sm font-medium text-gray-400 mb-1">Twitch (Main)</Label>
              <Input
                id="twitchMain"
                name="twitchMain"
                value={formData.socialLinks.twitchMain}
                onChange={handleSocialInputChange}
                className="bg-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="twitchGaming" className="block text-sm font-medium text-gray-400 mb-1">Twitch (Gaming)</Label>
              <Input
                id="twitchGaming"
                name="twitchGaming"
                value={formData.socialLinks.twitchGaming}
                onChange={handleSocialInputChange}
                className="bg-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="twitter" className="block text-sm font-medium text-gray-400 mb-1">Twitter/X</Label>
              <Input
                id="twitter"
                name="twitter"
                value={formData.socialLinks.twitter}
                onChange={handleSocialInputChange}
                className="bg-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="xCommunity" className="block text-sm font-medium text-gray-400 mb-1">X Community</Label>
              <Input
                id="xCommunity"
                name="xCommunity"
                value={formData.socialLinks.xCommunity}
                onChange={handleSocialInputChange}
                className="bg-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="instagram" className="block text-sm font-medium text-gray-400 mb-1">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                value={formData.socialLinks.instagram}
                onChange={handleSocialInputChange}
                className="bg-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="discord" className="block text-sm font-medium text-gray-400 mb-1">Discord</Label>
              <Input
                id="discord"
                name="discord"
                value={formData.socialLinks.discord}
                onChange={handleSocialInputChange}
                className="bg-dark border-gray-700"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Save Settings
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Change Admin Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="secondary" className="w-full">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}