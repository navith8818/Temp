import React, { useState } from 'react';
import { ChevronDown, FolderArchive, ExternalLink } from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { useToast } from '@/components/ui/Toast';

interface FileStorageSectionProps {
  plan: HostingPlan;
  defaultExpanded?: boolean;
}

export const FileStorageSection: React.FC<FileStorageSectionProps> = ({
  plan,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { toast } = useToast();

  const availableStorageGb = (plan.storageTotalGb - plan.storageUsedGb).toFixed(1);

  const handleLaunchFileManager = () => {
    toast(
      'HestiaCP File Manager',
      `Launching secure file manager session for /home/${plan.hestiaUsername}... (Simulated link)`,
      'info'
    );
    window.open(
      `https://${plan.serverHost}:${plan.controlPanelPort}/fm/`,
      '_blank',
      'noopener,noreferrer'
    );
  };

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
          <FolderArchive className="w-4 h-4 text-[#e8702a]" />
          <span>Files and Storage</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="mt-4 space-y-3.5 animate-in fade-in duration-200">
          <div className="rounded-2xl bg-gray-50/90 border border-gray-200/80 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Allocated Storage</span>
              <span className="font-bold text-gray-900">{plan.storageTotalGb} GB NVMe</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Used Capacity</span>
              <span className="font-bold text-gray-900">{plan.storageUsedGb.toFixed(1)} GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Available Free Space</span>
              <span className="font-bold text-emerald-600">{availableStorageGb} GB</span>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleLaunchFileManager}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold border border-gray-200 shadow-xs transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FolderArchive className="w-3.5 h-3.5 text-[#e8702a]" />
              <span>Launch HestiaCP File Manager</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <p className="text-[11px] text-gray-500 leading-normal px-1">
            Web directories and logs are securely hosted on HestiaCP at{' '}
            <code className="text-gray-900 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
              /home/{plan.hestiaUsername}/web/
            </code>
          </p>
        </div>
      )}
    </div>
  );
};
