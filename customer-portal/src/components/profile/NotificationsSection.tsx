'use client';

import React from 'react';
import { Mail, ShieldAlert, CreditCard } from 'lucide-react';
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
      <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Notification Channels</h3>
          <p className="text-xs text-gray-500">Configure what email alerts and summaries Server Salad delivers to you</p>
        </div>
      </div>

      {/* 3 Columns of Notification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
        {/* Weekly Digest */}
        <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Weekly Hosting Digest</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                Summary of bandwidth usage, disk quota trends, and website uptime statistics sent every Monday.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500">
              {profile.emailDigest ? 'Delivered via Email' : 'Channel Muted'}
            </span>
            <button
              type="button"
              onClick={() => handleToggle('Weekly Digest', toggleEmailDigest)}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                profile.emailDigest
                  ? 'bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/30'
                  : 'bg-gray-200 text-gray-600 border border-gray-300'
              }`}
            >
              {profile.emailDigest ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Security & SSL Alerts */}
        <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Security & SSL Alerts</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                Immediate alerts when an SSL certificate fails renewal, unauthorized logins occur, or firewalls trigger.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500">
              {profile.securityAlerts ? 'Priority Incident Push' : 'Channel Muted'}
            </span>
            <button
              type="button"
              onClick={() => handleToggle('Security Alerts', toggleSecurityAlerts)}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                profile.securityAlerts
                  ? 'bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/30'
                  : 'bg-gray-200 text-gray-600 border border-gray-300'
              }`}
            >
              {profile.securityAlerts ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Billing & Renewal Reminders */}
        <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Invoices & Auto-Renewal</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                Monthly paid invoice receipts, payment method expiration warnings, and renewal notices.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500">
              {profile.billingAlerts ? 'Receipts & Invoices' : 'Channel Muted'}
            </span>
            <button
              type="button"
              onClick={() => handleToggle('Billing Alerts', toggleBillingAlerts)}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                profile.billingAlerts
                  ? 'bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/30'
                  : 'bg-gray-200 text-gray-600 border border-gray-300'
              }`}
            >
              {profile.billingAlerts ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};