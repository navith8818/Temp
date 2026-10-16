import React, { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { hostingService } from '@/data/mockHostingData';
import { useToast } from '@/components/ui/Toast';

interface RenewalSectionProps {
  plan: HostingPlan;
  onPlanUpdated: (updatedPlan: HostingPlan) => void;
}

export const RenewalSection: React.FC<RenewalSectionProps> = ({ plan, onPlanUpdated }) => {
  const { toast } = useToast();
  const [autoRenew, setAutoRenew] = useState(plan.autoRenew);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleAutoRenew = async () => {
    const nextState = !autoRenew;
    setIsUpdating(true);
    try {
      await hostingService.toggleAutoRenew(nextState);
      setAutoRenew(nextState);
      onPlanUpdated({ ...plan, autoRenew: nextState });
      toast(
        nextState ? 'Auto-Renewal Enabled' : 'Auto-Renewal Disabled',
        nextState
          ? 'Payment method will be charged automatically on renewal date. (Simulated mock)'
          : 'Service will not renew automatically on expiration date. (Simulated mock)',
        'success'
      );
    } catch {
      toast('Update Failed', 'Could not update auto-renewal settings.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="py-5 border-b border-gray-100">
      <div className="flex items-center justify-between mb-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Renewal
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
          Mock Data
        </span>
      </div>

      <div className="rounded-2xl bg-gray-50/90 border border-gray-200/80 p-4 space-y-3.5">
        {/* Expiration date & price */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-900 font-medium">
            <Calendar className="w-4 h-4 text-[#e8702a]" />
            <span>
              Expires on <strong className="font-bold text-gray-900">{plan.renewalDate}</strong>
            </span>
          </div>
          <span className="text-xs font-bold text-gray-900">
            ${plan.renewalPrice.toFixed(2)}{' '}
            <span className="text-[11px] font-normal text-gray-500">/{plan.billingCycle}</span>
          </span>
        </div>

        {/* Thin renewal timeline bar */}
        <div className="w-full h-1.5 bg-gray-200/70 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
        </div>

        {/* Auto-renew switch */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-200/70">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs font-semibold text-gray-900">Auto-renew</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {autoRenew
                  ? 'Card ending in •••• 4242 will be charged automatically.'
                  : 'Manual renewal required before expiration.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={autoRenew}
            disabled={isUpdating}
            onClick={handleToggleAutoRenew}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8702a] ${
              autoRenew ? 'bg-[#e8702a]' : 'bg-gray-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Toggle auto-renewal"
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                autoRenew ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
