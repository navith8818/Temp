'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { PaymentMethod } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodAdded: (method: PaymentMethod) => void;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onMethodAdded,
}) => {
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = cardNumber.replace(/\s+/g, '');

    if (cleanDigits.length < 15) {
      setError('Please enter a valid 15 or 16-digit card number.');
      return;
    }
    if (!cardholderName.trim()) {
      setError('Cardholder name is required.');
      return;
    }
    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(`20${yearStr}`, 10);

    if (!month || month < 1 || month > 12 || !year) {
      setError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvc.length < 3) {
      setError('Please enter a valid 3 or 4-digit security code (CVC).');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const newMethod = await billingService.addPaymentMethod({
        cardNumber: cleanDigits,
        cardholderName: cardholderName.trim(),
        expMonth: month,
        expYear: year,
        isDefault,
      });

      toast('Card Added', `Card ending in ${newMethod.last4} saved successfully.`, 'success');
      onMethodAdded(newMethod);
      onClose();
    } catch {
      setError('Failed to verify card. Please check details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-card-title"
    >
      <div className="fixed inset-0" onClick={() => !isSubmitting && onClose()} />

      <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 sm:p-7 text-gray-900 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
              <CreditCard className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 id="add-card-title" className="text-base font-bold text-gray-900">
                Add Payment Card
              </h3>
              <p className="text-xs text-gray-500">Secure 256-bit encrypted card tokenization</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Cardholder Name */}
          <div>
            <label htmlFor="card-name" className="block text-xs font-bold text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              id="card-name"
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="e.g. John Doe"
              disabled={isSubmitting}
              autoFocus
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#e8702a]"
            />
          </div>

          {/* Card Number */}
          <div>
            <label htmlFor="card-num" className="block text-xs font-bold text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                id="card-num"
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4242 •••• •••• 4242"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 font-mono placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>
          </div>

          {/* Expiry & CVC Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="card-exp" className="block text-xs font-bold text-gray-700 mb-1">
                Expires (MM/YY)
              </label>
              <input
                id="card-exp"
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 font-mono placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label htmlFor="card-cvc" className="block text-xs font-bold text-gray-700 mb-1">
                Security Code (CVC)
              </label>
              <input
                id="card-cvc"
                type="password"
                maxLength={4}
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                placeholder="•••"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 font-mono placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>
          </div>

          {/* Set as Default Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200/70">
            <div>
              <p className="text-xs font-bold text-gray-900">Set as primary payment method</p>
              <p className="text-[11px] text-gray-500">Auto-renewals will prioritize this card</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isDefault}
              onClick={() => setIsDefault(!isDefault)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDefault ? 'bg-[#e8702a]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isDefault ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Card numbers are vaulted with Stripe-level PCI-DSS Level 1 compliance.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-sm shadow-[#e8702a]/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Tokenizing card...</span>
                </>
              ) : (
                <span>Save Payment Method</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
