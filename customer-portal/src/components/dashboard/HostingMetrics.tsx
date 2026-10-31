import React from 'react';
import { HardDrive, Globe, Layout, Activity, Layers, ShieldCheck } from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { UsageProgress } from '@/components/ui/UsageProgress';

interface HostingMetricsProps {
  plan: HostingPlan;
}

export const HostingMetrics: React.FC<HostingMetricsProps> = ({ plan }) => {
  const bandwidthUsed = plan.bandwidthUsedGb ?? 42.6;
  const bandwidthTotal = plan.bandwidthTotalGb ?? 500.0;
  const inodesUsed = plan.inodesUsed ?? 68420;
  const inodesTotal = plan.inodesTotal ?? 250000;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-5 pb-1 border-t border-gray-100">
      {/* Metric 1: Storage */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-semibold text-gray-700">
            <HardDrive className="w-3.5 h-3.5 text-[#e8702a]" />
            Storage Allocation
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-orange-50 text-[#e8702a]">
            NVMe SSD
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 text-base sm:text-lg font-bold text-gray-900 font-mono">
          <span>{plan.storageUsedGb.toFixed(1)} GB</span>
          <span className="text-xs font-normal text-gray-500 font-sans">
            used / {plan.storageTotalGb} GB
          </span>
        </div>
        <UsageProgress
          value={plan.storageUsedGb}
          max={plan.storageTotalGb}
          heightClass="h-1.5"
        />
        <div className="text-[11px] text-gray-500 flex justify-between">
          <span>Web & DB Storage</span>
          <span className="text-emerald-700 font-medium">Healthy</span>
        </div>
      </div>

      {/* Metric 2: Monthly Bandwidth */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-semibold text-gray-700">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Monthly Bandwidth
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            Cycle 2026
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 text-base sm:text-lg font-bold text-gray-900 font-mono">
          <span>{bandwidthUsed.toFixed(1)} GB</span>
          <span className="text-xs font-normal text-gray-500 font-sans">
            / {bandwidthTotal} GB
          </span>
        </div>
        <UsageProgress
          value={bandwidthUsed}
          max={bandwidthTotal}
          heightClass="h-1.5"
        />
        <div className="text-[11px] text-gray-500 flex justify-between">
          <span>Resets {plan.renewalDate}</span>
          <span className="text-blue-700 font-medium">91% Free</span>
        </div>
      </div>

      {/* Metric 3: Inodes / Files */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-semibold text-gray-700">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            Inodes Allocation
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            File Descriptors
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 text-base sm:text-lg font-bold text-gray-900 font-mono">
          <span>{inodesUsed.toLocaleString()}</span>
          <span className="text-xs font-normal text-gray-500 font-sans">
            / {inodesTotal.toLocaleString()}
          </span>
        </div>
        <UsageProgress
          value={inodesUsed}
          max={inodesTotal}
          heightClass="h-1.5"
        />
        <div className="text-[11px] text-gray-500 flex justify-between">
          <span>{(inodesTotal - inodesUsed).toLocaleString()} available</span>
          <span className="text-emerald-700 font-medium">Optimal</span>
        </div>
      </div>

      {/* Metric 4: Domains */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-semibold text-gray-700">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            Domain Capacity
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
            {plan.domainLimit - plan.domainCount} Free
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 text-base sm:text-lg font-bold text-gray-900 font-mono">
          <span>{plan.domainCount}</span>
          <span className="text-xs font-normal text-gray-500 font-sans">/ {plan.domainLimit} Allocated</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-0.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#e8702a]"></span>
          <span>Primary: <strong className="text-gray-800">{plan.primaryDomain}</strong></span>
        </div>
        <div className="text-[11px] text-gray-400">
          <span>Auto-provisioned Let&apos;s Encrypt</span>
        </div>
      </div>

      {/* Metric 5: Stack & Websites */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-semibold text-gray-700">
            <Layout className="w-3.5 h-3.5 text-gray-500" />
            Websites & Stack
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
            HestiaCP v1.8
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 text-base sm:text-lg font-bold text-gray-900 font-mono">
          <span>{plan.websiteCount}</span>
          <span className="text-xs font-normal text-gray-500 font-sans">Active Websites</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 pt-0.5">
          <span className="font-mono text-[11px] bg-gray-100 px-2 py-0.5 rounded-md font-semibold">
            PHP {plan.phpVersion || '8.3'}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> SSL Active
          </span>
        </div>
        <div className="text-[11px] text-gray-400 truncate">
          <span>Node: {plan.serverHost}</span>
        </div>
      </div>
    </div>
  );
};
