import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertStreamSchema,
  insertAnnouncementSchema,
  insertGalleryImageSchema,
  updateSiteSettingsSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  await setupAuth(app);

  // Initialize default site settings if not exists
  const settings = await storage.getSiteSettings();
  if (!settings) {
    await storage.initializeSiteSettings({
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
      }
    });
  }

  // Initialize default streams
  const streams = await storage.getAllStreams();
  if (streams.length === 0) {
    await storage.createStream({
      name: "RENNSZ - Travel & IRL",
      url: "https://www.twitch.tv/rennsz",
      description: "Join me as I explore luxurious destinations and share authentic travel experiences.",
      type: "IRL",
      isFeatured: true,
    });

    await storage.createStream({
      name: "RENNSZINO - Gaming & Chill",
      url: "https://www.twitch.tv/rennszino",
      description: "Relaxed gaming sessions and chill vibes when we're not on the road.",
      type: "Gaming",
      isFeatured: false,
    });
  }

  // Streams API
  app.get("/api/streams", async (req, res) => {
    try {
      const streams = await storage.getAllStreams();
      res.json(streams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch streams" });
    }
  });

  app.get("/api/streams/featured", async (req, res) => {
    try {
      const featuredStream = await storage.getFeaturedStream();
      if (!featuredStream) {
        return res.status(404).json({ error: "No featured stream found" });
      }
      res.json(featuredStream);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured stream" });
    }
  });

  // Admin routes - Streams
  app.post("/api/admin/streams", async (req, res) => {
    try {
      const streamData = insertStreamSchema.parse(req.body);
      const stream = await storage.createStream(streamData);
      res.status(201).json(stream);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create stream" });
    }
  });

  app.put("/api/admin/streams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const streamData = insertStreamSchema.parse(req.body);
      const stream = await storage.updateStream(id, streamData);
      if (!stream) {
        return res.status(404).json({ error: "Stream not found" });
      }
      res.json(stream);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update stream" });
    }
  });

  app.put("/api/admin/streams/:id/featured", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stream = await storage.setFeaturedStream(id);
      if (!stream) {
        return res.status(404).json({ error: "Stream not found" });
      }
      res.json(stream);
    } catch (error) {
      res.status(500).json({ error: "Failed to set featured stream" });
    }
  });

  app.delete("/api/admin/streams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStream(id);
      if (!success) {
        return res.status(404).json({ error: "Stream not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete stream" });
    }
  });

  // Announcements API
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  // Admin routes - Announcements
  app.post("/api/admin/announcements", async (req, res) => {
    try {
      const announcementData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  app.put("/api/admin/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcementData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.updateAnnouncement(id, announcementData);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  app.delete("/api/admin/announcements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnnouncement(id);
      if (!success) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // Gallery API
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });

  // Admin routes - Gallery
  app.post("/api/admin/gallery", async (req, res) => {
    try {
      const imageData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create gallery image" });
    }
  });

  app.put("/api/admin/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const imageData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.updateGalleryImage(id, imageData);
      if (!image) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update gallery image" });
    }
  });

  app.delete("/api/admin/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGalleryImage(id);
      if (!success) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gallery image" });
    }
  });

  // Site Settings API
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      if (!settings) {
        return res.status(404).json({ error: "Site settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  // Admin routes - Site Settings
  app.put("/api/admin/site-settings", async (req, res) => {
    try {
      const settingsData = updateSiteSettingsSchema.parse(req.body);
      const settings = await storage.updateSiteSettings(settingsData);
      if (!settings) {
        return res.status(404).json({ error: "Site settings not found" });
      }
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update site settings" });
    }
  });

  // Twitch Tracker stats endpoint
  app.get("/api/twitch/:channel", async (req, res) => {
    try {
      const { channel } = req.params;
      const response = await fetch(`https://twitchtracker.com/${channel}`);
      const html = await response.text();

      // Extract stats from HTML
      let viewerMatch = html.match(/Average viewers.*?>([\d,]+)/);
      let followerMatch = html.match(/Followers.*?>([\d,]+)/);

      const viewers = viewerMatch ? parseInt(viewerMatch[1].replace(/,/g, '')) : 0;
      const followers = followerMatch ? parseInt(followerMatch[1].replace(/,/g, '')) : 0;

      // Check if stream is live by looking for "LIVE" indicator
      const isLive = html.includes('class="live"');

      res.json({
        isLive,
        viewers,
        followers,
        subscribers: 0 // TwitchTracker doesn't show sub count
      });
    } catch (error) {
      console.error('Error fetching Twitch Tracker data:', error);
      res.status(500).json({ error: "Failed to fetch stream data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}