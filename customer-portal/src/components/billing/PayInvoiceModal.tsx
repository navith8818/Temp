'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Wallet, AlertCircle } from 'lucide-react';
import { Invoice, PaymentMethod } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface PayInvoiceModalProps {
  invoice: Invoice | null;
  paymentMethods: PaymentMethod[];
  creditBalance: number;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (invoiceId: string, paidAmount: number, methodUsed: string) => void;
}

export const PayInvoiceModal: React.FC<PayInvoiceModalProps> = ({
  invoice,
  paymentMethods,
  creditBalance,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<'SAVED_CARD' | 'PAYHERE_HOSTED' | 'CREDIT_BALANCE'>('SAVED_CARD');
  const [selectedCardId, setSelectedCardId] = useState(paymentMethods[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !invoice) return null;

  const balanceDue = invoice.outstandingBalance || invoice.total;
  const canUseCredit = creditBalance >= balanceDue;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await billingService.payInvoice({
        invoiceId: invoice.id,
        amount: balanceDue,
        method: selectedMethod,
        cardId: selectedCardId,
      });

      if (res.success) {
        toast('Payment Verified', res.message, 'success');
        onPaymentSuccess(
          invoice.id,
          balanceDue,
          selectedMethod === 'CREDIT_BALANCE' ? 'Account Credit' : 'Visa •••• 4242 via PayHere'
        );
        onClose();
      }
    } catch {
      toast('Payment Failed', 'Gateway signature verification failed or declined.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={() => !isProcessing && onClose()} />

      <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 text-gray-900 z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Settle Invoice</h3>
            <p className="text-xs text-gray-500 font-mono">{invoice.invoiceNumber} • {invoice.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePay} className="pt-4 space-y-4 text-xs">
          {/* Amount Due Card */}
          <div className="p-3.5 rounded-2xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Total Outstanding
              </span>
              <span className="text-xl font-bold font-mono text-gray-900">
                ${balanceDue.toFixed(2)} USD
              </span>
            </div>
            <div className="text-right text-[11px] text-gray-500">
              <span>Due: {invoice.dueDate}</span>
              {invoice.status === 'overdue' && (
                <span className="block text-red-600 font-bold uppercase text-[10px]">Overdue</span>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700">Select Payment Method</label>

            {/* Option 1: Saved Tokenized Card */}
            {paymentMethods.length > 0 && (
              <label
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'SAVED_CARD'
                    ? 'border-[#e8702a] bg-[#fcf5f1]/40 ring-1 ring-[#e8702a]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedMethod === 'SAVED_CARD'}
                    onChange={() => setSelectedMethod('SAVED_CARD')}
                    className="accent-[#e8702a]"
                  />
                  <div>
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span>Saved Card ({paymentMethods[0].brand.toUpperCase()})</span>
                      <span className="font-mono text-[11px]">•••• {paymentMethods[0].last4}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">Tokenized via PayHere PCI Vault</span>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </label>
            )}

            {/* Option 2: PayHere Hosted Checkout */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'PAYHERE_HOSTED'
                  ? 'border-[#e8702a] bg-[#fcf5f1]/40 ring-1 ring-[#e8702a]'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === 'PAYHERE_HOSTED'}
                  onChange={() => setSelectedMethod('PAYHERE_HOSTED')}
                  className="accent-[#e8702a]"
                />
                <div>
                  <div className="font-bold text-gray-900">PayHere Hosted Checkout</div>
                  <span className="text-[11px] text-gray-500">Credit / Debit Card or Local Payment Gateway</span>
                </div>
              </div>
              <CreditCard className="w-4 h-4 text-[#e8702a]" />
            </label>

            {/* Option 3: Account Credit Balance */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'CREDIT_BALANCE'
                  ? 'border-[#e8702a] bg-[#fcf5f1]/40 ring-1 ring-[#e8702a]'
                  : 'border-gray-200 hover:bg-gray-50'
              } ${!canUseCredit ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="paymentMethod"
                  disabled={!canUseCredit}
                  checked={selectedMethod === 'CREDIT_BALANCE'}
                  onChange={() => setSelectedMethod('CREDIT_BALANCE')}
                  className="accent-[#e8702a]"
                />
                <div>
                  <div className="font-bold text-gray-900">Account Credit Balance</div>
                  <span className="text-[11px] text-gray-500">
                    Available: ${creditBalance.toFixed(2)} USD
                  </span>
                </div>
              </div>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </label>
          </div>

          <p className="text-[11px] text-gray-400 leading-tight">
            Transactions are encrypted with 256-Bit SSL. PayHere verifies HMAC-MD5 signatures server-to-server.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-full font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authorize & Pay ${balanceDue.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
