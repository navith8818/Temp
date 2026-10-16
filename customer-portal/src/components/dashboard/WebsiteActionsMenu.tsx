import React, { useState } from 'react';
import {
  MoreVertical,
  ExternalLink,
  FolderTree,
  Database,
  Shield,
  FileCode2,
  Trash2,
  Sliders,
} from 'lucide-react';
import { Website, HostingPlan } from '@/types/hosting';
import { useToast } from '@/components/ui/Toast';

interface WebsiteActionsMenuProps {
  website: Website;
  plan: HostingPlan;
  onOpenDetails: (website: Website) => void;
  onDeleteRequest: (website: Website) => void;
}

export const WebsiteActionsMenu: React.FC<WebsiteActionsMenuProps> = ({
  website,
  plan,
  onOpenDetails,
  onDeleteRequest,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenHestiaForWebsite = () => {
    setIsOpen(false);
    toast(
      'HestiaCP Web Domain',
      `Routing to HestiaCP domain manager for ${website.domain} on port ${plan.controlPanelPort}... (Simulated link)`,
      'info'
    );
    window.open(
      `https://${plan.serverHost}:${plan.controlPanelPort}/list/web/`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleOpenFileManager = () => {
    setIsOpen(false);
    toast(
      'File Manager',
      `Opening HestiaCP File Manager at ${website.documentRoot}... (Simulated link)`,
      'info'
    );
    window.open(
      `https://${plan.serverHost}:${plan.controlPanelPort}/fm/`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleOpenPhpMyAdmin = () => {
    setIsOpen(false);
    toast(
      'phpMyAdmin',
      `Launching phpMyAdmin database console for ${plan.hestiaUsername}... (Simulated link)`,
      'info'
    );
    window.open(
      `https://${plan.serverHost}/phpmyadmin/`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors focus:outline-none cursor-pointer"
        aria-label={`Options for ${website.domain}`}
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-200 shadow-2xl z-50 py-2 text-xs animate-in fade-in zoom-in-95">
            {/* Header / Type */}
            <div className="px-4 py-2 text-[11px] font-bold tracking-wider uppercase text-gray-400 border-b border-gray-100 flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5 text-[#e8702a]" />
              <span>{website.appType} options</span>
            </div>

            {/* Menu Items */}
            <button
              type="button"
              onClick={handleOpenHestiaForWebsite}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#e8702a]" />
                <span>Open in HestiaCP</span>
              </span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={handleOpenFileManager}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FolderTree className="w-3.5 h-3.5 text-gray-500" />
                <span>Manage files</span>
              </span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={handleOpenPhpMyAdmin}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-gray-500" />
                <span>Manage in phpMyAdmin</span>
              </span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenDetails(website);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-gray-500" />
              <span>Website & SSL details</span>
            </button>

            {/* Danger Zone */}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDeleteRequest(website);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Remove website</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
