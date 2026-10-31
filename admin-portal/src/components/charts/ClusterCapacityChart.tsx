'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Server,
  Layers,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ToggleLeft,
  ToggleRight,
  Cpu,
  HardDrive,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { analyticsService, NodeCapacityMetric } from '@/services/analyticsService';
import type { HostingServer } from '@/types';

interface ClusterCapacityChartProps {
  servers?: HostingServer[];
  onToggleAllocation?: (serverId: string) => void;
}

export const ClusterCapacityChart: React.FC<ClusterCapacityChartProps> = ({
  servers: propServers,
  onToggleAllocation: propOnToggleAllocation
}) => {
  const router = useRouter();
  const adminData = useAdminData();

  const servers = propServers || adminData.servers;
  const onToggleAllocation = propOnToggleAllocation || adminData.toggleServerAllocation;

  const [sortBy, setSortBy] = useState<'UTILIZATION' | 'PROVIDER' | 'LOCATION' | 'NAME'>('UTILIZATION');
  const [filterProvider, setFilterProvider] = useState<string>('ALL');
  const [filterLocation, setFilterLocation] = useState<string>('ALL');
  const [confirmToggleNode, setConfirmToggleNode] = useState<NodeCapacityMetric | null>(null);
  const [isUpdatingAllocation, setIsUpdatingAllocation] = useState<string | null>(null);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [showAllNodes, setShowAllNodes] = useState(false);

  const capacitySummary = useMemo(() => {
    return analyticsService.getClusterCapacity(servers, sortBy, filterProvider, filterLocation);
  }, [servers, sortBy, filterProvider, filterLocation]);

  const nodes = capacitySummary.nodes;
  const visibleNodes = showAllNodes ? nodes : nodes.slice(0, 3);

  const toggleNodeExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeId(prev => (prev === nodeId ? null : nodeId));
  };

  const handleToggle = async (node: NodeCapacityMetric, e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.allocationEnabled) {
      setConfirmToggleNode(node);
      return;
    }
    await executeToggle(node.id, true);
  };

  const executeToggle = async (nodeId: string, newState: boolean) => {
    setIsUpdatingAllocation(nodeId);
    try {
      await analyticsService.toggleServerAllocation(nodeId, newState);
      if (onToggleAllocation) {
        onToggleAllocation(nodeId);
      }
    } finally {
      setIsUpdatingAllocation(null);
      setConfirmToggleNode(null);
    }
  };

  // Helper color functions for thresholds
  const getCpuColor = (pct: number) => {
    if (pct >= 85) return 'bg-rose-500';
    if (pct >= 65) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getRamColor = (pct: number) => {
    if (pct >= 85) return 'bg-rose-500';
    if (pct >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getDiskColor = (pct: number) => {
    if (pct >= 85) return 'bg-rose-500';
    if (pct >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getAccountsBarColor = (utilPct: number, available: number, status: string) => {
    if (available === 0) return 'bg-rose-500';
    if (status === 'MAINTENANCE') return 'bg-gray-400';
    if (utilPct >= 85) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const renderNodeCard = (node: NodeCapacityMetric) => {
          const accountsBarColor = getAccountsBarColor(node.utilizationPct, node.accountsAvailable, node.status);
          const cpuColor = getCpuColor(node.cpuLoadPct);
          const ramColor = getRamColor(node.ramUsagePct);
          const diskColor = getDiskColor(node.storageUsagePct);
          const isExpanded = expandedNodeId === node.id;

          return (
            <div
              key={node.id}
              onClick={(e) => toggleNodeExpand(node.id, e)}
              className="p-4 rounded-xl border border-gray-200/80 bg-white hover:border-[#e8702a]/40 hover:shadow-xs transition-all cursor-pointer space-y-3 group"
            >
              {/* Row Header: Node Name, Hostname, Provider, Location, Status & Allocation Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-sm group-hover:text-[#e8702a] transition-colors">
                    {node.name}
                  </span>

                  {/* Provider Tag */}
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200/60 uppercase">
                    {node.provider.replace('_', ' ')}
                  </span>

                  {/* Location Tag */}
                  <span className="text-[11px] text-gray-500">
                    {node.location}
                  </span>

                  {/* Status Indicator */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                      node.status === 'ONLINE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : node.status === 'MAINTENANCE'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}
                  >
                    {node.status === 'ONLINE' ? (
                      <CheckCircle2 size={10} />
                    ) : node.status === 'MAINTENANCE' ? (
                      <Wrench size={10} />
                    ) : (
                      <AlertCircle size={10} />
                    )}
                    {node.status}
                  </span>
                </div>

                {/* Right: Allocation Toggle Button */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  {/* Allocation Toggle Button */}
                  <button
                    onClick={e => handleToggle(node, e)}
                    disabled={isUpdatingAllocation === node.id}
                    title={node.allocationEnabled ? 'Disable automated customer account allocation on this node' : 'Enable automated account allocation'}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      node.allocationEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {node.allocationEnabled ? (
                      <>
                        <ToggleRight size={15} className="text-emerald-600" />
                        <span>Allocating</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={15} className="text-gray-400" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Account Allocation Density Progress Bar & Single Clean Density Metrics */}
              <div className="space-y-2">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${accountsBarColor}`}
                    style={{ width: `${Math.min(100, node.utilizationPct)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-600 font-medium">
                    Account Density: <strong className="text-gray-900 font-mono font-semibold">{node.utilizationPct}%</strong> ({node.accountsCount}/{node.accountsLimit} accounts)
                    <span className="text-gray-300 mx-1.5">•</span>
                    {node.accountsAvailable > 0 ? (
                      <span className="text-emerald-700 font-semibold font-mono">+{node.accountsAvailable} free slots</span>
                    ) : (
                      <span className="text-rose-600 font-semibold font-mono">Full capacity</span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => toggleNodeExpand(node.id, e)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/70 transition-all cursor-pointer"
                  >
                    <Cpu size={12} className="text-[#e8702a]" />
                    <span>{isExpanded ? 'Hide Hardware' : 'Inspect Hardware (CPU, RAM, SSD)'}</span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 text-gray-500 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Hardware Progress Bars: Single Server Expand with Smooth Grow Animation */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isExpanded
                    ? 'grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-gray-100/90'
                    : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in zoom-in-95 duration-200">
                
                {/* 1. CPU Load Progress Bar */}
                <div className="bg-[#fafafa]/80 p-2.5 rounded-xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Cpu size={13} className="text-gray-500" />
                      <span className="font-semibold text-gray-700 text-[11px]">CPU Load</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-gray-900 text-xs">{node.cpuLoadPct}%</span>
                      <span className="text-[10px] text-gray-400 ml-1">({node.cpuCores}c)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cpuColor}`}
                      style={{ width: `${Math.min(100, node.cpuLoadPct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 pt-0.5">
                    <span>Active Cores: {node.cpuCores}</span>
                    <span className={node.cpuLoadPct >= 80 ? 'text-rose-600 font-semibold' : 'text-emerald-700'}>
                      {node.cpuLoadPct >= 80 ? 'Heavy Load' : 'Normal'}
                    </span>
                  </div>
                </div>

                {/* 2. RAM Usage Progress Bar */}
                <div className="bg-[#fafafa]/80 p-2.5 rounded-xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Layers size={13} className="text-gray-500" />
                      <span className="font-semibold text-gray-700 text-[11px]">RAM Usage</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-gray-900 text-xs">{node.ramUsagePct}%</span>
                      <span className="text-[10px] text-gray-400 ml-1">({node.ramUsageGb}/{node.ramTotalGb}GB)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${ramColor}`}
                      style={{ width: `${Math.min(100, node.ramUsagePct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 pt-0.5">
                    <span>Available:</span>
                    <span className="font-semibold text-gray-700 font-mono">
                      {node.ramTotalGb - node.ramUsageGb} GB free
                    </span>
                  </div>
                </div>

                {/* 3. NVMe SSD Storage Progress Bar */}
                <div className="bg-[#fafafa]/80 p-2.5 rounded-xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <HardDrive size={13} className="text-gray-500" />
                      <span className="font-semibold text-gray-700 text-[11px]">NVMe SSD</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-gray-900 text-xs">{node.storageUsagePct}%</span>
                      <span className="text-[10px] text-gray-400 ml-1">
                        ({(node.storageUsageGb / 1000).toFixed(1)}/{(node.storageTotalGb / 1000).toFixed(1)}TB)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${diskColor}`}
                      style={{ width: `${Math.min(100, node.storageUsagePct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 pt-0.5">
                    <span>Available:</span>
                    <span className="font-semibold text-gray-700 font-mono">
                      {((node.storageTotalGb - node.storageUsageGb) / 1000).toFixed(1)} TB free
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
            <Server size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Cluster Node Capacity & Allocation Density
            </h3>
          </div>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/70 rounded-lg px-2.5 py-1 text-gray-600">
            <ArrowUpDown size={12} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            >
              <option value="UTILIZATION">Sort: Utilization</option>
              <option value="NAME">Sort: Name</option>
              <option value="PROVIDER">Sort: Provider</option>
              <option value="LOCATION">Sort: Location</option>
            </select>
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/70 rounded-lg px-2.5 py-1 text-gray-600">
            <Filter size={12} className="text-gray-400" />
            <select
              value={filterProvider}
              onChange={e => setFilterProvider(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Providers</option>
              <option value="WHM_CPANEL">WHM/cPanel</option>
              <option value="DIRECT_ADMIN">DirectAdmin</option>
              <option value="PROXMOX_KVM">Proxmox KVM</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/70 rounded-lg px-2.5 py-1 text-gray-600">
            <select
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Regions</option>
              <option value="London">London (UK)</option>
              <option value="Frankfurt">Frankfurt (DE)</option>
              <option value="Virginia">Virginia (US)</option>
            </select>
          </div>


        </div>
      </div>

      {/* Node Rows List */}
      <div className="space-y-3.5">
        {/* Primary 3 Server Nodes (Always Visible) */}
        {nodes.slice(0, 3).map(node => renderNodeCard(node))}

        {/* Overflow Server Nodes with Height Grow Animation */}
        {nodes.length > 3 && (
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showAllNodes
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0 pointer-events-none'
            }`}
          >
            <div className="overflow-hidden space-y-3.5">
              {nodes.slice(3).map(node => (
                <div key={node.id} className="animate-in fade-in zoom-in-95 duration-200">
                  {renderNodeCard(node)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Left-Aligned Show More / Show Less Button */}
        {nodes.length > 3 && (
          <div className="pt-1 flex justify-start">
            <button
              type="button"
              onClick={() => setShowAllNodes(prev => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80 transition-all cursor-pointer shadow-2xs"
            >
              <span>
                {showAllNodes ? 'Show Less Nodes' : `Show More Nodes (${nodes.length - 3} more)`}
              </span>
              {showAllNodes ? (
                <ChevronUp size={14} className="text-gray-500" />
              ) : (
                <ChevronDown size={14} className="text-gray-500" />
              )}
            </button>
          </div>
        )}

        {nodes.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl">
            No servers match the selected provider/location filter.
          </div>
        )}
      </div>

      {/* Confirmation Modal for Disabling Allocation */}
      {confirmToggleNode && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-gray-200 space-y-3">
            <h4 className="text-sm font-bold text-gray-900">
              Disable Allocation on {confirmToggleNode.name}?
            </h4>
            <p className="text-xs text-gray-600">
              Pausing allocation will stop new automated orders from placing accounts on <strong>{confirmToggleNode.hostname}</strong>. Existing hosted accounts will not be affected.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmToggleNode(null)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeToggle(confirmToggleNode.id, false)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
