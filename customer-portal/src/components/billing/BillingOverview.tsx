'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Calendar,
  Gift,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
  Receipt,
  Layers,
} from 'lucide-react';
import { Invoice, Subscription, PaymentTransaction } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface BillingOverviewProps {
  invoices: Invoice[];
  subscriptions: Subscription[];
  transactions: PaymentTransaction[];
  creditBalance: number;
  onCreditUpdated: (newCredit: number) => void;
  onFilterByStatus?: (status: string) => void;
  onNavigateTab?: (tab: 'invoices' | 'transactions' | 'subscriptions' | 'discounts') => void;
}

export const BillingOverview: React.FC<BillingOverviewProps> = ({
  invoices,
  subscriptions,
  transactions,
  creditBalance,
  onCreditUpdated,
  onFilterByStatus,
  onNavigateTab,
}) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Compute live metrics dynamically from actual data
  const metrics = useMemo(() => {
    let totalOutstanding = 0;
    let totalPaid = 0;
    let overdueAmount = 0;
    let unpaidInvoicesCount = 0;
    let overdueInvoicesCount = 0;

    for (const inv of invoices) {
      totalPaid += inv.paidAmount || 0;
      if (inv.status === 'unpaid' || inv.status === 'overdue' || inv.status === 'partially_paid') {
        totalOutstanding += inv.outstandingBalance || 0;
        unpaidInvoicesCount += 1;
      }
      if (inv.status === 'overdue') {
        overdueAmount += inv.outstandingBalance || 0;
        overdueInvoicesCount += 1;
      }
    }

    const activeSubs = subscriptions.filter((s) => s.status === 'active');
    const upcomingPaymentsTotal = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalOutstanding,
      totalPaid,
      overdueAmount,
      unpaidInvoicesCount,
      overdueInvoicesCount,
      activeSubsCount: activeSubs.length,
      upcomingPaymentsTotal,
      nextChargeDate: activeSubs[0]?.nextBillingDate || 'Nov 15, 2026',
      primaryPlan: activeSubs[0]?.serviceName || 'Cloud VPS Cluster',
    };
  }, [invoices, subscriptions]);

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
    <section className="shrink-0 rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs">
      {/* 4 Essential Calculated Financial KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Outstanding / Due */}
        <div
          className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
            metrics.totalOutstanding > 0
              ? 'bg-[#fcf5f1] border-[#e8702a]/30'
              : 'bg-gray-50/70 border-gray-200/70'
          }`}
        >
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Outstanding Balance</span>
            <AlertCircle
              className={`w-3.5 h-3.5 ${metrics.totalOutstanding > 0 ? 'text-[#e8702a]' : 'text-gray-400'}`}
            />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-gray-900">
            ${metrics.totalOutstanding.toFixed(2)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
            {metrics.unpaidInvoicesCount > 0 ? (
              <span className="text-[#e8702a] font-semibold">
                {metrics.unpaidInvoicesCount} unpaid invoice{metrics.unpaidInvoicesCount > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All settled
              </span>
            )}
            {metrics.overdueAmount > 0 && (
              <span className="text-red-600 font-bold">(${metrics.overdueAmount.toFixed(2)} overdue)</span>
            )}
          </div>
        </div>

        {/* Metric 2: Total Spent / Settled */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/70">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Paid (YTD)</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-gray-900">
            ${metrics.totalPaid.toFixed(2)}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5 truncate">
            {transactions.filter((t) => t.status === 'successful').length} successful payments via PayHere
          </div>
        </div>

        {/* Metric 3: Active Subscriptions & Upcoming Renewal */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/70">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Renewal</span>
            <Calendar className="w-3.5 h-3.5 text-[#e8702a]" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-gray-900">
            ${metrics.upcomingPaymentsTotal.toFixed(2)}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5 truncate">
            {metrics.nextChargeDate} • {metrics.activeSubsCount} active service{metrics.activeSubsCount > 1 ? 's' : ''}
          </div>
        </div>

        {/* Metric 4: Account Credit Balance & Promo */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#fcf5f1]/60 border border-[#e8702a]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e8702a]">
              Available Credits
            </span>
            <Gift className="w-3.5 h-3.5 text-[#e8702a]" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-700">
            ${creditBalance.toFixed(2)} USD
          </div>

          {showPromoInput ? (
            <form onSubmit={handleRedeem} className="flex items-center gap-1 mt-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Voucher code"
                disabled={isRedeeming}
                autoFocus
                className="flex-1 min-w-0 px-2 py-0.5 text-xs rounded-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-400 uppercase font-mono focus:outline-none focus:border-[#e8702a]"
              />
              <button
                type="submit"
                disabled={isRedeeming}
                className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#e8702a] text-white hover:bg-[#d2611f] disabled:opacity-50 cursor-pointer"
              >
                {isRedeeming ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
              </button>
              <button
                type="button"
                onClick={() => setShowPromoInput(false)}
                className="text-gray-400 hover:text-gray-700 text-xs px-1"
              >
                ✕
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between mt-0.5 text-[11px]">
              <span className="text-gray-500">Auto-applies at renewal</span>
              <button
                type="button"
                onClick={() => setShowPromoInput(true)}
                className="font-semibold text-[#e8702a] hover:underline cursor-pointer"
              >
                + Add Code
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
