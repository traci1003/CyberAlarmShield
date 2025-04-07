import { 
  users, type User, type InsertUser,
  alarms, type Alarm, type InsertAlarm,
  securityScans, type SecurityScan, type InsertSecurityScan,
  securityTips, type SecurityTip, type InsertSecurityTip
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private alarms: Map<number, Alarm>;
  private securityScans: Map<number, SecurityScan>;
  private securityTips: Map<number, SecurityTip>;
  private userIdCounter: number;
  private alarmIdCounter: number;
  private scanIdCounter: number;
  private tipIdCounter: number;

  constructor() {
    this.users = new Map();
    this.alarms = new Map();
    this.securityScans = new Map();
    this.securityTips = new Map();
    this.userIdCounter = 1;
    this.alarmIdCounter = 1;
    this.scanIdCounter = 1;
    this.tipIdCounter = 1;
    
    // Seed some security tips
    this.seedSecurityTips();
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

  // Alarm methods
  async getAlarms(userId: number): Promise<Alarm[]> {
    return Array.from(this.alarms.values()).filter(
      (alarm) => alarm.userId === userId,
    );
  }

  async getAlarm(id: number): Promise<Alarm | undefined> {
    return this.alarms.get(id);
  }

  async createAlarm(alarm: InsertAlarm & { userId: number }): Promise<Alarm> {
    const id = this.alarmIdCounter++;
    const newAlarm: Alarm = { ...alarm, id };
    this.alarms.set(id, newAlarm);
    return newAlarm;
  }

  async updateAlarm(id: number, alarm: Partial<InsertAlarm>): Promise<Alarm | undefined> {
    const existingAlarm = this.alarms.get(id);
    if (!existingAlarm) return undefined;
    
    const updatedAlarm: Alarm = { ...existingAlarm, ...alarm };
    this.alarms.set(id, updatedAlarm);
    return updatedAlarm;
  }

  async deleteAlarm(id: number): Promise<boolean> {
    return this.alarms.delete(id);
  }

  // Security scan methods
  async getSecurityScans(userId: number, limit?: number): Promise<SecurityScan[]> {
    const scans = Array.from(this.securityScans.values())
      .filter((scan) => scan.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? scans.slice(0, limit) : scans;
  }

  async getLatestSecurityScan(userId: number): Promise<SecurityScan | undefined> {
    const scans = await this.getSecurityScans(userId, 1);
    return scans.length > 0 ? scans[0] : undefined;
  }

  async createSecurityScan(scan: InsertSecurityScan & { userId: number }): Promise<SecurityScan> {
    const id = this.scanIdCounter++;
    const timestamp = new Date();
    const newScan: SecurityScan = { ...scan, id, timestamp };
    this.securityScans.set(id, newScan);
    return newScan;
  }

  // Security tips methods
  async getSecurityTips(): Promise<SecurityTip[]> {
    return Array.from(this.securityTips.values());
  }

  async getRandomSecurityTip(): Promise<SecurityTip | undefined> {
    const tips = Array.from(this.securityTips.values());
    if (tips.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }

  async createSecurityTip(tip: InsertSecurityTip): Promise<SecurityTip> {
    const id = this.tipIdCounter++;
    const newTip: SecurityTip = { ...tip, id };
    this.securityTips.set(id, newTip);
    return newTip;
  }
  
  private seedSecurityTips() {
    const tips = [
      { tip: "Always check the sender's email address, not just the display name, to avoid falling for phishing attacks.", category: "phishing" },
      { tip: "Use a password manager to generate and store unique passwords for all your accounts.", category: "passwords" },
      { tip: "Enable two-factor authentication on all your important accounts for an extra layer of security.", category: "authentication" },
      { tip: "Regularly update your device's operating system and apps to protect against security vulnerabilities.", category: "updates" },
      { tip: "Be cautious when connecting to public Wi-Fi networks. Consider using a VPN for better security.", category: "network" },
      { tip: "Review app permissions regularly and revoke access to your camera, microphone, and location when not needed.", category: "privacy" },
      { tip: "Encrypt your sensitive data to protect it from unauthorized access even if your device is lost or stolen.", category: "encryption" },
      { tip: "Be wary of suspicious links in emails, texts, or social media messages that could lead to phishing sites.", category: "phishing" },
      { tip: "Backup your important data regularly to protect against ransomware attacks and device failure.", category: "backup" },
      { tip: "Lock your device with a strong PIN, pattern, or biometric authentication to prevent unauthorized access.", category: "device" }
    ];
    
    tips.forEach(tip => {
      this.createSecurityTip(tip);
    });
  }
}

export const storage = new MemStorage();
