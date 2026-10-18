// Admin Portal Type Definitions for Server Salad Cloud Services

export type StaffRole = 'ADMINISTRATOR' | 'STAFF' | 'SUPPORT_AGENT' | 'BILLING_STAFF';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastActive: string;
  department: string;
}

export type ServerProvider = 'WHM_CPANEL' | 'PROXMOX_KVM' | 'HETZNER_CLOUD' | 'AWS_EC2';
export type ServerType = 'SHARED_HOSTING' | 'VPS_NODE' | 'DEDICATED';
export type ServerHealthStatus = 'ONLINE' | 'MAINTENANCE' | 'DEGRADED' | 'OFFLINE';

export interface ServerCapacity {
  cpuCores: number;
  cpuUsagePct: number;
  ramGb: number;
  ramUsageGb: number;
  storageGb: number;
  storageUsageGb: number;
  accountsCount: number;
  accountsLimit: number;
}

export interface HostingServer {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  provider: ServerProvider;
  serverType: ServerType;
  os: string;
  datacenter: string;
  location: string;
  status: ServerHealthStatus;
  capacity: ServerCapacity;
  allocatedServicesCount: number;
  allocationEnabled: boolean;
  lastHealthCheck: string;
  providerConfig: {
    port: number;
    useSsl: boolean;
    apiUsername?: string;
    hasApiToken: boolean;
    nameservers?: string[];
    clusterNode?: string;
  };
  notes?: string;
}

export interface ServerGroup {
  id: string;
  name: string;
  purpose: 'SHARED_HOSTING' | 'VPS_CLUSTER' | 'DEDICATED_ISOLATION';
  provider: ServerProvider;
  location: string;
  serverIds: string[];
  enabled: boolean;
  allocationPolicy: 'BALANCED' | 'PACK_FIRST' | 'MANUAL';
  description?: string;
}

export type ProductType = 'SHARED' | 'VPS';

export interface HostingProduct {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  tagline: string;
  description: string;
  published: boolean;
  isNewSalesDisabled: boolean;
  priceMonthly: number;
  priceAnnual: number;
  setupFee: number;
  trialDays: number;
  // Shared Hosting limits
  storageGb: number;
  domainLimit: number;
  bandwidthGb: number;
  emailAccounts: number;
  databases: number;
  sslIncluded: boolean;
  backupsIncluded: boolean;
  whmPackageName?: string;
  // VPS limits
  vCpuCores?: number;
  ramGb?: number;
  diskType?: 'NVMe SSD' | 'Standard SSD';
  dedicatedIps?: number;
  osOptions?: string[];
  // Mapping
  serverGroupId: string;
  servicesCount: number;
  ordersCount: number;
}

export type CustomerStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: CustomerStatus;
  loginSuspended: boolean;
  hostingSuspended: boolean;
  registeredDate: string;
  activeServicesCount: number;
  ordersCount: number;
  outstandingBalance: number;
  openTicketsCount: number;
  billingAddress: {
    line1: string;
    city: string;
    country: string;
    postalCode: string;
  };
  internalNotes: string[];
}

export type OrderStatus = 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | 'VOIDED';

export interface OrderItem {
  productId: string;
  productName: string;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  domain: string;
  amount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  orderDate: string;
  total: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  invoiceId: string;
  provisioningStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  notes?: string;
}

export type ServiceStatus = 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';

export interface HostingService {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  serviceType: ProductType;
  primaryDomain: string;
  serverId: string;
  serverHostname: string;
  serverIp: string;
  provider: ServerProvider;
  status: ServiceStatus;
  createdDate: string;
  nextRenewalDate: string;
  renewalPrice: number;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  relatedOrderId: string;
  autoRenew: boolean;
  controlPanelUrl: string;
  controlPanelUsername: string;
  storageUsedGb: number;
  storageLimitGb: number;
  bandwidthUsedGb: number;
  bandwidthLimitGb: number;
  phpVersion?: string;
  sslStatus: 'ACTIVE' | 'EXPIRING' | 'NONE';
  suspensionReason?: string;
}

export type ProvisioningJobStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'RETRYING' | 'CANCELLED';
export type ProvisioningOperation = 'CREATE_ACCOUNT' | 'SUSPEND_ACCOUNT' | 'UNSUSPEND_ACCOUNT' | 'TERMINATE_ACCOUNT' | 'UPGRADE_PACKAGE';

export interface ProvisioningStep {
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  log?: string;
}

