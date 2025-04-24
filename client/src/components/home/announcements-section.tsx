import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { FaBullhorn, FaStar, FaGift, FaCalendarAlt, FaMicrophone } from "react-icons/fa";

export function AnnouncementsSection() {
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  if (isLoading) {
    return (
      <section id="announcements" className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Latest Announcements</h2>
            <p className="mt-4 text-xl text-gray-300">Stay updated with stream schedules and equipment upgrades</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <section id="announcements" className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Latest Announcements</h2>
            <p className="mt-4 text-xl text-gray-300">No announcements at the moment</p>
          </div>
        </div>
      </section>
    );
  }

  const getAnnouncementIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'partnership':
        return <FaStar />;
      case 'giveaway':
        return <FaGift />;
      case 'schedule':
        return <FaCalendarAlt />;
      case 'equipment':
        return <FaMicrophone />;
      default:
        return <FaBullhorn />;
    }
  };

  const getAnnouncementBorder = (type: string) => {
    switch (type.toLowerCase()) {
      case 'partnership':
        return 'border-primary';
      case 'giveaway':
        return 'border-accent-purple';
      case 'schedule':
        return 'border-accent-teal';
      case 'equipment':
        return 'border-red-500';
      default:
        return 'border-secondary';
    }
  };

  const getAnnouncementIconBg = (type: string) => {
    switch (type.toLowerCase()) {
      case 'partnership':
        return 'bg-primary/20 text-primary';
      case 'giveaway':
        return 'bg-accent-purple/20 text-accent-purple';
      case 'schedule':
        return 'bg-accent-teal/20 text-accent-teal';
      case 'equipment':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-secondary/20 text-secondary';
    }
  };

  return (
    <section id="announcements" className="py-16 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Latest Announcements</h2>
          <p className="mt-4 text-xl text-gray-300">Stay updated with stream schedules and equipment upgrades</p>
        </div>
        
        <div className="space-y-8">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-dark-light rounded-xl p-6 shadow-lg border-l-4 ${getAnnouncementBorder(announcement.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${getAnnouncementIconBg(announcement.type)}`}>
                    {getAnnouncementIcon(announcement.type)}
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{announcement.title}</h3>
                    <span className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-300">{announcement.content}</p>
                  {announcement.imageUrl && (
                    <div className="mt-4 flex items-center">
                      <img 
                        src={announcement.imageUrl} 
                        alt={announcement.title} 
                        className="h-24 w-32 rounded object-cover" 
                      />
                      <div className="ml-4">
                        <a href="#" className="text-accent-teal hover:underline">
                          {announcement.type.toLowerCase() === 'schedule' ? 'Schedule reminder' : 'Learn more'}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
