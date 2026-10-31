'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ShieldCheck,
  Download,
  FileText,
  CreditCard,
  RefreshCw,
  Gift,
  Layers,
  Building2,
  Receipt,
} from 'lucide-react';
import {
  BillingSummary,
  Invoice,
  PaymentMethod,
  BillingAddress,
  PaymentTransaction,
  Subscription,
  CreditTransaction,
  Coupon,
  RefundRequest,
} from '@/types/billing';
import {
  INITIAL_BILLING_SUMMARY,
  INITIAL_INVOICES,
  INITIAL_PAYMENT_METHODS,
  INITIAL_BILLING_ADDRESS,
  INITIAL_TRANSACTIONS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_CREDIT_LEDGER,
  INITIAL_COUPONS,
  INITIAL_REFUND_REQUESTS,
} from '@/data/mockBillingData';
import { BillingOverview } from '@/components/billing/BillingOverview';
import { InvoicesList } from '@/components/billing/InvoicesList';
import { InvoiceDetailModal } from '@/components/billing/InvoiceDetailModal';
import { PaymentTransactionsList } from '@/components/billing/PaymentTransactionsList';
import { SubscriptionsList } from '@/components/billing/SubscriptionsList';
import { DiscountsAndCreditsCard } from '@/components/billing/DiscountsAndCreditsCard';
import { PayInvoiceModal } from '@/components/billing/PayInvoiceModal';
import { RequestRefundModal } from '@/components/billing/RequestRefundModal';
import { PaymentMethodsList } from '@/components/billing/PaymentMethodsList';
import { AddPaymentMethodModal } from '@/components/billing/AddPaymentMethodModal';
import { BillingAddressCard } from '@/components/billing/BillingAddressCard';
import { EditBillingAddressModal } from '@/components/billing/EditBillingAddressModal';
import { useToast } from '@/components/ui/Toast';
import { useAccount } from '@/context/AccountContext';

type BillingTab =
  | 'invoices'
  | 'transactions'
  | 'subscriptions'
  | 'payment-methods'
  | 'billing-details'
  | 'discounts';

