import {
  BillingSummary,
  PaymentMethod,
  Invoice,
  BillingAddress,
  CardBrand,
  PaymentTransaction,
  Subscription,
  CreditTransaction,
  Coupon,
  RefundRequest,
} from '@/types/billing';

export const INITIAL_BILLING_ADDRESS: BillingAddress = {
  companyName: 'Fresh Kitchen Media S.A.',
  contactName: 'Sarah Jenkins',
  email: 'billing@freshkitchen.io',
  phone: '+1 (555) 382-9014',
  vatId: 'LU30918274',
  vatValidated: true,
  addressLine1: '2-4, Rue Edmond Reuter',
  addressLine2: 'Building B, Suite 400',
  city: 'Contern',
  postalCode: 'L-5326',
  country: 'Luxembourg',
};

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_01',
    brand: 'visa',
    last4: '4242',
    expMonth: 8,
    expYear: 2028,
    cardholderName: 'Sarah Jenkins',
    isDefault: true,
  },
  {
    id: 'pm_02',
    brand: 'mastercard',
    last4: '8812',
    expMonth: 11,
    expYear: 2027,
    cardholderName: 'Sarah Jenkins',
    isDefault: false,
  },
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'txn_01',
    transactionId: 'TXN-8821901',
    invoiceId: 'inv_01',
    invoiceNumber: 'INV-2026-0891',
    gateway: 'PayHere',
    gatewayRefId: '320025184910',
    paymentMethod: 'Visa •••• 4242',
    date: 'Oct 15, 2026, 09:14 UTC',
    amount: 9.99,
    currency: 'USD',
    status: 'successful',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
  },
  {
    id: 'txn_02',
    transactionId: 'TXN-8821850',
    invoiceId: 'inv_03',
    invoiceNumber: 'INV-2026-0885',
    gateway: 'PayHere',
    gatewayRefId: '320025183401',
    paymentMethod: 'Mastercard •••• 8812',
    date: 'Oct 20, 2026, 14:22 UTC',
    amount: 29.99,
    currency: 'USD',
    status: 'failed',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    canRetry: true,
  },
  {
    id: 'txn_03',
    transactionId: 'TXN-8821790',
    invoiceId: 'inv_04',
    invoiceNumber: 'INV-2026-0870',
    gateway: 'PayHere',
    gatewayRefId: '320025181299',
    paymentMethod: 'Visa •••• 4242',
    date: 'Oct 22, 2026, 11:05 UTC',
    amount: 50.0,
    currency: 'USD',
    status: 'successful',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
  },
  {
    id: 'txn_04',
    transactionId: 'TXN-8821640',
    invoiceId: 'inv_07',
    invoiceNumber: 'INV-2026-0550',
    gateway: 'PayHere',
    gatewayRefId: '320025179840',
    paymentMethod: 'Visa •••• 4242',
    date: 'Sep 28, 2026, 16:30 UTC',
    amount: 19.99,
    currency: 'USD',
    status: 'refunded',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    refundStatus: 'Processed by PayHere Gateway',
    refundAmount: 19.99,
    refundReason: 'Redundant add-on package cancellation reversal',
  },
  {
    id: 'txn_05',
    transactionId: 'TXN-8821510',
    invoiceId: 'inv_05',
    invoiceNumber: 'INV-2026-0742',
    gateway: 'PayHere',
    gatewayRefId: '320025176211',
    paymentMethod: 'Visa •••• 4242',
    date: 'Sep 15, 2026, 10:00 UTC',
    amount: 9.99,
    currency: 'USD',
    status: 'successful',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_01',
    invoiceNumber: 'INV-2026-0891',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    description: 'Web Hosting Essential (Monthly)',
    date: 'Oct 15, 2026',
    dueDate: 'Oct 15, 2026',
    period: 'Oct 15, 2026 – Nov 14, 2026',
    amount: 9.99,
    paidAmount: 9.99,
    outstandingBalance: 0.0,
    currency: 'USD',
    status: 'paid',
    paymentMethodSummary: 'Visa ending in 4242 via PayHere',
    items: [
      {
        id: 'li_01',
        description: 'Web Hosting Essential — 25 GB NVMe SSD, HestiaCP Cluster (EU-Central)',
        quantity: 1,
        unitPrice: 9.99,
        total: 9.99,
      },
    ],
    subtotal: 9.99,
    taxRate: 0,
    taxAmount: 0.0,
    total: 9.99,
    paymentHistory: [INITIAL_TRANSACTIONS[0]],
  },
  {
    id: 'inv_02',
    invoiceNumber: 'INV-2026-0902',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    description: 'Cloud Business VPS Dedicated 8-Core (Monthly Renewal)',
    date: 'Oct 28, 2026',
    dueDate: 'Nov 05, 2026',
    period: 'Nov 01, 2026 – Nov 30, 2026',
    amount: 49.0,
    paidAmount: 0.0,
    outstandingBalance: 49.0,
    currency: 'USD',
    status: 'unpaid',
    paymentMethodSummary: 'Pending Payment Authorization',
    items: [
      {
        id: 'li_02',
        description: 'Cloud Business VPS — 8 vCPU, 16 GB RAM, 100 GB NVMe (Frankfurt FRA-01)',
        quantity: 1,
        unitPrice: 49.0,
        total: 49.0,
      },
    ],
    subtotal: 49.0,
    taxRate: 0,
    taxAmount: 0.0,
    total: 49.0,
    paymentHistory: [],
  },
  {
    id: 'inv_03',
    invoiceNumber: 'INV-2026-0885',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    description: 'NVMe Storage Expansion Tier 2',
    date: 'Oct 10, 2026',
    dueDate: 'Oct 20, 2026',
    period: 'Oct 10, 2026 – Nov 09, 2026',
    amount: 29.99,
    paidAmount: 0.0,
    outstandingBalance: 29.99,
    currency: 'USD',
    status: 'overdue',
    paymentMethodSummary: 'Failed via Mastercard 8812 (Card Declined)',
    items: [
      {
        id: 'li_03',
        description: 'Dedicated NVMe Storage Volume (150 GB Additional Pool)',
        quantity: 1,
        unitPrice: 29.99,
        total: 29.99,
      },
    ],
    subtotal: 29.99,
    taxRate: 0,
    taxAmount: 0.0,
    total: 29.99,
    paymentHistory: [INITIAL_TRANSACTIONS[1]],
  },
  {
    id: 'inv_04',
    invoiceNumber: 'INV-2026-0870',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    description: 'Cloud Infrastructure Setup & Security Audit',
    date: 'Oct 18, 2026',
    dueDate: 'Nov 10, 2026',
    period: 'One-time professional service',
    amount: 100.0,
    paidAmount: 50.0,
    outstandingBalance: 50.0,
    currency: 'USD',
    status: 'partially_paid',
    paymentMethodSummary: 'Deposit of $50.00 paid via Visa 4242',
    items: [
      {
        id: 'li_04',
        description: 'Managed Cluster Migration & Hardening Consultation',
        quantity: 1,
        unitPrice: 100.0,
        total: 100.0,
      },
    ],
    subtotal: 100.0,
    taxRate: 0,
    taxAmount: 0.0,
    total: 100.0,
    paymentHistory: [INITIAL_TRANSACTIONS[2]],
  },
  {
    id: 'inv_05',
    invoiceNumber: 'INV-2026-0742',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    description: 'Web Hosting Essential (Monthly)',
    date: 'Sep 15, 2026',
    dueDate: 'Sep 15, 2026',
    period: 'Sep 15, 2026 – Oct 14, 2026',
    amount: 9.99,
    paidAmount: 9.99,
    outstandingBalance: 0.0,
    currency: 'USD',
    status: 'paid',
    paymentMethodSummary: 'Visa ending in 4242 via PayHere',
    items: [
      {
        id: 'li_05',
        description: 'Web Hosting Essential — 25 GB NVMe SSD, HestiaCP Cluster (EU-Central)',
        quantity: 1,
        unitPrice: 9.99,
        total: 9.99,
      },
    ],
    subtotal: 9.99,
    taxRate: 0,
    taxAmount: 0.0,
    total: 9.99,
    paymentHistory: [INITIAL_TRANSACTIONS[4]],
  },
  {
    id: 'inv_06',
    invoiceNumber: 'INV-2026-0610',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    description: 'Web Hosting Essential (Monthly)',
    date: 'Aug 15, 2026',
    dueDate: 'Aug 15, 2026',
    period: 'Aug 15, 2026 – Sep 14, 2026',
    amount: 9.99,
    paidAmount: 9.99,
    outstandingBalance: 0.0,
    currency: 'USD',
    status: 'paid',
    paymentMethodSummary: 'Visa ending in 4242 via PayHere',
    items: [
      {
        id: 'li_06',
        description: 'Web Hosting Essential — 25 GB NVMe SSD, HestiaCP Cluster (EU-Central)',
        quantity: 1,
        unitPrice: 9.99,
        total: 9.99,
      },
    ],
    subtotal: 9.99,
    taxRate: 0,
    taxAmount: 0.0,
    total: 9.99,
    paymentHistory: [],
  },
  {
    id: 'inv_07',
    invoiceNumber: 'INV-2026-0550',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    description: 'Automated Daily Snapshot Retention (Refunded)',
    date: 'Jul 22, 2026',
    dueDate: 'Jul 22, 2026',
    period: 'Jul 22, 2026 – Aug 21, 2026',
    amount: 19.99,
    paidAmount: 0.0,
    outstandingBalance: 0.0,
    currency: 'USD',
    status: 'refunded',
    paymentMethodSummary: 'Refunded to Visa ending in 4242',
    items: [
      {
        id: 'li_07',
        description: 'Automated 14-Day Rolling Backup Vault',
        quantity: 1,
        unitPrice: 19.99,
        total: 19.99,
      },
    ],
    subtotal: 19.99,
    taxRate: 0,
    taxAmount: 0.0,
    total: 19.99,
    paymentHistory: [INITIAL_TRANSACTIONS[3]],
  },
  {
    id: 'inv_08',
    invoiceNumber: 'INV-2026-0915',
    customerName: 'Sarah Jenkins',
    customerEmail: 'billing@freshkitchen.io',
    description: 'SSL Wildcard SAN Certificate Renewal',
    date: 'Oct 30, 2026',
    dueDate: 'Nov 14, 2026',
    period: 'Annual SSL Certificate (2026–2027)',
    amount: 15.0,
    paidAmount: 0.0,
    outstandingBalance: 15.0,
    currency: 'USD',
    status: 'draft',
    paymentMethodSummary: 'Draft Quote / Pending Confirmation',
    items: [
      {
        id: 'li_08',
        description: 'Sectigo PositiveSSL Wildcard Certificate (*.freshkitchen.io)',
        quantity: 1,
        unitPrice: 15.0,
        total: 15.0,
      },
    ],
    subtotal: 15.0,
    taxRate: 0,
    taxAmount: 0.0,
    total: 15.0,
    paymentHistory: [],
  },
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_01',
    subscriptionId: 'SUB-9941',
    serviceName: 'Cloud Business VPS (Dedicated 8-Core)',
    package: 'High Performance NVMe Cluster (FRA-01)',
    billingCycle: 'monthly',
    amount: 49.0,
    currency: 'USD',
    startDate: 'Jan 15, 2024',
    nextBillingDate: 'Nov 15, 2026',
    status: 'active',
    autoRenew: true,
    associatedHostingId: 'plan_785df5d6',
    renewalInvoicesCount: 22,
  },
  {
    id: 'sub_02',
    subscriptionId: 'SUB-8812',
    serviceName: 'Web Hosting Essential',
    package: '25 GB SSD Fast cPanel / HestiaCP',
    billingCycle: 'monthly',
    amount: 9.99,
    currency: 'USD',
    startDate: 'Jun 10, 2024',
    nextBillingDate: 'Nov 10, 2026',
    status: 'active',
    autoRenew: true,
    associatedHostingId: 'plan_884fa21',
    renewalInvoicesCount: 5,
  },
  {
    id: 'sub_03',
    subscriptionId: 'SUB-7703',
    serviceName: 'Dedicated NVMe Volume Pool (100 GB)',
    package: 'Block Storage Add-on',
    billingCycle: 'quarterly',
    amount: 30.0,
    currency: 'USD',
    startDate: 'Sep 01, 2024',
    nextBillingDate: 'Dec 01, 2026',
    status: 'active',
    autoRenew: true,
    associatedHostingId: 'vol_nvme_01',
    renewalInvoicesCount: 1,
  },
  {
    id: 'sub_04',
    subscriptionId: 'SUB-6601',
    serviceName: 'Staging WordPress Sandbox',
    package: 'Basic Developer Tier',
    billingCycle: 'monthly',
    amount: 4.99,
    currency: 'USD',
    startDate: 'Feb 01, 2024',
    nextBillingDate: 'Expired',
    status: 'cancelled',
    autoRenew: false,
    renewalInvoicesCount: 7,
  },
];

