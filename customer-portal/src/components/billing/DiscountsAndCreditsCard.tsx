'use client';

import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  Clock,
  RefreshCw,
  Wallet,
  Sparkles,
  Tag,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { CreditTransaction, Coupon, RefundRequest } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface DiscountsAndCreditsCardProps {
  creditBalance: number;
  creditLedger: CreditTransaction[];
  coupons: Coupon[];
  refundRequests: RefundRequest[];
  onCreditUpdated: (newBalance: number) => void;
}

export const DiscountsAndCreditsCard: React.FC<DiscountsAndCreditsCardProps> = ({
  creditBalance,
  creditLedger,
  coupons,
  refundRequests,
  onCreditUpdated,
}) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast('Code Copied', `Voucher code ${code} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsRedeeming(true);
    try {
      const res = await billingService.redeemPromoCode(promoCode);
      if (res.success) {
        toast('Credit Applied', res.message, 'success');
        onCreditUpdated(creditBalance + res.creditAdded);
        setPromoCode('');
      } else {
        toast('Invalid Code', res.message, 'error');
      }
    } catch {
      toast('Redemption Failed', 'Failed to validate promo voucher.', 'error');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="shrink-0 pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
            Account Credits, Discounts & Refund Audits
          </h3>
          <p className="text-xs text-gray-500">
            Pre-funded credits, active promotional coupons, and payment gateway refund tickets
          </p>
        </div>

        {/* Current Balance Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20">
          <Wallet className="w-3.5 h-3.5 text-[#e8702a]" />
          <span className="text-xs text-gray-600">Balance:</span>
          <span className="text-sm font-bold font-mono text-[#e8702a]">
            ${creditBalance.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-3 pr-1 text-xs">
        {/* Voucher Redemption Box */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80">
          <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-[#e8702a]" />
            <span>Redeem Promotional Coupon / Voucher</span>
          </h4>
          <p className="text-[11px] text-gray-500 mb-2">
            Enter a promotional code to add credits or apply package renewal discounts.
          </p>

          <form onSubmit={handleRedeem} className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="e.g. SALAD10, WELCOME25, VIP50"
              disabled={isRedeeming}
              className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 font-mono uppercase focus:outline-none focus:border-[#e8702a]"
            />
            <button
              type="submit"
              disabled={isRedeeming}
              className="px-4 py-1.5 rounded-full font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isRedeeming ? 'Applying...' : 'Redeem Code'}
            </button>
          </form>
        </div>

        {/* Active Promotional Coupons */}
        <div>
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-gray-500" />
            <span>Available Promotional Discounts</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {coupons.map((cp) => (
              <div
                key={cp.id}
                className="p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-[#e8702a]/40 shadow-2xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-gray-900 text-xs px-2 py-0.5 rounded-md bg-[#fcf5f1] border border-[#e8702a]/20 text-[#e8702a]">
                      {cp.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cp.code)}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Copy code"
                    >
                      {copiedCode === cp.code ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-tight mb-2">
                    {cp.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1.5 border-t border-gray-100">
                  <span>Expires {cp.expiresAt}</span>
                  <span className="text-emerald-700 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Transaction Ledger */}
        <div>
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Credit Balance Audit Ledger</span>
          </h4>
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-3.5 py-2">Date & Time</th>
                  <th className="px-3.5 py-2">Type / Source</th>
                  <th className="px-3.5 py-2">Description</th>
                  <th className="px-3.5 py-2 text-right">Adjustment</th>
                  <th className="px-3.5 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {creditLedger.map((cr) => (
                  <tr key={cr.id} className="hover:bg-gray-50/50">
                    <td className="px-3.5 py-2.5 text-gray-500 font-mono text-[11px]">{cr.date}</td>
                    <td className="px-3.5 py-2.5">
                      <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {cr.type}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-800 font-medium">{cr.description}</td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold">
                      <span className={cr.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {cr.amount >= 0 ? `+$${cr.amount.toFixed(2)}` : `-$${Math.abs(cr.amount).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono text-gray-700 font-semibold">
                      ${cr.balanceAfter.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refund Management & Gateway Status */}
        <div>
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>PayHere Gateway Refund Requests</span>
          </h4>
          {refundRequests.length > 0 ? (
            <div className="space-y-2">
              {refundRequests.map((ref) => (
                <div
                  key={ref.id}
                  className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900">{ref.transactionId}</span>
                      <span className="text-gray-400 font-mono text-[11px]">({ref.invoiceNumber})</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          ref.status === 'refunded'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ref.status === 'refunded' ? 'Settled to Card' : 'Pending Gateway Execution'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Reason: <span className="font-medium text-gray-800">{ref.reason}</span> • Logged {ref.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-purple-700">
                      ${ref.amount.toFixed(2)} USD
                    </span>
                    <span className="block text-[10px] text-gray-400">PayHere Gateway Reversal</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-xs py-2">No active refund tickets logged.</p>
          )}
        </div>
      </div>
    </div>
  );
};
