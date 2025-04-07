import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAlarmSchema, insertSecurityScanSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Get all alarms for user
  router.get("/alarms", async (req: Request, res: Response) => {
    // For demo, use user ID 1
    const userId = 1;
    const alarms = await storage.getAlarms(userId);
    res.json(alarms);
  });
  
  // Get a specific alarm
  router.get("/alarms/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid alarm ID" });
    }
    
    const alarm = await storage.getAlarm(id);
    if (!alarm) {
      return res.status(404).json({ message: "Alarm not found" });
    }
    
    res.json(alarm);
  });
  
  // Create a new alarm
  router.post("/alarms", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAlarmSchema.parse(req.body);
      // For demo, use user ID 1
      const userId = 1;
      const alarm = await storage.createAlarm({ ...validatedData, userId });
      res.status(201).json(alarm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alarm data", errors: error.errors });
      }
      throw error;
    }
  });
  
  // Update an alarm
  router.patch("/alarms/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid alarm ID" });
    }
    
    try {
      const validatedData = insertAlarmSchema.partial().parse(req.body);
      const updatedAlarm = await storage.updateAlarm(id, validatedData);
      
      if (!updatedAlarm) {
        return res.status(404).json({ message: "Alarm not found" });
      }
      
      res.json(updatedAlarm);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alarm data", errors: error.errors });
      }
      throw error;
    }
  });
  
  // Delete an alarm
  router.delete("/alarms/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid alarm ID" });
    }
    
    const success = await storage.deleteAlarm(id);
    if (!success) {
      return res.status(404).json({ message: "Alarm not found" });
    }
    
    res.status(204).end();
  });
  
  // Get security scans history
  router.get("/security/scans", async (req: Request, res: Response) => {
    // For demo, use user ID 1
    const userId = 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const scans = await storage.getSecurityScans(userId, limit);
    res.json(scans);
  });
  
  // Get latest security scan
  router.get("/security/latest", async (req: Request, res: Response) => {
    // For demo, use user ID 1
    const userId = 1;
    const scan = await storage.getLatestSecurityScan(userId);
    
    if (!scan) {
      return res.status(404).json({ message: "No security scans found" });
    }
    
    res.json(scan);
  });
  
  // Create a new security scan
  router.post("/security/scan", async (req: Request, res: Response) => {
    try {
      const validatedData = insertSecurityScanSchema.parse(req.body);
      // For demo, use user ID 1
      const userId = 1;
      const scan = await storage.createSecurityScan({ ...validatedData, userId });
      res.status(201).json(scan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scan data", errors: error.errors });
      }
      throw error;
    }
  });
  
  // Perform security check
  router.post("/security/check", async (req: Request, res: Response) => {
    // Simulate security check
    const appScanScore = Math.floor(Math.random() * 20) + 80;
    const networkCheckScore = Math.floor(Math.random() * 30) + 70;
    const privacyCheckScore = Math.floor(Math.random() * 25) + 75;
    const systemCheckScore = Math.floor(Math.random() * 15) + 85;
    
    const totalScore = Math.floor((appScanScore + networkCheckScore + privacyCheckScore + systemCheckScore) / 4);
    
    const appScanResult = appScanScore >= 90 ? 'safe' : 'warning';
    const networkCheckResult = networkCheckScore >= 80 ? 'safe' : 'warning';
    const privacyCheckResult = privacyCheckScore >= 85 ? 'safe' : 'warning';
    const systemCheckResult = systemCheckScore >= 90 ? 'safe' : 'warning';
    
    const issuesFound = [];
    if (networkCheckResult === 'warning') {
      issuesFound.push({
        type: 'network',
        severity: 'medium',
        description: 'Connected to unsecured Wi-Fi network "CoffeeShop_Free"'
      });
    }
    
    const permissionsAccessed = [
      {
        app: 'SocialApp',
        permission: 'camera',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        app: 'VoiceAssistant',
        permission: 'microphone',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ];
    
    // For demo, use user ID 1
    const userId = 1;
    const scan = await storage.createSecurityScan({
      userId,
      score: totalScore,
      appScanResult,
      networkCheckResult,
      privacyCheckResult,
      systemCheckResult,
      issuesFound,
      permissionsAccessed
    });
    
    res.json(scan);
  });
  
  // Get security tip of the day
  router.get("/security/tip", async (req: Request, res: Response) => {
    const tip = await storage.getRandomSecurityTip();
    if (!tip) {
      return res.status(404).json({ message: "No security tips found" });
    }
    
    res.json(tip);
  });
  
  // Register routes
  app.use("/api", router);
  
  const httpServer = createServer(app);
  return httpServer;
}
