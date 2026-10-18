'use client';

import React from 'react';
import { Building2, Mail, MapPin, CheckCircle2, Edit3 } from 'lucide-react';
import { BillingAddress } from '@/types/billing';

interface BillingAddressCardProps {
  address: BillingAddress;
  onEditClick: () => void;
}

export const BillingAddressCard: React.FC<BillingAddressCardProps> = ({ address, onEditClick }) => {
  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
        <div className="min-w-0 pr-2">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Billing & Tax Details</h3>
          <p className="text-xs text-gray-500 leading-tight mt-0.5">Legal entity details for monthly invoices</p>
        </div>

        <button
          type="button"
          onClick={onEditClick}
          className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#e8702a]" />
          <span>Edit</span>
        </button>
      </div>

      <div className="space-y-3 pt-3.5 text-xs">
        <div className="flex items-start gap-2.5">
          <Building2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-900">{address.companyName}</p>
            <p className="text-gray-500 mt-0.5">Attn: {address.contactName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-gray-700 font-mono text-[11px]">{address.email}</span>
        </div>

        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="text-gray-700">
            <p>{address.addressLine1}</p>
            <p>{address.postalCode} {address.city}, {address.country}</p>
          </div>
        </div>

        {address.vatId && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200/70 mt-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">VAT / Tax ID</span>
              <span className="font-mono text-gray-900 font-bold">{address.vatId}</span>
            </div>
            {address.vatValidated && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>EU Validated</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
