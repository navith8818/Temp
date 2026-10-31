'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Server,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  X,
  Layers,
} from 'lucide-react';
import { Subscription } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface SubscriptionsListProps {
  subscriptions: Subscription[];
  onSubscriptionUpdated: (updatedSub: Subscription) => void;
  onViewRenewalInvoices: (serviceName: string) => void;
}

export const SubscriptionsList: React.FC<SubscriptionsListProps> = ({
  subscriptions,
  onSubscriptionUpdated,
  onViewRenewalInvoices,
}) => {
  const { toast } = useToast();
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [cancellingSub, setCancellingSub] = useState<Subscription | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleAutoRenew = async (sub: Subscription) => {
    const nextVal = !sub.autoRenew;
    try {
      await billingService.toggleSubscriptionAutoRenew(sub.id, nextVal);
      const updated: Subscription = { ...sub, autoRenew: nextVal };
      onSubscriptionUpdated(updated);
      toast(
        'Subscription Updated',
        `Auto-renewal ${nextVal ? 'enabled' : 'disabled'} for ${sub.serviceName}.`,
        'success'
      );
    } catch {
      toast('Update Failed', 'Failed to update auto-renewal state.', 'error');
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingSub) return;
    setIsProcessing(true);

    try {
      await billingService.cancelSubscription(cancellingSub.id);
      const updated: Subscription = {
        ...cancellingSub,
        status: 'cancelled',
        autoRenew: false,
        nextBillingDate: 'Cancelled',
      };
      onSubscriptionUpdated(updated);
      toast('Subscription Cancelled', `${cancellingSub.serviceName} has been cancelled.`, 'info');
      setCancellingSub(null);
    } catch {
      toast('Cancellation Failed', 'Failed to cancel subscription.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Active</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Pending</span>
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>Suspended</span>
          </span>
        );
      case 'cancelled':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
            Hosting Subscriptions & Renewal Cycles
          </h3>
          <p className="text-xs text-gray-500">
            Recurring cloud compute packages, add-ons, and billing schedules
          </p>
        </div>

        <Link
          href="/hosting/new"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-2xs transition-all cursor-pointer"
        >
          <span>+ Add Package</span>
        </Link>
      </div>

      {/* Subscription List */}
      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 pr-1 pt-1">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 rounded-2xl px-2.5 transition-colors"
          >
            {/* Left Column: Service Details */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0 mt-0.5">
                <Server className="w-4 h-4 text-[#e8702a]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    {sub.serviceName}
                  </span>
                  {renderStatusBadge(sub.status)}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-mono">
                    {sub.subscriptionId}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5 truncate">{sub.package}</p>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5 flex-wrap">
                  <span className="capitalize font-medium text-gray-700">
                    {sub.billingCycle} cycle
                  </span>
                  <span>•</span>
                  <span>Started {sub.startDate}</span>
                  <span>•</span>
                  <span>Next: <strong className="text-gray-800">{sub.nextBillingDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right">
                <div className="font-mono text-sm font-bold text-gray-900">
                  ${sub.amount.toFixed(2)} USD
                </div>
                <div className="text-[11px] text-gray-500">
                  /{sub.billingCycle === 'annually' ? 'year' : 'month'}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Auto-renew switch pill */}
                {sub.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => handleToggleAutoRenew(sub)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      sub.autoRenew
                        ? 'bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/30'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                    title="Toggle auto-renewal charging"
                  >
                    {sub.autoRenew ? 'Auto-Renew: ON' : 'Auto-Renew: OFF'}
                  </button>
                )}

                {/* View details */}
                <button
                  type="button"
                  onClick={() => setSelectedSub(sub)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                >
                  Manage
                </button>

                {/* Cancel link if active */}
                {sub.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => setCancellingSub(sub)}
                    className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Cancel subscription"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Detail Modal */}
      {selectedSub && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setSelectedSub(null)} />

          <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 text-gray-900 z-10 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Subscription Overview</h3>
                  <p className="text-[11px] text-gray-500 font-mono">{selectedSub.subscriptionId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-bold text-gray-900">{selectedSub.serviceName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Specification:</span>
                  <span className="text-gray-800">{selectedSub.package}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Billing Cycle:</span>
                  <span className="capitalize font-semibold text-gray-800">{selectedSub.billingCycle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Recurring Price:</span>
                  <span className="font-mono font-bold text-gray-900">${selectedSub.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Next Scheduled Charge:</span>
                  <span className="font-semibold text-gray-900">{selectedSub.nextBillingDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Auto-Renew Status:</span>
                  <span className="font-semibold text-gray-800">{selectedSub.autoRenew ? 'Enabled (PayHere Token)' : 'Manual Payment'}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const name = selectedSub.serviceName;
                    setSelectedSub(null);
                    onViewRenewalInvoices(name);
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold text-center transition-colors cursor-pointer"
                >
                  View Renewal Invoices
                </button>

                <Link
                  href="/hosting/new"
                  className="px-3 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-center transition-colors cursor-pointer"
                >
                  Request Upgrade
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-5 py-1.5 rounded-full font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingSub && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => !isProcessing && setCancellingSub(null)} />

          <div className="relative w-full max-w-sm rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 text-gray-900 z-10 animate-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Cancel Subscription?</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Are you sure you want to stop recurring renewals for <strong>{cancellingSub.serviceName}</strong>? Service access will expire on {cancellingSub.nextBillingDate}.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setCancellingSub(null)}
                className="px-4 py-1.5 rounded-full font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 rounded-full font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                {isProcessing ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
