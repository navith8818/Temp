'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Clock,
  ShieldCheck,
  Ban,
  ArrowRight,
} from 'lucide-react';
import { Invoice, BillingAddress } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  billingAddress: BillingAddress;
  onClose: () => void;
  onPayClick?: (invoice: Invoice) => void;
  onCancelInvoice?: (invoiceId: string) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  billingAddress,
  onClose,
  onPayClick,
  onCancelInvoice,
}) => {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast(
      'Download Started',
      `Downloading official PDF tax receipt for ${invoice.invoiceNumber}...`,
      'info'
    );
  };

  const handleResend = async () => {
    setIsResending(true);
    await billingService.resendInvoice(invoice.id);
    setIsResending(false);
    toast(
      'Receipt Dispatched',
      `Invoice ${invoice.invoiceNumber} was resent to ${billingAddress.email}.`,
      'success'
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Paid</span>
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Unpaid</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>Overdue</span>
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <span>Partially Paid</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <span>Refunded</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            <span>Cancelled</span>
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            <span>Draft</span>
          </span>
        );
    }
  };

  const isPayable = invoice.outstandingBalance > 0 && invoice.status !== 'cancelled';
  const isCancellable = (invoice.status === 'unpaid' || invoice.status === 'draft') && onCancelInvoice;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-details-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 sm:p-8 text-gray-900 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Top Actions Bar (No-print) */}
        <div className="shrink-0 flex items-center justify-between pb-4 border-b border-gray-100 print:hidden flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <FileText className="w-4 h-4 text-[#e8702a]" />
            <span>Official Tax Invoice & Receipt</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isResending ? 'Sending...' : 'Email'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#fcf5f1] hover:bg-[#faeae1] text-[#e8702a] border border-[#e8702a]/20 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors ml-1 cursor-pointer"
              aria-label="Close invoice receipt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-1">
          {/* Brand & Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 256 256"
                  fill="#e8702a"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
                </svg>
              </div>
              <div>
                <span className="text-gray-900 text-base font-bold tracking-tight font-sans">
                  Server Salad
                </span>
                <span className="text-xs font-playfair italic text-[#e8702a] ml-1.5 font-medium">
                  Cloud Services S.A.
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <h3 id="invoice-details-title" className="text-lg font-bold text-gray-900 font-mono">
                {invoice.invoiceNumber}
              </h3>
              <div className="flex items-center sm:justify-end gap-2 mt-1">
                <span className="text-xs text-gray-500">Issued: {invoice.date}</span>
                {getStatusBadge(invoice.status)}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Due Date: <strong className="text-gray-800">{invoice.dueDate}</strong>
              </div>
            </div>
          </div>

          {/* Billed From & Billed To Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200/70 text-xs">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block mb-1">
                Supplier & Operator
              </span>
              <p className="font-bold text-gray-900">Server Salad S.A.</p>
              <p className="text-gray-600">2-4, Rue Edmond Reuter</p>
              <p className="text-gray-600">L-5326 Contern, Luxembourg</p>
              <p className="text-gray-500 mt-1 font-mono">VAT ID: LU-28491029</p>
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block mb-1">
                Billed To (Customer)
              </span>
              <p className="font-bold text-gray-900">{billingAddress.companyName}</p>
              <p className="text-gray-600">{billingAddress.contactName} ({billingAddress.email})</p>
              {billingAddress.phone && <p className="text-gray-600 font-mono text-[11px]">{billingAddress.phone}</p>}
              <p className="text-gray-600">
                {billingAddress.addressLine1}, {billingAddress.postalCode} {billingAddress.city}, {billingAddress.country}
              </p>
              {billingAddress.vatId && (
                <p className="text-gray-500 mt-1 font-mono">VAT ID: {billingAddress.vatId}</p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5">Item Description</th>
                  <th className="px-4 py-2.5 text-center">Qty</th>
                  <th className="px-4 py-2.5 text-right">Unit Price</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="text-gray-900">
                    <td className="px-4 py-3 font-medium">
                      {item.description}
                      <span className="block text-[11px] text-gray-500 mt-0.5">
                        Billing Period: {invoice.period}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Totals & Balances */}
          <div className="flex flex-col items-end space-y-1.5 text-xs pr-2">
            <div className="flex justify-between w-64 py-0.5 text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono font-medium">${invoice.subtotal.toFixed(2)} USD</span>
            </div>
            {invoice.discountAmount && invoice.discountAmount > 0 && (
              <div className="flex justify-between w-64 py-0.5 text-emerald-600">
                <span>Discount / Promo</span>
                <span className="font-mono font-medium">-${invoice.discountAmount.toFixed(2)} USD</span>
              </div>
            )}
            <div className="flex justify-between w-64 py-0.5 text-gray-600 border-b border-gray-100 pb-1.5">
              <span>VAT / Tax (0% Reverse Charge)</span>
              <span className="font-mono font-medium">$0.00 USD</span>
            </div>
            <div className="flex justify-between w-64 pt-1 text-sm font-bold text-gray-900">
              <span>Total Invoice Amount</span>
              <span className="font-mono">${invoice.total.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between w-64 py-0.5 text-xs text-emerald-700">
              <span>Amount Paid</span>
              <span className="font-mono font-bold">-${invoice.paidAmount.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between w-64 pt-1.5 border-t border-gray-200 text-sm font-bold text-gray-900">
              <span>Outstanding Balance</span>
              <span className={`font-mono ${invoice.outstandingBalance > 0 ? 'text-[#e8702a]' : 'text-emerald-700'}`}>
                ${invoice.outstandingBalance.toFixed(2)} USD
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Method: {invoice.paymentMethodSummary}
            </p>
          </div>

          {/* Associated Payment Transactions History */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#e8702a]" />
              <span>Associated Payment Transactions</span>
            </h4>
            {invoice.paymentHistory && invoice.paymentHistory.length > 0 ? (
              <div className="space-y-2">
                {invoice.paymentHistory.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900">{txn.transactionId}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {txn.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                        {txn.gateway} (Ref: {txn.gatewayRefId}) • {txn.date}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gray-900">${txn.amount.toFixed(2)} USD</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center text-[11px] text-gray-400">
                No electronic payment settlements logged yet for this invoice.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="shrink-0 pt-4 border-t border-gray-100 flex items-center justify-between print:hidden">
          <div>
            {isCancellable && (
              <button
                type="button"
                onClick={() => {
                  onCancelInvoice(invoice.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Unpaid Invoice</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Close
            </button>

            {isPayable && onPayClick && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPayClick(invoice);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-xs transition-all cursor-pointer"
              >
                <span>Pay Now (${invoice.outstandingBalance.toFixed(2)})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
