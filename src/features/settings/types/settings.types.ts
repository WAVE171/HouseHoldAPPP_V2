export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  taskReminders: boolean;
  eventReminders: boolean;
  billReminders: boolean;
  inventoryAlerts: boolean;
  weeklyDigest: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'household' | 'private';
  showActivityStatus: boolean;
  allowInvitations: boolean;
  shareCalendar: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  trustedDevices: TrustedDevice[];
  loginHistory: LoginHistoryEntry[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  browser: string;
  os: string;
  lastUsed: string;
  isCurrent: boolean;
}

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  status: 'success' | 'failed';
}

export interface AppSettings {
  preferences: UserPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
}