export const INITIAL_CREDIT_LEDGER: CreditTransaction[] = [
  {
    id: 'cr_01',
    date: 'Oct 18, 2026, 12:40 UTC',
    type: 'PROMO_CODE',
    description: 'Redeemed voucher code: WELCOME25',
    amount: 25.0,
    balanceAfter: 25.0,
  },
  {
    id: 'cr_02',
    date: 'Sep 28, 2026, 16:35 UTC',
    type: 'REFUND_CREDIT',
    description: 'Service credit compensation for minor latency window',
    amount: 10.0,
    balanceAfter: 35.0,
  },
  {
    id: 'cr_03',
    date: 'Oct 01, 2026, 00:00 UTC',
    type: 'INVOICE_PAYMENT',
    description: 'Auto-applied credit towards INV-2026-0810 renewal',
    amount: -10.0,
    balanceAfter: 25.0,
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cp_01',
    code: 'SALAD10',
    description: '$10.00 instant credit applied to your wallet balance',
    discountType: 'fixed',
    discountValue: 10.0,
    expiresAt: 'Dec 31, 2026',
    isActive: true,
    usageLimit: 1,
    usedCount: 0,
  },
  {
    id: 'cp_02',
    code: 'WELCOME25',
    description: '$25.00 welcome bonus for new cloud infrastructure deployments',
    discountType: 'fixed',
    discountValue: 25.0,
    expiresAt: 'Nov 30, 2026',
    isActive: true,
    usageLimit: 1,
    usedCount: 1,
  },
  {
    id: 'cp_03',
    code: 'VIP50',
    description: '50% discount on dedicated cloud server upgrades',
    discountType: 'percentage',
    discountValue: 50.0,
    expiresAt: 'Jan 15, 2027',
    isActive: true,
    usageLimit: 3,
    usedCount: 0,
  },
];

