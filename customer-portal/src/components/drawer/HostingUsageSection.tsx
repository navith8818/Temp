import React, { useState } from 'react';
import { ChevronDown, BarChart2, HardDrive, Activity, Layers } from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { UsageProgress } from '@/components/ui/UsageProgress';

interface HostingUsageSectionProps {
  plan: HostingPlan;
  defaultExpanded?: boolean;
}

export const HostingUsageSection: React.FC<HostingUsageSectionProps> = ({
  plan,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const storagePercent = Math.round((plan.storageUsedGb / plan.storageTotalGb) * 100);
  const bandwidthPercent = Math.round((plan.bandwidthUsedGb / plan.bandwidthTotalGb) * 100);
  const inodesPercent = Math.round((plan.inodesUsed / plan.inodesTotal) * 100);

  return (
    <div className="py-4 border-b border-gray-100">
      {/* Header with Chevron */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-1 text-left group focus:outline-none cursor-pointer"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 group-hover:text-[#e8702a] transition-colors">
          <BarChart2 className="w-4 h-4 text-[#e8702a]" />
          <span>Hosting Usage</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in duration-200">
          {/* Storage Metric */}
          <div className="rounded-2xl bg-gray-50/90 border border-gray-200/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-900 font-semibold">
                <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                Disk Allocation
              </span>
              <span className="text-gray-500">
                <strong className="text-gray-900 font-bold">{plan.storageUsedGb.toFixed(1)} GB</strong> /{' '}
                {plan.storageTotalGb} GB ({storagePercent}%)
              </span>
            </div>
            <UsageProgress value={plan.storageUsedGb} max={plan.storageTotalGb} heightClass="h-1.5" />

            {/* Storage Breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-gray-200/60 text-[11px]">
              <div>
                <p className="text-gray-400">Web Files</p>
                <p className="font-bold text-gray-900 mt-0.5">{plan.storageBreakdown.webGb} GB</p>
              </div>
              <div>
                <p className="text-gray-400">Databases</p>
                <p className="font-bold text-gray-900 mt-0.5">{plan.storageBreakdown.dbGb} GB</p>
              </div>
              <div>
                <p className="text-gray-400">Mail & Logs</p>
                <p className="font-bold text-gray-900 mt-0.5">{plan.storageBreakdown.mailGb} GB</p>
              </div>
            </div>
          </div>

          {/* Bandwidth & Inodes Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Bandwidth */}
            <div className="rounded-2xl bg-gray-50/90 border border-gray-200/80 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-900 font-semibold text-[11px]">
                  <Activity className="w-3 h-3 text-[#e8702a]" />
                  Bandwidth
                </span>
                <span className="text-[10px] text-gray-500 font-medium">{bandwidthPercent}%</span>
              </div>
              <div className="text-xs font-bold text-gray-900">
                {plan.bandwidthUsedGb} / {plan.bandwidthTotalGb} GB
              </div>
              <UsageProgress
                value={plan.bandwidthUsedGb}
                max={plan.bandwidthTotalGb}
                heightClass="h-1"
              />
            </div>

            {/* Inodes */}
            <div className="rounded-2xl bg-gray-50/90 border border-gray-200/80 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-900 font-semibold text-[11px]">
                  <Layers className="w-3 h-3 text-[#e8702a]" />
                  Inodes
                </span>
                <span className="text-[10px] text-gray-500 font-medium">{inodesPercent}%</span>
              </div>
              <div className="text-xs font-bold text-gray-900">
                {(plan.inodesUsed / 1000).toFixed(1)}k / {(plan.inodesTotal / 1000).toFixed(0)}k
              </div>
              <UsageProgress
                value={plan.inodesUsed}
                max={plan.inodesTotal}
                heightClass="h-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