export default function BillingPage() {
  const { toast } = useToast();
  const { addNotification } = useAccount();

  // Primary state datasets
  const [activeTab, setActiveTab] = useState<BillingTab>('invoices');
  const [invoicesFilter, setInvoicesFilter] = useState<string>('all');
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [creditLedger, setCreditLedger] = useState<CreditTransaction[]>(INITIAL_CREDIT_LEDGER);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(INITIAL_REFUND_REQUESTS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [billingAddress, setBillingAddress] = useState<BillingAddress>(INITIAL_BILLING_ADDRESS);
  const [creditBalance, setCreditBalance] = useState<number>(INITIAL_BILLING_SUMMARY.creditBalance);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [refundingTxn, setRefundingTxn] = useState<PaymentTransaction | null>(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

  const handleDownloadAll = () => {
    toast(
      'Consolidated Statement Generated',
      `An archive containing ${invoices.length} PDF receipts and transaction statements is ready.`,
      'info'
    );
  };

  // Callback when an invoice is successfully settled
  const handlePaymentSuccess = (invoiceId: string, paidAmount: number, methodUsed: string) => {
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'paid' as const,
          paidAmount: inv.total,
          outstandingBalance: 0,
          paymentMethodSummary: methodUsed,
        };
      }
      return inv;
    });
    setInvoices(updatedInvoices);

    const paidInv = invoices.find((i) => i.id === invoiceId);
    const newTxnId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newTxn: PaymentTransaction = {
      id: `txn_${Date.now()}`,
      transactionId: newTxnId,
      invoiceId,
      invoiceNumber: paidInv?.invoiceNumber || 'INV-2026-NEW',
      gateway: methodUsed.includes('Credit') ? 'Account Credit' : 'PayHere',
      gatewayRefId: `320025${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: methodUsed,
      date: 'Just now',
      amount: paidAmount,
      currency: 'USD',
      status: 'successful',
      customerName: billingAddress.contactName,
      customerEmail: billingAddress.email,
    };
    setTransactions([newTxn, ...transactions]);

    // If credit balance was used, deduct from ledger
    if (methodUsed.includes('Credit')) {
      const newBal = Math.max(0, creditBalance - paidAmount);
      setCreditBalance(newBal);
      setCreditLedger([
        {
          id: `cr_${Date.now()}`,
          date: 'Just now',
          type: 'INVOICE_PAYMENT',
          description: `Applied towards ${paidInv?.invoiceNumber}`,
          amount: -paidAmount,
          balanceAfter: newBal,
        },
        ...creditLedger,
      ]);
    }

    // Push notification to bell
    addNotification({
      title: `Payment Processed (${paidInv?.invoiceNumber})`,
      description: `Payment of $${paidAmount.toFixed(2)} USD verified via ${methodUsed}.`,
      timestamp: 'Just now',
      type: 'billing',
      read: false,
      link: '/billing',
    });
  };

  // Callback when an unpaid invoice is cancelled
  const handleCancelInvoice = (invoiceId: string) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, status: 'cancelled' as const, outstandingBalance: 0 } : inv
    );
    setInvoices(updated);
    toast('Invoice Cancelled', 'Eligible unpaid invoice has been voided.', 'info');
  };

  // Callback when refund request is submitted
  const handleRefundSubmitted = (newRequest: RefundRequest) => {
    setRefundRequests([newRequest, ...refundRequests]);
    // Mark associated transaction as refund_pending
    setTransactions((prev) =>
      prev.map((t) =>
        t.transactionId === newRequest.transactionId ? { ...t, status: 'refund_pending' as const } : t
      )
    );

    addNotification({
      title: 'Refund Request Queued',
      description: `A refund request for $${newRequest.amount.toFixed(2)} on ${newRequest.invoiceNumber} was forwarded to PayHere.`,
      timestamp: 'Just now',
      type: 'billing',
      read: false,
      link: '/billing',
    });
  };

  const billingTabs = [
    {
      id: 'invoices' as BillingTab,
      label: 'Invoices & Statements',
      icon: FileText,
      count: invoices.length,
    },
    {
      id: 'transactions' as BillingTab,
      label: 'Payment Transactions',
      icon: Receipt,
      count: transactions.length,
    },
    {
      id: 'subscriptions' as BillingTab,
      label: 'Hosting Subscriptions',
      icon: RefreshCw,
      count: subscriptions.filter((s) => s.status === 'active').length,
    },
    {
      id: 'payment-methods' as BillingTab,
      label: 'Payment Methods',
      icon: CreditCard,
      count: paymentMethods.length,
    },
    {
      id: 'billing-details' as BillingTab,
      label: 'Billing & Tax Details',
      icon: Building2,
    },
    {
      id: 'discounts' as BillingTab,
      label: 'Credits & Discounts',
      icon: Gift,
    },
  ];

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col bg-[#f8f9fa] text-gray-900 overflow-hidden">
      {/* Top Subheader: Breadcrumb & Title */}
      <section className="shrink-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-0.5">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Customer Portal
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-700 font-semibold">Billing & Financial Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Billing & Invoices Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 max-w-xl truncate">
            Track cloud hosting invoices, settle payments via PayHere, oversee active subscriptions, and audit credit balances.
          </p>
        </div>

        {/* Quick Action: Export Statement */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#e8702a]" />
            <span>Export Statement</span>
          </button>
        </div>
      </section>

      {/* Main Single-Section Grid */}
      <main className="flex-1 min-h-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-2.5 flex flex-col gap-3 overflow-hidden">
        {/* Dynamic Calculated Financial Overview (KPIs) */}
        <BillingOverview
          invoices={invoices}
          subscriptions={subscriptions}
          transactions={transactions}
          creditBalance={creditBalance}
          onCreditUpdated={(newBal) => {
            setCreditBalance(newBal);
            setCreditLedger([
              {
                id: `cr_${Date.now()}`,
                date: 'Just now',
                type: 'PROMO_CODE',
                description: 'Voucher code credit applied',
                amount: newBal - creditBalance,
                balanceAfter: newBal,
              },
              ...creditLedger,
            ]);
          }}
        />

        {/* Main Workspace Area: Left Side Icon Bar (Fixed Width, Hover Tooltip) + Dedicated Full-Width Active View */}
        <div className="flex-1 min-h-0 flex flex-row gap-2.5 overflow-hidden">
          {/* Side Icon Bar placed on the LEFT side of the section (Fixed width w-12 sm:w-13, no rail expansion, hover shows name tooltip) */}
          <aside
            aria-label="Billing navigation tabs"
            className="shrink-0 w-12 sm:w-13 flex flex-col items-center py-3 px-1 bg-white border border-gray-200/80 rounded-3xl shadow-xs min-h-0 overflow-visible relative"
          >
            <div className="flex flex-col items-center gap-2 w-full">
              {billingTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <div key={tab.id} className="relative group/tab flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#fcf5f1] text-[#e8702a]'
                          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100/70'
                      }`}
                      aria-label={tab.label}
                    >
                      {/* Highlight the tab with a thin vertical line leftside of the icon */}
                      <span
                        className={`absolute left-0.5 top-2.5 bottom-2.5 w-[2.5px] rounded-full transition-all ${
                          isActive ? 'bg-[#e8702a]' : 'bg-transparent'
                        }`}
                      />

                      {/* Icon */}
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover/tab:scale-105 ${
                          isActive ? 'text-[#e8702a]' : 'text-gray-400 group-hover/tab:text-gray-700'
                        }`}
                      />
                    </button>

                    {/* Floating Tooltip displaying name on hover */}
                    <div
                      role="tooltip"
                      className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap shadow-xl opacity-0 invisible group-hover/tab:opacity-100 group-hover/tab:visible transition-all duration-150 z-50 pointer-events-none flex items-center gap-1.5"
                    >
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                            isActive
                              ? 'bg-[#e8702a] text-white'
                              : 'bg-white/20 text-white'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                      {/* Caret pointing left towards the icon */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-gray-900" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Space for expansion */}
            <div className="flex-1 w-full min-h-[40px]" />
          </aside>

          {/* Active Tab View (Dedicated full-width section without crowding) */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
            {activeTab === 'invoices' && (
              <InvoicesList
                invoices={invoices}
                initialFilter={invoicesFilter}
                onViewInvoice={(inv) => setSelectedInvoice(inv)}
                onPayInvoice={(inv) => setPayingInvoice(inv)}
                onCancelInvoice={handleCancelInvoice}
              />
            )}

            {activeTab === 'transactions' && (
              <PaymentTransactionsList
                transactions={transactions}
                onViewInvoice={(invNum) => {
                  const target = invoices.find((i) => i.invoiceNumber === invNum);
                  if (target) setSelectedInvoice(target);
                  else toast('Invoice Not Found', `Record for ${invNum} is archived.`, 'info');
                }}
                onRequestRefund={(txn) => setRefundingTxn(txn)}
                onTransactionUpdated={(updatedTxn) => {
                  setTransactions((prev) =>
                    prev.map((t) => (t.id === updatedTxn.id ? updatedTxn : t))
                  );
                }}
              />
            )}

            {activeTab === 'subscriptions' && (
              <SubscriptionsList
                subscriptions={subscriptions}
                onSubscriptionUpdated={(updated) => {
                  setSubscriptions((prev) =>
                    prev.map((s) => (s.id === updated.id ? updated : s))
                  );
                }}
                onViewRenewalInvoices={(serviceName) => {
                  setActiveTab('invoices');
                  toast('Filtered for Renewal Invoices', `Displaying invoices for ${serviceName}.`, 'info');
                }}
              />
            )}

            {activeTab === 'payment-methods' && (
              <PaymentMethodsList
                paymentMethods={paymentMethods}
                onAddClick={() => setIsAddCardOpen(true)}
                onMethodsUpdated={(methods) => setPaymentMethods(methods)}
              />
            )}

            {activeTab === 'billing-details' && (
              <BillingAddressCard
                address={billingAddress}
                onEditClick={() => setIsEditAddressOpen(true)}
              />
            )}

            {activeTab === 'discounts' && (
              <DiscountsAndCreditsCard
                creditBalance={creditBalance}
                creditLedger={creditLedger}
                coupons={coupons}
                refundRequests={refundRequests}
                onCreditUpdated={(newBal) => setCreditBalance(newBal)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Pinned Bottom Status Bar */}
      <footer className="shrink-0 border-t border-gray-200/80 bg-white/70 backdrop-blur-xs py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>PCI-DSS Level 1 Secure Vault • PayHere Gateway Signed IPN • 256-Bit SSL Encrypted Billing</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">Need billing help?</span>
            <a
              href="mailto:billing@serversalad.com"
              className="text-[#e8702a] hover:underline font-medium"
            >
              billing@serversalad.com
            </a>
          </div>
        </div>
      </footer>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        billingAddress={billingAddress}
        onClose={() => setSelectedInvoice(null)}
        onPayClick={(inv) => setPayingInvoice(inv)}
        onCancelInvoice={handleCancelInvoice}
      />

      {/* Settle / Pay Invoice Modal (PayHere / Saved Card / Credit) */}
      <PayInvoiceModal
        invoice={payingInvoice}
        paymentMethods={paymentMethods}
        creditBalance={creditBalance}
        isOpen={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Request Refund Modal */}
      <RequestRefundModal
        transaction={refundingTxn}
        isOpen={!!refundingTxn}
        onClose={() => setRefundingTxn(null)}
        onRefundSubmitted={handleRefundSubmitted}
      />

      {/* Add Payment Method Modal (PayHere Preapproval Tokenization) */}
      <AddPaymentMethodModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onMethodAdded={(newMethod) => {
          let updated = [...paymentMethods];
          if (newMethod.isDefault) {
            updated = updated.map((pm) => ({ ...pm, isDefault: false }));
          }
          setPaymentMethods([newMethod, ...updated]);
          addNotification({
            title: 'Payment Method Tokenized',
            description: `${newMethod.brand.toUpperCase()} ending in ${newMethod.last4} saved via PayHere Vault.`,
            timestamp: 'Just now',
            type: 'billing',
            read: false,
            link: '/billing',
          });
        }}
      />

      {/* Edit Billing Address Modal */}
      <EditBillingAddressModal
        isOpen={isEditAddressOpen}
        address={billingAddress}
        onClose={() => setIsEditAddressOpen(false)}
        onAddressUpdated={(updated) => setBillingAddress(updated)}
      />
    </div>
  );
}
