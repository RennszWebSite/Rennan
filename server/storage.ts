import { 
  User, InsertUser, 
  Stream, InsertStream, 
  Announcement, InsertAnnouncement, 
  GalleryImage, InsertGalleryImage,
  SiteSettings, InsertSiteSettings, UpdateSiteSettings,
  users, streams, announcements, galleryImages, siteSettings
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, desc, not } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

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
  sessionStore: any; // Type any to avoid typing issues with express-session
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private streams: Map<number, Stream>;
  private announcements: Map<number, Announcement>;
  private galleryImages: Map<number, GalleryImage>;
  private siteSettings: SiteSettings | undefined;
  
  sessionStore: any; // Using any type instead of session.SessionStore
  
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

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any type instead of session.SessionStore

  constructor() {
    // Initialize session store with PostgreSQL
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
    
    // Initialize database with default values
    this.initializeDefaults();
  }

  private async initializeDefaults() {
    try {
      // Check if admin user exists, if not create default admin
      const adminExists = await this.getUserByUsername("admin");
      if (!adminExists) {
        // Create a function to hash the password directly here to avoid circular imports
        const scryptAsync = promisify(scrypt);
        const hashPassword = async (password: string) => {
          const salt = randomBytes(16).toString("hex");
          const buf = (await scryptAsync(password, salt, 64)) as Buffer;
          return `${buf.toString("hex")}.${salt}`;
        };
        
        const hashedPassword = await hashPassword("password");
        await this.createUser({
          username: "admin",
          password: hashedPassword,
          isAdmin: true
        });
      }
      
      // Check if site settings exist, if not create defaults
      const settings = await this.getSiteSettings();
      if (!settings) {
        await this.initializeSiteSettings({
          siteTitle: "RENNSZ - Premium Streamer",
          metaDescription: "Join RENNSZ on his streaming journey. Premium streaming experiences with the best content.",
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
            currentTheme: "dark",
            primaryColor: "#4A00E0",
            secondaryColor: "#F2C94C",
            accentTeal: "#2DD4BF",
            accentPurple: "#8B5CF6"
          }
        });
      }
      
      // Check if streams exist, if not create defaults
      const allStreams = await this.getAllStreams();
      if (allStreams.length === 0) {
        // Add default featured stream
        const defaultStream = await this.createStream({
          name: "RENNSZ - Main Stream",
          url: "https://www.twitch.tv/rennsz",
          description: "Premium streaming content with the best production quality",
          type: "main",
          isFeatured: true
        });
        
        // Add default non-featured stream
        await this.createStream({
          name: "RENNSZ Gaming",
          url: "https://www.twitch.tv/rennszino",
          description: "Gaming content and competitive gameplay",
          type: "gaming",
          isFeatured: false
        });
      }
      
      // Check if announcements exist, if not create defaults
      const announcements = await this.getAllAnnouncements();
      if (announcements.length === 0) {
        await this.createAnnouncement({
          title: "New Streaming Schedule!",
          content: "I'll be streaming every Monday, Wednesday, and Friday at 8 PM EST. Don't miss out on the action!",
          type: "schedule",
          imageUrl: "/assets/IMG_2456.png",
        });
        
        await this.createAnnouncement({
          title: "New Gear Setup!",
          content: "Just upgraded my streaming setup with new cameras and audio equipment for the best quality streams!",
          type: "equipment",
          imageUrl: "/assets/IMG_2457.png",
        });
      }
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getAllStreams(): Promise<Stream[]> {
    return await db.select().from(streams);
  }
  
  async getStream(id: number): Promise<Stream | undefined> {
    const [stream] = await db.select().from(streams).where(eq(streams.id, id));
    return stream;
  }
  
  async getFeaturedStream(): Promise<Stream | undefined> {
    const [stream] = await db.select().from(streams).where(eq(streams.isFeatured, true));
    return stream;
  }
  
  async createStream(stream: InsertStream): Promise<Stream> {
    // If this is marked as featured, unfeature all others
    if (stream.isFeatured) {
      await db.update(streams).set({ isFeatured: false });
    }
    
    const [newStream] = await db.insert(streams).values(stream).returning();
    return newStream;
  }
  
  async updateStream(id: number, stream: InsertStream): Promise<Stream | undefined> {
    // If this is being set as featured, unfeature all others
    if (stream.isFeatured) {
      await db.update(streams)
        .set({ isFeatured: false })
        .where(not(eq(streams.id, id)));
    }
    
    const [updatedStream] = await db
      .update(streams)
      .set(stream)
      .where(eq(streams.id, id))
      .returning();
    
    return updatedStream;
  }
  
  async setFeaturedStream(id: number): Promise<Stream | undefined> {
    // Unfeature all streams
    await db.update(streams).set({ isFeatured: false });
    
    // Feature the selected stream
    const [featuredStream] = await db
      .update(streams)
      .set({ isFeatured: true })
      .where(eq(streams.id, id))
      .returning();
    
    return featuredStream;
  }
  
  async deleteStream(id: number): Promise<boolean> {
    const result = await db.delete(streams).where(eq(streams.id, id));
    return !!result;
  }
  
  async getAllAnnouncements(): Promise<Announcement[]> {
    const result = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));
    return result;
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const [announcement] = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, id));
    return announcement;
  }
  
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values({ ...announcement, createdAt: new Date() })
      .returning();
    return newAnnouncement;
  }
  
  async updateAnnouncement(id: number, announcement: InsertAnnouncement): Promise<Announcement | undefined> {
    const [updatedAnnouncement] = await db
      .update(announcements)
      .set(announcement)
      .where(eq(announcements.id, id))
      .returning();
    return updatedAnnouncement;
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id));
    return !!result;
  }
  
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    // We're removing the gallery as requested, but keeping the method for compatibility
    return [];
  }
  
  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    // We're removing the gallery as requested, but keeping the method for compatibility
    return undefined;
  }
  
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    // We're removing the gallery as requested, but keeping the method for compatibility
    throw new Error("Gallery feature has been removed");
  }
  
  async updateGalleryImage(id: number, image: InsertGalleryImage): Promise<GalleryImage | undefined> {
    // We're removing the gallery as requested, but keeping the method for compatibility
    throw new Error("Gallery feature has been removed");
  }
  
  async deleteGalleryImage(id: number): Promise<boolean> {
    // We're removing the gallery as requested, but keeping the method for compatibility
    return false;
  }
  
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings);
    return settings;
  }
  
  async initializeSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    const [newSettings] = await db
      .insert(siteSettings)
      .values(settings)
      .returning();
    return newSettings;
  }
  
  async updateSiteSettings(settings: UpdateSiteSettings): Promise<SiteSettings | undefined> {
    const [updatedSettings] = await db
      .update(siteSettings)
      .set(settings)
      .returning();
    return updatedSettings;
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
