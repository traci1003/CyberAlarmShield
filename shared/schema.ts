import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alarm table
export const alarms = pgTable("alarms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  time: text("time").notNull(),
  label: text("label"),
  days: text("days").array(),
  isActive: boolean("is_active").default(true),
  vibrate: boolean("vibrate").default(true),
  sound: boolean("sound").default(true),
  mathProblem: boolean("math_problem").default(false),
  securityScan: boolean("security_scan").default(false),
  phishingDrill: boolean("phishing_drill").default(false),
  soundCloudUrl: text("sound_cloud_url"), // SoundCloud playlist URL
  settings: text("settings"), // JSON string for storing additional settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Security scans
export const securityScans = pgTable("security_scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow(),
  score: integer("score").notNull(),
  appScanResult: text("app_scan_result"),
  networkCheckResult: text("network_check_result"),
  privacyCheckResult: text("privacy_check_result"),
  systemCheckResult: text("system_check_result"),
  issuesFound: jsonb("issues_found"),
  permissionsAccessed: jsonb("permissions_accessed"),
});

// Lockdown settings
export const lockdownSettings = pgTable("lockdown_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  isEnabled: boolean("is_enabled").default(false),
  startTime: text("start_time").default("22:00"),
  endTime: text("end_time").default("07:00"),
  blockBackgroundActivity: boolean("block_background_activity").default(true),
  enforceVpn: boolean("enforce_vpn").default(false),
  disableBluetoothWifi: boolean("disable_bluetooth_wifi").default(false),
  autoScanOnEnd: boolean("auto_scan_on_end").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Network Vulnerability table
export const networkVulnerabilities = pgTable("network_vulnerabilities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  deviceName: varchar("device_name", { length: 100 }),
  ipAddress: varchar("ip_address", { length: 50 }),
  timestamp: timestamp("timestamp").defaultNow(),
  isResolved: boolean("is_resolved").default(false),
  scanId: integer("scan_id").references(() => securityScans.id),
});

// App Permissions table
export const appPermissions = pgTable("app_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  appName: varchar("app_name", { length: 100 }).notNull(),
  permissionType: varchar("permission_type", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  isRecommended: boolean("is_recommended").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  scanId: integer("scan_id").references(() => securityScans.id),
});

// Threat Alerts table
export const threatAlerts = pgTable("threat_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  sourceIp: varchar("source_ip", { length: 50 }),
  url: text("url"),
  app: varchar("app", { length: 100 }),
  affectedDevice: varchar("affected_device", { length: 100 }),
  recommendedAction: text("recommended_action"),
  dismissed: boolean("dismissed").default(false),
});

// Security tips
export const securityTips = pgTable("security_tips", {
  id: serial("id").primaryKey(),
  tip: text("tip").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  alarms: many(alarms),
  securityScans: many(securityScans),
  networkVulnerabilities: many(networkVulnerabilities),
  appPermissions: many(appPermissions),
  threatAlerts: many(threatAlerts),
  lockdownSettings: many(lockdownSettings),
}));

export const securityScansRelations = relations(securityScans, ({ one, many }) => ({
  user: one(users, {
    fields: [securityScans.userId],
    references: [users.id],
  }),
  networkVulnerabilities: many(networkVulnerabilities),
  appPermissions: many(appPermissions),
}));

export const networkVulnerabilitiesRelations = relations(networkVulnerabilities, ({ one }) => ({
  user: one(users, {
    fields: [networkVulnerabilities.userId],
    references: [users.id],
  }),
  scan: one(securityScans, {
    fields: [networkVulnerabilities.scanId],
    references: [securityScans.id],
  }),
}));

export const appPermissionsRelations = relations(appPermissions, ({ one }) => ({
  user: one(users, {
    fields: [appPermissions.userId],
    references: [users.id],
  }),
  scan: one(securityScans, {
    fields: [appPermissions.scanId],
    references: [securityScans.id],
  }),
}));

export const threatAlertsRelations = relations(threatAlerts, ({ one }) => ({
  user: one(users, {
    fields: [threatAlerts.userId],
    references: [users.id],
  }),
}));

export const lockdownSettingsRelations = relations(lockdownSettings, ({ one }) => ({
  user: one(users, {
    fields: [lockdownSettings.userId],
    references: [users.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAlarmSchema = createInsertSchema(alarms).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSecurityScanSchema = createInsertSchema(securityScans).omit({
  id: true,
  userId: true,
  timestamp: true,
});

export const insertNetworkVulnerabilitySchema = createInsertSchema(networkVulnerabilities).omit({
  id: true,
  userId: true,
  timestamp: true,
  scanId: true,
});

export const insertAppPermissionSchema = createInsertSchema(appPermissions).omit({
  id: true,
  userId: true,
  lastUpdated: true,
  scanId: true,
});

export const insertThreatAlertSchema = createInsertSchema(threatAlerts).omit({
  id: true,
  userId: true,
  timestamp: true,
});

export const insertSecurityTipSchema = createInsertSchema(securityTips).omit({
  id: true,
});

export const insertLockdownSettingsSchema = createInsertSchema(lockdownSettings).omit({
  id: true,
  userId: true,
  lastUpdated: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAlarm = z.infer<typeof insertAlarmSchema>;
export type Alarm = typeof alarms.$inferSelect;

export type InsertSecurityScan = z.infer<typeof insertSecurityScanSchema>;
export type SecurityScan = typeof securityScans.$inferSelect;

export type InsertNetworkVulnerability = z.infer<typeof insertNetworkVulnerabilitySchema>;
export type NetworkVulnerability = typeof networkVulnerabilities.$inferSelect;

export type InsertAppPermission = z.infer<typeof insertAppPermissionSchema>;
export type AppPermission = typeof appPermissions.$inferSelect;

export type InsertThreatAlert = z.infer<typeof insertThreatAlertSchema>;
export type ThreatAlert = typeof threatAlerts.$inferSelect;

export type InsertSecurityTip = z.infer<typeof insertSecurityTipSchema>;
export type SecurityTip = typeof securityTips.$inferSelect;

export type InsertLockdownSettings = z.infer<typeof insertLockdownSettingsSchema>;
export type LockdownSettings = typeof lockdownSettings.$inferSelect;

export type SecurityStatus = 'safe' | 'warning' | 'danger';
