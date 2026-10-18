'use client';

import React, { useState } from 'react';
import { X, Building2, Loader2 } from 'lucide-react';
import { BillingAddress } from '@/types/billing';
import { billingService } from '@/data/mockBillingData';
import { useToast } from '@/components/ui/Toast';

interface EditBillingAddressModalProps {
  isOpen: boolean;
  address: BillingAddress;
  onClose: () => void;
  onAddressUpdated: (updated: BillingAddress) => void;
}

export const EditBillingAddressModal: React.FC<EditBillingAddressModalProps> = ({
  isOpen,
  address,
  onClose,
  onAddressUpdated,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BillingAddress>({ ...address });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.email.trim() || !formData.addressLine1.trim()) {
      setError('Company name, email, and street address are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await billingService.updateBillingAddress(formData);
      toast('Billing Details Updated', 'Your tax and legal entity information was saved.', 'success');
      onAddressUpdated(updated);
      onClose();
    } catch {
      setError('Failed to update billing details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-address-title"
    >
      <div className="fixed inset-0" onClick={() => !isSubmitting && onClose()} />

      <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-2xl p-6 sm:p-7 text-gray-900 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
              <Building2 className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 id="edit-address-title" className="text-base font-bold text-gray-900">
                Edit Billing & Tax Details
              </h3>
              <p className="text-xs text-gray-500">Updates invoices and future tax receipts</p>
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

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-3 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="company-name" className="block font-bold text-gray-700 mb-1">
                Company / Legal Name <span className="text-[#e8702a]">*</span>
              </label>
              <input
                id="company-name"
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label htmlFor="contact-name" className="block font-bold text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                id="contact-name"
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="billing-email" className="block font-bold text-gray-700 mb-1">
                Receipt Email <span className="text-[#e8702a]">*</span>
              </label>
              <input
                id="billing-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label htmlFor="vat-id" className="block font-bold text-gray-700 mb-1">
                VAT / Tax ID (Optional)
              </label>
              <input
                id="vat-id"
                type="text"
                value={formData.vatId || ''}
                onChange={(e) => setFormData({ ...formData, vatId: e.target.value })}
                placeholder="e.g. LU30918274"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-mono focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address-1" className="block font-bold text-gray-700 mb-1">
              Street Address <span className="text-[#e8702a]">*</span>
            </label>
            <input
              id="address-1"
              type="text"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="city" className="block font-bold text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label htmlFor="postal-code" className="block font-bold text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                id="postal-code"
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label htmlFor="country" className="block font-bold text-gray-700 mb-1">
                Country
              </label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
