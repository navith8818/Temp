import React from 'react';
import { X, Globe, ExternalLink } from 'lucide-react';
import { Website, HostingPlan } from '@/types/hosting';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/Toast';

interface WebsiteDetailsDialogProps {
  website: Website | null;
  plan: HostingPlan;
  onClose: () => void;
}

export const WebsiteDetailsDialog: React.FC<WebsiteDetailsDialogProps> = ({
  website,
  plan,
  onClose,
}) => {
  const { toast } = useToast();

  if (!website) return null;

  const handleOpenHestiaWeb = () => {
    toast(
      'HestiaCP Web Domain',
      `Routing to HestiaCP configuration for ${website.domain}... (Simulated link)`,
      'info'
    );
    window.open(
      `https://${plan.serverHost}:${plan.controlPanelPort}/list/web/`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="website-details-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-2xl p-7 sm:p-8 text-gray-900 z-10 animate-in zoom-in-95 duration-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
              <Globe className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 id="website-details-title" className="text-lg font-bold text-gray-900">
                {website.domain}
              </h3>
              <p className="text-xs text-gray-500">Website Configuration & Telemetry</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
          <span className="text-xs font-semibold text-gray-600">Operational Status</span>
          <StatusBadge status={website.status} />
        </div>

        {/* Details Grid */}
        <div className="rounded-2xl bg-gray-50/90 border border-gray-200/80 p-4 space-y-3 text-xs text-gray-700">
          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Application Type:</span>
            <span className="text-gray-900 font-bold">
              {website.appType} {website.appVersion ? `(${website.appVersion})` : ''}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">PHP Version:</span>
            <span className="text-gray-900 font-mono font-semibold">PHP {website.phpVersion}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Created At:</span>
            <span className="text-gray-900 font-medium">{website.createdAt}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">SSL Certificate:</span>
            <span className="text-emerald-700 font-semibold">
              {website.sslIssuer || "Let's Encrypt"} ({website.sslExpiresInDays} days remaining)
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-gray-200/60">
            <span className="text-gray-500 font-medium">Document Root:</span>
            <code className="text-gray-900 font-mono text-[11px] truncate max-w-[260px] bg-white px-1.5 py-0.5 rounded border border-gray-200">
              {website.documentRoot}
            </code>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-gray-500 font-medium">Disk Space Used:</span>
            <span className="text-gray-900 font-mono font-semibold">
              {(website.storageUsedMb / 1024).toFixed(2)} GB
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleOpenHestiaWeb}
            className="inline-flex items-center gap-1.5 text-xs text-[#e8702a] hover:text-[#d2611f] font-bold transition-colors cursor-pointer"
          >
            <span>Open in HestiaCP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-gray-900 hover:bg-black text-white shadow-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
