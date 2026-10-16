'use client';

import React, { useEffect, useRef } from 'react';
import { X, Server } from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { RenewalSection } from '@/components/drawer/RenewalSection';
import { HestiaAccessSection } from '@/components/drawer/HestiaAccessSection';
import { HostingUsageSection } from '@/components/drawer/HostingUsageSection';
import { FileStorageSection } from '@/components/drawer/FileStorageSection';
import { AdvancedOptionsSection } from '@/components/drawer/AdvancedOptionsSection';

interface HostingManagementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: HostingPlan;
  onPlanUpdated: (plan: HostingPlan) => void;
}

export const HostingManagementDrawer: React.FC<HostingManagementDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  onPlanUpdated,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key & focus trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/35 backdrop-blur-xs transition-opacity duration-250 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel from the LEFT side (380-460px on desktop) */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-heading"
        className={`fixed top-0 bottom-0 left-0 z-50 w-full sm:w-[440px] max-w-[460px] bg-white border-r border-gray-200 shadow-2xl flex flex-col transition-transform duration-250 ease-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="shrink-0 px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
              <Server className="w-5 h-5 stroke-[2]" />
            </div>

            <div className="min-w-0">
              <h2
                id="drawer-heading"
                className="text-base font-bold text-gray-900 tracking-tight truncate leading-tight"
              >
                {plan.name}
              </h2>
              <p className="text-xs text-gray-500 truncate font-mono mt-0.5">
                for {plan.primaryDomain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-200/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8702a] cursor-pointer"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Plan metadata subtitle banner */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] text-gray-500 flex flex-col gap-0.5">
          <span>Started on {plan.startedAt}. Updated on {plan.updatedAt}.</span>
          <span className="font-mono text-[10px] text-gray-400 truncate">
            Product ID: {plan.productId}
          </span>
        </div>

        {/* Scrollable Content Body with Generous Vertical Space */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
          {/* A. Renewal Section */}
          <RenewalSection plan={plan} onPlanUpdated={onPlanUpdated} />

          {/* B. HestiaCP Access */}
          <HestiaAccessSection plan={plan} defaultExpanded={true} />

          {/* C. Hosting Usage */}
          <HostingUsageSection plan={plan} defaultExpanded={true} />

          {/* D. Files & Storage */}
          <FileStorageSection plan={plan} defaultExpanded={false} />

          {/* Section 8: Advanced Options — Progressive Disclosure */}
          <AdvancedOptionsSection plan={plan} onPlanUpdated={onPlanUpdated} />
        </div>

        {/* Panel Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50/80 flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium text-gray-700">Server Salad Cloud Engine</span>
          <span className="font-mono text-gray-500">HestiaCP v1.8</span>
        </div>
      </aside>
    </>
  );
};
