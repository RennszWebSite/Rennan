import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SiteSettings, UpdateSiteSettings } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { getThemeColors } from "@/lib/utils";

export function ThemeSettings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  const [customColors, setCustomColors] = useState({
    primaryColor: "#4A00E0",
    secondaryColor: "#F2C94C",
    accentTeal: "#2DD4BF",
    accentPurple: "#8B5CF6"
  });

  useEffect(() => {
    if (settings?.themeSettings) {
      setCustomColors({
        primaryColor: settings.themeSettings.primaryColor,
        secondaryColor: settings.themeSettings.secondaryColor,
        accentTeal: settings.themeSettings.accentTeal,
        accentPurple: settings.themeSettings.accentPurple
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
        title: "Theme updated",
        description: "The site theme has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating theme",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    
    // Update theme in database
    const themeColors = getThemeColors(newTheme);
    updateMutation.mutate({
      themeSettings: {
        currentTheme: newTheme,
        ...themeColors
      }
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomColors(prev => ({ ...prev, [name]: value }));
  };

  const applyCustomColors = () => {
    updateMutation.mutate({
      themeSettings: {
        currentTheme: "custom",
        ...customColors
      }
    });
    
    // Apply custom theme
    setTheme("custom");
    
    // Update CSS variables
    document.documentElement.style.setProperty('--primary', hexToHSL(customColors.primaryColor));
    document.documentElement.style.setProperty('--secondary', hexToHSL(customColors.secondaryColor));
    document.documentElement.style.setProperty('--accent-teal', hexToHSL(customColors.accentTeal));
    document.documentElement.style.setProperty('--accent-purple', hexToHSL(customColors.accentPurple));
  };

  // Helper function to convert hex to HSL
  const hexToHSL = (hex: string): string => {
    // Default fallback
    return `266 100% 44%`;
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
      <h2 className="text-2xl font-bold mb-6">Theme Settings</h2>
      
      <div className="space-y-8">
        <div className="bg-dark-light rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Theme Selector</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Default Theme */}
            <Card className={`border ${theme === 'default' ? 'border-primary' : 'border-gray-700'} rounded-md p-4 bg-dark hover:border-primary/70 cursor-pointer transition-colors`} onClick={() => handleThemeChange('default')}>
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-base font-medium">Default Theme</CardTitle>
                  {theme === 'default' && <Check className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#4A00E0]"></span>
                  <span className="w-5 h-5 rounded-full bg-[#F2C94C]"></span>
                  <span className="w-5 h-5 rounded-full bg-[#2DD4BF]"></span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-xs text-gray-400">
                  The standard luxury travel theme with purple and gold accents.
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Christmas Theme */}
            <Card className={`border ${theme === 'christmas' ? 'border-primary' : 'border-gray-700'} rounded-md p-4 bg-dark hover:border-primary/70 cursor-pointer transition-colors`} onClick={() => handleThemeChange('christmas')}>
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-base font-medium">Christmas Theme</CardTitle>
                  {theme === 'christmas' && <Check className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#D42F2F]"></span>
                  <span className="w-5 h-5 rounded-full bg-[#1D8348]"></span>
                  <span className="w-5 h-5 rounded-full bg-[#E74C3C]"></span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-xs text-gray-400">
                  Festive holiday theme with red and green color scheme.
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Halloween Theme */}
            <Card className={`border ${theme === 'halloween' ? 'border-primary' : 'border-gray-700'} rounded-md p-4 bg-dark hover:border-primary/70 cursor-pointer transition-colors`} onClick={() => handleThemeChange('halloween')}>
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-base font-medium">Halloween Theme</CardTitle>
                  {theme === 'halloween' && <Check className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF6600]"></span>
                  <span className="w-5 h-5 rounded-full bg-[#6600CC]"></span>
                  <span className="w-5 h-5 rounded-full bg-[#00CC99]"></span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-xs text-gray-400">
                  Spooky theme with orange and purple color palette.
                </CardDescription>
              </CardContent>
            </Card>
            
            {/* Summer Theme */}
            <Card className={`border ${theme === 'summer' ? 'border-primary' : 'border-gray-700'} rounded-md p-4 bg-dark hover:border-primary/70 cursor-pointer transition-colors`} onClick={() => handleThemeChange('summer')}>
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-base font-medium">Summer Theme</CardTitle>
                  {theme === 'summer' && <Check className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#1E88E5]"></span>
                  <span className="w-5 h-5 rounded-full bg-[#FFB300]"></span>
                  <span className="w-5 h-5 rounded-full bg-[#00BFA5]"></span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-xs text-gray-400">
                  Bright and vibrant theme for summer travel seasons.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-dark-light rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Custom Theme Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-gray-400 mb-1">Primary Color</Label>
              <div className="flex">
                <input 
                  type="color" 
                  value={customColors.primaryColor} 
                  onChange={(e) => setCustomColors(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="h-10 w-10 rounded-l-md border-0"
                  style={{ backgroundColor: 'transparent' }}
                />
                <Input
                  name="primaryColor"
                  value={customColors.primaryColor}
                  onChange={handleColorChange}
                  className="bg-dark border-gray-700 rounded-l-none flex-grow"
                />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-400 mb-1">Secondary Color</Label>
              <div className="flex">
                <input 
                  type="color" 
                  value={customColors.secondaryColor} 
                  onChange={(e) => setCustomColors(prev => ({ ...prev, secondaryColor: e.target.value }))}
                  className="h-10 w-10 rounded-l-md border-0"
                  style={{ backgroundColor: 'transparent' }}
                />
                <Input
                  name="secondaryColor"
                  value={customColors.secondaryColor}
                  onChange={handleColorChange}
                  className="bg-dark border-gray-700 rounded-l-none flex-grow"
                />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-400 mb-1">Accent Teal</Label>
              <div className="flex">
                <input 
                  type="color" 
                  value={customColors.accentTeal} 
                  onChange={(e) => setCustomColors(prev => ({ ...prev, accentTeal: e.target.value }))}
                  className="h-10 w-10 rounded-l-md border-0"
                  style={{ backgroundColor: 'transparent' }}
                />
                <Input
                  name="accentTeal"
                  value={customColors.accentTeal}
                  onChange={handleColorChange}
                  className="bg-dark border-gray-700 rounded-l-none flex-grow"
                />
              </div>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-400 mb-1">Accent Purple</Label>
              <div className="flex">
                <input 
                  type="color" 
                  value={customColors.accentPurple} 
                  onChange={(e) => setCustomColors(prev => ({ ...prev, accentPurple: e.target.value }))}
                  className="h-10 w-10 rounded-l-md border-0"
                  style={{ backgroundColor: 'transparent' }}
                />
                <Input
                  name="accentPurple"
                  value={customColors.accentPurple}
                  onChange={handleColorChange}
                  className="bg-dark border-gray-700 rounded-l-none flex-grow"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={applyCustomColors}
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Apply Custom Colors
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
