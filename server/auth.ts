import { Express } from "express";
import session from "express-session";
import { compareSync, hashSync } from "bcryptjs";
import { storage } from "./storage";

// Simple admin auth with just password
const ADMIN_PASSWORD = "admin123"; // Default password, can be changed in admin settings
let currentAdminPassword = ADMIN_PASSWORD;

export function hashPassword(password: string) {
  return hashSync(password, 10);
}

export function comparePasswords(supplied: string, stored: string) {
  return compareSync(supplied, stored);
}

// Simple user interface for admin session
interface AdminUser {
  id: number;
  isAdmin: boolean;
}

export async function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "RENNSZ-streaming-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === "production",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  
  // Simple admin login with just password
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    
    // Check if password matches
    if (password === currentAdminPassword) {
      // Create admin session
      req.session.admin = { id: 1, isAdmin: true };
      return res.status(200).json({ id: 1, username: "admin", isAdmin: true });
    }
    
    return res.status(401).json({ message: "Invalid password" });
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.session.admin) {
      return res.sendStatus(401);
    }
    
    return res.status(200).json({ id: 1, username: "admin", isAdmin: true });
  });

  // Admin check middleware
  app.use("/api/admin/*", (req, res, next) => {
    if (!req.session.admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    next();
  });
  
  // Update admin password
  app.post("/api/update-password", (req, res) => {
    if (!req.session.admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    currentAdminPassword = newPassword;
    return res.status(200).json({ message: "Password updated successfully" });
  });
}
