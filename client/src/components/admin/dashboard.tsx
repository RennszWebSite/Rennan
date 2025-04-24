import { useQuery } from "@tanstack/react-query";
import { Stream, Announcement, SiteSettings } from "@shared/schema";
import { 
  FaUsers, 
  FaEye, 
  FaBell, 
  FaBullhorn, 
  FaVideo, 
  FaImages, 
  FaPaintBrush 
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: streams } = useQuery<Stream[]>({
    queryKey: ["/api/streams"],
  });
  
  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });
  
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });
  
  const stats = {
    followers: "54.2K",
    viewers: "1.2K",
    subscribers: "3.8K"
  };

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-light p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/20 text-primary">
              <FaUsers className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Total Followers</h3>
              <span className="text-2xl font-semibold text-white">{stats.followers}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-light p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary/20 text-secondary">
              <FaEye className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Current Viewers</h3>
              <span className="text-2xl font-semibold text-white">{stats.viewers}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-light p-6 rounded-lg border border-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-teal/20 text-accent-teal">
              <FaBell className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-400 text-sm">Subscribers</h3>
              <span className="text-2xl font-semibold text-white">{stats.subscribers}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-light p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Stream Status</h3>
          <div className="space-y-4">
            {streams?.map((stream) => (
              <div key={stream.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className={`w-3 h-3 ${stream.isFeatured ? 'bg-green-500' : 'bg-gray-500'} rounded-full mr-2`}></span>
                  <span>{stream.name}</span>
                </div>
                <span className={stream.isFeatured ? 'text-green-500' : 'text-gray-500'}>
                  {stream.isFeatured ? 'Live' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button 
              variant="link" 
              className="text-sm text-accent-teal hover:underline p-0"
              onClick={() => handleNavigate("/admin/streams")}
            >
              View detailed analytics
            </Button>
          </div>
        </div>
        
        <div className="bg-dark-light p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="p-3 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors justify-center"
              onClick={() => handleNavigate("/admin/announcements")}
            >
              <FaBullhorn className="mr-2" /> New Announcement
            </Button>
            <Button
              className="p-3 bg-secondary/10 text-secondary rounded-md hover:bg-secondary/20 transition-colors justify-center"
              onClick={() => handleNavigate("/admin/streams")}
            >
              <FaVideo className="mr-2" /> Set Featured Stream
            </Button>
            <Button
              className="p-3 bg-accent-teal/10 text-accent-teal rounded-md hover:bg-accent-teal/20 transition-colors justify-center"
              onClick={() => handleNavigate("/admin/gallery")}
            >
              <FaImages className="mr-2" /> Upload Images
            </Button>
            <Button
              className="p-3 bg-accent-purple/10 text-accent-purple rounded-md hover:bg-accent-purple/20 transition-colors justify-center"
              onClick={() => handleNavigate("/admin/theme")}
            >
              <FaPaintBrush className="mr-2" /> Change Theme
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
