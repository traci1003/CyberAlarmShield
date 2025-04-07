export interface AlarmSettings {
  volumeLevel: number;
  gradualVolume: boolean;
  snoozeCount: number;
  snoozeDuration: number;
}

export interface Alarm {
  id: number;
  time: string;
  label?: string;
  days: string[];
  isActive: boolean;
  vibrate: boolean;
  sound: boolean;
  mathProblem: boolean;
  securityScan: boolean;
  phishingDrill: boolean;
  settings?: string; // JSON string for additional settings
}

export interface SecurityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface PermissionAccess {
  app: string;
  permission: string;
  timestamp: Date;
}

export interface SecurityScan {
  id: number;
  timestamp: Date;
  score: number;
  appScanResult: string;
  networkCheckResult: string;
  privacyCheckResult: string;
  systemCheckResult: string;
  issuesFound: SecurityIssue[];
  permissionsAccessed: PermissionAccess[];
}

export interface SecurityTip {
  id: number;
  tip: string;
  category: string;
}

export type SecurityStatus = 'safe' | 'warning' | 'danger';

export interface Tab {
  id: string;
  label: string;
  icon: string;
}

export interface MathProblem {
  question: string;
  options: string[];
  correctAnswer: string;
}
