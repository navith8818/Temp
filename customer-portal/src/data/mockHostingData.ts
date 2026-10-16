import { HostingPlan, Website, HostingProductTier } from '@/types/hosting';

export const INITIAL_HOSTING_PLAN: HostingPlan = {
  id: 'plan_785df5d6',
  name: 'Web Hosting Essential',
  tier: 'Essential SSD NVMe',
  status: 'active',
  primaryDomain: 'freshkitchen.io',
  serverHost: 'cp1.serversalad.com',
  serverIp: '198.51.100.42',
  controlPanelPort: 8083,
  hestiaUsername: 'usr_salad_84',
  productId: '785df5d6-7b0b-43c2-8d55-9cc92e677dad',
  startedAt: 'Jan 13, 2026',
  updatedAt: 'Oct 13, 2026',
  renewalDate: 'Nov 15, 2026',
  renewalPrice: 9.99,
  billingCycle: 'monthly',
  autoRenew: true,
  storageUsedGb: 8.4,
  storageTotalGb: 25.0,
  storageBreakdown: {
    webGb: 5.6,
    dbGb: 1.8,
    mailGb: 0.7,
    backupGb: 0.3,
  },
  bandwidthUsedGb: 42.6,
  bandwidthTotalGb: 500.0,
  domainCount: 2,
  domainLimit: 5,
  websiteCount: 2,
  inodesUsed: 68420,
  inodesTotal: 250000,
  phpVersion: '8.3',
  availablePhpVersions: ['8.1', '8.2', '8.3', '8.4'],
  webServer: 'Nginx + PHP-FPM',
  sslActive: true,
  dnsNameservers: ['ns1.serversalad.com', 'ns2.serversalad.com'],
  backupSummary: {
    lastBackup: 'Today at 03:00 UTC',
    retentionDays: 14,
    frequency: 'Daily Automated',
    snapshotSizeGb: 2.1,
    totalSnapshots: 14,
  },
  mailboxesUsed: 2,
  mailboxesLimit: 10,
};

export const INITIAL_WEBSITES: Website[] = [
  {
    id: 'web_01',
    hostingPlanId: 'plan_785df5d6',
    domain: 'freshkitchen.io',
    status: 'active',
    createdAt: 'Dec 23, 2025, 11:53 AM',
    appType: 'WordPress',
    appVersion: '6.9',
    phpVersion: '8.3',
    sslActive: true,
    sslIssuer: "Let's Encrypt Authority X3",
    sslExpiresInDays: 74,
    documentRoot: '/home/usr_salad_84/web/freshkitchen.io/public_html',
    storageUsedMb: 3420,
    databaseCount: 1,
    emailCount: 2,
    isPrimary: true,
  },
  {
    id: 'web_02',
    hostingPlanId: 'plan_785df5d6',
    domain: 'craftsalad.dev',
    status: 'active',
    createdAt: 'Jan 13, 2026, 04:15 PM',
    appType: 'PHP/Static',
    appVersion: 'Nginx FastCGI',
    phpVersion: '8.3',
    sslActive: true,
    sslIssuer: "Let's Encrypt Authority X3",
    sslExpiresInDays: 82,
    documentRoot: '/home/usr_salad_84/web/craftsalad.dev/public_html',
    storageUsedMb: 1180,
    databaseCount: 1,
    emailCount: 0,
    isPrimary: false,
  },
];

export const HOSTING_PRODUCTS: HostingProductTier[] = [
  {
    id: 'tier_starter',
    name: 'Web Hosting Starter',
    tagline: 'Ideal for personal blogs and lightweight landing pages.',
    priceMonthly: 4.99,
    priceAnnual: 49.90,
    storageGb: 10,
    domainLimit: 1,
    bandwidthGb: 100,
    cpuCores: 1,
    ramGb: 1,
    features: [
      '1 Domain / 1 Website',
      '10 GB NVMe SSD Storage',
      'Free Let’s Encrypt SSL',
      'HestiaCP Web Panel',
      'Automated Weekly Backups',
      'Standard Support (24/7)',
    ],
  },
  {
    id: 'tier_essential',
    name: 'Web Hosting Essential',
    tagline: 'Our most popular balance of capacity and developer flexibility.',
    priceMonthly: 9.99,
    priceAnnual: 99.90,
    storageGb: 25,
    domainLimit: 5,
    bandwidthGb: 500,
    cpuCores: 2,
    ramGb: 2,
    popular: true,
    features: [
      'Up to 5 Domains & Websites',
      '25 GB NVMe SSD Storage',
      'Full HestiaCP Control Panel',
      'Free SSL & HTTP/3 Enabled',
      'Daily Backups (14-Day Retention)',
      'Git Deployment & SSH / SFTP Access',
      'phpMyAdmin & Unlimited MariaDB Databases',
    ],
  },
  {
    id: 'tier_pro',
    name: 'Web Hosting Pro',
    tagline: 'High concurrency and compute for growing businesses and agencies.',
    priceMonthly: 19.99,
    priceAnnual: 199.90,
    storageGb: 60,
    domainLimit: 15,
    bandwidthGb: 1500,
    cpuCores: 4,
    ramGb: 4,
    features: [
      'Up to 15 Domains & Websites',
      '60 GB Enterprise NVMe SSD',
      'High-Performance Redis & Memcached',
      'Dedicated Server Salad Nameservers',
      'Hourly Snapshot Backups (30-Day Retention)',
      'Node.js & Python Application Support',
      'Priority Infrastructure Support',
    ],
  },
];

/**
 * Service simulation layer
 * Ready to be swapped with NestJS HTTP endpoints (`/api/v1/hosting/...`)
 */
export const hostingService = {
  async getHostingPlan(): Promise<HostingPlan> {
    await new Promise((res) => setTimeout(res, 200));
    return { ...INITIAL_HOSTING_PLAN };
  },

  async getWebsites(): Promise<Website[]> {
    await new Promise((res) => setTimeout(res, 180));
    return [...INITIAL_WEBSITES];
  },

  async toggleAutoRenew(enabled: boolean): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 350));
    return enabled;
  },

  async addWebsite(data: {
    domain: string;
    appType: Website['appType'];
    phpVersion: string;
  }): Promise<Website> {
    await new Promise((res) => setTimeout(res, 450));
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      id: `web_${Date.now()}`,
      hostingPlanId: INITIAL_HOSTING_PLAN.id,
      domain: data.domain.toLowerCase().trim(),
      status: 'active',
      createdAt: formattedDate,
      appType: data.appType,
      phpVersion: data.phpVersion,
      sslActive: true,
      sslIssuer: "Let's Encrypt Authority X3",
      sslExpiresInDays: 90,
      documentRoot: `/home/${INITIAL_HOSTING_PLAN.hestiaUsername}/web/${data.domain.toLowerCase().trim()}/public_html`,
      storageUsedMb: 120,
      databaseCount: 0,
      emailCount: 0,
    };
  },

  async deleteWebsite(websiteId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  },

  async updatePhpVersion(phpVersion: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  },

  async requestCancellation(reason: string): Promise<{ success: boolean; ticketId: string }> {
    await new Promise((res) => setTimeout(res, 400));
    return {
      success: true,
      ticketId: `TICK-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  },
};
