import React from 'react';
import { HardDrive, Globe, Layout } from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { UsageProgress } from '@/components/ui/UsageProgress';

interface HostingMetricsProps {
  plan: HostingPlan;
}

export const HostingMetrics: React.FC<HostingMetricsProps> = ({ plan }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 pb-1 border-t border-gray-100">
      {/* Metric 1: Storage */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium">
            <HardDrive className="w-3.5 h-3.5 text-gray-400" />
            Storage Usage
          </span>
          <span className="text-[11px] font-medium text-gray-400">NVMe SSD</span>
        </div>
        <div className="flex items-baseline gap-1.5 text-sm sm:text-base font-bold text-gray-900">
          <span>{plan.storageUsedGb.toFixed(1)} GB</span>
          <span className="text-xs font-normal text-gray-500">
            used / {plan.storageTotalGb} GB
          </span>
        </div>
        <UsageProgress
          value={plan.storageUsedGb}
          max={plan.storageTotalGb}
          heightClass="h-1 mt-0.5"
        />
      </div>

      {/* Metric 2: Domains */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            Domain Capacity
          </span>
          <span className="text-[11px] font-medium text-gray-400">Allocated</span>
        </div>
        <div className="flex items-baseline gap-1.5 text-sm sm:text-base font-bold text-gray-900">
          <span>{plan.domainCount}</span>
          <span className="text-xs font-normal text-gray-500">/ {plan.domainLimit} used</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e8702a]"></span>
          <span>{plan.domainLimit - plan.domainCount} domain slots available</span>
        </div>
      </div>

      {/* Metric 3: Websites */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium">
            <Layout className="w-3.5 h-3.5 text-gray-400" />
            Websites Active
          </span>
          <span className="text-[11px] font-medium text-gray-400">HestiaCP</span>
        </div>
        <div className="flex items-baseline gap-1.5 text-sm sm:text-base font-bold text-gray-900">
          <span>{plan.websiteCount}</span>
          <span className="text-xs font-normal text-gray-500">websites deployed</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span className="font-mono text-[11px]">Server: {plan.serverHost}</span>
        </div>
      </div>
    </div>
  );
};
