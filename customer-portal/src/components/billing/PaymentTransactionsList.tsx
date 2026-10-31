'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  X,
} from 'lucide-react';
import { PaymentTransaction, Invoice } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface PaymentTransactionsListProps {
  transactions: PaymentTransaction[];
  onViewInvoice: (invoiceNumber: string) => void;
  onRequestRefund: (transaction: PaymentTransaction) => void;
  onTransactionUpdated: (updatedTxn: PaymentTransaction) => void;
}

export const PaymentTransactionsList: React.FC<PaymentTransactionsListProps> = ({
  transactions,
  onViewInvoice,
  onRequestRefund,
  onTransactionUpdated,
}) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState<PaymentTransaction | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.transactionId.toLowerCase().includes(q) ||
        t.invoiceNumber.toLowerCase().includes(q) ||
        t.gatewayRefId.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q)
      );
    });
  }, [transactions, statusFilter, search]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleRetry = async (txn: PaymentTransaction) => {
    setRetryingId(txn.id);
    try {
      const res = await billingService.retryPayment(txn.id);
      if (res.success) {
        toast('Payment Retried', res.message, 'success');
        const updated: PaymentTransaction = {
          ...txn,
          status: 'successful',
          canRetry: false,
          date: 'Just now (Retried)',
        };
        onTransactionUpdated(updated);
      }
    } catch {
      toast('Retry Failed', 'Payment gateway declined the authorization.', 'error');
    } finally {
      setRetryingId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'successful':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Successful</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>Failed</span>
          </span>
        );
      case 'refund_pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Refund Pending</span>
          </span>
        );
      case 'refunded':
      case 'partially_refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <RefreshCw className="w-3 h-3 text-purple-500" />
            <span>{status === 'partially_refunded' ? 'Partially Refunded' : 'Refunded'}</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs overflow-hidden">
      {/* Header & Filter Bar */}
      <div className="shrink-0 space-y-3 pb-3 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
              Payment Transactions & Gateways
            </h3>
            <p className="text-xs text-gray-500">
              Electronic payment verifications, gateway reference tokens, and refund records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search txn ID or invoice #..."
                className="w-48 sm:w-56 pl-8 pr-3 py-1 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e8702a]"
              />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'successful', label: 'Successful' },
            { id: 'failed', label: 'Failed' },
            { id: 'refund_pending', label: 'Refund Pending' },
            { id: 'refunded', label: 'Refunded' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                setStatusFilter(chip.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === chip.id
                  ? 'bg-gray-900 text-white shadow-2xs'
                  : 'bg-gray-100 hover:bg-gray-200/70 text-gray-600'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Rows */}
      {paginatedTransactions.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 pr-1">
          {paginatedTransactions.map((txn) => (
            <div
              key={txn.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 rounded-2xl px-2.5 transition-colors"
            >
              {/* Left Column: Txn ID, Gateway Ref, Invoice */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4 text-[#e8702a]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-gray-900 font-mono">
                      {txn.transactionId}
                    </span>
                    {renderStatusBadge(txn.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5 flex-wrap">
                    <span className="font-semibold text-gray-800">{txn.gateway}</span>
                    <span className="font-mono text-[11px] text-gray-400">Ref: {txn.gatewayRefId}</span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => onViewInvoice(txn.invoiceNumber)}
                      className="font-mono text-[#e8702a] hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <span>{txn.invoiceNumber}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {txn.paymentMethod} • {txn.date}
                  </div>
                </div>
              </div>

              {/* Right Column: Amount & Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-gray-900">
                    ${txn.amount.toFixed(2)} USD
                  </div>
                  {txn.refundAmount && (
                    <div className="text-[11px] text-purple-700 font-semibold">
                      Refund: ${txn.refundAmount.toFixed(2)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Retry Button if Failed */}
                  {txn.canRetry && (
                    <button
                      type="button"
                      onClick={() => handleRetry(txn)}
                      disabled={retryingId === txn.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${retryingId === txn.id ? 'animate-spin' : ''}`} />
                      <span>Retry</span>
                    </button>
                  )}

                  {/* Request Refund if Successful */}
                  {txn.status === 'successful' && (
                    <button
                      type="button"
                      onClick={() => onRequestRefund(txn)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                      title="Request refund on this transaction"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                      <span>Refund</span>
                    </button>
                  )}

                  {/* View Details */}
                  <button
                    type="button"
                    onClick={() => setSelectedTxn(txn)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title="View gateway verification details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <CreditCard className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-700">No transactions found</p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? `No payments match "${search}".` : 'Payment history will appear here once charges settle.'}
          </p>
        </div>
      )}

      {/* Pagination Bar */}
      {filteredTransactions.length > itemsPerPage && (
        <div className="shrink-0 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
            {filteredTransactions.length} transactions
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

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setSelectedTxn(null)} />

          <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 text-gray-900 z-10 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Transaction Verification</h3>
                  <p className="text-[11px] text-gray-500 font-mono">{selectedTxn.transactionId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span>{renderStatusBadge(selectedTxn.status)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Settled:</span>
                  <span className="font-mono font-bold text-gray-900">${selectedTxn.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Associated Invoice:</span>
                  <span className="font-mono font-bold text-[#e8702a]">{selectedTxn.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Gateway:</span>
                  <span className="font-semibold text-gray-900">{selectedTxn.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gateway Ref ID:</span>
                  <span className="font-mono text-gray-900">{selectedTxn.gatewayRefId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Method:</span>
                  <span className="text-gray-800">{selectedTxn.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="text-gray-800">{selectedTxn.date}</span>
                </div>
              </div>

              {/* Security Signatures */}
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>HMAC-MD5 Signature Verified</span>
                </div>
                <p className="text-emerald-700">
                  PayHere IPN webhook confirmed. Idempotency token verified. Zero raw card PAN stored.
                </p>
              </div>

              {selectedTxn.refundReason && (
                <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-200 text-[11px]">
                  <strong className="text-purple-900 block mb-0.5">Refund Notes:</strong>
                  <p className="text-purple-800">{selectedTxn.refundReason}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="px-5 py-2 rounded-full font-semibold bg-gray-900 hover:bg-black text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
