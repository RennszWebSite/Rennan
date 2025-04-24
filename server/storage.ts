import { 
  User, InsertUser, 
  Stream, InsertStream, 
  Announcement, InsertAnnouncement, 
  GalleryImage, InsertGalleryImage,
  SiteSettings, InsertSiteSettings, UpdateSiteSettings,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Interface methods...
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllStreams(): Promise<Stream[]>;
  getStream(id: number): Promise<Stream | undefined>;
  getFeaturedStream(): Promise<Stream | undefined>;
  createStream(stream: InsertStream): Promise<Stream>;
  updateStream(id: number, stream: InsertStream): Promise<Stream | undefined>;
  setFeaturedStream(id: number): Promise<Stream | undefined>;
  deleteStream(id: number): Promise<boolean>;
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: InsertAnnouncement): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, image: InsertGalleryImage): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: number): Promise<boolean>;
  getSiteSettings(): Promise<SiteSettings | undefined>;
  initializeSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;
  updateSiteSettings(settings: UpdateSiteSettings): Promise<SiteSettings | undefined>;
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private streams: Map<number, Stream>;
  private announcements: Map<number, Announcement>;
  private galleryImages: Map<number, GalleryImage>;
  private siteSettings: SiteSettings | undefined;
  sessionStore: any;

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
      checkPeriod: 86400000
    });
    this.initializeDefaults();
  }

  async initializeDefaults() {
    // Initialize admin user
    const scryptAsync = promisify(scrypt);
    const hashPassword = async (password: string) => {
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      return `${buf.toString("hex")}.${salt}`;
    };

    const hashedPassword = await hashPassword("admin123");
    await this.createUser({
      username: "admin",
      password: hashedPassword,
      isAdmin: true
    });

    // Initialize site settings
    await this.initializeSiteSettings({
      siteTitle: "RENNSZ - Premium Streamer",
      metaDescription: "Join RENNSZ on his streaming journey",
      footerText: "Made with ❤️ by sf.xen on discord",
      socialLinks: {
        twitchMain: "https://www.twitch.tv/rennsz",
        twitchGaming: "https://www.twitch.tv/rennszino",
        twitter: "https://x.com/rennsz96",
        xCommunity: "https://x.com/i/communities/1823168507401634218",
        instagram: "https://www.instagram.com/rennsz",
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

    // Initialize streams
    await this.createStream({
      name: "RENNSZ - Main Stream",
      url: "https://www.twitch.tv/rennsz",
      description: "Premium streaming content",
      type: "main",
      isFeatured: true
    });

    await this.createStream({
      name: "RENNSZ Gaming",
      url: "https://www.twitch.tv/rennszino",
      description: "Gaming content",
      type: "gaming",
      isFeatured: false
    });

    // Initialize announcements
    await this.createAnnouncement({
      title: "Welcome!",
      content: "Welcome to my new website!",
      type: "announcement",
      imageUrl: "/assets/IMG_2456.png"
    });
  }

  // Implementation of all interface methods...
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getAllStreams(): Promise<Stream[]> {
    return Array.from(this.streams.values());
  }

  async getStream(id: number): Promise<Stream | undefined> {
    return this.streams.get(id);
  }

  async getFeaturedStream(): Promise<Stream | undefined> {
    return Array.from(this.streams.values()).find(s => s.isFeatured);
  }

  async createStream(stream: InsertStream): Promise<Stream> {
    const id = this.streamIdCounter++;
    const newStream = { ...stream, id, isFeatured: stream.isFeatured };
    if (newStream.isFeatured) {
      for (const s of this.streams.values()) {
        s.isFeatured = false;
      }
    }
    this.streams.set(id, newStream);
    return newStream;
  }

  async updateStream(id: number, stream: InsertStream): Promise<Stream | undefined> {
    if (!this.streams.has(id)) return undefined;
    const updatedStream = { ...stream, id, isFeatured: stream.isFeatured };
    if (updatedStream.isFeatured) {
      for (const s of this.streams.values()) {
        s.isFeatured = s.id === id;
      }
    }
    this.streams.set(id, updatedStream);
    return updatedStream;
  }

  async setFeaturedStream(id: number): Promise<Stream | undefined> {
    const stream = this.streams.get(id);
    if (!stream) return undefined;

    for (const s of this.streams.values()) {
      s.isFeatured = s.id === id;
    }

    return stream;
  }

  async deleteStream(id: number): Promise<boolean> {
    return this.streams.delete(id);
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementIdCounter++;
    const newAnnouncement = { ...announcement, id, createdAt: new Date() };
    this.announcements.set(id, newAnnouncement);
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: InsertAnnouncement): Promise<Announcement | undefined> {
    if (!this.announcements.has(id)) return undefined;
    const existing = this.announcements.get(id)!;
    const updatedAnnouncement = { ...announcement, id, createdAt: existing.createdAt };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }

  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values());
  }

  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    return this.galleryImages.get(id);
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const id = this.galleryImageIdCounter++;
    const newImage = { ...image, id };
    this.galleryImages.set(id, newImage);
    return newImage;
  }

  async updateGalleryImage(id: number, image: InsertGalleryImage): Promise<GalleryImage | undefined> {
    if (!this.galleryImages.has(id)) return undefined;
    const updatedImage = { ...image, id };
    this.galleryImages.set(id, updatedImage);
    return updatedImage;
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    return this.galleryImages.delete(id);
  }

  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return this.siteSettings;
  }

  async initializeSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings> {
    this.siteSettings = { ...settings, id: 1 };
    return this.siteSettings;
  }

  async updateSiteSettings(settings: UpdateSiteSettings): Promise<SiteSettings | undefined> {
    if (!this.siteSettings) return undefined;
    this.siteSettings = { ...this.siteSettings, ...settings };
    return this.siteSettings;
  }
}

// Export a single instance
export const storage = new MemStorage();