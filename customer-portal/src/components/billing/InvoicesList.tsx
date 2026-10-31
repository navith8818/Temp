'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Mail,
  CreditCard,
  Ban,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Invoice, InvoiceStatus } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface InvoicesListProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  onPayInvoice: (invoice: Invoice) => void;
  onCancelInvoice: (invoiceId: string) => void;
  initialFilter?: string;
}

export const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  onViewInvoice,
  onPayInvoice,
  onCancelInvoice,
  initialFilter = 'all',
}) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter counts
  const counts = useMemo(() => {
    return {
      all: invoices.length,
      unpaid: invoices.filter((i) => i.status === 'unpaid' || i.status === 'partially_paid').length,
      overdue: invoices.filter((i) => i.status === 'overdue').length,
      paid: invoices.filter((i) => i.status === 'paid').length,
      draft: invoices.filter((i) => i.status === 'draft').length,
      refunded: invoices.filter((i) => i.status === 'refunded').length,
    };
  }, [invoices]);

  // Filtered and sorted invoices
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        // Status filter
        if (statusFilter === 'unpaid') {
          if (inv.status !== 'unpaid' && inv.status !== 'partially_paid') return false;
        } else if (statusFilter !== 'all') {
          if (inv.status !== statusFilter) return false;
        }

        // Search query
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.date.toLowerCase().includes(q) ||
          (inv.description && inv.description.toLowerCase().includes(q)) ||
          (inv.customerName && inv.customerName.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'amount_desc') return b.total - a.total;
        if (sortBy === 'amount_asc') return a.total - b.total;
        if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
  }, [invoices, statusFilter, search, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const handleDownload = (inv: Invoice) => {
    toast('Receipt Downloaded', `Downloaded PDF for ${inv.invoiceNumber}.`, 'success');
  };

  const handleResend = async (inv: Invoice) => {
    await billingService.resendInvoice(inv.id);
    toast('Invoice Sent', `Dispatched copy of ${inv.invoiceNumber} to your billing email.`, 'info');
  };

  const renderStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Paid</span>
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Unpaid</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>Overdue</span>
          </span>
        );
      case 'partially_paid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <span>Partially Paid</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <span>Refunded</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            <span>Cancelled</span>
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            <span>Draft</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs overflow-hidden">
      {/* Top Filter & Search Controls */}
      <div className="shrink-0 space-y-3 pb-3 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Invoices & Statements
            </h3>
            <p className="text-xs text-gray-500">
              Tax receipts, payment settlements, and pending hosting renewals
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search invoice # or plan..."
                className="w-44 sm:w-56 pl-8 pr-3 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8702a] transition-colors"
              />
            </div>

            {/* Sort Toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:border-[#e8702a] cursor-pointer"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 text-xs">
          {[
            { id: 'all', label: 'All Invoices', count: counts.all },
            { id: 'unpaid', label: 'Unpaid', count: counts.unpaid },
            { id: 'overdue', label: 'Overdue', count: counts.overdue },
            { id: 'paid', label: 'Paid', count: counts.paid },
            { id: 'refunded', label: 'Refunded', count: counts.refunded },
            { id: 'draft', label: 'Drafts', count: counts.draft },
          ].map((chip) => {
            const isActive = statusFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setStatusFilter(chip.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-2xs'
                    : 'bg-gray-100 hover:bg-gray-200/70 text-gray-600'
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#e8702a] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Column Titles Bar */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 shrink-0">
        <div className="col-span-4">Invoice & Status</div>
        <div className="col-span-3">Description & Line Items</div>
        <div className="col-span-2">Billing Dates</div>
        <div className="col-span-3 text-right">Amount & Quick Actions</div>
      </div>

      {/* Invoice Rows List */}
      {paginatedInvoices.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 pr-1">
          {paginatedInvoices.map((inv) => {
            const hasBalance = inv.outstandingBalance > 0 && inv.status !== 'cancelled';
            const isCancellable = inv.status === 'unpaid' || inv.status === 'draft';

            return (
              <div
                key={inv.id}
                className="py-3.5 px-3 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-4 items-center hover:bg-gray-50/70 rounded-2xl transition-colors"
              >
                {/* Col 1-4: Invoice Number, Badge, Customer */}
                <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                    <FileText className="w-4 h-4 text-[#e8702a]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-gray-900 font-mono">
                        {inv.invoiceNumber}
                      </span>
                      {renderStatusBadge(inv.status)}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                      {inv.customerName || 'Sarah Jenkins'}
                    </p>
                  </div>
                </div>

                {/* Col 5-7: Description & Plan */}
                <div className="md:col-span-3 min-w-0 text-xs">
                  <p className="font-medium text-gray-900 truncate">
                    {inv.description || inv.items[0]?.description}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {inv.items.length} item(s) • {inv.paymentMethodSummary || 'Online Settlement'}
                  </p>
                </div>

                {/* Col 8-9: Billing Dates */}
                <div className="md:col-span-2 min-w-0 text-xs space-y-0.5">
                  <div className="text-[11px] text-gray-500">
                    Issued: <span className="text-gray-700">{inv.date}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Due: <strong className={hasBalance ? 'text-[#e8702a]' : 'text-gray-800'}>{inv.dueDate}</strong>
                  </div>
                </div>

                {/* Col 10-12: Amounts & Quick Actions */}
                <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <div className="font-mono text-sm font-bold text-gray-900">
                      ${inv.total.toFixed(2)} USD
                    </div>
                    {hasBalance ? (
                      <div className="text-[11px] font-mono text-[#e8702a] font-semibold">
                        Due: ${inv.outstandingBalance.toFixed(2)}
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-700 font-medium">
                        Paid: ${inv.paidAmount.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5">
                    {/* Pay Now Button if has balance */}
                    {hasBalance && (
                      <button
                        type="button"
                        onClick={() => onPayInvoice(inv)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay</span>
                      </button>
                    )}

                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => onViewInvoice(inv)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                      title="View details receipt"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {/* Download PDF */}
                    <button
                      type="button"
                      onClick={() => handleDownload(inv)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-[#e8702a] hover:bg-[#fcf5f1] transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Resend Receipt Email */}
                    <button
                      type="button"
                      onClick={() => handleResend(inv)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer hidden sm:inline-flex"
                      title="Resend to email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>

                    {/* Cancel button if draft / unpaid */}
                    {isCancellable && (
                      <button
                        type="button"
                        onClick={() => onCancelInvoice(inv.id)}
                        className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Cancel invoice"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <FileText className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-700">No invoices match your filter</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? `No records found matching "${search}".` : 'Try selecting another status tab.'}
          </p>
        </div>
      )}

      {/* Pagination Bar */}
      {filteredInvoices.length > itemsPerPage && (
        <div className="shrink-0 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{' '}
            {filteredInvoices.length} invoices
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-gray-800">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};