export interface ProvisioningJob {
  id: string;
  jobCode: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceDomain: string;
  orderId: string;
  provider: ServerProvider;
  targetServerId: string;
  targetServerName: string;
  operation: ProvisioningOperation;
  status: ProvisioningJobStatus;
  createdAt: string;
  completedAt?: string;
  attemptsCount: number;
  durationMs?: number;
  currentStep: string;
  steps: ProvisioningStep[];
  customerSafeError?: string;
  internalErrorDetails?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderId?: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'REFUNDED' | 'CANCELLED';
  items: InvoiceItem[];
  paymentMethod?: string;
  paidAt?: string;
  billingAddress: {
    name: string;
    line1: string;
    city: string;
    country: string;
  };
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  provider: 'PayHere' | 'Stripe' | 'Manual' | 'Bank Transfer';
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  date: string;
  gatewayResponseCode?: string;
  refundedAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  metadata?: Record<string, string>;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceDomain: string;
  productName: string;
  frequency: 'MONTHLY' | 'ANNUAL';
  nextRenewalDate: string;
  renewalPrice: number;
  currency: string;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'SUSPENDED';
  autoRenew: boolean;
  gracePeriodDays: number;
  failedRenewalAttempts: number;
}

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'WAITING_FOR_STAFF' | 'CLOSED';
export type TicketDepartment = 'TECHNICAL_SUPPORT' | 'BILLING' | 'INFRASTRUCTURE' | 'SALES';

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: 'CUSTOMER' | 'STAFF' | 'SYSTEM';
  isInternalNote: boolean;
  timestamp: string;
  content: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  department: TicketDepartment;
  assignedAgentId?: string;
  assignedAgentName?: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdDate: string;
  lastResponseDate: string;
  relatedServiceId?: string;
  relatedServiceDomain?: string;
  messages: TicketMessage[];
}

export interface LiveChatMessage {
  id: string;
  sender: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface LiveChatSession {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  activeServiceDomain?: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  status: 'WAITING' | 'ACTIVE' | 'CLOSED';
  startedAt: string;
  unreadCount: number;
  messages: LiveChatMessage[];
}

export interface NotificationLog {
  id: string;
  event: string;
  recipientEmail: string;
  recipientName: string;
  channel: 'EMAIL' | 'IN_APP' | 'SMS';
  status: 'DELIVERED' | 'BOUNCED' | 'QUEUED' | 'FAILED';
  subject: string;
  timestamp: string;
  errorDetails?: string;
}

export interface EmailTemplate {
  id: string;
  code: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: StaffRole;
  action: string;
  resourceType: 'SERVER' | 'PACKAGE' | 'CUSTOMER' | 'SERVICE' | 'ORDER' | 'INVOICE' | 'PAYMENT' | 'STAFF' | 'PROVISIONING' | 'SETTINGS';
  resourceId: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details: string;
}

export interface CustomerDomain {
  id: string;
  domainName: string;
  customerId: string;
  customerName: string;
  linkedServiceId?: string;
  linkedServiceDomain?: string;
  dnsStatus: 'POINTED' | 'PENDING_PROPAGATION' | 'MISCONFIGURED';
  nameservers: string[];
  sslStatus: 'ACTIVE_LETS_ENCRYPT' | 'EXPIRING_SOON' | 'NONE' | 'PENDING';
  sslExpiryDays?: number;
  autoRenewSsl: boolean;
  expiresAt: string;
}

export interface IntegrationSettings {
  whm: {
    enabled: boolean;
    hostUrl: string;
    port: number;
    hasApiToken: boolean;
    useSsl: boolean;
    lastPingStatus: 'CONNECTED' | 'DISCONNECTED';
    lastPingMs?: number;
  };
  vps: {
    enabled: boolean;
    provider: 'Proxmox VE' | 'KVM Node';
    endpointUrl: string;
    hasToken: boolean;
    defaultStoragePool: string;
    lastPingStatus: 'CONNECTED' | 'DISCONNECTED';
  };
  payHere: {
    enabled: boolean;
    merchantId: string;
    isSandbox: boolean;
    currency: string;
    webhookActive: boolean;
    lastWebhookReceived?: string;
  };
  resend: {
    enabled: boolean;
    senderEmail: string;
    senderName: string;
    hasApiKey: boolean;
    deliverabilityRatePct: number;
  };
  general: {
    companyName: string;
    supportEmail: string;
    defaultCurrency: string;
    taxRatePct: number;
    gracePeriodDays: number;
    autoSuspendOverdueDays: number;
    maintenanceMode: boolean;
  };
}
