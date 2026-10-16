import React from 'react';
import { Globe, Lock, SlidersHorizontal } from 'lucide-react';
import { Website, HostingPlan } from '@/types/hosting';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { WebsiteActionsMenu } from '@/components/dashboard/WebsiteActionsMenu';

interface WebsiteRowProps {
  website: Website;
  plan: HostingPlan;
  onManageClick: (website: Website) => void;
  onOpenDetails: (website: Website) => void;
  onDeleteRequest: (website: Website) => void;
}

export const WebsiteRow: React.FC<WebsiteRowProps> = ({
  website,
  plan,
  onManageClick,
  onOpenDetails,
  onDeleteRequest,
}) => {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50/70 hover:bg-gray-100/70 rounded-2xl border border-gray-200/70 hover:border-gray-300 transition-all shadow-2xs">
      {/* Left: Domain & Meta */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
          <Globe className="w-4 h-4 stroke-[2]" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-gray-900 group-hover:text-[#e8702a] transition-colors truncate">
              {website.domain}
            </span>

            {website.isPrimary && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gray-200/70 text-gray-700">
                Primary
              </span>
            )}

            <StatusBadge status={website.status} />

            {website.sslActive && (
              <span
                className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium"
                title={`SSL Active: ${website.sslIssuer || "Let's Encrypt"}`}
              >
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>SSL</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span>Created on {website.createdAt}</span>
            <span className="text-gray-300">•</span>
            <span className="font-mono text-[11px] text-gray-600">
              {website.appType} {website.appVersion ? `(${website.appVersion})` : ''}
            </span>
            <span className="text-gray-300">•</span>
            <span className="font-mono text-[11px] text-gray-600">PHP {website.phpVersion}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          type="button"
          onClick={() => onManageClick(website)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8702a] shadow-2xs cursor-pointer"
          aria-label={`Manage ${website.domain}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#e8702a]" />
          <span>Manage</span>
        </button>

        <WebsiteActionsMenu
          website={website}
          plan={plan}
          onOpenDetails={onOpenDetails}
          onDeleteRequest={onDeleteRequest}
        />
      </div>
    </div>
  );
};
