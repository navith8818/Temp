'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import {
  BillingSummary,
  Invoice,
  PaymentMethod,
  BillingAddress,
} from '@/types/billing';
import {
  INITIAL_BILLING_SUMMARY,
  INITIAL_INVOICES,
  INITIAL_PAYMENT_METHODS,
  INITIAL_BILLING_ADDRESS,
} from '@/data/mockBillingData';
import { BillingOverview } from '@/components/billing/BillingOverview';
import { InvoicesList } from '@/components/billing/InvoicesList';
import { InvoiceDetailModal } from '@/components/billing/InvoiceDetailModal';
import { PaymentMethodsList } from '@/components/billing/PaymentMethodsList';
import { AddPaymentMethodModal } from '@/components/billing/AddPaymentMethodModal';
import { BillingAddressCard } from '@/components/billing/BillingAddressCard';
import { EditBillingAddressModal } from '@/components/billing/EditBillingAddressModal';
import { useToast } from '@/components/ui/Toast';

export default function BillingPage() {
  const { toast } = useToast();

  // State
  const [summary, setSummary] = useState<BillingSummary>(INITIAL_BILLING_SUMMARY);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  const [billingAddress, setBillingAddress] = useState<BillingAddress>(INITIAL_BILLING_ADDRESS);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

  const handleDownloadAll = () => {
    toast(
      'Archive Prepared',
      'An archive containing all 4 tax receipts is being generated for download.',
      'info'
    );
  };

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col bg-[#f8f9fa] text-gray-900 overflow-hidden">
      {/* Top Subheader: Breadcrumb & Title */}
      <section className="shrink-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-3 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-0.5">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Customer Portal
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-700 font-semibold">Billing & Invoices</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Billing & Subscriptions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 max-w-xl truncate">
            Manage your cloud hosting payments, saved payment methods, and downloadable VAT tax receipts.
          </p>
        </div>

        {/* Quick Action: Download Statement / Receipts */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#e8702a]" />
            <span>Export Statement</span>
          </button>
        </div>
      </section>

      {/* Main Single-Section Grid */}
      <main className="flex-1 min-h-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-2.5 flex flex-col gap-3.5 overflow-hidden">
        {/* Top Active Subscription Overview */}
        <BillingOverview
          summary={summary}
          onCreditUpdated={(newCredit) => setSummary({ ...summary, creditBalance: newCredit })}
        />

        {/* Lower Two-Column Grid filling the viewport */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3.5 overflow-hidden">
          {/* Left Column (2 Cols): Invoices List */}
          <div className="lg:col-span-2 flex flex-col min-h-0 overflow-hidden">
            <InvoicesList
              invoices={invoices}
              onViewInvoice={(inv) => setSelectedInvoice(inv)}
            />
          </div>

          {/* Right Column (1 Col): Payment Methods + Billing Address */}
          <div className="flex flex-col gap-3.5 overflow-y-auto pr-0.5 min-h-0">
            <PaymentMethodsList
              paymentMethods={paymentMethods}
              onAddClick={() => setIsAddCardOpen(true)}
              onMethodsUpdated={(methods) => setPaymentMethods(methods)}
            />

            <BillingAddressCard
              address={billingAddress}
              onEditClick={() => setIsEditAddressOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Pinned Bottom Status Bar */}
      <footer className="shrink-0 border-t border-gray-200/80 bg-white/70 backdrop-blur-xs py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>PCI-DSS Level 1 Secure Vault • 256-Bit SSL Encrypted Billing</span>
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
      />

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onMethodAdded={(newMethod) => {
          let updated = [...paymentMethods];
          if (newMethod.isDefault) {
            updated = updated.map((pm) => ({ ...pm, isDefault: false }));
          }
          setPaymentMethods([newMethod, ...updated]);
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
