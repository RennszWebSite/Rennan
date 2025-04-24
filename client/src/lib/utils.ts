import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  let counter;
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit);
    if (counter > 0) {
      return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getImageForStreamType(type: string): string {
  if (type.toLowerCase() === 'gaming') {
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  } else {
    return "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  }
}

export function getThemeColors(themeName: string): {
  primaryColor: string;
  secondaryColor: string;
  accentTeal: string;
  accentPurple: string;
} {
  switch (themeName) {
    case 'christmas':
      return {
        primaryColor: '#D42F2F',
        secondaryColor: '#1D8348',
        accentTeal: '#58D68D',
        accentPurple: '#E74C3C'
      };
    case 'halloween':
      return {
        primaryColor: '#FF6600',
        secondaryColor: '#6600CC',
        accentTeal: '#00CC99',
        accentPurple: '#990099'
      };
    case 'summer':
      return {
        primaryColor: '#1E88E5',
        secondaryColor: '#FFB300',
        accentTeal: '#00BFA5',
        accentPurple: '#FF4081'
      };
    default:
      return {
        primaryColor: '#4A00E0',
        secondaryColor: '#F2C94C',
        accentTeal: '#2DD4BF',
        accentPurple: '#8B5CF6'
      };
  }
}

export function createChannelUrl(channelName: string): string {
  if (!channelName) return '';
  
  // If it's already a full URL, return it
  if (channelName.startsWith('http')) {
    return channelName;
  }
  
  // Otherwise, construct the Twitch URL
  return `https://www.twitch.tv/${channelName.toLowerCase().trim()}`;
}

export function extractChannelName(url: string): string {
  if (!url) return '';
  
  try {
    // Parse URL and extract channel name from path
    const parsed = new URL(url);
    if (parsed.hostname.includes('twitch.tv')) {
      // Remove leading slash and return the path
      return parsed.pathname.replace(/^\//, '');
    }
    return '';
  } catch (error) {
    // If URL parsing fails, return the input as is
    // (assuming it might be just the channel name)
    return url;
  }
}
