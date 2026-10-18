'use client';

import React from 'react';
import { Mail, ShieldAlert, CreditCard, Bell, Sparkles } from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { useToast } from '@/components/ui/Toast';

export const NotificationsSection: React.FC = () => {
  const { profile, toggleEmailDigest, toggleSecurityAlerts, toggleBillingAlerts } = useAccount();
  const { toast } = useToast();

  const handleToggle = (name: string, fn: () => boolean) => {
    const next = fn();
    toast('Preferences Saved', `${name} notifications are now ${next ? 'enabled' : 'disabled'}.`, 'info');
  };

  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
      <div className="pb-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">Notification Channels</h3>
        <p className="text-xs text-gray-500">Configure what email alerts and summaries Server Salad delivers to you</p>
      </div>

      <div className="pt-4 divide-y divide-gray-100">
        {/* Weekly Digest */}
        <div className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0 mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Weekly Cloud Hosting Digest</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Summary of bandwidth usage, disk quota trends, and website uptime statistics sent every Monday.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle('Weekly Digest', toggleEmailDigest)}
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              profile.emailDigest
                ? 'bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/30'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            {profile.emailDigest ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Security & SSL Alerts */}
        <div className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Security & SSL Expiry Alerts</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Immediate alerts when an SSL certificate fails renewal, unauthorized logins occur, or firewalls trigger.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle('Security Alerts', toggleSecurityAlerts)}
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              profile.securityAlerts
                ? 'bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/30'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            {profile.securityAlerts ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Billing & Renewal Reminders */}
        <div className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Invoices & Auto-Renewal Receipts</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Monthly paid invoice receipts, payment method expiration warnings, and renewal notices.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle('Billing Alerts', toggleBillingAlerts)}
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              profile.billingAlerts
                ? 'bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/30'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            {profile.billingAlerts ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </div>
  );
};
