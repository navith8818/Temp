export type InvoiceStatus =
  | 'draft'
  | 'unpaid'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded'
  | 'pending'
  | 'failed';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'paypal';

export type PaymentGateway = 'PayHere' | 'Account Credit' | 'Manual' | 'Bank Transfer';

export type PaymentStatus =
  | 'pending'
  | 'successful'
  | 'failed'
  | 'cancelled'
  | 'refund_pending'
  | 'partially_refunded'
  | 'refunded';

export type SubscriptionBillingCycle = 'monthly' | 'quarterly' | 'semi-annually' | 'annually';

export type SubscriptionStatus = 'active' | 'pending' | 'suspended' | 'cancelled' | 'expired';

export type CreditTransactionType =
  | 'PROMO_CODE'
  | 'REFUND_CREDIT'
  | 'INVOICE_PAYMENT'
  | 'MANUAL_ADJUSTMENT';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  discount?: number;
  taxRate?: number;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  invoiceId: string;
  invoiceNumber: string;
  gateway: PaymentGateway;
  gatewayRefId: string;
  paymentMethod: string;
  date: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  customerName: string;
  customerEmail: string;
  refundStatus?: string;
  refundAmount?: number;
  refundReason?: string;
  canRetry?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName?: string;
  customerEmail?: string;
  description?: string;
  date: string;
  dueDate: string;
  period: string;
  amount: number;
  paidAmount: number;
  outstandingBalance: number;
  currency: string;
  status: InvoiceStatus;
  paymentMethodSummary: string;
  items: InvoiceLineItem[];
  subtotal: number;
  discountAmount?: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  pdfUrl?: string;
  paymentHistory?: PaymentTransaction[];
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
  phone?: string;
  vatId?: string;
  vatValidated?: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Subscription {
  id: string;
  subscriptionId: string;
  serviceName: string;
  package: string;
  billingCycle: SubscriptionBillingCycle;
  amount: number;
  currency: string;
  startDate: string;
  nextBillingDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  associatedHostingId?: string;
  renewalInvoicesCount?: number;
}

export interface CreditTransaction {
  id: string;
  date: string;
  type: CreditTransactionType;
  description: string;
  amount: number;
  balanceAfter: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  expiresAt: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

export interface RefundRequest {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  amount: number;
  reason: string;
  status: 'refund_pending' | 'refunded' | 'rejected';
  date: string;
}

export interface BillingSummary {
  currentPlanName: string;
  currentPlanPrice: number;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
  autoRenew: boolean;
  creditBalance: number;
  totalOutstanding?: number;
  totalRevenue?: number;
  overdueAmount?: number;
  unpaidInvoicesCount?: number;
  overdueInvoicesCount?: number;
  activeSubscriptionsCount?: number;
}
