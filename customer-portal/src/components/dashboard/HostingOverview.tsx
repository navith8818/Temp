import React, { useState } from 'react';
import {
  Settings,
  MoreVertical,
  ExternalLink,
  Plus,
  Server,
  Copy,
  Check,
  RefreshCw,
  SlidersHorizontal,
  Calendar,
  Cpu,
} from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { HostingMetrics } from '@/components/dashboard/HostingMetrics';
import { useToast } from '@/components/ui/Toast';

interface HostingOverviewProps {
  plan: HostingPlan;
  onOpenManageDrawer: () => void;
  onOpenAddWebsite: () => void;
  onRefresh?: () => void;
}

export const HostingOverview: React.FC<HostingOverviewProps> = ({
  plan,
  onOpenManageDrawer,
  onOpenAddWebsite,
  onRefresh,
}) => {
  const { toast } = useToast();
  const [copiedIp, setCopiedIp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(plan.serverIp);
    setCopiedIp(true);
    toast('Copied to clipboard', `Server IP ${plan.serverIp} copied.`, 'success');
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const handleOpenHestiaSso = () => {
    toast(
      'HestiaCP Single Sign-On',
      `Opening secure control panel session for ${plan.hestiaUsername}... (Mock simulation)`,
      'info'
    );
    window.open(`https://${plan.serverHost}:${plan.controlPanelPort}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="shrink-0 rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
      {/* Top Header Row with Structured Middle Columns */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4">
        {/* Left: Server Identity */}
        <div className="flex items-start sm:items-center gap-3.5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0 shadow-xs">
            <Server className="w-5 h-5 stroke-[2]" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider uppercase text-gray-500">
                {plan.name}
              </span>
              <StatusBadge status={plan.status} />
              <span className="hidden sm:inline text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-500 font-mono">{plan.serverIp}</span>
              <button
                type="button"
                onClick={handleCopyIp}
                title="Copy Server IP"
                className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 rounded cursor-pointer"
                aria-label="Copy server IP"
              >
                {copiedIp ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {plan.primaryDomain}
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                {plan.tier}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Server Cluster & Renewal Columns */}
        <div className="hidden lg:grid grid-cols-2 gap-6 px-6 border-x border-gray-100 flex-1 max-w-xl">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Cluster Host & Stack
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
              <Cpu className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="font-mono truncate">{plan.serverHost}</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5 truncate">
              {plan.webServer} • PHP {plan.phpVersion}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Renewal Schedule
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
              <Calendar className="w-3.5 h-3.5 text-[#e8702a] shrink-0" />
              <span>{plan.renewalDate}</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              ${plan.renewalPrice.toFixed(2)} USD / {plan.billingCycle === 'annual' ? 'year' : 'month'} • {plan.autoRenew ? 'Auto-Pay Active' : 'Manual Pay'}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons - Lithos-Hero Pill Style */}
        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          {/* Manage Button - Triggers Left Side Drawer */}
          <button
            type="button"
            onClick={onOpenManageDrawer}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gray-900 hover:bg-black text-white transition-all shadow-xs active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8702a] cursor-pointer"
            id="manage-plan-button"
            aria-label="Manage hosting plan"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#e8702a]" />
            <span>Manage</span>
          </button>

          {/* Add Website Button */}
          <button
            type="button"
            onClick={onOpenAddWebsite}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-sm shadow-[#e8702a]/20 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8702a] cursor-pointer"
            aria-label="Add website to plan"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Website</span>
          </button>

          {/* Plan level 3-dot overflow menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors focus:outline-none cursor-pointer"
              aria-label="More plan options"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-200 shadow-xl z-50 py-2 text-xs animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleOpenHestiaSso();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#e8702a]" />
                    <span>Open HestiaCP (SSO)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenManageDrawer();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-gray-500" />
                    <span>Open Plan Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleCopyIp();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copy Server IP ({plan.serverIp})</span>
                  </button>

                  {onRefresh && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onRefresh();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                      <span>Refresh Telemetry</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row: 5 Full-Width Columns */}
      <HostingMetrics plan={plan} />
    </section>
  );
};