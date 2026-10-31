'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import {
  analyticsService,
  TimeRange,
  RevenueMetric,
  RevenuePoint
} from '@/services/analyticsService';
import type { PaymentTransaction, Order, HostingProduct } from '@/types';

interface RevenueVelocityChartProps {
  payments?: PaymentTransaction[];
  orders?: Order[];
  products?: HostingProduct[];
}

export const RevenueVelocityChart: React.FC<RevenueVelocityChartProps> = ({
  payments: propPayments,
  orders: propOrders,
  products: propProducts
}) => {
  const router = useRouter();
  const adminData = useAdminData();

  const payments = propPayments || adminData.payments;
  const orders = propOrders || adminData.orders;
  const products = propProducts || adminData.products;
  const [metric, setMetric] = useState<RevenueMetric>('REVENUE');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const summary = useMemo(() => {
    return analyticsService.getRevenueVelocity(timeRange, payments, orders, products);
  }, [timeRange, payments, orders, products]);

  const points = summary.points;

  // Compute SVG plotting bounds
  const width = 760;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 58 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const values = points.map(p => (metric === 'REVENUE' ? p.revenue : p.ordersCount));
  const maxVal = Math.max(...values, metric === 'REVENUE' ? 1000 : 20) * 1.15;
  const minVal = 0;

  const getX = (index: number) => {
    if (points.length <= 1) return padding.left;
    return padding.left + (index / (points.length - 1)) * plotW;
  };

  const getY = (val: number) => {
    const range = maxVal - minVal || 1;
    return padding.top + plotH - ((val - minVal) / range) * plotH;
  };

  // Build SVG path strings
  const linePoints = points.map((p, idx) => ({
    x: getX(idx),
    y: getY(metric === 'REVENUE' ? p.revenue : p.ordersCount),
    point: p
  }));

  // Smooth line path using cubic Bezier curve
  const pathD = useMemo(() => {
    if (linePoints.length === 0) return '';
    if (linePoints.length === 1) return `M ${linePoints[0].x} ${linePoints[0].y}`;

    let d = `M ${linePoints[0].x} ${linePoints[0].y}`;
    for (let i = 0; i < linePoints.length - 1; i++) {
      const curr = linePoints[i];
      const next = linePoints[i + 1];
      const midX = (curr.x + next.x) / 2;
      d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [linePoints]);

  const areaD = useMemo(() => {
    if (linePoints.length === 0) return '';
    const lastX = linePoints[linePoints.length - 1].x;
    const firstX = linePoints[0].x;
    const bottomY = padding.top + plotH;
    return `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathD, linePoints, plotH]);

  // Selected or active point (only active when hovering over chart)
  const activeIndex = hoveredIndex;
  const activeItem = activeIndex !== null ? points[activeIndex] : null;
  const activeCoord = activeIndex !== null ? linePoints[activeIndex] : null;

  const handlePointClick = (p: RevenuePoint) => {
    if (metric === 'REVENUE') {
      router.push('/payments');
    } else {
      router.push('/orders');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs h-full flex flex-col justify-between transition-all">
      {/* Top Header Row with Icon, Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
            {metric === 'REVENUE' ? <DollarSign size={17} /> : <ShoppingCart size={17} />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                Revenue & Order Velocity
              </h3>
              <span title="Consolidated payment gateway settlements vs. order velocity over time" className="text-gray-400 hover:text-gray-600 cursor-help">
                <Info size={13} />
              </span>
            </div>

          </div>
        </div>

        {/* Action Controls: Dual Metric Switcher & Time Range */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Dual Metric Switcher */}
          <div className="flex items-center bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/60 text-xs font-semibold">
            <button
              onClick={() => setMetric('REVENUE')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                metric === 'REVENUE'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Revenue (LKR)
            </button>
            <button
              onClick={() => setMetric('ORDERS')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                metric === 'ORDERS'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Orders (#)
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/60 text-[11px] font-semibold">
            {(['7d', '30d', '90d', 'ytd'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-2 py-1 rounded-md uppercase transition-all cursor-pointer ${
                  timeRange === tr
                    ? 'bg-[#e8702a] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Numerical Headline */}
      <div className="pt-4 pb-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-sans">
              {metric === 'REVENUE'
                ? `LKR ${summary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `${summary.totalOrders} Orders`}
            </span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ArrowUpRight size={12} />
              <span>+{summary.growthPct}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
            <span>
              {metric === 'REVENUE'
                ? `${summary.totalPayments} total payment transactions`
                : `${summary.completedOrders} completed • ${summary.pendingOrders} pending • ${summary.cancelledOrders} cancelled`}
            </span>
            <span className="text-gray-300">•</span>
            <span className="font-medium text-gray-600">
              AOV: <span className="font-semibold text-gray-900">LKR {summary.averageOrderValue.toFixed(2)}</span>
            </span>
          </div>
        </div>

        {/* Gateway & Settlement Badge (PayHere Only) */}
        {metric === 'REVENUE' ? (
          <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60">
            <CreditCard size={13} className="text-[#e8702a]" />
            <span>Gateway: <strong className="text-gray-800">PayHere</strong></span>
            <span className="text-gray-300">|</span>
            <span>Settled: <strong className="text-emerald-700">LKR {summary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60">
            <TrendingUp size={13} className="text-gray-400" />
            <span>Fulfillment: <strong className="text-emerald-700">88.4% auto-active</strong></span>
          </div>
        )}
      </div>

      {/* Interactive Chart Container */}
      <div className="relative w-full mt-2 flex-1 flex flex-col justify-end">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-52 overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8702a" stopOpacity="0.22" />
              <stop offset="90%" stopColor="#e8702a" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.20" />
              <stop offset="90%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.33, 0.66, 1].map((pct, i) => {
            const y = padding.top + plotH * pct;
            const gridVal = maxVal * (1 - pct);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={i === 3 ? undefined : '3 3'}
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-gray-400 text-[10px] font-mono font-medium"
                >
                  {metric === 'REVENUE'
                    ? `LKR ${Math.round(gridVal >= 1000 ? gridVal / 1000 : gridVal)}${gridVal >= 1000 ? 'k' : ''}`
                    : Math.round(gridVal)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path
            d={areaD}
            fill={metric === 'REVENUE' ? 'url(#revenueGradient)' : 'url(#ordersGradient)'}
            className="transition-all duration-300"
          />

          {/* Polyline / Curve */}
          <path
            d={pathD}
            fill="none"
            stroke={metric === 'REVENUE' ? '#e8702a' : '#2563eb'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Interactive Hover Vertical Guideline & Point Highlight */}
          {activeCoord && activeItem && (
            <g className="transition-all duration-150">
              <line
                x1={activeCoord.x}
                y1={padding.top}
                x2={activeCoord.x}
                y2={padding.top + plotH}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="6"
                fill="#ffffff"
                stroke={metric === 'REVENUE' ? '#e8702a' : '#2563eb'}
                strokeWidth="3"
                className="drop-shadow-sm cursor-pointer"
                onClick={() => handlePointClick(activeItem)}
              />
            </g>
          )}

          {/* Invisible interactive vertical capture columns */}
          {linePoints.map((pt, idx) => {
            const colW = plotW / linePoints.length;
            return (
              <rect
                key={idx}
                x={pt.x - colW / 2}
                y={padding.top}
                width={colW}
                height={plotH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => handlePointClick(pt.point)}
              />
            );
          })}

          {/* X Axis Date Labels */}
          {points.map((p, idx) => {
            // Show every nth label to avoid crowding
            const step = points.length > 20 ? 5 : points.length > 10 ? 2 : 1;
            if (idx % step !== 0 && idx !== points.length - 1) return null;
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="fill-gray-400 text-[10px] font-sans font-medium"
              >
                {p.label}
              </text>
            );
          })}
        </svg>

        {/* Dynamic Tooltip Box */}
        {activeItem && activeCoord && (
          <div
            className="absolute top-2 pointer-events-none transition-all duration-150 z-20"
            style={{
              left: `${Math.min(Math.max(activeCoord.x - 100, 10), width - 210)}px`,
            }}
          >
            <div className="bg-gray-900/95 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-xs border border-gray-700/60 min-w-[190px]">
              <div className="flex items-center justify-between border-b border-gray-700/80 pb-1">
                <span className="font-semibold text-gray-200 text-[11px]">{activeItem.date}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {metric === 'REVENUE' ? `LKR ${activeItem.revenue.toFixed(2)}` : `${activeItem.ordersCount} orders`}
                </span>
              </div>

              <div className="space-y-0.5 text-[11px] text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed Orders:</span>
                  <span className="font-medium text-emerald-300">{activeItem.completedOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending / Cancelled:</span>
                  <span className="font-medium text-amber-300">
                    {activeItem.pendingOrders} / {activeItem.cancelledOrders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Day AOV:</span>
                  <span className="font-medium text-gray-200">LKR {activeItem.aov.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-0.5 border-t border-gray-800 text-[10px]">
                  <span className="text-gray-400">Top Product:</span>
                  <span className="font-semibold text-[#e8702a] truncate max-w-[110px]">
                    {activeItem.topSellingPlan}
                  </span>
                </div>
              </div>

              <div className="text-[9px] text-gray-400 text-center pt-0.5 italic">
                Click point to filter {metric === 'REVENUE' ? 'payments' : 'orders'} &rarr;
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
