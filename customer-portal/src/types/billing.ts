export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'paypal';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  period: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paymentMethodSummary: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  pdfUrl?: string;
}

export interface PaymentMethod {
  id: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  cardholderName: string;
  isDefault: boolean;
}

export interface BillingAddress {
  companyName: string;
  contactName: string;
  email: string;
  vatId?: string;
  vatValidated?: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface BillingSummary {
  currentPlanName: string;
  currentPlanPrice: number;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
  autoRenew: boolean;
  creditBalance: number;
}
