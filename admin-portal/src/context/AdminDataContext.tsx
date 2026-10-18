'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  StaffMember,
  StaffRole,
  HostingServer,
  ServerGroup,
  HostingProduct,
  Customer,
  Order,
  HostingService,
  ProvisioningJob,
  Invoice,
  PaymentTransaction,
  Subscription,
  SupportTicket,
  LiveChatSession,
  NotificationLog,
  EmailTemplate,
  AuditLog,
  CustomerDomain,
  IntegrationSettings
} from '../types';
import {
  INITIAL_STAFF,
  INITIAL_SERVER_GROUPS,
  INITIAL_SERVERS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_SERVICES,
  INITIAL_PROVISIONING_JOBS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TICKETS,
  INITIAL_LIVE_CHATS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_AUDIT_LOGS,
  INITIAL_DOMAINS,
  INITIAL_SETTINGS
} from '../data/mockAdminData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AdminDataContextType {
  // Current user & role simulation
  currentRole: StaffRole;
  setCurrentRole: (role: StaffRole) => void;
  currentStaff: StaffMember;

  // Data states
  servers: HostingServer[];
  serverGroups: ServerGroup[];
  products: HostingProduct[];
  customers: Customer[];
  orders: Order[];
  services: HostingService[];
  provisioningJobs: ProvisioningJob[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  subscriptions: Subscription[];
  tickets: SupportTicket[];
  liveChats: LiveChatSession[];
  notifications: NotificationLog[];
  emailTemplates: EmailTemplate[];
  staff: StaffMember[];
  auditLogs: AuditLog[];
  domains: CustomerDomain[];
  settings: IntegrationSettings;

  // Toast
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Reset
  resetDemoData: () => void;

  // Server actions
  addServer: (serverData: Partial<HostingServer>) => boolean;
  updateServer: (id: string, updates: Partial<HostingServer>) => void;
  toggleServerAllocation: (id: string) => void;
  markServerMaintenance: (id: string) => void;
  testServerConnection: (id: string) => Promise<{ success: boolean; latencyMs: number; message: string }>;
  checkServerHealth: (id: string) => void;
  decommissionServer: (id: string) => { success: boolean; error?: string };

  // Server Groups
  createServerGroup: (group: Partial<ServerGroup>) => void;
  updateServerGroup: (id: string, updates: Partial<ServerGroup>) => void;
  toggleServerGroup: (id: string) => void;

  // Products
  createProduct: (product: Partial<HostingProduct>) => void;
  updateProduct: (id: string, updates: Partial<HostingProduct>) => void;
  duplicateProduct: (id: string) => void;
  toggleProductPublished: (id: string) => void;
  toggleNewSales: (id: string) => void;
  archiveProduct: (id: string) => void;

  // Customers
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  toggleCustomerLoginSuspended: (id: string) => void;
  addCustomerNote: (id: string, note: string) => void;
  triggerPasswordReset: (id: string) => void;
  createCustomer: (customerData: Partial<Customer>) => void;

  // Orders
  updateOrderStatus: (id: string, status: Order['orderStatus']) => void;
  cancelOrder: (id: string) => void;
  addOrderNote: (id: string, note: string) => void;

  // Services
  suspendService: (id: string, reason: string) => void;
  unsuspendService: (id: string) => void;
  terminateService: (id: string) => void;
  changeServiceServer: (serviceId: string, newServerId: string) => void;
  changeServiceProduct: (serviceId: string, newProductId: string) => void;

  // Provisioning
  retryProvisioningJob: (jobId: string) => void;
  cancelProvisioningJob: (jobId: string) => void;
  triggerNewProvisioning: (orderId: string) => void;

  // Invoices & Payments
  applyInvoiceCredit: (invoiceId: string, amount: number, note: string) => void;
  voidInvoice: (invoiceId: string) => void;
  resendInvoiceEmail: (invoiceId: string) => void;
  createManualInvoice: (invoiceData: Partial<Invoice>) => void;
  refundPayment: (paymentId: string, amount: number, reason: string) => boolean;

  // Subscriptions
  updateSubscriptionStatus: (subId: string, status: Subscription['status']) => void;
  retrySubscriptionRenewal: (subId: string) => void;
  cancelSubscriptionRenewal: (subId: string) => void;

  // Tickets
  replyToTicket: (ticketId: string, content: string, isInternalNote?: boolean) => void;
  assignTicketAgent: (ticketId: string, agentId: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  updateTicketPriority: (ticketId: string, priority: SupportTicket['priority']) => void;

  // Live Chat
  sendChatMessage: (chatId: string, text: string) => void;
  acceptChatSession: (chatId: string) => void;
  closeChatSession: (chatId: string) => void;

  // Notifications & Templates
  retryNotification: (notifId: string) => void;
  updateEmailTemplate: (templateId: string, subject: string, body: string) => void;

  // Staff
  addStaffMember: (staffData: Partial<StaffMember>) => void;
  updateStaffRole: (staffId: string, role: StaffRole) => void;
  toggleStaffStatus: (staffId: string) => void;

  // Domains
  recheckDomainDns: (domainId: string) => void;
  reissueDomainSsl: (domainId: string) => void;

  // Settings
  updateIntegrationSettings: (newSettings: Partial<IntegrationSettings>) => void;

  // Audit
  logAuditEvent: (action: string, resourceType: AuditLog['resourceType'], resourceId: string, outcome: AuditLog['outcome'], details: string) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const STORAGE_KEY = 'serversalad_admin_data_v1';

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<StaffRole>('ADMINISTRATOR');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Entities
  const [servers, setServers] = useState<HostingServer[]>(() => getStored(`${STORAGE_KEY}_servers`, INITIAL_SERVERS));
  const [serverGroups, setServerGroups] = useState<ServerGroup[]>(() => getStored(`${STORAGE_KEY}_serverGroups`, INITIAL_SERVER_GROUPS));
  const [products, setProducts] = useState<HostingProduct[]>(() => getStored(`${STORAGE_KEY}_products`, INITIAL_PRODUCTS));
  const [customers, setCustomers] = useState<Customer[]>(() => getStored(`${STORAGE_KEY}_customers`, INITIAL_CUSTOMERS));
  const [orders, setOrders] = useState<Order[]>(() => getStored(`${STORAGE_KEY}_orders`, INITIAL_ORDERS));
  const [services, setServices] = useState<HostingService[]>(() => getStored(`${STORAGE_KEY}_services`, INITIAL_SERVICES));
  const [provisioningJobs, setProvisioningJobs] = useState<ProvisioningJob[]>(() => getStored(`${STORAGE_KEY}_provisioningJobs`, INITIAL_PROVISIONING_JOBS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStored(`${STORAGE_KEY}_invoices`, INITIAL_INVOICES));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => getStored(`${STORAGE_KEY}_payments`, INITIAL_PAYMENTS));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => getStored(`${STORAGE_KEY}_subscriptions`, INITIAL_SUBSCRIPTIONS));
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getStored(`${STORAGE_KEY}_tickets`, INITIAL_TICKETS));
  const [liveChats, setLiveChats] = useState<LiveChatSession[]>(() => getStored(`${STORAGE_KEY}_liveChats`, INITIAL_LIVE_CHATS));
  const [notifications, setNotifications] = useState<NotificationLog[]>(() => getStored(`${STORAGE_KEY}_notifications`, INITIAL_NOTIFICATIONS));
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(() => getStored(`${STORAGE_KEY}_emailTemplates`, INITIAL_EMAIL_TEMPLATES));
  const [staff, setStaff] = useState<StaffMember[]>(() => getStored(`${STORAGE_KEY}_staff`, INITIAL_STAFF));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored(`${STORAGE_KEY}_auditLogs`, INITIAL_AUDIT_LOGS));
  const [domains, setDomains] = useState<CustomerDomain[]>(() => getStored(`${STORAGE_KEY}_domains`, INITIAL_DOMAINS));
  const [settings, setSettings] = useState<IntegrationSettings>(() => getStored(`${STORAGE_KEY}_settings`, INITIAL_SETTINGS));

  // Current staff member representation based on role
  const currentStaff: StaffMember = staff.find(s => s.role === currentRole) || staff[0];

  // Persist state changes
  useEffect(() => { setStored(`${STORAGE_KEY}_servers`, servers); }, [servers]);
  useEffect(() => { setStored(`${STORAGE_KEY}_serverGroups`, serverGroups); }, [serverGroups]);
  useEffect(() => { setStored(`${STORAGE_KEY}_products`, products); }, [products]);
  useEffect(() => { setStored(`${STORAGE_KEY}_customers`, customers); }, [customers]);
  useEffect(() => { setStored(`${STORAGE_KEY}_orders`, orders); }, [orders]);
  useEffect(() => { setStored(`${STORAGE_KEY}_services`, services); }, [services]);
  useEffect(() => { setStored(`${STORAGE_KEY}_provisioningJobs`, provisioningJobs); }, [provisioningJobs]);
  useEffect(() => { setStored(`${STORAGE_KEY}_invoices`, invoices); }, [invoices]);
  useEffect(() => { setStored(`${STORAGE_KEY}_payments`, payments); }, [payments]);
  useEffect(() => { setStored(`${STORAGE_KEY}_subscriptions`, subscriptions); }, [subscriptions]);
  useEffect(() => { setStored(`${STORAGE_KEY}_tickets`, tickets); }, [tickets]);
  useEffect(() => { setStored(`${STORAGE_KEY}_liveChats`, liveChats); }, [liveChats]);
  useEffect(() => { setStored(`${STORAGE_KEY}_notifications`, notifications); }, [notifications]);
  useEffect(() => { setStored(`${STORAGE_KEY}_emailTemplates`, emailTemplates); }, [emailTemplates]);
  useEffect(() => { setStored(`${STORAGE_KEY}_staff`, staff); }, [staff]);
  useEffect(() => { setStored(`${STORAGE_KEY}_auditLogs`, auditLogs); }, [auditLogs]);
  useEffect(() => { setStored(`${STORAGE_KEY}_domains`, domains); }, [domains]);
  useEffect(() => { setStored(`${STORAGE_KEY}_settings`, settings); }, [settings]);

  // Toast Helpers
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setCurrentRole = (role: StaffRole) => {
    setCurrentRoleState(role);
    addToast('info', `Active Role Changed: ${role}`, 'Simulating role-based access permissions.');
  };

  const logAuditEvent = (action: string, resourceType: AuditLog['resourceType'], resourceId: string, outcome: AuditLog['outcome'], details: string) => {
    const newLog: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor: currentStaff.name,
      actorRole: currentRole,
      action,
      resourceType,
      resourceId,
      outcome,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    if (typeof window !== 'undefined') { localStorage.clear(); }
    setServers(INITIAL_SERVERS);
    setServerGroups(INITIAL_SERVER_GROUPS);
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setServices(INITIAL_SERVICES);
    setProvisioningJobs(INITIAL_PROVISIONING_JOBS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setTickets(INITIAL_TICKETS);
    setLiveChats(INITIAL_LIVE_CHATS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEmailTemplates(INITIAL_EMAIL_TEMPLATES);
    setStaff(INITIAL_STAFF);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDomains(INITIAL_DOMAINS);
    setSettings(INITIAL_SETTINGS);
    setCurrentRoleState('ADMINISTRATOR');
    addToast('success', 'Demo Data Reset', 'All administrative records restored to default demonstration state.');
  };

  // ---------------- SERVER ACTIONS (Module B) ----------------
  const addServer = (data: Partial<HostingServer>): boolean => {
    if (!data.name || !data.hostname || !data.ipAddress) {
      addToast('error', 'Missing Information', 'Server name, hostname, and IP are required.');
      return false;
    }

    const newId = `srv_${Date.now()}`;
    const newServer: HostingServer = {
      id: newId,
      name: data.name,
      hostname: data.hostname,
      ipAddress: data.ipAddress,
      provider: data.provider || 'WHM_CPANEL',
      serverType: data.serverType || 'SHARED_HOSTING',
      os: data.os || 'CloudLinux 9.4 (64-bit)',
      datacenter: data.datacenter || 'Frankfurt Equinix FR2',
      location: data.location || 'Frankfurt, DE',
      status: 'ONLINE',
      capacity: data.capacity || {
        cpuCores: 32,
        cpuUsagePct: 5,
        ramGb: 128,
        ramUsageGb: 8,
        storageGb: 2000,
        storageUsageGb: 50,
        accountsCount: 0,
        accountsLimit: 250,
      },
      allocatedServicesCount: 0,
      allocationEnabled: data.allocationEnabled !== undefined ? data.allocationEnabled : true,
      lastHealthCheck: 'Just added',
      providerConfig: data.providerConfig || {
        port: data.provider === 'PROXMOX_KVM' ? 8006 : 2087,
        useSsl: true,
        apiUsername: 'root',
        hasApiToken: true,
        nameservers: ['ns1.serversalad.com', 'ns2.serversalad.com'],
      },
      notes: data.notes || '',
    };

    setServers(prev => [newServer, ...prev]);

    // If an associated group was selected, update group
    logAuditEvent('SERVER_ADDED', 'SERVER', newServer.name, 'SUCCESS', `Registered new ${newServer.provider} server at ${newServer.ipAddress}`);
    addToast('success', 'Server Registered', `Server ${newServer.name} has been added successfully.`);
    return true;
  };

  const updateServer = (id: string, updates: Partial<HostingServer>) => {
    setServers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logAuditEvent('SERVER_UPDATED', 'SERVER', id, 'SUCCESS', 'Server configuration updated');
    addToast('success', 'Server Updated', 'Changes saved successfully.');
  };

  const toggleServerAllocation = (id: string) => {
    setServers(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.allocationEnabled;
        logAuditEvent(
          'SERVER_ALLOCATION_TOGGLED',
          'SERVER',
          s.name,
          nextState ? 'SUCCESS' : 'WARNING',
          `Allocations ${nextState ? 'enabled' : 'disabled'} for ${s.name}`
        );
        addToast(
          nextState ? 'success' : 'info',
          `Allocation ${nextState ? 'Enabled' : 'Disabled'}`,
          `Server ${s.name} is ${nextState ? 'now accepting' : 'no longer taking'} new service allocations.`
        );
        return { ...s, allocationEnabled: nextState };
      }
      return s;
    }));
  };

  const markServerMaintenance = (id: string) => {
    setServers(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'MAINTENANCE' ? 'ONLINE' : 'MAINTENANCE';
        const allocationDisabled = nextStatus === 'MAINTENANCE' ? false : s.allocationEnabled;
        logAuditEvent('SERVER_MAINTENANCE_TOGGLED', 'SERVER', s.name, 'WARNING', `Server set to ${nextStatus}`);
        addToast('info', `Server status: ${nextStatus}`, `Maintenance mode toggled for ${s.name}`);
        return { ...s, status: nextStatus, allocationEnabled: allocationDisabled };
      }
      return s;
    }));
  };

  const testServerConnection = async (id: string): Promise<{ success: boolean; latencyMs: number; message: string }> => {
    const srv = servers.find(s => s.id === id);
    if (!srv) return { success: false, latencyMs: 0, message: 'Server not found' };

    // Simulate mock network latency
    const latency = Math.floor(Math.random() * 35) + 25;
    await new Promise(r => setTimeout(r, 650));

    if (srv.status === 'OFFLINE') {
      return { success: false, latencyMs: latency, message: `Connection refused: Host ${srv.hostname}:${srv.providerConfig.port} unreachable.` };
    }

    logAuditEvent('SERVER_CONNECTION_TEST', 'SERVER', srv.name, 'SUCCESS', `Ping verified: ${latency}ms latency via ${srv.providerConfig.useSsl ? 'HTTPS' : 'HTTP'}`);
    return { success: true, latencyMs: latency, message: `Handshake verified on port ${srv.providerConfig.port}. API responded in ${latency}ms.` };
  };

  const checkServerHealth = (id: string) => {
    setServers(prev => prev.map(s => {
      if (s.id === id) {
        const jitter = Math.floor(Math.random() * 6) - 3;
        const newCpu = Math.max(5, Math.min(95, s.capacity.cpuUsagePct + jitter));
        addToast('success', 'Health Check Complete', `${s.name}: Load is normal, CPU usage at ${newCpu}%.`);
        return {
          ...s,
          lastHealthCheck: 'Just now',
          capacity: { ...s.capacity, cpuUsagePct: newCpu }
        };
      }
      return s;
    }));
  };

  const decommissionServer = (id: string): { success: boolean; error?: string } => {
    const srv = servers.find(s => s.id === id);
    if (!srv) return { success: false, error: 'Server not found.' };

    // Check if services are currently allocated
    const activeAllocations = services.filter(svc => svc.serverId === id && svc.status !== 'TERMINATED');
    if (activeAllocations.length > 0) {
      addToast(
        'error',
        'Cannot Decommission Server',
        `Safety guard triggered: ${activeAllocations.length} active hosting service(s) are allocated to ${srv.name}. Migrate or terminate them first.`
      );
      return { success: false, error: `${activeAllocations.length} active service(s) allocated.` };
    }

    setServers(prev => prev.filter(s => s.id !== id));
    logAuditEvent('SERVER_DECOMMISSIONED', 'SERVER', srv.name, 'WARNING', `Server decommissioned and removed from cluster`);
    addToast('success', 'Server Decommissioned', `${srv.name} has been safely removed.`);
    return { success: true };
  };

  // ---------------- SERVER GROUPS (Module D) ----------------
  const createServerGroup = (data: Partial<ServerGroup>) => {
    const newGroup: ServerGroup = {
      id: `sg_${Date.now()}`,
      name: data.name || 'New Server Group',
      purpose: data.purpose || 'SHARED_HOSTING',
      provider: data.provider || 'WHM_CPANEL',
      location: data.location || 'Frankfurt, DE',
      serverIds: data.serverIds || [],
      enabled: true,
      allocationPolicy: data.allocationPolicy || 'BALANCED',
      description: data.description || '',
    };
    setServerGroups(prev => [...prev, newGroup]);
    logAuditEvent('SERVER_GROUP_CREATED', 'SERVER', newGroup.name, 'SUCCESS', `Created group ${newGroup.name}`);
    addToast('success', 'Server Group Created', `${newGroup.name} created successfully.`);
  };

  const updateServerGroup = (id: string, updates: Partial<ServerGroup>) => {
    setServerGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    addToast('success', 'Server Group Updated', 'Group allocation settings updated.');
  };

  const toggleServerGroup = (id: string) => {
    setServerGroups(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
    addToast('info', 'Server Group Updated', 'Group availability toggled.');
  };

  // ---------------- PRODUCTS & PACKAGES (Module C) ----------------
  const createProduct = (data: Partial<HostingProduct>) => {
    const newProduct: HostingProduct = {
      id: `prod_${Date.now()}`,
      name: data.name || 'New Hosting Plan',
      slug: (data.name || 'new-plan').toLowerCase().replace(/\s+/g, '-'),
      type: data.type || 'SHARED',
      tagline: data.tagline || '',
      description: data.description || '',
      published: data.published !== undefined ? data.published : true,
      isNewSalesDisabled: false,
      priceMonthly: Number(data.priceMonthly) || 9.99,
      priceAnnual: Number(data.priceAnnual) || 99.90,
      setupFee: Number(data.setupFee) || 0,
      trialDays: Number(data.trialDays) || 0,
      storageGb: Number(data.storageGb) || 10,
      domainLimit: Number(data.domainLimit) || 1,
      bandwidthGb: Number(data.bandwidthGb) || 100,
      emailAccounts: Number(data.emailAccounts) || 5,
      databases: Number(data.databases) || 2,
      sslIncluded: true,
      backupsIncluded: true,
      whmPackageName: data.whmPackageName || 'salad_custom_pkg',
      serverGroupId: data.serverGroupId || (data.type === 'VPS' ? 'sg_vps_eu' : 'sg_shared_eu'),
      servicesCount: 0,
      ordersCount: 0,
      vCpuCores: data.vCpuCores,
      ramGb: data.ramGb,
      diskType: data.diskType,
      dedicatedIps: data.dedicatedIps,
      osOptions: data.osOptions || ['Ubuntu 24.04 LTS', 'Debian 12'],
    };

    setProducts(prev => [newProduct, ...prev]);
    logAuditEvent('PACKAGE_CREATED', 'PACKAGE', newProduct.name, 'SUCCESS', `Created package ${newProduct.name} ($${newProduct.priceMonthly}/mo)`);
    addToast('success', 'Product Package Created', `${newProduct.name} is now available.`);
  };

  const updateProduct = (id: string, updates: Partial<HostingProduct>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logAuditEvent('PACKAGE_UPDATED', 'PACKAGE', id, 'SUCCESS', 'Package configuration modified');
    addToast('success', 'Product Package Updated', 'Configuration changes saved.');
  };

  const duplicateProduct = (id: string) => {
    const existing = products.find(p => p.id === id);
    if (!existing) return;
    const duplicated: HostingProduct = {
      ...existing,
      id: `prod_${Date.now()}`,
      name: `${existing.name} (Copy)`,
      slug: `${existing.slug}-copy`,
      published: false,
      servicesCount: 0,
      ordersCount: 0,
    };
    setProducts(prev => [duplicated, ...prev]);
    addToast('success', 'Package Duplicated', `Created draft copy: ${duplicated.name}`);
  };

  const toggleProductPublished = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const next = !p.published;
        addToast(next ? 'success' : 'info', `Package ${next ? 'Published' : 'Unpublished'}`, `${p.name} is ${next ? 'now publicly visible' : 'hidden from public view'}.`);
        return { ...p, published: next };
      }
      return p;
    }));
  };

  const toggleNewSales = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const next = !p.isNewSalesDisabled;
        addToast('info', `New Sales ${next ? 'Disabled' : 'Enabled'}`, `${p.name} new order placement ${next ? 'suspended' : 'active'}.`);
        return { ...p, isNewSalesDisabled: next };
      }
      return p;
    }));
  };

  const archiveProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, published: false, isNewSalesDisabled: true } : p));
    addToast('info', 'Package Archived', 'Product archived and removed from active offerings.');
  };

  // ---------------- CUSTOMERS (Module E) ----------------
  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logAuditEvent('CUSTOMER_UPDATED', 'CUSTOMER', id, 'SUCCESS', 'Customer profile updated');
    addToast('success', 'Customer Updated', 'Profile changes saved.');
  };

  const toggleCustomerLoginSuspended = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const next = !c.loginSuspended;
        logAuditEvent('CUSTOMER_LOGIN_SUSPENSION_TOGGLED', 'CUSTOMER', c.email, next ? 'WARNING' : 'SUCCESS', `Customer login ${next ? 'suspended' : 'restored'}`);
        addToast(next ? 'warning' : 'success', `Customer Login ${next ? 'Suspended' : 'Restored'}`, `Portal login access for ${c.name} has been ${next ? 'blocked' : 're-enabled'}.`);
        return { ...c, loginSuspended: next };
      }
      return c;
    }));
  };

  const addCustomerNote = (id: string, note: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, internalNotes: [note, ...c.internalNotes] } : c));
    addToast('success', 'Note Added', 'Internal administrative note attached.');
  };

  const triggerPasswordReset = (id: string) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    const notif: NotificationLog = {
      id: `notif_${Date.now()}`,
      event: 'PASSWORD_RESET_LINK',
      recipientEmail: cust.email,
      recipientName: cust.name,
      channel: 'EMAIL',
      status: 'DELIVERED',
      subject: 'Reset Your Server Salad Account Password',
      timestamp: 'Just now',
    };
    setNotifications(prev => [notif, ...prev]);
    logAuditEvent('CUSTOMER_PASSWORD_RESET', 'CUSTOMER', cust.email, 'SUCCESS', `Triggered password reset email`);
    addToast('success', 'Password Reset Sent', `Reset link emailed to ${cust.email}.`);
  };

  const createCustomer = (data: Partial<Customer>) => {
    const newCust: Customer = {
      id: `cust_${Date.now()}`,
      name: data.name || 'New Customer',
      email: data.email || 'customer@example.com',
      company: data.company || '',
      phone: data.phone || '',
      status: 'ACTIVE',
      loginSuspended: false,
      hostingSuspended: false,
      registeredDate: 'Today',
      activeServicesCount: 0,
      ordersCount: 0,
      outstandingBalance: 0,
      openTicketsCount: 0,
      billingAddress: data.billingAddress || {
        line1: '100 Market St',
        city: 'Frankfurt',
        country: 'Germany',
        postalCode: '60311',
      },
      internalNotes: ['Account manually registered by administrator.'],
    };
    setCustomers(prev => [newCust, ...prev]);
    logAuditEvent('CUSTOMER_CREATED', 'CUSTOMER', newCust.email, 'SUCCESS', 'Admin manual registration');
    addToast('success', 'Customer Created', `Account for ${newCust.name} created.`);
  };

  // ---------------- ORDERS (Module F) ----------------
  const updateOrderStatus = (id: string, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: status } : o));
    addToast('info', 'Order Status Updated', `Order ${id} set to ${status}.`);
  };

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: 'CANCELLED' } : o));
    logAuditEvent('ORDER_CANCELLED', 'ORDER', id, 'WARNING', 'Order cancelled by staff');
    addToast('warning', 'Order Cancelled', `Order has been marked as cancelled.`);
  };

  const addOrderNote = (id: string, note: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, notes: note } : o));
    addToast('success', 'Order Note Saved', 'Administrative order note saved.');
  };

  // ---------------- SERVICES (Module G) ----------------
  const suspendService = (id: string, reason: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        logAuditEvent('SERVICE_SUSPENDED', 'SERVICE', s.primaryDomain, 'WARNING', `Hosting suspended: ${reason}`);
        addToast('warning', 'Service Suspended', `Hosting for ${s.primaryDomain} has been suspended.`);
        return { ...s, status: 'SUSPENDED', suspensionReason: reason };
      }
      return s;
    }));
  };

  const unsuspendService = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        logAuditEvent('SERVICE_UNSUSPENDED', 'SERVICE', s.primaryDomain, 'SUCCESS', 'Hosting unsuspended by administrator');
        addToast('success', 'Service Unsuspended', `Hosting for ${s.primaryDomain} restored to ACTIVE.`);
        return { ...s, status: 'ACTIVE', suspensionReason: undefined };
      }
      return s;
    }));
  };

  const terminateService = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        logAuditEvent('SERVICE_TERMINATED', 'SERVICE', s.primaryDomain, 'WARNING', 'Service permanently terminated');
        addToast('error', 'Service Terminated', `Hosting service for ${s.primaryDomain} was terminated.`);
        return { ...s, status: 'TERMINATED' };
      }
      return s;
    }));
  };

  const changeServiceServer = (serviceId: string, newServerId: string) => {
    const targetServer = servers.find(srv => srv.id === newServerId);
    if (!targetServer) return;

    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        logAuditEvent('SERVICE_MIGRATED', 'SERVICE', s.primaryDomain, 'SUCCESS', `Reassigned server to ${targetServer.name}`);
        addToast('success', 'Server Reassigned', `${s.primaryDomain} now mapped to ${targetServer.name}.`);
        return {
          ...s,
          serverId: targetServer.id,
          serverHostname: targetServer.hostname,
          serverIp: targetServer.ipAddress,
        };
      }
      return s;
    }));
  };

  const changeServiceProduct = (serviceId: string, newProductId: string) => {
    const targetProduct = products.find(p => p.id === newProductId);
    if (!targetProduct) return;

    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        logAuditEvent('SERVICE_UPGRADED', 'SERVICE', s.primaryDomain, 'SUCCESS', `Package updated to ${targetProduct.name}`);
        addToast('success', 'Package Updated', `${s.primaryDomain} updated to ${targetProduct.name}.`);
        return {
          ...s,
          productId: targetProduct.id,
          productName: targetProduct.name,
          renewalPrice: s.billingCycle === 'ANNUAL' ? targetProduct.priceAnnual : targetProduct.priceMonthly,
          storageLimitGb: targetProduct.storageGb,
          bandwidthLimitGb: targetProduct.bandwidthGb,
        };
      }
      return s;
    }));
  };

  // ---------------- PROVISIONING (Module H & Scenario D) ----------------
  const retryProvisioningJob = (jobId: string) => {
    const job = provisioningJobs.find(j => j.id === jobId);
    if (!job) return;

    addToast('info', 'Retry Initiated', `Retrying provisioning workflow for ${job.serviceDomain}...`);

    // Simulate real step progression
    setProvisioningJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'RUNNING',
          attemptsCount: j.attemptsCount + 1,
          customerSafeError: undefined,
          internalErrorDetails: undefined,
          steps: j.steps.map(step => step.status === 'FAILED' ? { ...step, status: 'RUNNING' } : step),
        };
      }
      return j;
    }));

    // Step 1: Recover failed step
    setTimeout(() => {
      setProvisioningJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            steps: j.steps.map(step => {
              if (step.name.includes('createacct')) {
                return { ...step, status: 'COMPLETED', log: 'cPanel account successfully created on port 2087.' };
              }
              if (step.name.includes('AutoSSL')) {
                return { ...step, status: 'RUNNING' };
              }
              return step;
            }),
          };
        }
        return j;
      }));
    }, 1200);

    // Step 2: Finalize
    setTimeout(() => {
      setProvisioningJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'SUCCEEDED',
            currentStep: 'All steps completed successfully',
            completedAt: 'Just now',
            steps: j.steps.map(s => ({ ...s, status: 'COMPLETED' })),
          };
        }
        return j;
      }));

      // Update associated service if exists
      setServices(prev => prev.map(svc => {
        if (svc.id === job.serviceId || svc.primaryDomain === job.serviceDomain) {
          return { ...svc, status: 'ACTIVE' };
        }
        return svc;
      }));

      // Update associated order
      setOrders(prev => prev.map(o => {
        if (o.id === job.orderId) {
          return { ...o, provisioningStatus: 'COMPLETED', orderStatus: 'COMPLETED' };
        }
        return o;
      }));

      logAuditEvent('PROVISIONING_JOB_RECOVERED', 'PROVISIONING', job.jobCode, 'SUCCESS', `Recovered provisioning on ${job.targetServerName}`);
      addToast('success', 'Provisioning Succeeded', `Job ${job.jobCode} for ${job.serviceDomain} completed without duplicate instances.`);
    }, 2400);
  };

  const cancelProvisioningJob = (jobId: string) => {
    setProvisioningJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'CANCELLED' } : j));
    addToast('warning', 'Job Cancelled', 'Provisioning queue job was cancelled.');
  };

  const triggerNewProvisioning = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newJob: ProvisioningJob = {
      id: `job_${Date.now()}`,
      jobCode: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: order.customerId,
      customerName: order.customerName,
      serviceId: `srv_inst_${Date.now()}`,
      serviceDomain: order.items[0]?.domain || 'domain.com',
      orderId: order.id,
      provider: 'WHM_CPANEL',
      targetServerId: 'srv_cpanel_01',
      targetServerName: 'cp1.serversalad.com',
      operation: 'CREATE_ACCOUNT',
      status: 'RUNNING',
      createdAt: 'Just now',
      attemptsCount: 1,
      currentStep: 'Step 1: Validate DNS & Domain Availability',
      steps: [
        { name: '1. Validate DNS & Domain Availability', status: 'RUNNING' },
        { name: '2. Select Optimal Cluster Server', status: 'PENDING' },
        { name: '3. Execute WHM API createacct', status: 'PENDING' },
        { name: '4. Issue Let\'s Encrypt AutoSSL', status: 'PENDING' },
        { name: '5. Dispatch Welcome Email', status: 'PENDING' },
      ],
    };

    setProvisioningJobs(prev => [newJob, ...prev]);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, provisioningStatus: 'IN_PROGRESS' } : o));
    addToast('info', 'Provisioning Dispatched', `Job ${newJob.jobCode} queued.`);

    setTimeout(() => {
      setProvisioningJobs(prev => prev.map(j => j.id === newJob.id ? {
        ...j,
        status: 'SUCCEEDED',
        currentStep: 'Completed all steps',
        steps: j.steps.map(s => ({ ...s, status: 'COMPLETED' })),
      } : j));
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, provisioningStatus: 'COMPLETED', orderStatus: 'COMPLETED' } : o));
      addToast('success', 'Service Provisioned', `Account generated for ${newJob.serviceDomain}`);
    }, 2000);
  };

  // ---------------- BILLING, INVOICES & REFUNDS (Modules I & J - Scenario E) ----------------
  const applyInvoiceCredit = (invoiceId: string, amount: number, note: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newTotal = Math.max(0, inv.total - amount);
        const nextStatus = newTotal === 0 ? 'PAID' : inv.status;
        logAuditEvent('INVOICE_CREDIT_APPLIED', 'INVOICE', inv.invoiceNumber, 'SUCCESS', `Credit of $${amount} applied. Note: ${note}`);
        addToast('success', 'Credit Applied', `$${amount.toFixed(2)} adjustment applied to ${inv.invoiceNumber}.`);
        return {
          ...inv,
          discountAmount: inv.discountAmount + amount,
          total: newTotal,
          status: nextStatus,
        };
      }
      return inv;
    }));
  };

  const voidInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'CANCELLED' } : inv));
    addToast('warning', 'Invoice Voided', 'Invoice has been marked as void / cancelled.');
  };

  const resendInvoiceEmail = (invoiceId: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    addToast('success', 'Invoice Sent', `Invoice ${inv.invoiceNumber} emailed to ${inv.customerEmail}.`);
  };

  const createManualInvoice = (data: Partial<Invoice>) => {
    const newInv: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(8900 + Math.random() * 999)}`,
      customerId: data.customerId || 'cust_101',
      customerName: data.customerName || 'Alex Chen',
      customerEmail: data.customerEmail || 'alex.chen@freshkitchen.io',
      issueDate: 'Today',
      dueDate: 'In 14 days',
      subtotal: data.subtotal || 25.00,
      taxAmount: 0,
      discountAmount: 0,
      total: data.total || 25.00,
      currency: 'USD',
      status: 'UNPAID',
      items: data.items || [{ description: 'Custom Hosting Fee', quantity: 1, unitPrice: 25.00, amount: 25.00 }],
      billingAddress: data.billingAddress || { name: 'Customer', line1: 'Billing Address', city: 'London', country: 'UK' },
    };
    setInvoices(prev => [newInv, ...prev]);
    addToast('success', 'Invoice Created', `Invoice ${newInv.invoiceNumber} created.`);
  };

  const refundPayment = (paymentId: string, amount: number, reason: string): boolean => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) {
      addToast('error', 'Payment Not Found', 'Could not locate payment transaction.');
      return false;
    }

    if (payment.status === 'REFUNDED') {
      addToast('error', 'Already Refunded', 'This transaction has already been refunded.');
      return false;
    }

    // 1. Update Payment Transaction
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'REFUNDED',
          refundedAmount: amount,
          refundReason: reason,
          refundedAt: 'Just now',
        };
      }
      return p;
    }));

    // 2. Update Associated Invoice
    setInvoices(prev => prev.map(inv => {
      if (inv.id === payment.invoiceId || inv.invoiceNumber === payment.invoiceNumber) {
        return {
          ...inv,
          status: 'REFUNDED',
        };
      }
      return inv;
    }));

    // 3. Log Audit Event
    logAuditEvent(
      'REFUND_ISSUED',
      'PAYMENT',
      payment.transactionRef,
      'SUCCESS',
      `Authorized refund of $${amount.toFixed(2)} via ${payment.provider}. Reason: ${reason}`
    );

    addToast(
      'success',
      'Refund Processed',
      `Successfully refunded $${amount.toFixed(2)} for ${payment.invoiceNumber}. Financial audit record created.`
    );

    return true;
  };

  // ---------------- SUBSCRIPTIONS (Module K) ----------------
  const updateSubscriptionStatus = (subId: string, status: Subscription['status']) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status } : s));
    addToast('info', 'Subscription Updated', `Status changed to ${status}.`);
  };

  const retrySubscriptionRenewal = (subId: string) => {
    addToast('info', 'Renewal Processing', 'Initiating automated renewal transaction...');
    setTimeout(() => {
      setSubscriptions(prev => prev.map(s => {
        if (s.id === subId) {
          return { ...s, status: 'ACTIVE', failedRenewalAttempts: 0 };
        }
        return s;
      }));
      addToast('success', 'Renewal Successful', 'Subscription successfully renewed for the next billing cycle.');
    }, 1200);
  };

  const cancelSubscriptionRenewal = (subId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, autoRenew: false, status: 'CANCELLED' } : s));
    logAuditEvent('SUBSCRIPTION_CANCELLED', 'ORDER', subId, 'WARNING', 'Auto-renew disabled by staff. Service remains active till expiry.');
    addToast('warning', 'Renewal Cancelled', 'Auto-renewal disabled. Hosting service will run until current paid period ends.');
  };

  // ---------------- SUPPORT TICKETS (Module L - Scenario F) ----------------
  const replyToTicket = (ticketId: string, content: string, isInternalNote = false) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderName: currentStaff.name,
      senderRole: 'STAFF' as const,
      isInternalNote,
      timestamp: 'Just now',
      content,
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const nextStatus = isInternalNote ? t.status : 'WAITING_FOR_CUSTOMER';
        return {
          ...t,
          status: nextStatus,
          lastResponseDate: 'Just now',
          messages: [...t.messages, newMessage],
        };
      }
      return t;
    }));

    logAuditEvent(
      isInternalNote ? 'TICKET_NOTE_ADDED' : 'TICKET_REPLY_SENT',
      'CUSTOMER',
      ticketId,
      'SUCCESS',
      isInternalNote ? 'Staff internal note recorded' : 'Customer-facing response sent'
    );

    addToast('success', isInternalNote ? 'Internal Note Added' : 'Reply Dispatched', isInternalNote ? 'Visible only to team members.' : 'Sent to customer email.');
  };

  const assignTicketAgent = (ticketId: string, agentId: string) => {
    const agent = staff.find(s => s.id === agentId);
    if (!agent) return;

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignedAgentId: agent.id,
          assignedAgentName: agent.name,
        };
      }
      return t;
    }));

    addToast('info', 'Ticket Reassigned', `Ticket assigned to ${agent.name}.`);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    addToast('info', 'Ticket Status Changed', `Ticket status updated to ${status}.`);
  };

  const updateTicketPriority = (ticketId: string, priority: SupportTicket['priority']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, priority } : t));
    addToast('info', 'Priority Updated', `Ticket priority set to ${priority}.`);
  };

  // ---------------- LIVE CHAT (Module M) ----------------
  const sendChatMessage = (chatId: string, text: string) => {
    const newMsg = {
      id: `cm_${Date.now()}`,
      sender: 'AGENT' as const,
      senderName: currentStaff.name,
      text,
      timestamp: 'Just now',
    };

    setLiveChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          status: 'ACTIVE',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    }));
  };

  const acceptChatSession = (chatId: string) => {
    setLiveChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          status: 'ACTIVE',
          assignedAgentId: currentStaff.id,
          assignedAgentName: currentStaff.name,
          unreadCount: 0,
        };
      }
      return c;
    }));
    addToast('success', 'Conversation Accepted', 'You are now connected with the customer.');
  };

  const closeChatSession = (chatId: string) => {
    setLiveChats(prev => prev.map(c => c.id === chatId ? { ...c, status: 'CLOSED' } : c));
    addToast('info', 'Chat Resolved', 'Session marked as resolved.');
  };

  // ---------------- NOTIFICATIONS & EMAIL (Module N) ----------------
  const retryNotification = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, status: 'DELIVERED', errorDetails: undefined } : n));
    addToast('success', 'Notification Retried', 'Delivery succeeded via mail gateway.');
  };

  const updateEmailTemplate = (templateId: string, subject: string, body: string) => {
    setEmailTemplates(prev => prev.map(t => t.id === templateId ? { ...t, subject, body, lastUpdated: 'Just now' } : t));
    addToast('success', 'Template Saved', 'Email notification template updated.');
  };

  // ---------------- STAFF (Module O - Scenario G) ----------------
  const addStaffMember = (data: Partial<StaffMember>) => {
    const newMember: StaffMember = {
      id: `staff_${Date.now()}`,
      name: data.name || 'New Staff',
      email: data.email || 'staff@serversalad.com',
      role: data.role || 'SUPPORT_AGENT',
      status: 'ACTIVE',
      lastActive: 'Just added',
      department: data.department || 'Customer Operations',
    };
    setStaff(prev => [...prev, newMember]);
    logAuditEvent('STAFF_MEMBER_CREATED', 'STAFF', newMember.email, 'SUCCESS', `Created account with role ${newMember.role}`);
    addToast('success', 'Staff Member Added', `${newMember.name} added as ${newMember.role}.`);
  };

  const updateStaffRole = (staffId: string, role: StaffRole) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, role } : s));
    logAuditEvent('STAFF_ROLE_CHANGED', 'STAFF', staffId, 'WARNING', `Role updated to ${role}`);
    addToast('success', 'Role Updated', `Staff permissions updated to ${role}.`);
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s));
    addToast('info', 'Staff Status Toggled', 'Account activity status updated.');
  };

  // ---------------- DOMAINS (Module R) ----------------
  const recheckDomainDns = (domainId: string) => {
    setDomains(prev => prev.map(d => d.id === domainId ? { ...d, dnsStatus: 'POINTED' } : d));
    addToast('success', 'DNS Verified', 'Domain records verified successfully on ns1.serversalad.com.');
  };

  const reissueDomainSsl = (domainId: string) => {
    setDomains(prev => prev.map(d => d.id === domainId ? { ...d, sslStatus: 'ACTIVE_LETS_ENCRYPT', sslExpiryDays: 90 } : d));
    addToast('success', 'SSL Reissued', 'Let\'s Encrypt AutoSSL certificate renewed for 90 days.');
  };

  // ---------------- SETTINGS (Module S) ----------------
  const updateIntegrationSettings = (newSettings: Partial<IntegrationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAuditEvent('SETTINGS_UPDATED', 'SETTINGS', 'SYSTEM', 'SUCCESS', 'Integration settings updated');
    addToast('success', 'Settings Saved', 'Platform integrations updated.');
  };

  return (
    <AdminDataContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentStaff,
        servers,
        serverGroups,
        products,
        customers,
        orders,
        services,
        provisioningJobs,
        invoices,
        payments,
        subscriptions,
        tickets,
        liveChats,
        notifications,
        emailTemplates,
        staff,
        auditLogs,
        domains,
        settings,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        addServer,
        updateServer,
        toggleServerAllocation,
        markServerMaintenance,
        testServerConnection,
        checkServerHealth,
        decommissionServer,
        createServerGroup,
        updateServerGroup,
        toggleServerGroup,
        createProduct,
        updateProduct,
        duplicateProduct,
        toggleProductPublished,
        toggleNewSales,
        archiveProduct,
        updateCustomer,
        toggleCustomerLoginSuspended,
        addCustomerNote,
        triggerPasswordReset,
        createCustomer,
        updateOrderStatus,
        cancelOrder,
        addOrderNote,
        suspendService,
        unsuspendService,
        terminateService,
        changeServiceServer,
        changeServiceProduct,
        retryProvisioningJob,
        cancelProvisioningJob,
        triggerNewProvisioning,
        applyInvoiceCredit,
        voidInvoice,
        resendInvoiceEmail,
        createManualInvoice,
        refundPayment,
        updateSubscriptionStatus,
        retrySubscriptionRenewal,
        cancelSubscriptionRenewal,
        replyToTicket,
        assignTicketAgent,
        updateTicketStatus,
        updateTicketPriority,
        sendChatMessage,
        acceptChatSession,
        closeChatSession,
        retryNotification,
        updateEmailTemplate,
        addStaffMember,
        updateStaffRole,
        toggleStaffStatus,
        recheckDomainDns,
        reissueDomainSsl,
        updateIntegrationSettings,
        logAuditEvent,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
