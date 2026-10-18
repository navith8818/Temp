'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { AdminMetricCard } from '@/components/ui/AdminMetricCard';
import {
  DollarSign,
  HardDrive,
  Receipt,
  Server
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    services,
    payments,
    servers,
    products,
  } = useAdminData();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'mtd' | 'ytd'>('mtd');

  const totalPaidRevenue = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter(p => p.status === 'REFUNDED')
    .reduce((sum, p) => sum + (p.refundedAmount || p.amount), 0);

  const activeServices = services.filter(s => s.status === 'ACTIVE').length;
  const suspendedServices = services.filter(s => s.status === 'SUSPENDED').length;

  const totalCapacityAccounts = servers.reduce((acc, s) => acc + s.capacity.accountsLimit, 0);
  const totalAllocatedAccounts = servers.reduce((acc, s) => acc + s.capacity.accountsCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
            Reports & Operational Analytics
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Business performance summaries, resource consumption, order volumes, and financial flow.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
          {(['7d', '30d', 'mtd', 'ytd'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDateRange(d)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase cursor-pointer transition-all ${
                dateRange === d
                  ? 'bg-[#e8702a] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Top Summaries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminMetricCard
          label="Gross Revenue"
          value={`$${totalPaidRevenue.toFixed(2)}`}
          subtext="Total collected payments"
          icon={<DollarSign size={16} />}
          badge={{ text: '+18.4%', variant: 'positive' }}
        />
        <AdminMetricCard
          label="Total Refunds"
          value={`$${totalRefunded.toFixed(2)}`}
          subtext={`${payments.filter(p => p.status === 'REFUNDED').length} authorized reversals`}
          icon={<Receipt size={16} />}
          badge={totalRefunded > 0 ? { text: 'Audited', variant: 'neutral' } : { text: 'Zero', variant: 'positive' }}
        />
        <AdminMetricCard
          label="Active Hosting Ratio"
          value={`${activeServices} / ${services.length}`}
          subtext={`${suspendedServices} suspended accounts`}
          icon={<HardDrive size={16} />}
          badge={{ text: '98.2% Healthy', variant: 'positive' }}
        />
        <AdminMetricCard
          label="Overall Cluster Capacity"
          value={`${Math.round((totalAllocatedAccounts / totalCapacityAccounts) * 100)}%`}
          subtext={`${totalAllocatedAccounts} / ${totalCapacityAccounts} accounts filled`}
          icon={<Server size={16} />}
          badge={{ text: 'Adequate', variant: 'positive' }}
        />
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Product Sales Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Product Tier Sales & Service Distribution
          </h3>

          <div className="space-y-3">
            {products.map(p => {
              const count = services.filter(s => s.productId === p.id).length;
              const pct = services.length > 0 ? Math.round((count / services.length) * 100) : 0;

              return (
                <div key={p.id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{p.name}</span>
                    <span className="text-gray-500 font-mono">{count} services ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-[#e8702a] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Server Allocation Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Node Load & Capacity Density
          </h3>

          <div className="space-y-3">
            {servers.map(s => {
              const pct = Math.round((s.capacity.accountsCount / s.capacity.accountsLimit) * 100);
              return (
                <div key={s.id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">{s.name} ({s.location})</span>
                    <span className="text-gray-500 font-mono">{s.capacity.accountsCount}/{s.capacity.accountsLimit} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
