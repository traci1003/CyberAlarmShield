import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertAlarmSchema, 
  insertSecurityScanSchema, 
  insertNetworkVulnerabilitySchema,
  insertAppPermissionSchema,
  insertThreatAlertSchema,
  insertLockdownSettingsSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Utility to get user ID (for demo, we use a fixed user ID)
  const getUserId = (req: Request): number => {
    return 1; // Default user ID for testing
  };
  
  // Get all alarms for user
  router.get("/alarms", async (req: Request, res: Response) => {
    const userId = getUserId(req);
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
      const userId = getUserId(req);
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
    const userId = getUserId(req);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const scans = await storage.getSecurityScans(userId, limit);
    res.json(scans);
  });
  
  // Get latest security scan
  router.get("/security/latest", async (req: Request, res: Response) => {
    const userId = getUserId(req);
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
      const userId = getUserId(req);
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
    
    const userId = getUserId(req);
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
  
  // Network vulnerabilities endpoints
  router.get("/security/vulnerabilities", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const vulnerabilities = await storage.getNetworkVulnerabilities(userId, limit);
    res.json(vulnerabilities);
  });
  
  router.post("/security/vulnerabilities", async (req: Request, res: Response) => {
    try {
      const validatedData = insertNetworkVulnerabilitySchema.parse(req.body);
      const userId = getUserId(req);
      const scanId = req.body.scanId ? parseInt(req.body.scanId as string) : undefined;
      
      const vulnerability = await storage.createNetworkVulnerability({
        ...validatedData,
        userId,
        scanId
      });
      
      res.status(201).json(vulnerability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vulnerability data", errors: error.errors });
      }
      throw error;
    }
  });
  
  router.patch("/security/vulnerabilities/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid vulnerability ID" });
    }
    
    try {
      const validatedData = insertNetworkVulnerabilitySchema.partial().parse(req.body);
      const updatedVulnerability = await storage.updateNetworkVulnerability(id, validatedData);
      
      if (!updatedVulnerability) {
        return res.status(404).json({ message: "Vulnerability not found" });
      }
      
      res.json(updatedVulnerability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vulnerability data", errors: error.errors });
      }
      throw error;
    }
  });
  
  // App permissions endpoints
  router.get("/security/permissions", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const permissions = await storage.getAppPermissions(userId);
    res.json(permissions);
  });
  
  router.post("/security/permissions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAppPermissionSchema.parse(req.body);
      const userId = getUserId(req);
      const scanId = req.body.scanId ? parseInt(req.body.scanId as string) : undefined;
      
      const permission = await storage.createAppPermission({
        ...validatedData,
        userId,
        scanId
      });
      
      res.status(201).json(permission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid permission data", errors: error.errors });
      }
      throw error;
    }
  });
  
  router.patch("/security/permissions/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid permission ID" });
    }
    
    try {
      const validatedData = insertAppPermissionSchema.partial().parse(req.body);
      const updatedPermission = await storage.updateAppPermission(id, validatedData);
      
      if (!updatedPermission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      
      res.json(updatedPermission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid permission data", errors: error.errors });
      }
      throw error;
    }
  });
  
  // Threat alerts endpoints
  router.get("/security/threats", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const onlyActive = req.query.active === 'true';
    
    const threats = await storage.getThreatAlerts(userId, onlyActive);
    res.json(threats);
  });
  
  router.post("/security/threats", async (req: Request, res: Response) => {
    try {
      const validatedData = insertThreatAlertSchema.parse(req.body);
      const userId = getUserId(req);
      
      const threat = await storage.createThreatAlert({
        ...validatedData,
        userId
      });
      
      res.status(201).json(threat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid threat data", errors: error.errors });
      }
      throw error;
    }
  });
  
  router.patch("/security/threats/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid threat ID" });
    }
    
    try {
      const validatedData = insertThreatAlertSchema.partial().parse(req.body);
      const updatedThreat = await storage.updateThreatAlert(id, validatedData);
      
      if (!updatedThreat) {
        return res.status(404).json({ message: "Threat not found" });
      }
      
      res.json(updatedThreat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid threat data", errors: error.errors });
      }
      throw error;
    }
  });
  
  router.post("/security/threats/:id/dismiss", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid threat ID" });
    }
    
    const success = await storage.dismissThreatAlert(id);
    if (!success) {
      return res.status(404).json({ message: "Threat not found" });
    }
    
    res.status(204).end();
  });
  
  // Network scan endpoints
  router.post("/security/network/scan", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    
    // Simulate a network scan result
    const vulnerabilities = [];
    
    // Generate random vulnerabilities for demo purposes
    if (Math.random() > 0.3) {
      vulnerabilities.push({
        type: 'open-port',
        description: 'Port 8080 exposed on router',
        severity: 'medium',
        deviceName: 'Home Router',
        ipAddress: '192.168.1.1',
      });
    }
    
    if (Math.random() > 0.6) {
      vulnerabilities.push({
        type: 'weak-password',
        description: 'Weak password on network device',
        severity: 'high',
        deviceName: 'IoT Camera',
        ipAddress: '192.168.1.24',
      });
    }
    
    // Create a scan record
    const scan = await storage.createSecurityScan({
      userId,
      score: Math.floor(Math.random() * 20) + 75,
      networkCheckResult: vulnerabilities.length > 0 ? 'warning' : 'safe',
      appScanResult: 'safe',
      privacyCheckResult: 'safe',
      systemCheckResult: 'safe',
      issuesFound: [],
      permissionsAccessed: []
    });
    
    // Store vulnerabilities in the database
    for (const vuln of vulnerabilities) {
      await storage.createNetworkVulnerability({
        userId,
        scanId: scan.id,
        type: vuln.type,
        description: vuln.description,
        severity: vuln.severity as any,
        deviceName: vuln.deviceName,
        ipAddress: vuln.ipAddress,
        isResolved: false
      });
    }
    
    // Return scan results
    res.json({
      scanId: scan.id,
      vulnerabilities,
      secureNetworks: Math.floor(Math.random() * 2) + 1,
      vulnerableNetworks: vulnerabilities.length > 0 ? 1 : 0,
      exposedPorts: vulnerabilities.filter(v => v.type === 'open-port').length,
      encryptionLevel: Math.random() > 0.7 ? 'standard' : 'strong',
      vpnConnected: Math.random() > 0.7
    });
  });
  
  // Permission check endpoints
  router.post("/security/permissions/check", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    
    // Demo apps with permissions
    const apps = [
      {
        appName: 'Social Connect',
        permissions: [
          { 
            type: 'camera', 
            description: 'Access camera for photos and video calls', 
            isActive: true, 
            isRecommended: true 
          },
          { 
            type: 'location', 
            description: 'Access precise location', 
            isActive: true, 
            isRecommended: false 
          },
          { 
            type: 'contacts', 
            description: 'Access contacts list', 
            isActive: true, 
            isRecommended: true 
          }
        ]
      },
      {
        appName: 'Weather Forecast',
        permissions: [
          { 
            type: 'location', 
            description: 'Access precise location', 
            isActive: true, 
            isRecommended: true 
          },
          { 
            type: 'contacts', 
            description: 'Access contacts list', 
            isActive: true, 
            isRecommended: false 
          }
        ]
      },
      {
        appName: 'Flashlight Tools',
        permissions: [
          { 
            type: 'camera', 
            description: 'Access camera flash', 
            isActive: true, 
            isRecommended: true 
          },
          { 
            type: 'location', 
            description: 'Access precise location', 
            isActive: true, 
            isRecommended: false 
          }
        ]
      }
    ];
    
    // Create a scan record
    const scan = await storage.createSecurityScan({
      userId,
      score: Math.floor(Math.random() * 20) + 75,
      networkCheckResult: 'safe',
      appScanResult: 'warning',
      privacyCheckResult: 'warning',
      systemCheckResult: 'safe',
      issuesFound: [],
      permissionsAccessed: []
    });
    
    // Store app permissions in the database
    for (const app of apps) {
      for (const perm of app.permissions) {
        await storage.createAppPermission({
          userId,
          scanId: scan.id,
          appName: app.appName,
          permissionType: perm.type,
          isActive: perm.isActive,
          isRecommended: perm.isRecommended
        });
      }
    }
    
    // Count unnecessary permissions
    let unnecessaryPermissions = 0;
    let highRiskApps = 0;
    let mediumRiskApps = 0;
    let totalPermissions = 0;
    
    apps.forEach(app => {
      let appUnnecessary = 0;
      app.permissions.forEach(perm => {
        totalPermissions++;
        if (perm.isActive && !perm.isRecommended) {
          unnecessaryPermissions++;
          appUnnecessary++;
        }
      });
      
      if (appUnnecessary >= 2) highRiskApps++;
      else if (appUnnecessary >= 1) mediumRiskApps++;
    });
    
    // Calculate risk score (0-100)
    const riskScore = Math.max(0, Math.min(100, 100 - (unnecessaryPermissions * 100 / totalPermissions)));
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (riskScore > 75) riskLevel = 'low';
    else if (riskScore > 50) riskLevel = 'medium';
    else riskLevel = 'high';
    
    // Return permission check results
    res.json({
      scanId: scan.id,
      riskLevel,
      riskScore: Math.round(riskScore),
      highRiskApps,
      mediumRiskApps,
      totalPermissions,
      unnecessaryPermissions,
      apps: apps.map((app, index) => ({
        id: index + 1,
        appName: app.appName,
        icon: app.appName === 'Social Connect' ? 'ri-chat-3-line' : 
              app.appName === 'Weather Forecast' ? 'ri-cloud-line' : 'ri-flashlight-line',
        permissions: app.permissions
      }))
    });
  });
  
  // Lockdown settings endpoints
  router.get("/security/lockdown", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const settings = await storage.getLockdownSettings(userId);
    
    if (!settings) {
      return res.status(404).json({ message: "Lockdown settings not found" });
    }
    
    res.json(settings);
  });
  
  router.post("/security/lockdown", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLockdownSettingsSchema.parse(req.body);
      const userId = getUserId(req);
      
      // Check if settings already exist
      const existingSettings = await storage.getLockdownSettings(userId);
      
      if (existingSettings) {
        // Update existing settings
        const updatedSettings = await storage.updateLockdownSettings(userId, validatedData);
        return res.json(updatedSettings);
      }
      
      // Create new settings
      const settings = await storage.createLockdownSettings({
        ...validatedData,
        userId
      });
      
      res.status(201).json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lockdown settings data", errors: error.errors });
      }
      throw error;
    }
  });
  
  router.patch("/security/lockdown", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLockdownSettingsSchema.partial().parse(req.body);
      const userId = getUserId(req);
      
      const updatedSettings = await storage.updateLockdownSettings(userId, validatedData);
      
      if (!updatedSettings) {
        // If no settings exist, create default ones with the provided updates
        const settings = await storage.createLockdownSettings({
          ...req.body,
          userId
        });
        return res.status(201).json(settings);
      }
      
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lockdown settings data", errors: error.errors });
      }
      throw error;
    }
  });
  
  router.post("/security/lockdown/toggle", async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { isEnabled } = req.body;
    
    if (typeof isEnabled !== 'boolean') {
      return res.status(400).json({ message: "isEnabled must be a boolean value" });
    }
    
    const settings = await storage.toggleLockdownMode(userId, isEnabled);
    res.json(settings);
  });
  
  // Register routes
  app.use("/api", router);
  
  const httpServer = createServer(app);
  return httpServer;
}
