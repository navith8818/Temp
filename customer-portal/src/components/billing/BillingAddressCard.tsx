'use client';

import React from 'react';
import { Building2, Mail, Phone, MapPin, CheckCircle2, Edit3 } from 'lucide-react';
import { BillingAddress } from '@/types/billing';

interface BillingAddressCardProps {
  address: BillingAddress;
  onEditClick: () => void;
}

export const BillingAddressCard: React.FC<BillingAddressCardProps> = ({ address, onEditClick }) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs overflow-hidden">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-100 shrink-0">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Billing & Tax Details</h3>
          <p className="text-xs text-gray-500 mt-0.5">Legal entity, registered business address, and tax information printed on monthly invoices</p>
        </div>

        <button
          type="button"
          onClick={onEditClick}
          className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#e8702a]" />
          <span>Edit Details</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pt-4 space-y-4 pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Legal Entity & Contact */}
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 space-y-3">
            <div className="flex items-center gap-2 text-gray-500 pb-2 border-b border-gray-200/50">
              <Building2 className="w-4 h-4 text-[#e8702a]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Legal Entity</span>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">{address.companyName}</p>
              <p className="text-xs text-gray-500 mt-0.5">Attention: {address.contactName}</p>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-gray-700 font-mono text-[11px]">{address.email}</span>
              </div>
              {address.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-700 font-mono text-[11px]">{address.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Registered Tax & VAT Identification */}
          <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 space-y-3">
            <div className="flex items-center gap-2 text-gray-500 pb-2 border-b border-gray-200/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Tax Identification</span>
            </div>

            {address.vatId ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">VAT / TAX ID</span>
                    <span className="font-mono text-sm text-gray-900 font-bold">{address.vatId}</span>
                  </div>
                  {address.vatValidated && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>EU Validated</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Reverse charge mechanism applies for cross-border B2B digital services within the European Union.
                </p>
              </div>
            ) : (
              <div className="text-xs text-gray-500 py-3">
                No VAT / Tax ID on file. Invoices will include standard local rate taxes.
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Invoicing Physical Address */}
        <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 space-y-2.5">
          <div className="flex items-center gap-2 text-gray-500 pb-2 border-b border-gray-200/50">
            <MapPin className="w-4 h-4 text-[#e8702a]" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Invoicing Postal Address</span>
          </div>

          <div className="text-xs text-gray-800 space-y-0.5">
            <p className="font-semibold text-gray-900">{address.addressLine1}</p>
            <p>{address.postalCode} {address.city}</p>
            <p className="font-medium text-gray-600">{address.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
