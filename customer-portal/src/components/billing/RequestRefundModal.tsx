'use client';

import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { PaymentTransaction, RefundRequest } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface RequestRefundModalProps {
  transaction: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onRefundSubmitted: (newRequest: RefundRequest) => void;
}

export const RequestRefundModal: React.FC<RequestRefundModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onRefundSubmitted,
}) => {
  const { toast } = useToast();
  const [reason, setReason] = useState('Service adjustment / Billing correction');
  const [amount, setAmount] = useState(transaction ? transaction.amount.toString() : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid refund amount.');
      return;
    }
    if (numAmount > transaction.amount) {
      setError(`Refund amount cannot exceed the transaction amount ($${transaction.amount.toFixed(2)}).`);
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for the refund.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const refundReq = await billingService.submitRefundRequest({
        transactionId: transaction.transactionId,
        invoiceNumber: transaction.invoiceNumber,
        amount: numAmount,
        reason: reason.trim(),
      });

      toast('Refund Request Logged', `Refund of $${numAmount.toFixed(2)} USD queued for PayHere gateway settlement.`, 'info');
      onRefundSubmitted(refundReq);
      onClose();
    } catch {
      setError('Failed to initiate refund with payment gateway.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={() => !isSubmitting && onClose()} />

      <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 text-gray-900 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Request Payment Refund</h3>
              <p className="text-xs text-gray-500 font-mono">{transaction.transactionId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-3.5 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Associated Invoice:</span>
              <span className="font-mono font-bold text-gray-900">{transaction.invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Gateway:</span>
              <span className="font-medium text-gray-900">{transaction.gateway} ({transaction.gatewayRefId})</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Original Amount:</span>
              <span className="font-mono font-bold text-emerald-700">${transaction.amount.toFixed(2)} USD</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Refund Amount ($ USD) <span className="text-[#e8702a]">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-mono focus:bg-white focus:outline-none focus:border-[#e8702a]"
            />
            <p className="text-[11px] text-gray-400 mt-1">Full or partial refund up to original payment amount.</p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Reason for Refund <span className="text-[#e8702a]">*</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Explain why this refund is requested..."
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:border-[#e8702a]"
            />
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Note: Refunds are subject to payment gateway settlement rules (3-5 business days back to original card).
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting to Gateway...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submit Refund Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
