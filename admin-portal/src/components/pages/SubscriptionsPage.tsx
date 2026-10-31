'use client';

import React from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { Subscription } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import {
  RefreshCw,
  Ban,
  Clock
} from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const {
    subscriptions,
    retrySubscriptionRenewal,
    cancelSubscriptionRenewal,
    currentRole
  } = useAdminData();

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  const columns: Column<Subscription>[] = [
    {
      key: 'serviceDomain',
      header: 'Associated Hosting Domain',
      sortable: true,
      render: sub => (
        <div>
          <span className="font-semibold text-gray-900">{sub.serviceDomain}</span>
          <div className="text-[11px] text-gray-400">{sub.productName}</div>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: sub => <span className="font-medium text-gray-800">{sub.customerName}</span>,
    },
    {
      key: 'frequency',
      header: 'Cadence',
      render: sub => (
        <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
          {sub.frequency}
        </span>
      ),
    },
    {
      key: 'nextRenewalDate',
      header: 'Next Renewal Date',
      sortable: true,
      render: sub => (
        <div>
          <span className="font-semibold text-gray-800">{sub.nextRenewalDate}</span>
          <div className="text-[11px] text-gray-400">LKR {sub.renewalPrice.toFixed(2)}</div>
        </div>
      ),
    },
    {
      key: 'autoRenew',
      header: 'Auto-Renew',
      render: sub => (
        <span className={sub.autoRenew ? 'text-emerald-700 font-semibold' : 'text-gray-400 font-medium'}>
          {sub.autoRenew ? 'Enabled' : 'Disabled'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: sub => (
        <AdminBadge
          variant={
            sub.status === 'ACTIVE'
              ? 'success'
              : sub.status === 'PAST_DUE'
              ? 'danger'
              : 'neutral'
          }
        >
          {sub.status}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: sub => (
        <div className="flex items-center justify-end gap-1.5">
          {!isRestricted && (
            <>
              <AdminButton
                variant="secondary"
                size="sm"
                icon={<RefreshCw size={12} />}
                onClick={() => retrySubscriptionRenewal(sub.id)}
                title="Trigger automated billing retry"
              >
                Retry Charge
              </AdminButton>

              {sub.autoRenew && (
                <AdminButton
                  variant="outline"
                  size="sm"
                  icon={<Ban size={12} />}
                  onClick={() => cancelSubscriptionRenewal(sub.id)}
                  title="Cancel auto-renewal"
                >
                  Cancel Renewal
                </AdminButton>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
            Subscriptions & Recurring Renewals
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Automated renewal cycles, card retry policies, grace period enforcement, and cancellations.
          </p>
        </div>
      </div>

      {/* Grace period policy box */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Clock size={16} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Standard Renewal Grace Period: 5 Days</div>
            <div className="text-[11px] text-gray-400">
              Accounts remain operational for 5 days after payment failure before automated suspension is enforced.
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        data={subscriptions}
        columns={columns}
        keyExtractor={s => s.id}
        searchPlaceholder="Search subscriptions by domain, customer..."
        searchFilter={(s, q) =>
          s.serviceDomain.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q)
        }
      />
    </div>
  );
};
