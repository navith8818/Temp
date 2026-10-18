export type NotificationType = 'system' | 'security' | 'billing' | 'backup';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
  link?: string;
}

export interface SSHKey {
  id: string;
  name: string;
  fingerprint: string;
  addedDate: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  initials: string;
  timezone: string;
  language: string;
  memberSince: string;
  twoFactorEnabled: boolean;
  emailDigest: boolean;
  securityAlerts: boolean;
  billingAlerts: boolean;
  sshKeys: SSHKey[];
  activeSessions: ActiveSession[];
}
