'use client';

import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { Invoice, BillingAddress } from '@/types/billing';
import { useToast } from '@/components/ui/Toast';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  billingAddress: BillingAddress;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  billingAddress,
  onClose,
}) => {
  const { toast } = useToast();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast(
      'Download Started',
      `Downloading official PDF receipt for ${invoice.invoiceNumber}...`,
      'info'
    );
  };

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
        <div className="shrink-0 flex items-center justify-between pb-4 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <FileText className="w-4 h-4 text-[#e8702a]" />
            <span>Tax Invoice / Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#fcf5f1] hover:bg-[#faeae1] text-[#e8702a] border border-[#e8702a]/20 transition-colors cursor-pointer"
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
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
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
                <span className="text-xs text-gray-500">Date: {invoice.date}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Paid</span>
                </span>
              </div>
            </div>
          </div>

          {/* Billed From & Billed To Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-gray-50 border border-gray-200/70 text-xs">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block mb-1">
                Supplier
              </span>
              <p className="font-bold text-gray-900">Server Salad S.A.</p>
              <p className="text-gray-600">2-4, Rue Edmond Reuter</p>
              <p className="text-gray-600">L-5326 Contern, Luxembourg</p>
              <p className="text-gray-500 mt-1 font-mono">VAT ID: LU-28491029</p>
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 block mb-1">
                Billed To
              </span>
              <p className="font-bold text-gray-900">{billingAddress.companyName}</p>
              <p className="text-gray-600">{billingAddress.contactName}</p>
              <p className="text-gray-600">{billingAddress.addressLine1}</p>
              <p className="text-gray-600">
                {billingAddress.postalCode} {billingAddress.city}, {billingAddress.country}
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

          {/* Summary Totals */}
          <div className="flex flex-col items-end space-y-1.5 text-xs pr-2">
            <div className="flex justify-between w-60 py-1 text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono font-medium">${invoice.subtotal.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between w-60 py-1 text-gray-600 border-b border-gray-100 pb-1.5">
              <span>VAT / Tax (0% Reverse Charge)</span>
              <span className="font-mono font-medium">$0.00 USD</span>
            </div>
            <div className="flex justify-between w-60 pt-1 text-sm font-bold text-gray-900">
              <span>Total Paid</span>
              <span className="font-mono text-[#e8702a]">${invoice.total.toFixed(2)} USD</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Paid via {invoice.paymentMethodSummary}
            </p>
          </div>

          {/* Legal Reverse Charge Note */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60 text-[11px] text-gray-500 leading-relaxed">
            <span className="font-bold text-gray-700">Tax Note:</span> In accordance with EU Council
            Directive 2006/112/EC, reverse charge applies to B2B electronic cloud hosting services provided
            to registered VAT entities.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 pt-4 border-t border-gray-100 flex items-center justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-gray-900 hover:bg-black text-white transition-colors cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
