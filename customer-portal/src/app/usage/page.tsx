'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  HardDrive,
  Activity,
  Globe,
  Layout,
  RefreshCw,
  ShieldCheck,
  Server,
  Layers,
  Database,
  Mail,
  Archive,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_HOSTING_PLAN } from '@/data/mockHostingData';
import { UsageProgress } from '@/components/ui/UsageProgress';
import { useToast } from '@/components/ui/Toast';

export default function UsagePage() {
  const { toast } = useToast();
  const [plan, setPlan] = useState(INITIAL_HOSTING_PLAN);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const storagePercent = Math.round((plan.storageUsedGb / plan.storageTotalGb) * 100);
  const bandwidthPercent = Math.round((plan.bandwidthUsedGb / plan.bandwidthTotalGb) * 100);
  const inodesPercent = Math.round((plan.inodesUsed / plan.inodesTotal) * 100);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast('Telemetry Updated', 'Live resource metrics refreshed from HestiaCP node.', 'success');
    }, 600);
  };

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col bg-[#f8f9fa] text-gray-900 overflow-hidden">
      {/* Top Subheader: Breadcrumb & Title */}
      <section className="shrink-0 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-0.5">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Customer Portal
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-700 font-semibold">Hosting Usage & Telemetry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Server Resource Usage & Telemetry
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 max-w-xl truncate">
            Real-time telemetry for {plan.primaryDomain} on {plan.serverHost} ({plan.serverIp})
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-2xs transition-colors cursor-pointer focus:outline-none"
            title="Refresh resource metrics"
            aria-label="Refresh resource metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#e8702a]' : 'text-gray-500'}`} />
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs transition-all cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-[#e8702a]" />
            <span>Manage Hosting Plan</span>
          </Link>
        </div>
      </section>

      {/* Main Single-Section Grid */}
      <main className="flex-1 min-h-0 w-full px-4 sm:px-6 lg:px-8 pb-2.5 flex flex-col gap-3.5 overflow-hidden">
        {/* 4 Essential Metric KPI Cards */}
        <section className="shrink-0 rounded-3xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Metric 1: NVMe SSD Storage */}
            <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/70 space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#e8702a]" />
                  Storage Allocation
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  NVMe SSD
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-gray-900">
                  {plan.storageUsedGb.toFixed(1)} GB
                </span>
                <span className="text-xs text-gray-500">
                  / {plan.storageTotalGb} GB ({storagePercent}%)
                </span>
              </div>
              <UsageProgress value={plan.storageUsedGb} max={plan.storageTotalGb} heightClass="h-1.5" />
              <div className="text-[11px] text-gray-500 pt-0.5 flex justify-between">
                <span>Free: {(plan.storageTotalGb - plan.storageUsedGb).toFixed(1)} GB</span>
                <span className="text-emerald-700 font-medium">Optimal</span>
              </div>
            </div>

            {/* Metric 2: Bandwidth */}
            <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/70 space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  Monthly Bandwidth
                </span>
                <span className="text-[10px] font-semibold text-gray-400">
                  Resets {plan.renewalDate}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-gray-900">
                  {plan.bandwidthUsedGb.toFixed(1)} GB
                </span>
                <span className="text-xs text-gray-500">
                  / {plan.bandwidthTotalGb} GB ({bandwidthPercent}%)
                </span>
              </div>
              <UsageProgress value={plan.bandwidthUsedGb} max={plan.bandwidthTotalGb} heightClass="h-1.5" />
              <div className="text-[11px] text-gray-500 pt-0.5 flex justify-between">
                <span>Remaining: {(plan.bandwidthTotalGb - plan.bandwidthUsedGb).toFixed(1)} GB</span>
                <span className="text-emerald-700 font-medium">91% Free</span>
              </div>
            </div>

            {/* Metric 3: Inodes / File Descriptors */}
            <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-200/70 space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  Inodes Allocation
                </span>
                <span className="text-[10px] font-semibold text-gray-400">
                  File Count
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-gray-900">
                  {plan.inodesUsed.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  / {plan.inodesTotal.toLocaleString()} ({inodesPercent}%)
                </span>
              </div>
              <UsageProgress value={plan.inodesUsed} max={plan.inodesTotal} heightClass="h-1.5" />
              <div className="text-[11px] text-gray-500 pt-0.5 flex justify-between">
                <span>Available: {(plan.inodesTotal - plan.inodesUsed).toLocaleString()}</span>
                <span className="text-emerald-700 font-medium">Healthy</span>
              </div>
            </div>

            {/* Metric 4: Domains & Websites */}
            <div className="p-3.5 rounded-2xl bg-[#fcf5f1]/60 border border-[#e8702a]/20 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#e8702a] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#e8702a]" />
                    Domain Slots
                  </span>
                  <span className="text-[10px] font-bold text-[#e8702a] bg-[#fcf5f1] px-1.5 py-0.5 rounded-full border border-[#e8702a]/20">
                    {plan.domainLimit - plan.domainCount} Available
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-gray-900">
                    {plan.domainCount}
                  </span>
                  <span className="text-xs text-gray-500">/ {plan.domainLimit} Allocated</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e8702a]/10 flex items-center justify-between text-[11px] text-gray-600">
                <span>Active Websites: <strong>{plan.websiteCount}</strong></span>
                <span>Mailboxes: <strong>{plan.mailboxesUsed}/{plan.mailboxesLimit}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown & Server Specifications (Scrollable within viewport) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Storage Breakdown Details */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-orange-50 text-[#e8702a] flex items-center justify-center">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Disk Consumption by Category</h3>
                    <p className="text-[11px] text-gray-500">Actual disk usage across system directories</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-gray-900">{plan.storageUsedGb.toFixed(1)} GB Total</span>
              </div>

              <div className="space-y-3 pt-3.5">
                {/* Web Files */}
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-gray-700 font-medium">
                    <Layout className="w-3.5 h-3.5 text-gray-400" />
                    Web Application & Static Assets
                  </span>
                  <span className="font-mono font-bold text-gray-900">{plan.storageBreakdown.webGb} GB</span>
                </div>
                <UsageProgress value={plan.storageBreakdown.webGb} max={plan.storageTotalGb} heightClass="h-1.5" />

                {/* Databases */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-2 text-gray-700 font-medium">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    MySQL / MariaDB Databases
                  </span>
                  <span className="font-mono font-bold text-gray-900">{plan.storageBreakdown.dbGb} GB</span>
                </div>
                <UsageProgress value={plan.storageBreakdown.dbGb} max={plan.storageTotalGb} heightClass="h-1.5" />

                {/* Mail Storage */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-2 text-gray-700 font-medium">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    Mailboxes & Inbox Archives
                  </span>
                  <span className="font-mono font-bold text-gray-900">{plan.storageBreakdown.mailGb} GB</span>
                </div>
                <UsageProgress value={plan.storageBreakdown.mailGb} max={plan.storageTotalGb} heightClass="h-1.5" />

                {/* Backups */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="flex items-center gap-2 text-gray-700 font-medium">
                    <Archive className="w-3.5 h-3.5 text-purple-500" />
                    Local Snapshot Backups
                  </span>
                  <span className="font-mono font-bold text-gray-900">{plan.storageBreakdown.backupGb} GB</span>
                </div>
                <UsageProgress value={plan.storageBreakdown.backupGb} max={plan.storageTotalGb} heightClass="h-1.5" />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 mt-4">
              <span>Automatic cleanup deletes temporary cache files every midnight</span>
              <span className="font-mono text-emerald-600 font-semibold">Healthy I/O</span>
            </div>
          </div>

          {/* Runtime & Server Cluster Specifications */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Cluster Runtime Specifications</h3>
                    <p className="text-[11px] text-gray-500">Environment and server execution software</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Node Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3.5 text-xs">
                <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Web Server Stack
                  </span>
                  <span className="font-semibold text-gray-900">{plan.webServer}</span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    PHP Runtime Engine
                  </span>
                  <span className="font-semibold text-gray-900">PHP {plan.phpVersion}</span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    SSL Security Layer
                  </span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Let&apos;s Encrypt Wildcard
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Backup Snapshot Frequency
                  </span>
                  <span className="font-semibold text-gray-900">{plan.backupSummary.frequency}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-[#fcf5f1]/60 border border-[#e8702a]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e8702a]" />
                <span className="text-gray-700 font-medium">HestiaCP v1.8 Cluster Management Port: <strong>{plan.controlPanelPort}</strong></span>
              </div>
              <a
                href={`https://${plan.serverHost}:${plan.controlPanelPort}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e8702a] hover:underline"
              >
                <span>Hestia Login</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Pinned Bottom Status Bar */}
      <footer className="shrink-0 border-t border-gray-200/80 bg-white/70 backdrop-blur-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Cluster EU-Central (London & Frankfurt) • Node Telemetry Synchronized</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-gray-400">{plan.serverIp}</span>
            <span className="text-gray-400">99.99% Node Uptime</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
