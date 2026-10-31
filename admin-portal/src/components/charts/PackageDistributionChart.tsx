'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  PieChart,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { analyticsService } from '@/services/analyticsService';
import type { HostingProduct, HostingService } from '@/types';

interface PackageDistributionChartProps {
  products?: HostingProduct[];
  services?: HostingService[];
}

export const PackageDistributionChart: React.FC<PackageDistributionChartProps> = ({
  products: propProducts,
  services: propServices
}) => {
  const router = useRouter();
  const adminData = useAdminData();

  const products = propProducts || adminData.products;
  const services = propServices || adminData.services;
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);

  const summary = useMemo(() => {
    return analyticsService.getPackageDistribution(products, services);
  }, [products, services]);

  const tiers = summary.tiers;
  const totalActive = summary.totalActiveServices;

  // Geometry for SVG Donut
  const size = 152;
  const strokeWidth = 20;
  const radius = 54;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke-dasharray and stroke-dashoffset for each slice
  let accumulatedPct = 0;
  const slices = tiers.map(t => {
    const pct = t.sharePct / 100;
    const sliceLength = pct * circumference;
    const offset = -accumulatedPct * circumference;
    accumulatedPct += pct;
    return {
      ...t,
      strokeDasharray: `${sliceLength} ${circumference - sliceLength}`,
      strokeDashoffset: offset,
    };
  });

  const activeTier = tiers.find(t => t.id === hoveredTierId) || null;

  const handleTierClick = (tierId: string) => {
    router.push(`/services?product=${tierId}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between transition-all">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
            <PieChart size={17} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight truncate">
              Hosting Package Distribution & MRR
            </h3>
            <p className="text-[11px] text-gray-400 truncate">
              Active accounts, revenue share & growth
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/packages')}
          className="text-xs font-semibold text-[#e8702a] hover:underline flex items-center gap-1 shrink-0 cursor-pointer pt-0.5"
        >
          <span>Packages</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Centered Donut Graphic */}
      <div className="flex justify-center py-1">
        <div className="relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90 select-none overflow-visible"
          >
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {slices.map(slice => {
              const isHovered = hoveredTierId === slice.id;
              return (
                <circle
                  key={slice.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredTierId(slice.id)}
                  onMouseLeave={() => setHoveredTierId(null)}
                  onClick={() => handleTierClick(slice.id)}
                />
              );
            })}
          </svg>

          {/* Center Text (Always Total Active Services, never replaced on hover) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 select-none">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              Active
            </span>
            <span className="text-3xl font-bold text-gray-900 font-mono leading-tight">
              {totalActive}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              Services
            </span>
          </div>
        </div>
      </div>

      {/* Compact Numerical Breakdown Table */}
      <div className="space-y-2 pt-1 text-xs">
        {tiers.map(tier => {
          const isHovered = hoveredTierId === tier.id;
          return (
            <div
              key={tier.id}
              onMouseEnter={() => setHoveredTierId(tier.id)}
              onMouseLeave={() => setHoveredTierId(null)}
              onClick={() => handleTierClick(tier.id)}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                isHovered
                  ? 'bg-[#fcf5f1]/60 border-[#e8702a]/30 shadow-2xs'
                  : 'border-gray-100/90 bg-[#fafafa]/60 hover:bg-white hover:border-gray-200'
              }`}
            >
              {/* Left Column: Indicator dot, plan name, customer count */}
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: tier.color }}
                />
                <div className="min-w-0">
                  <span className="font-bold text-gray-900 text-xs block truncate">
                    {tier.name}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium font-mono block">
                    {tier.activeServicesCount} {tier.activeServicesCount === 1 ? 'account' : 'accounts'} • {tier.customerCount} {tier.customerCount === 1 ? 'client' : 'clients'}
                  </span>
                </div>
              </div>

              {/* Right Column: MRR, share percentage, and growth indicator */}
              <div className="text-right shrink-0">
                <div className="font-bold text-gray-900 font-mono text-sm">
                  LKR {tier.mrr.toFixed(2)}
                  <span className="text-[10px] font-normal text-gray-400 ml-0.5">/mo</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono">
                  <span className="font-bold text-gray-800">{tier.sharePct}%</span>
                  <span className="text-emerald-700 font-medium bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/50">
                    +{tier.newActivations} new
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Pill */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-1 min-w-0 truncate">
          <DollarSign size={13} className="text-emerald-600 shrink-0" />
          <span className="truncate">
            Platform MRR: <strong className="text-gray-900 font-bold font-mono text-xs">LKR {summary.totalMonthlyMrr.toFixed(2)}</strong>
          </span>
        </div>
        <span className="text-emerald-700 font-semibold font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 shrink-0 ml-2">
          +{summary.netGrowthServices} net
        </span>
      </div>
    </div>
  );
};
