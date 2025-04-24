import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";

interface SiteContextType {
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
  themeSettings: {
    currentTheme: string;
    primaryColor: string;
    secondaryColor: string;
    accentTeal: string;
    accentPurple: string;
  };
  isLoading: boolean;
}

const defaultContext: SiteContextType = {
  siteTitle: "RENNSZ - Premium Travel Streamer",
  metaDescription: "Join RENNSZ on luxury travel adventures around the world. Premium travel streaming experiences from exotic destinations.",
  footerText: "Made with ❤️ by sf.xen on discord",
  socialLinks: {
    twitchMain: "https://www.twitch.tv/rennsz",
    twitchGaming: "https://www.twitch.tv/rennszino",
    twitter: "https://x.com/rennsz96?s=21",
    xCommunity: "https://x.com/i/communities/1823168507401634218",
    instagram: "https://www.instagram.com/rennsz?igsh=MWhjYjg2ZDV4dHc0bw==",
    discord: "https://discord.gg/hUTXCaSdKC"
  },
  themeSettings: {
    currentTheme: "default",
    primaryColor: "#4A00E0",
    secondaryColor: "#F2C94C",
    accentTeal: "#2DD4BF",
    accentPurple: "#8B5CF6"
  },
  isLoading: true
};

export const SiteContext = createContext<SiteContextType>(defaultContext);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<SiteContextType>(defaultContext);
  
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });
  
  useEffect(() => {
    if (settings) {
      document.title = settings.siteTitle || defaultContext.siteTitle;
      
      setSiteData({
        siteTitle: settings.siteTitle || defaultContext.siteTitle,
        metaDescription: settings.metaDescription || defaultContext.metaDescription,
        footerText: settings.footerText || defaultContext.footerText,
        socialLinks: settings.socialLinks || defaultContext.socialLinks,
        themeSettings: settings.themeSettings || defaultContext.themeSettings,
        isLoading: false
      });
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.metaDescription || defaultContext.metaDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = settings.metaDescription || defaultContext.metaDescription;
        document.head.appendChild(meta);
      }
    }
  }, [settings]);
  
  return (
    <SiteContext.Provider value={{ ...siteData, isLoading: isLoading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteProvider');
  }
  return context;
}
