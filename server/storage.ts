import { 
  users, type User, type InsertUser,
  alarms, type Alarm, type InsertAlarm,
  securityScans, type SecurityScan, type InsertSecurityScan,
  securityTips, type SecurityTip, type InsertSecurityTip,
  networkVulnerabilities, type NetworkVulnerability, type InsertNetworkVulnerability,
  appPermissions, type AppPermission, type InsertAppPermission,
  threatAlerts, type ThreatAlert, type InsertThreatAlert
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, or } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Alarm methods
  getAlarms(userId: number): Promise<Alarm[]>;
  getAlarm(id: number): Promise<Alarm | undefined>;
  createAlarm(alarm: InsertAlarm & { userId: number }): Promise<Alarm>;
  updateAlarm(id: number, alarm: Partial<InsertAlarm>): Promise<Alarm | undefined>;
  deleteAlarm(id: number): Promise<boolean>;
  
  // Security scan methods
  getSecurityScans(userId: number, limit?: number): Promise<SecurityScan[]>;
  getLatestSecurityScan(userId: number): Promise<SecurityScan | undefined>;
  createSecurityScan(scan: InsertSecurityScan & { userId: number }): Promise<SecurityScan>;
  
  // Security tips methods
  getSecurityTips(): Promise<SecurityTip[]>;
  getRandomSecurityTip(): Promise<SecurityTip | undefined>;
  createSecurityTip(tip: InsertSecurityTip): Promise<SecurityTip>;
  
  // Network vulnerability methods
  getNetworkVulnerabilities(userId: number, limit?: number): Promise<NetworkVulnerability[]>;
  createNetworkVulnerability(vulnerability: InsertNetworkVulnerability & { userId: number, scanId?: number }): Promise<NetworkVulnerability>;
  updateNetworkVulnerability(id: number, update: Partial<NetworkVulnerability>): Promise<NetworkVulnerability | undefined>;
  
  // App permissions methods
  getAppPermissions(userId: number): Promise<AppPermission[]>;
  createAppPermission(permission: InsertAppPermission & { userId: number, scanId?: number }): Promise<AppPermission>;
  updateAppPermission(id: number, update: Partial<AppPermission>): Promise<AppPermission | undefined>;
  
  // Threat alerts methods
  getThreatAlerts(userId: number, onlyActive?: boolean): Promise<ThreatAlert[]>;
  createThreatAlert(threat: InsertThreatAlert & { userId: number }): Promise<ThreatAlert>;
  updateThreatAlert(id: number, update: Partial<ThreatAlert>): Promise<ThreatAlert | undefined>;
  dismissThreatAlert(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Alarm methods
  async getAlarms(userId: number): Promise<Alarm[]> {
    return await db.select().from(alarms).where(eq(alarms.userId, userId));
  }

  async getAlarm(id: number): Promise<Alarm | undefined> {
    const [alarm] = await db.select().from(alarms).where(eq(alarms.id, id));
    return alarm;
  }

  async createAlarm(alarm: InsertAlarm & { userId: number }): Promise<Alarm> {
    const [newAlarm] = await db.insert(alarms).values(alarm).returning();
    return newAlarm;
  }

  async updateAlarm(id: number, update: Partial<InsertAlarm>): Promise<Alarm | undefined> {
    const [updatedAlarm] = await db
      .update(alarms)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(alarms.id, id))
      .returning();
    return updatedAlarm;
  }

  async deleteAlarm(id: number): Promise<boolean> {
    const result = await db.delete(alarms).where(eq(alarms.id, id)).returning({ id: alarms.id });
    return result.length > 0;
  }

  // Security scan methods
  async getSecurityScans(userId: number, limit?: number): Promise<SecurityScan[]> {
    const query = db
      .select()
      .from(securityScans)
      .where(eq(securityScans.userId, userId))
      .orderBy(desc(securityScans.timestamp));
    
    if (limit) {
      query.limit(limit);
    }
    
    return await query;
  }

  async getLatestSecurityScan(userId: number): Promise<SecurityScan | undefined> {
    const scans = await this.getSecurityScans(userId, 1);
    return scans.length > 0 ? scans[0] : undefined;
  }

  async createSecurityScan(scan: InsertSecurityScan & { userId: number }): Promise<SecurityScan> {
    const [newScan] = await db.insert(securityScans).values(scan).returning();
    return newScan;
  }

  // Security tips methods
  async getSecurityTips(): Promise<SecurityTip[]> {
    return await db.select().from(securityTips).where(eq(securityTips.isActive, true));
  }

  async getRandomSecurityTip(): Promise<SecurityTip | undefined> {
    // Use PostgreSQL's RANDOM() function to get a random tip
    const [tip] = await db
      .select()
      .from(securityTips)
      .where(eq(securityTips.isActive, true))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    
    return tip;
  }

  async createSecurityTip(tip: InsertSecurityTip): Promise<SecurityTip> {
    const [newTip] = await db.insert(securityTips).values(tip).returning();
    return newTip;
  }
  
  // Network vulnerability methods
  async getNetworkVulnerabilities(userId: number, limit?: number): Promise<NetworkVulnerability[]> {
    const query = db
      .select()
      .from(networkVulnerabilities)
      .where(eq(networkVulnerabilities.userId, userId))
      .orderBy(desc(networkVulnerabilities.timestamp));
    
    if (limit) {
      query.limit(limit);
    }
    
    return await query;
  }
  
  async createNetworkVulnerability(vulnerability: InsertNetworkVulnerability & { userId: number, scanId?: number }): Promise<NetworkVulnerability> {
    const [newVulnerability] = await db.insert(networkVulnerabilities).values(vulnerability).returning();
    return newVulnerability;
  }
  
  async updateNetworkVulnerability(id: number, update: Partial<NetworkVulnerability>): Promise<NetworkVulnerability | undefined> {
    const [updatedVulnerability] = await db
      .update(networkVulnerabilities)
      .set(update)
      .where(eq(networkVulnerabilities.id, id))
      .returning();
    return updatedVulnerability;
  }
  
  // App permissions methods
  async getAppPermissions(userId: number): Promise<AppPermission[]> {
    return await db
      .select()
      .from(appPermissions)
      .where(eq(appPermissions.userId, userId))
      .orderBy(appPermissions.appName, appPermissions.permissionType);
  }
  
  async createAppPermission(permission: InsertAppPermission & { userId: number, scanId?: number }): Promise<AppPermission> {
    const [newPermission] = await db.insert(appPermissions).values(permission).returning();
    return newPermission;
  }
  
  async updateAppPermission(id: number, update: Partial<AppPermission>): Promise<AppPermission | undefined> {
    const [updatedPermission] = await db
      .update(appPermissions)
      .set({ ...update, lastUpdated: new Date() })
      .where(eq(appPermissions.id, id))
      .returning();
    return updatedPermission;
  }
  
  // Threat alerts methods
  async getThreatAlerts(userId: number, onlyActive: boolean = false): Promise<ThreatAlert[]> {
    let query = db
      .select()
      .from(threatAlerts)
      .where(eq(threatAlerts.userId, userId));
    
    if (onlyActive) {
      query = db
        .select()
        .from(threatAlerts)
        .where(and(
          eq(threatAlerts.userId, userId),
          eq(threatAlerts.dismissed, false)
        ));
    }
    
    return await query.orderBy(desc(threatAlerts.timestamp));
  }
  
  async createThreatAlert(threat: InsertThreatAlert & { userId: number }): Promise<ThreatAlert> {
    const [newThreat] = await db.insert(threatAlerts).values(threat).returning();
    return newThreat;
  }
  
  async updateThreatAlert(id: number, update: Partial<ThreatAlert>): Promise<ThreatAlert | undefined> {
    const [updatedThreat] = await db
      .update(threatAlerts)
      .set(update)
      .where(eq(threatAlerts.id, id))
      .returning();
    return updatedThreat;
  }
  
  async dismissThreatAlert(id: number): Promise<boolean> {
    const [updatedThreat] = await db
      .update(threatAlerts)
      .set({ dismissed: true })
      .where(eq(threatAlerts.id, id))
      .returning({ id: threatAlerts.id });
    return !!updatedThreat;
  }
  
  async seedSecurityTips(): Promise<void> {
    const existingTips = await db.select().from(securityTips);
    
    if (existingTips.length === 0) {
      const tips = [
        { tip: "Always check the sender's email address, not just the display name, to avoid falling for phishing attacks.", category: "phishing", isActive: true },
        { tip: "Use a password manager to generate and store unique passwords for all your accounts.", category: "passwords", isActive: true },
        { tip: "Enable two-factor authentication on all your important accounts for an extra layer of security.", category: "authentication", isActive: true },
        { tip: "Regularly update your device's operating system and apps to protect against security vulnerabilities.", category: "updates", isActive: true },
        { tip: "Be cautious when connecting to public Wi-Fi networks. Consider using a VPN for better security.", category: "network", isActive: true },
        { tip: "Review app permissions regularly and revoke access to your camera, microphone, and location when not needed.", category: "privacy", isActive: true },
        { tip: "Encrypt your sensitive data to protect it from unauthorized access even if your device is lost or stolen.", category: "encryption", isActive: true },
        { tip: "Be wary of suspicious links in emails, texts, or social media messages that could lead to phishing sites.", category: "phishing", isActive: true },
        { tip: "Backup your important data regularly to protect against ransomware attacks and device failure.", category: "backup", isActive: true },
        { tip: "Lock your device with a strong PIN, pattern, or biometric authentication to prevent unauthorized access.", category: "device", isActive: true }
      ];
      
      await db.insert(securityTips).values(tips);
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize database with seed data
(async () => {
  try {
    await (storage as DatabaseStorage).seedSecurityTips();
    console.log('Database initialized with seed data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
})();
