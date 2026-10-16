'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { HostingPlan, Website } from '@/types/hosting';
import { hostingService, INITIAL_HOSTING_PLAN, INITIAL_WEBSITES } from '@/data/mockHostingData';
import { HostingOverview } from '@/components/dashboard/HostingOverview';
import { WebsiteList } from '@/components/dashboard/WebsiteList';
import { AddWebsiteDialog } from '@/components/dashboard/AddWebsiteDialog';
import { WebsiteDetailsDialog } from '@/components/dashboard/WebsiteDetailsDialog';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { HostingManagementDrawer } from '@/components/drawer/HostingManagementDrawer';
import { useToast } from '@/components/ui/Toast';

export const HostingDashboard: React.FC = () => {
  const { toast } = useToast();

  // Primary state
  const [plan, setPlan] = useState<HostingPlan>(INITIAL_HOSTING_PLAN);
  const [websites, setWebsites] = useState<Website[]>(INITIAL_WEBSITES);
  const [isLoading, setIsLoading] = useState(false);

  // Modal & Drawer visibility
  const [isManageDrawerOpen, setIsManageDrawerOpen] = useState(false);
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [detailsWebsite, setDetailsWebsite] = useState<Website | null>(null);
  const [websiteToDelete, setWebsiteToDelete] = useState<Website | null>(null);

  // Sync state if needed
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const updatedPlan = await hostingService.getHostingPlan();
      const updatedSites = await hostingService.getWebsites();
      setPlan(updatedPlan);
      setWebsites(updatedSites);
      toast('Refreshed', 'Hosting telemetry updated from HestiaCP cluster.', 'success');
    } catch {
      toast('Error', 'Failed to refresh telemetry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteAdded = (newSite: Website) => {
    setWebsites((prev) => [newSite, ...prev]);
    setPlan((prev) => ({
      ...prev,
      websiteCount: prev.websiteCount + 1,
      domainCount: Math.min(prev.domainCount + 1, prev.domainLimit),
    }));
  };

  const handleWebsiteDeleted = async (websiteId: string) => {
    try {
      await hostingService.deleteWebsite(websiteId);
      setWebsites((prev) => prev.filter((w) => w.id !== websiteId));
      setPlan((prev) => ({
        ...prev,
        websiteCount: Math.max(prev.websiteCount - 1, 0),
        domainCount: Math.max(prev.domainCount - 1, 1),
      }));
      toast('Website Removed', 'The website has been removed from your hosting plan.', 'success');
    } catch {
      toast('Error', 'Failed to remove website.', 'error');
    }
  };

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col bg-[#f8f9fa] text-gray-900 overflow-hidden">
      {/* Top Subheader: Breadcrumb, Title & Single Primary Action Button */}
      <section className="shrink-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-3 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-0.5">
            <span>Customer Portal</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-700 font-semibold">Hosting Manager</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
            My Hosting
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 max-w-xl truncate">
            Manage your cloud hosting instance, connected websites, and HestiaCP control panel integrations.
          </p>
        </div>

        {/* Quick Actions Header: Single primary New Hosting button + telemetry refresh */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-full bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 border border-gray-200 shadow-2xs transition-colors focus:outline-none cursor-pointer"
            title="Refresh telemetry"
            aria-label="Refresh telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#e8702a]' : ''}`} />
          </button>

          {/* The single primary New Hosting button */}
          <Link
            href="/hosting/new"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-sm shadow-[#e8702a]/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8702a]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Hosting</span>
          </Link>
        </div>
      </section>

      {/* The Single Section Unified Body: Fills Remaining Viewport */}
      <main className="flex-1 min-h-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-2 flex flex-col gap-3 overflow-hidden">
        {/* Upper Part of Single Section: Hosting Overview & Metrics */}
        <HostingOverview
          plan={plan}
          onOpenManageDrawer={() => setIsManageDrawerOpen(true)}
          onOpenAddWebsite={() => setIsAddWebsiteOpen(true)}
          onRefresh={handleRefresh}
        />

        {/* Lower Part of Single Section: Linked Websites & Domains Manager */}
        <WebsiteList
          websites={websites}
          plan={plan}
          onAddWebsite={() => setIsAddWebsiteOpen(true)}
          onManageWebsite={() => {
            setIsManageDrawerOpen(true);
          }}
          onOpenDetails={(site) => setDetailsWebsite(site)}
          onDeleteRequest={(site) => setWebsiteToDelete(site)}
        />
      </main>

      {/* Pinned Bottom Status Bar */}
      <footer className="shrink-0 border-t border-gray-200/80 bg-white/70 backdrop-blur-xs py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Server Salad Cloud Infrastructure • Cluster EU-Central (London & Frankfurt)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-gray-400">HestiaCP v1.8</span>
            <a
              href="https://hestiacp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Docs</span>
              <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
            </a>
          </div>
        </div>
      </footer>

      {/* Section 7: Left-Side Slide-Over Management Drawer */}
      <HostingManagementDrawer
        isOpen={isManageDrawerOpen}
        onClose={() => setIsManageDrawerOpen(false)}
        plan={plan}
        onPlanUpdated={(updated) => setPlan(updated)}
      />

      {/* Section 5: Add Website Dialog */}
      <AddWebsiteDialog
        isOpen={isAddWebsiteOpen}
        onClose={() => setIsAddWebsiteOpen(false)}
        plan={plan}
        onWebsiteAdded={handleWebsiteAdded}
      />

      {/* Website Details Modal */}
      <WebsiteDetailsDialog
        website={detailsWebsite}
        plan={plan}
        onClose={() => setDetailsWebsite(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        website={websiteToDelete}
        isOpen={!!websiteToDelete}
        onClose={() => setWebsiteToDelete(null)}
        onConfirm={handleWebsiteDeleted}
      />
    </div>
  );
};
