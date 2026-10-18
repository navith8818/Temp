import {
  BillingSummary,
  PaymentMethod,
  Invoice,
  BillingAddress,
  CardBrand,
} from '@/types/billing';

export const INITIAL_BILLING_SUMMARY: BillingSummary = {
  currentPlanName: 'Web Hosting Essential',
  currentPlanPrice: 9.99,
  billingCycle: 'monthly',
  nextBillingDate: 'Nov 15, 2026',
  autoRenew: true,
  creditBalance: 25.0,
};

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_01',
    brand: 'visa',
    last4: '4242',
    expMonth: 8,
    expYear: 2028,
    cardholderName: 'John Doe',
    isDefault: true,
  },
  {
    id: 'pm_02',
    brand: 'mastercard',
    last4: '8812',
    expMonth: 11,
    expYear: 2027,
    cardholderName: 'John Doe',
    isDefault: false,
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_01',
    invoiceNumber: 'INV-2026-0891',
    date: 'Oct 15, 2026',
    dueDate: 'Oct 15, 2026',
    period: 'Oct 15, 2026 – Nov 14, 2026',
    amount: 9.99,
    currency: 'USD',
    status: 'paid',
    paymentMethodSummary: 'Visa ending in 4242',
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
  },
  {
    id: 'inv_02',
    invoiceNumber: 'INV-2026-0742',
    date: 'Sep 15, 2026',
    dueDate: 'Sep 15, 2026',
    period: 'Sep 15, 2026 – Oct 14, 2026',
    amount: 9.99,
    currency: 'USD',
    status: 'paid',
    paymentMethodSummary: 'Visa ending in 4242',
    items: [
      {
        id: 'li_02',
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
  },
  {
    id: 'inv_03',
    invoiceNumber: 'INV-2026-0610',
    date: 'Aug 15, 2026',
    dueDate: 'Aug 15, 2026',
    period: 'Aug 15, 2026 – Sep 14, 2026',
    amount: 9.99,
    currency: 'USD',
    status: 'paid',
    paymentMethodSummary: 'Visa ending in 4242',
    items: [
      {
        id: 'li_03',
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
  },
  {
    id: 'inv_04',
    invoiceNumber: 'INV-2026-0498',
    date: 'Jul 15, 2026',
    dueDate: 'Jul 15, 2026',
    period: 'Jul 15, 2026 – Aug 14, 2026',
    amount: 9.99,
    currency: 'USD',
    status: 'paid',
    paymentMethodSummary: 'Visa ending in 4242',
    items: [
      {
        id: 'li_04',
        description: 'Web Hosting Essential — Initial Setup & Deployment',
        quantity: 1,
        unitPrice: 9.99,
        total: 9.99,
      },
    ],
    subtotal: 9.99,
    taxRate: 0,
    taxAmount: 0.0,
    total: 9.99,
  },
];

export const INITIAL_BILLING_ADDRESS: BillingAddress = {
  companyName: 'Fresh Kitchen Media S.A.',
  contactName: 'John Doe',
  email: 'billing@freshkitchen.io',
  vatId: 'LU30918274',
  vatValidated: true,
  addressLine1: '2-4, Rue Edmond Reuter',
  city: 'Contern',
  postalCode: 'L-5326',
  country: 'Luxembourg',
};

/**
 * Billing simulation layer ready to connect to NestJS endpoints
 */
export const billingService = {
  async getBillingSummary(): Promise<BillingSummary> {
    await new Promise((res) => setTimeout(res, 200));
    return { ...INITIAL_BILLING_SUMMARY };
  },

  async getInvoices(): Promise<Invoice[]> {
    await new Promise((res) => setTimeout(res, 250));
    return [...INITIAL_INVOICES];
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...INITIAL_PAYMENT_METHODS];
  },

  async getBillingAddress(): Promise<BillingAddress> {
    await new Promise((res) => setTimeout(res, 180));
    return { ...INITIAL_BILLING_ADDRESS };
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
    await new Promise((res) => setTimeout(res, 250));
    return true;
  },

  async removePaymentMethod(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  },

  async updateBillingAddress(data: BillingAddress): Promise<BillingAddress> {
    await new Promise((res) => setTimeout(res, 350));
    return { ...data, vatValidated: !!data.vatId };
  },

  async redeemPromoCode(code: string): Promise<{ success: boolean; creditAdded: number; message: string }> {
    await new Promise((res) => setTimeout(res, 350));
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
    return {
      success: false,
      creditAdded: 0,
      message: 'Invalid or expired promo code. Try SALAD10 or WELCOME25.',
    };
  },
};
