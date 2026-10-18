'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Check, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  onAddClick: () => void;
  onMethodsUpdated: (methods: PaymentMethod[]) => void;
}

export const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  paymentMethods,
  onAddClick,
  onMethodsUpdated,
}) => {
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleSetDefault = async (id: string) => {
    setUpdatingId(id);
    try {
      await billingService.setDefaultPaymentMethod(id);
      const updated = paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }));
      onMethodsUpdated(updated);
      toast('Default Updated', 'Primary payment card updated successfully.', 'success');
    } catch {
      toast('Error', 'Failed to update default payment method.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    const target = paymentMethods.find((p) => p.id === id);
    if (target?.isDefault && paymentMethods.length > 1) {
      toast('Cannot Remove Default', 'Please assign another card as default before deleting.', 'error');
      return;
    }

    try {
      await billingService.removePaymentMethod(id);
      const updated = paymentMethods.filter((pm) => pm.id !== id);
      onMethodsUpdated(updated);
      toast('Card Removed', 'Payment method has been deleted.', 'success');
    } catch {
      toast('Error', 'Failed to delete payment method.', 'error');
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
        <div className="min-w-0 pr-2">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Payment Methods</h3>
          <p className="text-xs text-gray-500 leading-tight mt-0.5">Cards for automated renewals</p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-2xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e8702a]/30"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Card</span>
        </button>
      </div>

      <div className="space-y-2.5 pt-3.5">
        {paymentMethods.map((pm) => (
          <div
            key={pm.id}
            className={`flex items-center justify-between gap-2.5 p-3 rounded-2xl border transition-all ${
              pm.isDefault
                ? 'bg-[#fcf5f1]/60 border-[#e8702a]/30 shadow-2xs'
                : 'bg-gray-50/80 border-gray-200/70 hover:bg-gray-100/60'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-7 rounded-lg bg-white border border-gray-200 shrink-0 flex items-center justify-center font-bold text-[10px] uppercase tracking-wider text-gray-800 shadow-2xs">
                {pm.brand === 'visa' && <span className="text-blue-700 italic font-black">VISA</span>}
                {pm.brand === 'mastercard' && <span className="text-red-600 font-black">MC</span>}
                {pm.brand === 'amex' && <span className="text-blue-500 font-black">AMEX</span>}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-gray-900 font-mono whitespace-nowrap">
                    •••• {pm.last4}
                  </span>
                  {pm.isDefault && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/20 shrink-0">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5 whitespace-nowrap">
                  <span>Expires {String(pm.expMonth).padStart(2, '0')}/{String(pm.expYear).slice(-2)}</span>
                  <span>•</span>
                  <span className="truncate max-w-[100px]">{pm.cardholderName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!pm.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(pm.id)}
                  disabled={updatingId === pm.id}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                >
                  Set as default
                </button>
              )}
              {paymentMethods.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(pm.id)}
                  className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0 transition-colors cursor-pointer"
                  title="Remove card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
