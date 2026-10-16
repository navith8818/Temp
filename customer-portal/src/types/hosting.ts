export type HostingStatus = 'active' | 'needs_dns' | 'provisioning' | 'suspended';

export type WebsiteStatus = 'active' | 'needs_dns' | 'ssl_pending' | 'maintenance';

export type AppType = 'WordPress' | 'Node.js' | 'PHP/Static' | 'Laravel' | 'Custom';

export interface StorageBreakdown {
  webGb: number;
  dbGb: number;
  mailGb: number;
  backupGb: number;
}

export interface BackupSummary {
  lastBackup: string;
  retentionDays: number;
  frequency: string;
  snapshotSizeGb: number;
  totalSnapshots: number;
}

export interface HostingPlan {
  id: string;
  name: string;
  tier: string;
  status: HostingStatus;
  primaryDomain: string;
  serverHost: string;
  serverIp: string;
  controlPanelPort: number;
  hestiaUsername: string;
  productId: string;
  startedAt: string;
  updatedAt: string;
  renewalDate: string;
  renewalPrice: number;
  billingCycle: 'monthly' | 'annual';
  autoRenew: boolean;
  storageUsedGb: number;
  storageTotalGb: number;
  storageBreakdown: StorageBreakdown;
  bandwidthUsedGb: number;
  bandwidthTotalGb: number;
  domainCount: number;
  domainLimit: number;
  websiteCount: number;
  inodesUsed: number;
  inodesTotal: number;
  phpVersion: string;
  availablePhpVersions: string[];
  webServer: string;
  sslActive: boolean;
  dnsNameservers: string[];
  backupSummary: BackupSummary;
  mailboxesUsed: number;
  mailboxesLimit: number;
}

export interface Website {
  id: string;
  hostingPlanId: string;
  domain: string;
  status: WebsiteStatus;
  createdAt: string;
  appType: AppType;
  appVersion?: string;
  phpVersion: string;
  sslActive: boolean;
  sslIssuer?: string;
  sslExpiresInDays?: number;
  documentRoot: string;
  storageUsedMb: number;
  databaseCount: number;
  emailCount: number;
  isPrimary?: boolean;
}

export interface DnsRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  content: string;
  ttl: number;
}

export interface HostingProductTier {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  storageGb: number;
  domainLimit: number;
  bandwidthGb: number;
  cpuCores: number;
  ramGb: number;
  popular?: boolean;
  features: string[];
}
