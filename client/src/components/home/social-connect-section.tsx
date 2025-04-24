import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";
import { 
  FaTwitch, 
  FaInstagram, 
  FaDiscord, 
  FaUsers 
} from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function SocialConnectSection() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });
  
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreeToNotifications: false
  });

  const socialLinks = settings?.socialLinks || {
    twitchMain: "https://www.twitch.tv/rennsz",
    twitchGaming: "https://www.twitch.tv/rennszino",
    twitter: "https://x.com/rennsz96?s=21",
    xCommunity: "https://x.com/i/communities/1823168507401634218",
    instagram: "https://www.instagram.com/rennsz?igsh=MWhjYjg2ZDV4dHc0bw==",
    discord: "https://discord.gg/hUTXCaSdKC"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToNotifications: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.agreeToNotifications) {
      toast({
        title: "Agreement required",
        description: "Please agree to receive notifications.",
        variant: "destructive"
      });
      return;
    }
    
    // Success notification
    toast({
      title: "Subscription successful!",
      description: "You've been added to our notification list.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      agreeToNotifications: false
    });
  };

  return (
    <section id="social" className="py-16 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Connect With RENNSZ</h2>
          <p className="mt-4 text-xl text-gray-300">Follow on social media and join the community</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-dark-light rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Social Media</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Twitch Main */}
              <a 
                href={socialLinks.twitchMain}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-[#6441a5]/20 rounded-lg hover:bg-[#6441a5]/30 transition-colors"
              >
                <FaTwitch className="text-3xl text-[#6441a5]" />
                <div className="ml-4">
                  <h4 className="font-medium">Twitch (IRL)</h4>
                  <p className="text-sm text-gray-400">@rennsz</p>
                </div>
              </a>
              
              {/* Twitch Gaming */}
              <a 
                href={socialLinks.twitchGaming}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-[#6441a5]/20 rounded-lg hover:bg-[#6441a5]/30 transition-colors"
              >
                <FaTwitch className="text-3xl text-[#6441a5]" />
                <div className="ml-4">
                  <h4 className="font-medium">Twitch (Gaming)</h4>
                  <p className="text-sm text-gray-400">@rennszino</p>
                </div>
              </a>
              
              {/* Twitter/X */}
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RiTwitterXFill className="text-3xl text-white" />
                <div className="ml-4">
                  <h4 className="font-medium">Twitter/X</h4>
                  <p className="text-sm text-gray-400">@rennsz96</p>
                </div>
              </a>
              
              {/* X Community */}
              <a 
                href={socialLinks.xCommunity}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaUsers className="text-3xl text-white" />
                <div className="ml-4">
                  <h4 className="font-medium">X Community</h4>
                  <p className="text-sm text-gray-400">Join the discussion</p>
                </div>
              </a>
              
              {/* Instagram */}
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gradient-to-br from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#FCAF45]/20 rounded-lg hover:from-[#833AB4]/30 hover:via-[#FD1D1D]/30 hover:to-[#FCAF45]/30 transition-colors"
              >
                <FaInstagram className="text-3xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] bg-clip-text text-transparent" />
                <div className="ml-4">
                  <h4 className="font-medium">Instagram</h4>
                  <p className="text-sm text-gray-400">@rennsz</p>
                </div>
              </a>
              
              {/* Discord */}
              <a 
                href={socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-[#5865F2]/20 rounded-lg hover:bg-[#5865F2]/30 transition-colors"
              >
                <FaDiscord className="text-3xl text-[#5865F2]" />
                <div className="ml-4">
                  <h4 className="font-medium">Discord</h4>
                  <p className="text-sm text-gray-400">Join the server</p>
                </div>
              </a>
            </div>
          </div>
          
          <div className="bg-dark-light rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h3 className="text-2xl font-bold mb-6">Stay Connected</h3>
            <p className="text-gray-300 mb-6">Subscribe to get notifications about upcoming streams and exclusive content.</p>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-400">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-400">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agree" 
                  checked={formData.agreeToNotifications}
                  onCheckedChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="agree" className="text-sm text-gray-300">
                  I agree to receive email notifications
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent-purple text-white hover:from-accent-purple hover:to-primary py-2 px-4 rounded-md transition-all duration-300"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
