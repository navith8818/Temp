'use client';

import React, { useState } from 'react';
import { FileText, Download, Eye, CheckCircle2, Search } from 'lucide-react';
import { Invoice } from '@/types/billing';
import { useToast } from '@/components/ui/Toast';

interface InvoicesListProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
}

export const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, onViewInvoice }) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.date.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (inv: Invoice) => {
    toast(
      'Receipt Downloaded',
      `Downloaded receipt for ${inv.invoiceNumber} (${inv.date}).`,
      'success'
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Billing History & Invoices
          </h3>
          <p className="text-xs text-gray-500">
            Past payments and downloadable VAT-compliant tax receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="w-40 sm:w-48 pl-8 pr-3 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8702a] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Invoices List / Table */}
      {filteredInvoices.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 pr-1">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 rounded-xl px-2 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-600 shrink-0 mt-0.5 sm:mt-0">
                  <FileText className="w-4 h-4 text-[#e8702a]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-gray-900 font-mono">
                      {inv.invoiceNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{inv.status}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{inv.date}</span>
                    <span>•</span>
                    <span className="text-gray-400">{inv.paymentMethodSummary}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                <span className="font-mono text-sm font-bold text-gray-900">
                  ${inv.amount.toFixed(2)} USD
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onViewInvoice(inv)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title="View invoice receipt"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(inv)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-[#e8702a] hover:bg-[#fcf5f1] transition-colors cursor-pointer"
                    title="Download receipt PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <FileText className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-700">No invoices found</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? `No invoices match "${search}"` : 'Invoices will appear here once generated.'}
          </p>
        </div>
      )}
    </div>
  );
};
