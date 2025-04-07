import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

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
});

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

export const securityTips = pgTable("security_tips", {
  id: serial("id").primaryKey(),
  tip: text("tip").notNull(),
  category: text("category").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAlarmSchema = createInsertSchema(alarms).omit({
  id: true,
  userId: true,
});

export const insertSecurityScanSchema = createInsertSchema(securityScans).omit({
  id: true,
  userId: true,
  timestamp: true,
});

export const insertSecurityTipSchema = createInsertSchema(securityTips).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAlarm = z.infer<typeof insertAlarmSchema>;
export type Alarm = typeof alarms.$inferSelect;

export type InsertSecurityScan = z.infer<typeof insertSecurityScanSchema>;
export type SecurityScan = typeof securityScans.$inferSelect;

export type InsertSecurityTip = z.infer<typeof insertSecurityTipSchema>;
export type SecurityTip = typeof securityTips.$inferSelect;

export type SecurityStatus = 'safe' | 'warning' | 'danger';