export const INITIAL_REFUND_REQUESTS: RefundRequest[] = [
  {
    id: 'ref_01',
    transactionId: 'TXN-8821640',
    invoiceNumber: 'INV-2026-0550',
    amount: 19.99,
    reason: 'Redundant add-on package cancellation reversal',
    status: 'refunded',
    date: 'Sep 28, 2026',
  },
  {
    id: 'ref_02',
    transactionId: 'TXN-8821510',
    invoiceNumber: 'INV-2026-0742',
    amount: 9.99,
    reason: 'Customer requested plan adjustment credit',
    status: 'refund_pending',
    date: 'Oct 29, 2026',
  },
];

export const INITIAL_BILLING_SUMMARY: BillingSummary = {
  currentPlanName: 'Cloud Business VPS (Dedicated 8-Core)',
  currentPlanPrice: 49.0,
  billingCycle: 'monthly',
  nextBillingDate: 'Nov 15, 2026',
  autoRenew: true,
  creditBalance: 25.0,
};

/**
 * Enhanced Billing Service layer (fully decoupled & API-ready for NestJS & PayHere SDK)
 */
export const billingService = {
  async getInvoices(): Promise<Invoice[]> {
    await new Promise((res) => setTimeout(res, 150));
    return [...INITIAL_INVOICES];
  },

  async getTransactions(): Promise<PaymentTransaction[]> {
    await new Promise((res) => setTimeout(res, 150));
    return [...INITIAL_TRANSACTIONS];
  },

  async getSubscriptions(): Promise<Subscription[]> {
    await new Promise((res) => setTimeout(res, 150));
    return [...INITIAL_SUBSCRIPTIONS];
  },

  async getCreditLedger(): Promise<CreditTransaction[]> {
    await new Promise((res) => setTimeout(res, 100));
    return [...INITIAL_CREDIT_LEDGER];
  },

  async getCoupons(): Promise<Coupon[]> {
    await new Promise((res) => setTimeout(res, 100));
    return [...INITIAL_COUPONS];
  },

  async getRefundRequests(): Promise<RefundRequest[]> {
    await new Promise((res) => setTimeout(res, 100));
    return [...INITIAL_REFUND_REQUESTS];
  },

  async payInvoice(params: {
    invoiceId: string;
    amount: number;
    method: 'SAVED_CARD' | 'PAYHERE_HOSTED' | 'CREDIT_BALANCE';
    cardId?: string;
  }): Promise<{ success: boolean; transaction: PaymentTransaction; message: string }> {
    await new Promise((res) => setTimeout(res, 500));

    const txnId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const gatewayRef = `320025${Math.floor(100000 + Math.random() * 900000)}`;

    const newTxn: PaymentTransaction = {
      id: `txn_${Date.now()}`,
      transactionId: txnId,
      invoiceId: params.invoiceId,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      gateway: params.method === 'CREDIT_BALANCE' ? 'Account Credit' : 'PayHere',
      gatewayRefId: gatewayRef,
      paymentMethod:
        params.method === 'CREDIT_BALANCE'
          ? 'Account Credit Balance'
          : 'Visa •••• 4242 (PayHere Tokenized)',
      date: 'Just now',
      amount: params.amount,
      currency: 'USD',
      status: 'successful',
      customerName: 'Sarah Jenkins',
      customerEmail: 'billing@freshkitchen.io',
    };

    return {
      success: true,
      transaction: newTxn,
      message: `Payment of $${params.amount.toFixed(2)} USD processed successfully via ${newTxn.gateway}.`,
    };
  },

  async cancelInvoice(invoiceId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  },

  async resendInvoice(invoiceId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 250));
    return true;
  },

  async retryPayment(transactionId: string): Promise<{ success: boolean; message: string }> {
    await new Promise((res) => setTimeout(res, 600));
    return {
      success: true,
      message: 'Payment retried and settled successfully through PayHere Gateway.',
    };
  },

  async submitRefundRequest(data: {
    transactionId: string;
    invoiceNumber: string;
    amount: number;
    reason: string;
  }): Promise<RefundRequest> {
    await new Promise((res) => setTimeout(res, 450));
    return {
      id: `ref_${Date.now()}`,
      transactionId: data.transactionId,
      invoiceNumber: data.invoiceNumber,
      amount: data.amount,
      reason: data.reason,
      status: 'refund_pending',
      date: 'Just now',
    };
  },

  async cancelSubscription(subId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 350));
    return true;
  },

  async toggleSubscriptionAutoRenew(subId: string, enabled: boolean): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 250));
    return true;
  },

  async getBillingAddress(): Promise<BillingAddress> {
    await new Promise((res) => setTimeout(res, 100));
    return { ...INITIAL_BILLING_ADDRESS };
  },

  async updateBillingAddress(data: BillingAddress): Promise<BillingAddress> {
    await new Promise((res) => setTimeout(res, 300));
    return { ...data, vatValidated: !!data.vatId };
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await new Promise((res) => setTimeout(res, 150));
    return [...INITIAL_PAYMENT_METHODS];
  },

  async addPaymentMethod(data: {
    cardNumber: string;
    cardholderName: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
  }): Promise<PaymentMethod> {
    await new Promise((res) => setTimeout(res, 400));
    const cleanNumber = data.cardNumber.replace(/\s+/g, '');
    const last4 = cleanNumber.slice(-4) || '1234';

    let brand: CardBrand = 'visa';
    if (cleanNumber.startsWith('5')) brand = 'mastercard';
    if (cleanNumber.startsWith('3')) brand = 'amex';

    return {
      id: `pm_${Date.now()}`,
      brand,
      last4,
      expMonth: data.expMonth,
      expYear: data.expYear,
      cardholderName: data.cardholderName,
      isDefault: data.isDefault,
    };
  },

  async setDefaultPaymentMethod(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));
    return true;
  },

  async removePaymentMethod(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 250));
    return true;
  },

  async redeemPromoCode(code: string): Promise<{ success: boolean; creditAdded: number; message: string }> {
    await new Promise((res) => setTimeout(res, 300));
    const upper = code.trim().toUpperCase();
    if (upper === 'SALAD10' || upper === 'SALAD2026') {
      return {
        success: true,
        creditAdded: 10.0,
        message: 'Promo code applied! $10.00 added to account credit balance.',
      };
    }
    if (upper === 'WELCOME25') {
      return {
        success: true,
        creditAdded: 25.0,
        message: 'Welcome credit applied! $25.00 added to account balance.',
      };
    }
    if (upper === 'VIP50') {
      return {
        success: true,
        creditAdded: 50.0,
        message: 'VIP discount credit applied! $50.00 added to account balance.',
      };
    }
    return {
      success: false,
      creditAdded: 0,
      message: 'Invalid or expired promo code. Try SALAD10, WELCOME25, or VIP50.',
    };
  },
};
