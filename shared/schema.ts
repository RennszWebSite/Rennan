import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const streams = pgTable("streams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  isFeatured: boolean("is_featured").default(false),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteTitle: text("site_title").default("RENNSZ - Premium Travel Streamer"),
  metaDescription: text("meta_description"),
  footerText: text("footer_text").default("Made with ❤️ by sf.xen on discord"),
  socialLinks: json("social_links").$type<{
    twitchMain: string;
    twitchGaming: string;
    twitter: string;
    xCommunity: string;
    instagram: string;
    discord: string;
  }>(),
  themeSettings: json("theme_settings").$type<{
    currentTheme: string;
    primaryColor: string;
    secondaryColor: string;
    accentTeal: string;
    accentPurple: string;
  }>(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const insertStreamSchema = createInsertSchema(streams);

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  createdAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages);

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
});

export const updateSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
}).partial();

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStream = z.infer<typeof insertStreamSchema>;
export type Stream = typeof streams.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type UpdateSiteSettings = z.infer<typeof updateSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;

// Auth types
export type LoginCredentials = Pick<InsertUser, "username" | "password">;

// Simple admin login with just password
export type SimpleLoginCredentials = {
  password: string;
};
