import { useQuery } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";
import { FaTwitch, FaInstagram, FaDiscord } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { Loader2 } from "lucide-react";

export function Footer() {
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  if (isLoading) {
    return (
      <footer className="bg-dark-light py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </footer>
    );
  }

  const socialLinks = settings?.socialLinks || {
    twitchMain: "https://www.twitch.tv/rennsz",
    twitchGaming: "https://www.twitch.tv/rennszino",
    twitter: "https://x.com/rennsz96?s=21",
    xCommunity: "https://x.com/i/communities/1823168507401634218",
    instagram: "https://www.instagram.com/rennsz?igsh=MWhjYjg2ZDV4dHc0bw==",
    discord: "https://discord.gg/hUTXCaSdKC"
  };

  return (
    <footer className="bg-dark-light py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple">RENNSZ</span>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-gray-400">
              {settings?.footerText || "Made with ❤️ by sf.xen on discord"}
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:justify-start">
            <a href={socialLinks.twitchMain} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
              <FaTwitch size={20} />
              <span className="sr-only">Twitch</span>
            </a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
              <RiTwitterXFill size={20} />
              <span className="sr-only">X</span>
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
              <FaInstagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors">
              <FaDiscord size={20} />
              <span className="sr-only">Discord</span>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400 md:mt-0 md:text-right">
            &copy; {new Date().getFullYear()} RENNSZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
