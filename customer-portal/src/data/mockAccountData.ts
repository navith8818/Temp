import { NotificationItem, UserProfile } from '@/types/account';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'SSL Certificate Auto-Renewed',
    description: "Let's Encrypt certificate for serversalad.cloud was renewed successfully for 90 days.",
    timestamp: '12m ago',
    type: 'security',
    read: false,
    link: '/',
  },
  {
    id: 'notif_2',
    title: 'Automated Backup Completed',
    description: 'Daily snapshot backup for Cloud VPS 8-Core completed successfully (8.4 GB stored).',
    timestamp: '2h ago',
    type: 'backup',
    read: false,
    link: '/',
  },
  {
    id: 'notif_3',
    title: 'Payment Processed (#INV-2026-004)',
    description: 'Monthly renewal charge of $49.00 USD paid via Visa ending in 4242.',
    timestamp: 'Yesterday',
    type: 'billing',
    read: true,
    link: '/billing',
  },
  {
    id: 'notif_4',
    title: 'Scheduled Maintenance Notice',
    description: 'Routine kernel patch on US-East data center on Oct 25 at 02:00 UTC (zero downtime).',
    timestamp: '3d ago',
    type: 'system',
    read: true,
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_salad_84',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@serversalad.cloud',
  phone: '+1 (555) 382-9014',
  company: 'Fresh Kitchen Media S.A.',
  role: 'Account Owner',
  initials: 'SJ',
  timezone: 'UTC+00:00 (London, Lisbon)',
  language: 'English (United States)',
  memberSince: 'January 2024',
  twoFactorEnabled: true,
  emailDigest: true,
  securityAlerts: true,
  billingAlerts: true,
  sshKeys: [
    {
      id: 'ssh_1',
      name: 'MacBook Pro - Workstation',
      fingerprint: 'SHA256:7uK+Jb4h...x9Pq2L',
      addedDate: 'Feb 14, 2024',
    },
    {
      id: 'ssh_2',
      name: 'CI/CD Deploy Key',
      fingerprint: 'SHA256:3rN9vT...e4Mm0K',
      addedDate: 'Apr 02, 2024',
    },
  ],
  activeSessions: [
    {
      id: 'sess_1',
      device: 'Windows 11 PC',
      browser: 'Chrome 128.0',
      ip: '194.154.218.4',
      location: 'Colombo, Sri Lanka',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      id: 'sess_2',
      device: 'Apple iPhone 15 Pro',
      browser: 'Safari Mobile',
      ip: '194.154.218.12',
      location: 'Colombo, Sri Lanka',
      lastActive: '2 days ago',
      isCurrent: false,
    },
  ],
};

export const TIMEZONES = [
  'UTC-08:00 (Pacific Time - US & Canada)',
  'UTC-05:00 (Eastern Time - US & Canada)',
  'UTC+00:00 (London, Lisbon)',
  'UTC+01:00 (Berlin, Paris, Amsterdam)',
  'UTC+02:00 (Helsinki, Athens, Cairo)',
  'UTC+05:30 (Mumbai, New Delhi, Colombo)',
  'UTC+08:00 (Singapore, Hong Kong)',
  'UTC+09:00 (Tokyo, Seoul)',
];

export const LANGUAGES = [
  'English (United States)',
  'English (United Kingdom)',
  'Deutsch (German)',
  'Français (French)',
  'Español (Spanish)',
  '日本語 (Japanese)',
];
