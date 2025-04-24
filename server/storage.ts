import { 
  User, InsertUser, 
  Stream, InsertStream, 
  Announcement, InsertAnnouncement, 
  GalleryImage, InsertGalleryImage,
  SiteSettings, InsertSiteSettings, UpdateSiteSettings
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stream methods
  getAllStreams(): Promise<Stream[]>;
  getStream(id: number): Promise<Stream | undefined>;
  getFeaturedStream(): Promise<Stream | undefined>;
  createStream(stream: InsertStream): Promise<Stream>;
  updateStream(id: number, stream: InsertStream): Promise<Stream | undefined>;
  setFeaturedStream(id: number): Promise<Stream | undefined>;
  deleteStream(id: number): Promise<boolean>;
  
  // Announcement methods
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: InsertAnnouncement): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Gallery methods
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, image: InsertGalleryImage): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: number): Promise<boolean>;
  
  // Site Settings methods
  getSiteSettings(): Promise<SiteSettings | undefined>;
  initializeSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;
  updateSiteSettings(settings: UpdateSiteSettings): Promise<SiteSettings | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private streams: Map<number, Stream>;
  private announcements: Map<number, Announcement>;
  private galleryImages: Map<number, GalleryImage>;
  private siteSettings: SiteSettings | undefined;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private streamIdCounter: number;
  private announcementIdCounter: number;
  private galleryImageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.streams = new Map();
    this.announcements = new Map();
    this.galleryImages = new Map();
    
    this.userIdCounter = 1;
    this.streamIdCounter = 1;
    this.announcementIdCounter = 1;
    this.galleryImageIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Add sample announcements
    this.createAnnouncement({
      title: "Next Destination: Maldives Luxury Resort",
      content: "Get ready for our next travel adventure! We'll be exploring the premium overwater villas and underwater experiences in the Maldives. Stream starts next Monday at 3 PM EST.",
      type: "Travel Update",
      imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd"
    });
    
    this.createAnnouncement({
      title: "New Partnership: Luxury Travel Equipment",
      content: "Excited to announce our new partnership with PremiumGear! We'll be using their high-end streaming equipment during our travels for even better quality streams.",
      type: "Partnership",
      imageUrl: "https://images.unsplash.com/photo-1616763355548-1b606f439f86"
    });
    
    this.createAnnouncement({
      title: "Subscriber Giveaway: Travel Package",
      content: "To celebrate hitting 50K followers, we're giving away a luxury weekend package to one lucky subscriber. Details on how to enter during tomorrow's stream!",
      type: "Giveaway"
    });
    
    // Add sample gallery images
    this.createGalleryImage({
      title: "Bali Beachfront",
      description: "Exclusive oceanfront property",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      category: "Travel Destinations"
    });
    
    this.createGalleryImage({
      title: "Dubai Penthouse",
      description: "Sky-high luxury accommodation",
      imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      category: "Luxury Accommodations"
    });
    
    this.createGalleryImage({
      title: "Mediterranean Yacht",
      description: "Private sailing experience",
      imageUrl: "https://images.unsplash.com/photo-1517957754642-2870518e16f8",
      category: "Travel Destinations"
    });
    
    this.createGalleryImage({
      title: "Tokyo Skyline",
      description: "Urban luxury experience",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      category: "Travel Destinations"
    });
    
    this.createGalleryImage({
      title: "Premium Setup",
      description: "High-end streaming equipment",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      category: "Streaming Equipment"
    });
    
    this.createGalleryImage({
      title: "Maldives Resort",
      description: "Crystal clear infinity pool",
      imageUrl: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd",
      category: "Luxury Accommodations"
    });
    
    this.createGalleryImage({
      title: "Swiss Alps Chalet",
      description: "Exclusive mountain getaway",
      imageUrl: "https://images.unsplash.com/photo-1578530332818-6ba472e67b9f",
      category: "Travel Destinations"
    });
    
    this.createGalleryImage({
      title: "Live Streaming",
      description: "Behind the scenes look",
      imageUrl: "https://images.unsplash.com/photo-1570213489059-0aac6626cade",
      category: "Streaming Equipment"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Stream methods
  async getAllStreams(): Promise<Stream[]> {
    return Array.from(this.streams.values());
  }
  
  async getStream(id: number): Promise<Stream | undefined> {
    return this.streams.get(id);
  }
  
  async getFeaturedStream(): Promise<Stream | undefined> {
    return Array.from(this.streams.values()).find(stream => stream.isFeatured);
  }
  
  async createStream(stream: InsertStream): Promise<Stream> {
    const id = this.streamIdCounter++;
    const newStream: Stream = { ...stream, id };
    
    // If this is marked as featured, unfeature all others
    if (newStream.isFeatured) {
      for (const stream of this.streams.values()) {
        if (stream.isFeatured) {
          stream.isFeatured = false;
        }
      }
    }
    
    this.streams.set(id, newStream);
    return newStream;
  }
  
  async updateStream(id: number, stream: InsertStream): Promise<Stream | undefined> {
    if (!this.streams.has(id)) {
      return undefined;
    }
    
    // If this is being set as featured, unfeature all others
    if (stream.isFeatured) {
      for (const existingStream of this.streams.values()) {
        if (existingStream.id !== id && existingStream.isFeatured) {
          existingStream.isFeatured = false;
        }
      }
    }
    
    const updatedStream: Stream = { ...stream, id };
    this.streams.set(id, updatedStream);
    return updatedStream;
  }
  
  async setFeaturedStream(id: number): Promise<Stream | undefined> {
    if (!this.streams.has(id)) {
      return undefined;
    }
    
    // Unfeature all streams
    for (const stream of this.streams.values()) {
      stream.isFeatured = stream.id === id;
    }
    
    return this.streams.get(id);
  }
  
  async deleteStream(id: number): Promise<boolean> {
    return this.streams.delete(id);
  }
  
  // Announcement methods
  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }
  
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementIdCounter++;
    const createdAt = new Date();
    const newAnnouncement: Announcement = { ...announcement, id, createdAt };
    this.announcements.set(id, newAnnouncement);
    return newAnnouncement;
  }
  
  async updateAnnouncement(id: number, announcement: InsertAnnouncement): Promise<Announcement | undefined> {
    if (!this.announcements.has(id)) {
      return undefined;
    }
    
    const existing = this.announcements.get(id)!;
    const updatedAnnouncement: Announcement = { 
      ...announcement, 
      id, 
      createdAt: existing.createdAt 
    };
    
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }
  
  // Gallery methods
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }
  
  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }
  
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.galleryImageIdCounter++;
    const newImage: GalleryImage = { ...image, id };
    this.galleryImages.set(id, newImage);
    return newImage;
  }
  
  async updateGalleryImage(id: number, image: InsertGalleryImage): Promise<GalleryImage | undefined> {
    if (!this.galleryImages.has(id)) {
      return undefined;
    }
    
    const updatedImage: GalleryImage = { ...image, id };
    this.galleryImages.set(id, updatedImage);
    return updatedImage;
  }
  
  async deleteGalleryImage(id: number): Promise<boolean> {
    return this.galleryImages.delete(id);
  }
  
  // Site Settings methods
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return this.siteSettings;
  }
  
  async initializeSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    if (this.siteSettings) {
      return this.siteSettings;
    }
    
    this.siteSettings = { ...settings, id: 1 };
    return this.siteSettings;
  }
  
  async updateSiteSettings(settings: UpdateSiteSettings): Promise<SiteSettings | undefined> {
    if (!this.siteSettings) {
      return undefined;
    }
    
    this.siteSettings = { 
      ...this.siteSettings, 
      ...settings 
    };
    
    return this.siteSettings;
  }
}

export const storage = new MemStorage();
