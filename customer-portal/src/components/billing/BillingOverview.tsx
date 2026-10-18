'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Calendar, Gift, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { BillingSummary } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface BillingOverviewProps {
  summary: BillingSummary;
  onCreditUpdated: (newCredit: number) => void;
}

export const BillingOverview: React.FC<BillingOverviewProps> = ({ summary, onCreditUpdated }) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsRedeeming(true);
    try {
      const res = await billingService.redeemPromoCode(promoCode);
      if (res.success) {
        toast('Credit Applied', res.message, 'success');
        onCreditUpdated(summary.creditBalance + res.creditAdded);
        setPromoCode('');
        setShowPromoInput(false);
      } else {
        toast('Invalid Code', res.message, 'error');
      }
    } catch {
      toast('Error', 'Failed to redeem promo code.', 'error');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <section className="shrink-0 rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Active Plan & Price */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400">
            Active Subscription
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {summary.currentPlanName}
            </h2>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-semibold text-gray-900">
              ${summary.currentPlanPrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">/{summary.billingCycle}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              {summary.autoRenew ? 'Auto-Renew' : 'Manual'}
            </span>
          </div>
        </div>

        {/* Next Billing Date */}
        <div className="space-y-1 md:border-l md:border-gray-100 md:pl-6">
          <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400">
            Next Scheduled Charge
          </span>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Calendar className="w-4 h-4 text-[#e8702a]" />
            <span>{summary.nextBillingDate}</span>
          </div>
          <p className="text-xs text-gray-500">
            Estimated charge: <strong className="text-gray-900">${summary.currentPlanPrice.toFixed(2)} USD</strong>
          </p>
        </div>

        {/* Account Credits & Promo Code */}
        <div className="space-y-2 md:border-l md:border-gray-100 md:pl-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400">
              Account Credit Balance
            </span>
            <span className="text-xs font-bold text-emerald-600">
              ${summary.creditBalance.toFixed(2)} USD
            </span>
          </div>

          {showPromoInput ? (
            <form onSubmit={handleRedeem} className="flex items-center gap-1.5 pt-0.5">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Try SALAD10"
                disabled={isRedeeming}
                autoFocus
                className="flex-1 px-3 py-1.5 text-xs rounded-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 uppercase font-mono focus:outline-none focus:border-[#e8702a]"
              />
              <button
                type="submit"
                disabled={isRedeeming}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white disabled:opacity-50 cursor-pointer transition-colors"
              >
                {isRedeeming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
              </button>
              <button
                type="button"
                onClick={() => setShowPromoInput(false)}
                className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-500">
                Credits apply automatically to future renewals.
              </p>
              <button
                type="button"
                onClick={() => setShowPromoInput(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#e8702a] hover:text-[#d2611f] transition-colors cursor-pointer shrink-0 ml-2"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Add Code</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
