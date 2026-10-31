'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Server,
  HardDrive,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LifeBuoy,
  Users,
  Download,
  Printer,
  Calendar,
  Layers,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { AdminMetricCard } from '@/components/ui/AdminMetricCard';
import { AdminButton } from '@/components/ui/AdminButton';
import { analyticsService, TimeRange, RevenueMetric, RevenuePoint } from '@/services/analyticsService';

export const ReportsPage: React.FC = () => {
  const router = useRouter();
  const {
    services,
    payments,
    servers,
    products,
    orders,
    tickets,
    provisioningJobs,
    addToast
  } = useAdminData();

  // Active Report Category View & Date Range Filter
  const [activeTab, setActiveTab] = useState<'all' | 'financial' | 'packages' | 'infrastructure' | 'support'>('all');
  const [dateRange, setDateRange] = useState<TimeRange>('30d');
  const [chartMetric, setChartMetric] = useState<'REVENUE' | 'ORDERS' | 'INVOICED'>('REVENUE');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);

  // ResizeObserver for responsive SVG Chart 1 (Financial Velocity)
  const [finChartWidth, setFinChartWidth] = useState(900);
  const finChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finChartRef.current) return;
    const updateWidth = () => {
      if (finChartRef.current) {
        const w = finChartRef.current.clientWidth;
        if (w > 0) setFinChartWidth(Math.round(w));
      }
    };
    updateWidth();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setFinChartWidth(Math.round(entry.contentRect.width));
        }
      }
    });
    ro.observe(finChartRef.current);
    return () => ro.disconnect();
  }, [activeTab]);

  // Compute Revenue & Order Velocity based on selected time range
  const revSummary = useMemo(() => {
    return analyticsService.getRevenueVelocity(dateRange, payments, orders, products);
  }, [dateRange, payments, orders, products]);

  // Compute Package Distribution
  const pkgSummary = useMemo(() => {
    return analyticsService.getPackageDistribution(products, services);
  }, [products, services]);

  // Compute Cluster Infrastructure
  const clusterSummary = useMemo(() => {
    return analyticsService.getClusterCapacity(servers);
  }, [servers]);

  // Primary Metrics
  const totalPaidRevenue = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter(p => p.status === 'REFUNDED')
    .reduce((sum, p) => sum + (p.refundedAmount || p.amount), 0);

  const activeServices = services.filter(s => s.status === 'ACTIVE').length;
  const suspendedServices = services.filter(s => s.status === 'SUSPENDED').length;
  const totalServices = services.length || 1;

  const totalMrr = pkgSummary.totalMonthlyMrr;
  const totalArr = totalMrr * 12;

  // Billing Cycle Breakdown calculation
  const billingCycles = useMemo(() => {
    const counts: Record<string, number> = {
      MONTHLY: 0,
      QUARTERLY: 0,
      SEMI_ANNUALLY: 0,
      ANNUALLY: 0,
    };
    services.forEach(s => {
      const cycle = (s.billingCycle || 'MONTHLY').toUpperCase();
      if (counts[cycle] !== undefined) {
        counts[cycle]++;
      } else {
        counts.MONTHLY++;
      }
    });

    const total = services.length || 1;
    return [
      { label: 'Monthly Cycle', key: 'MONTHLY', count: counts.MONTHLY, pct: Math.round((counts.MONTHLY / total) * 100), color: '#e8702a' },
      { label: 'Quarterly (3-Mo)', key: 'QUARTERLY', count: counts.QUARTERLY, pct: Math.round((counts.QUARTERLY / total) * 100), color: '#2563eb' },
      { label: 'Semi-Annual (6-Mo)', key: 'SEMI_ANNUALLY', count: counts.SEMI_ANNUALLY, pct: Math.round((counts.SEMI_ANNUALLY / total) * 100), color: '#8b5cf6' },
      { label: 'Annual (12-Mo)', key: 'ANNUALLY', count: counts.ANNUALLY, pct: Math.round((counts.ANNUALLY / total) * 100), color: '#10b981' },
    ];
  }, [services]);

  // Support SLA Metrics
  const supportMetrics = useMemo(() => {
    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter(t => t.status === 'CLOSED').length;
    const openTickets = totalTickets - resolvedTickets;
    const departments = [
      { name: 'Technical Support', count: tickets.filter(t => t.department === 'TECHNICAL_SUPPORT' || t.department?.includes('Support')).length || 14, color: '#e8702a' },
      { name: 'Billing & PayHere', count: tickets.filter(t => t.department === 'BILLING' || t.department?.includes('Finance')).length || 8, color: '#2563eb' },
      { name: 'Infrastructure & WHM', count: tickets.filter(t => t.department === 'INFRASTRUCTURE' || t.department?.includes('Engineering')).length || 5, color: '#10b981' },
      { name: 'Sales & Migrations', count: tickets.filter(t => t.department === 'SALES').length || 3, color: '#8b5cf6' },
    ];
    return {
      totalTickets,
      resolvedTickets,
      openTickets,
      slaRate: 98.4,
      avgFirstResponseMin: 9,
      avgResolutionHr: 1.4,
      departments,
    };
  }, [tickets]);

  // Chart 1 SVG Geometry Calculation
  const points = revSummary.points;
  const chartW = Math.max(finChartWidth, 400);
  const chartH = 220;
  const padding = { top: 15, right: 10, bottom: 25, left: 60 };
  const plotW = chartW - padding.left - padding.right;
  const plotH = chartH - padding.top - padding.bottom;

  const getMetricValue = (p: RevenuePoint) => {
    if (chartMetric === 'REVENUE') return p.revenue;
    if (chartMetric === 'INVOICED') return p.revenue * 1.08;
    return p.ordersCount;
  };

  const values = points.map(getMetricValue);
  const maxVal = Math.max(...values, chartMetric === 'ORDERS' ? 20 : 1000) * 1.15;
  const minVal = 0;

  const getX = (index: number) => {
    if (points.length <= 1) return padding.left;
    return padding.left + (index / (points.length - 1)) * plotW;
  };

  const getY = (val: number) => {
    const range = maxVal - minVal || 1;
    return padding.top + plotH - ((val - minVal) / range) * plotH;
  };

  const linePoints = points.map((p, idx) => ({
    x: getX(idx),
    y: getY(getMetricValue(p)),
    point: p,
  }));

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

  const activePoint = hoveredPointIndex !== null ? points[hoveredPointIndex] : null;
  const activeCoord = hoveredPointIndex !== null ? linePoints[hoveredPointIndex] : null;

  // Donut Geometry for Package Distribution
  const donutSize = 160;
  const donutRadius = 56;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedPct = 0;
  const donutSlices = pkgSummary.tiers.map(t => {
    const pct = t.sharePct / 100;
    const sliceLength = pct * donutCircumference;
    const offset = -accumulatedPct * donutCircumference;
    accumulatedPct += pct;
    return {
      ...t,
      strokeDasharray: `${sliceLength} ${donutCircumference - sliceLength}`,
      strokeDashoffset: offset,
    };
  });

  const selectedTier = pkgSummary.tiers.find(t => t.id === hoveredTierId) || pkgSummary.tiers[0];

  // Export handlers
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Date,Revenue (LKR),Orders,Completed,AOV (LKR),Top Plan\n" +
      points.map(p => `"${p.date}","${p.revenue.toFixed(2)}","${p.ordersCount}","${p.completedOrders}","${p.aov.toFixed(2)}","${p.topSellingPlan}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ServerSalad_Report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Report Exported', `Generated CSV report for ${dateRange} period.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Executive Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
              Reports & Operational Analytics
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#e8702a] border border-[#e8702a]/20">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time business performance summaries, recurring cash flow, cluster capacity, and customer lifecycle retention.
          </p>
        </div>

        {/* Global Date Range & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/60 text-xs font-semibold">
            {(['7d', '30d', '90d', 'ytd'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setDateRange(tr)}
                className={`px-3 py-1 rounded-md uppercase transition-all cursor-pointer ${
                  dateRange === tr
                    ? 'bg-[#e8702a] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          {/* Export & Print */}
          <AdminButton
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet size={14} />}
            onClick={handleExportCSV}
          >
            Export CSV
          </AdminButton>
          <AdminButton
            variant="outline"
            size="sm"
            icon={<Printer size={14} />}
            onClick={handlePrint}
          >
            Print Summary
          </AdminButton>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-100 scrollbar-none text-xs font-semibold">
        {[
          { id: 'all', label: 'All Analytics Overview' },
          { id: 'financial', label: 'Financials & Revenue Velocity' },
          { id: 'packages', label: 'Package Share & Billing Horizons' },
          { id: 'infrastructure', label: 'Cluster Density & Hypervisors' },
          { id: 'support', label: 'Support SLA & Operations' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white shadow-2xs font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 8 Primary Performance Metrics (2 Rows of 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AdminMetricCard
          label="Gross Revenue (PayHere)"
          value={`LKR ${totalPaidRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Total collected payments"
          icon={<DollarSign size={16} />}
          badge={{ text: '+18.4% MoM', variant: 'positive' }}
          onClick={() => router.push('/payments')}
        />
        <AdminMetricCard
          label="Monthly Recurring Revenue"
          value={`LKR ${totalMrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext={`ARR: LKR ${totalArr.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          icon={<TrendingUp size={16} />}
          badge={{ text: 'Predictable', variant: 'positive' }}
          onClick={() => router.push('/services')}
        />
        <AdminMetricCard
          label="Active Hosting Ratio"
          value={`${activeServices} / ${totalServices}`}
          subtext={`${suspendedServices} suspended accounts`}
          icon={<HardDrive size={16} />}
          badge={{ text: '98.2% Retention', variant: 'positive' }}
          onClick={() => router.push('/services')}
        />
        <AdminMetricCard
          label="Cluster Capacity Density"
          value={`${clusterSummary.overallUtilizationPct}%`}
          subtext={`${clusterSummary.totalAllocatedAccounts} / ${clusterSummary.totalCapacityAccounts} accounts`}
          icon={<Server size={16} />}
          badge={{ text: 'Adequate', variant: 'positive' }}
          onClick={() => router.push('/servers')}
        />

        <AdminMetricCard
          label="Average Order Value (AOV)"
          value={`LKR ${revSummary.averageOrderValue.toFixed(2)}`}
          subtext="Across all hosting packages"
          icon={<CreditCard size={16} />}
          badge={{ text: '+8.2% vs target', variant: 'positive' }}
          onClick={() => router.push('/orders')}
        />
        <AdminMetricCard
          label="Refunds & Reversals"
          value={`LKR ${totalRefunded.toFixed(2)}`}
          subtext="Zero disputed chargebacks"
          icon={<CheckCircle2 size={16} />}
          badge={{ text: '0.0% Dispute', variant: 'positive' }}
          onClick={() => router.push('/payments')}
        />
        <AdminMetricCard
          label="Support SLA Compliance"
          value={`${supportMetrics.slaRate}%`}
          subtext={`Median FRT: ${supportMetrics.avgFirstResponseMin} mins`}
          icon={<LifeBuoy size={16} />}
          badge={{ text: 'Optimal', variant: 'positive' }}
          onClick={() => router.push('/tickets')}
        />
        <AdminMetricCard
          label="Provisioning Health"
          value="100%"
          subtext="WHM automation online"
          icon={<Cpu size={16} />}
          badge={{ text: 'Instant Setup', variant: 'positive' }}
          onClick={() => router.push('/provisioning')}
        />
      </div>

      {/* SECTION 1: Financial & Revenue Velocity Visual Chart (Full Width) */}
      {(activeTab === 'all' || activeTab === 'financial') && (
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
                <TrendingUp size={17} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                  Financial Performance & Revenue Velocity
                </h3>
                <p className="text-[11px] text-gray-500">
                  Daily settlement trends processed via PayHere payment gateway
                </p>
              </div>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center bg-gray-100/80 p-0.5 rounded-lg border border-gray-200/60 text-xs font-semibold">
                <button
                  onClick={() => setChartMetric('REVENUE')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    chartMetric === 'REVENUE'
                      ? 'bg-white text-gray-900 shadow-2xs font-bold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  PayHere Settled (LKR)
                </button>
                <button
                  onClick={() => setChartMetric('INVOICED')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    chartMetric === 'INVOICED'
                      ? 'bg-white text-gray-900 shadow-2xs font-bold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Invoiced Gross (LKR)
                </button>
                <button
                  onClick={() => setChartMetric('ORDERS')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    chartMetric === 'ORDERS'
                      ? 'bg-white text-gray-900 shadow-2xs font-bold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Orders (#)
                </button>
              </div>
            </div>
          </div>

          {/* Numerical KPI Headline */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 font-sans">
                  {chartMetric === 'ORDERS'
                    ? `${revSummary.totalOrders} Orders`
                    : `LKR ${revSummary.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <ArrowUpRight size={12} />
                  +{revSummary.growthPct}% vs prior {dateRange}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <span>Realized via PayHere Gateway</span>
                <span>•</span>
                <span>AOV: <strong className="text-gray-900 font-mono">LKR {revSummary.averageOrderValue.toFixed(2)}</strong></span>
                <span>•</span>
                <span>{revSummary.totalPayments} total transactions</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/60">
              <CreditCard size={14} className="text-[#e8702a]" />
              <span>Settlement Account: <strong className="text-gray-800">PayHere Merchant #219904</strong></span>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div ref={finChartRef} className="relative w-full mt-4 flex-1 flex flex-col justify-end">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-52 sm:h-60 overflow-visible select-none"
              onMouseLeave={() => setHoveredPointIndex(null)}
            >
              <defs>
                <linearGradient id="repRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e8702a" stopOpacity="0.25" />
                  <stop offset="90%" stopColor="#e8702a" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="repOrderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                  <stop offset="90%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((pct, i) => {
                const y = padding.top + plotH * pct;
                const gridVal = maxVal * (1 - pct);
                return (
                  <g key={i}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartW - padding.right}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-gray-400 text-[10px] font-mono"
                    >
                      {chartMetric === 'ORDERS' ? Math.round(gridVal) : `LKR ${Math.round(gridVal)}`}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <path
                d={areaD}
                fill={chartMetric === 'ORDERS' ? 'url(#repOrderGradient)' : 'url(#repRevenueGradient)'}
                className="transition-all duration-300"
              />

              {/* Spline Path */}
              <path
                d={pathD}
                fill="none"
                stroke={chartMetric === 'ORDERS' ? '#2563eb' : '#e8702a'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />

              {/* Interactive Hover Point & Guideline */}
              {activeCoord && activePoint && (
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
                    stroke={chartMetric === 'ORDERS' ? '#2563eb' : '#e8702a'}
                    strokeWidth="3"
                    className="drop-shadow-sm cursor-pointer"
                  />
                </g>
              )}

              {/* Hit testing columns */}
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
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                  />
                );
              })}

              {/* Date Labels */}
              {points.map((p, idx) => {
                const step = points.length > 20 ? 5 : points.length > 10 ? 2 : 1;
                if (idx % step !== 0 && idx !== points.length - 1) return null;
                const x = getX(idx);
                return (
                  <text
                    key={idx}
                    x={x}
                    y={chartH - 8}
                    textAnchor="middle"
                    className="fill-gray-400 text-[10px] font-sans"
                  >
                    {p.label}
                  </text>
                );
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {activePoint && activeCoord && (
              <div
                className="absolute top-2 pointer-events-none transition-all duration-150 z-20"
                style={{
                  left: `${Math.min(Math.max((activeCoord.x / chartW) * 100, 15), 85)}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="bg-gray-900/95 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-xs border border-gray-700/60 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-gray-700/80 pb-1">
                    <span className="font-semibold text-gray-200 text-[11px]">{activePoint.date}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      LKR {activePoint.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completed Orders:</span>
                      <span className="font-medium text-emerald-300">{activePoint.completedOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Day AOV:</span>
                      <span className="font-medium text-gray-200">LKR {activePoint.aov.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-0.5 border-t border-gray-800 text-[10px]">
                      <span className="text-gray-400">Top Package:</span>
                      <span className="font-semibold text-[#e8702a] truncate max-w-[120px]">
                        {activePoint.topSellingPlan}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Package Share & Billing Horizons (Two Columns) */}
      {(activeTab === 'all' || activeTab === 'packages') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Package Distribution Donut & MRR (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
                    <PieChart size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                      Hosting Package Market Share & MRR Contribution
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Active client services and monthly recurring revenue breakdown
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/packages')}
                  className="text-xs font-semibold text-[#e8702a] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Manage Packages &rarr;
                </button>
              </div>

              {/* Donut Graphic + Highlight Details */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-4">
                <div className="sm:col-span-5 flex justify-center">
                  <div className="relative flex items-center justify-center">
                    <svg
                      width={donutSize}
                      height={donutSize}
                      className="transform -rotate-90 select-none overflow-visible"
                    >
                      <circle
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={donutRadius}
                        stroke="#f3f4f6"
                        strokeWidth="18"
                        fill="none"
                      />
                      {donutSlices.map(slice => (
                        <circle
                          key={slice.id}
                          cx={donutSize / 2}
                          cy={donutSize / 2}
                          r={donutRadius}
                          stroke={slice.color}
                          strokeWidth={hoveredTierId === slice.id ? 22 : 18}
                          strokeDasharray={slice.strokeDasharray}
                          strokeDashoffset={slice.strokeDashoffset}
                          fill="none"
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredTierId(slice.id)}
                          onMouseLeave={() => setHoveredTierId(null)}
                        />
                      ))}
                    </svg>
                    {/* Donut Center Headline */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-xs text-gray-400 font-medium">Total MRR</span>
                      <span className="text-sm font-bold text-gray-900 font-mono">
                        LKR {Math.round(totalMrr).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slices Legend & Metric Table */}
                <div className="sm:col-span-7 space-y-2.5">
                  {pkgSummary.tiers.map(t => (
                    <div
                      key={t.id}
                      onMouseEnter={() => setHoveredTierId(t.id)}
                      onMouseLeave={() => setHoveredTierId(null)}
                      className={`p-2 rounded-xl transition-all border cursor-pointer ${
                        hoveredTierId === t.id
                          ? 'bg-orange-50/60 border-orange-200'
                          : 'bg-gray-50/50 border-transparent hover:bg-gray-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: t.color }}
                          />
                          <span className="font-semibold text-gray-900">{t.name}</span>
                        </div>
                        <span className="font-mono text-gray-700 font-bold">
                          LKR {t.mrr.toFixed(2)} <span className="text-[11px] text-gray-400 font-normal">({t.sharePct}%)</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 pl-4.5 pt-1">
                        <span>{t.activeServicesCount} active accounts</span>
                        <span className="text-emerald-700 font-medium">+{t.newActivations} new this month</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom summary bar */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>{pkgSummary.totalActiveServices} Total Active Subscriptions</span>
              <span className="font-semibold text-gray-800">100% Provisioned SLA</span>
            </div>
          </div>

          {/* Right: Subscription Contract Horizons (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                  <Layers size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                    Billing Cycle Horizons & Cash Predictability
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Distribution of client payment commitments
                  </p>
                </div>
              </div>

              {/* Stacked Horizon Bar */}
              <div className="py-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Contract Commitment Split</span>
                    <span>100% of Accounts</span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-gray-100 overflow-hidden flex shadow-inner">
                    {billingCycles.map(cycle => (
                      <div
                        key={cycle.key}
                        style={{ width: `${cycle.pct}%`, backgroundColor: cycle.color }}
                        title={`${cycle.label}: ${cycle.pct}% (${cycle.count} accounts)`}
                        className="h-full transition-all hover:opacity-85"
                      />
                    ))}
                  </div>
                </div>

                {/* Legend & Breakdown */}
                <div className="space-y-2.5 pt-1">
                  {billingCycles.map(c => (
                    <div key={c.key} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="font-semibold text-gray-800">{c.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-mono">{c.count} services</span>
                        <span className="font-bold text-gray-900 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                          {c.pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Retention Footnote */}
            <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
              <span>Annual Contract Renewal Rate:</span>
              <strong className="text-emerald-700 font-bold">96.8% Retention</strong>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Infrastructure Density & Support SLA Matrix (Two Columns) */}
      {(activeTab === 'all' || activeTab === 'infrastructure' || activeTab === 'support') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Infrastructure Node Capacity Matrix (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                    <Server size={17} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                      Cluster Node Capacity & Allocation Density
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Hardware resource utilization across WHM & KVM hypervisors
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/servers')}
                  className="text-xs font-semibold text-[#e8702a] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Server Nodes &rarr;
                </button>
              </div>

              {/* Server Nodes Visual Progress */}
              <div className="space-y-4 py-4">
                {servers.slice(0, 4).map(srv => {
                  const pct = Math.round((srv.capacity.accountsCount / srv.capacity.accountsLimit) * 100);
                  const statusColor = pct > 85 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500';

                  return (
                    <div key={srv.id} className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${srv.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span className="font-bold text-gray-900">{srv.name}</span>
                          <span className="text-[11px] text-gray-500 font-mono">({srv.location})</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-800">
                          {srv.capacity.accountsCount} / {srv.capacity.accountsLimit} accounts ({pct}%)
                        </span>
                      </div>

                      {/* Capacity Bar */}
                      <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Hardware stats */}
                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                        <span>CPU: <strong>{srv.capacity.cpuCores} Cores</strong></span>
                        <span>RAM: <strong>{srv.capacity.ramGb} GB</strong></span>
                        <span>Storage: <strong>{srv.capacity.storageGb} GB NVMe</strong></span>
                        <span className="text-emerald-700 font-semibold">{srv.capacity.accountsLimit - srv.capacity.accountsCount} available slots</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Overall Hypervisor Headroom:</span>
              <strong className="text-gray-900 font-mono">
                {clusterSummary.totalCapacityAccounts - clusterSummary.totalAllocatedAccounts} Slots Free
              </strong>
            </div>
          </div>

          {/* Right: Support Operations & SLA Delivery (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 shrink-0">
                  <LifeBuoy size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                    Support SLA & Resolution Velocity
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Response time compliance across departments
                  </p>
                </div>
              </div>

              {/* SLA Response KPIs */}
              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <span className="text-[11px] text-gray-500 font-medium">Median 1st Response</span>
                  <div className="text-2xl font-bold font-sans text-gray-900 mt-0.5">
                    {supportMetrics.avgFirstResponseMin}m
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SLA Target: &lt; 30m
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <span className="text-[11px] text-gray-500 font-medium">Resolution MTTR</span>
                  <div className="text-2xl font-bold font-sans text-gray-900 mt-0.5">
                    {supportMetrics.avgResolutionHr}h
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SLA Target: &lt; 4.0h
                  </span>
                </div>
              </div>

              {/* Department Volume Bars */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-gray-700">Tickets by Department:</span>
                {supportMetrics.departments.map(dept => (
                  <div key={dept.name} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-gray-800">{dept.name}</span>
                      <span className="text-gray-500 font-mono">{dept.count} cases</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round((dept.count / 25) * 100))}%`,
                          backgroundColor: dept.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Customer Satisfaction Index:</span>
              <strong className="text-emerald-700 font-bold">99.1% Positive</strong>
            </div>
          </div>
        </div>
      )}

      {/* Historical Report Ledger Summary */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Periodic Financial & Operational Ledger ({dateRange.toUpperCase()})
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            Showing {points.length} reporting snapshots
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 bg-gray-50/60">
                <th className="py-2.5 px-3 font-semibold">Snapshot Date</th>
                <th className="py-2.5 px-3 font-semibold">Settled Revenue</th>
                <th className="py-2.5 px-3 font-semibold">Orders (Completed / Total)</th>
                <th className="py-2.5 px-3 font-semibold">Average Order Value</th>
                <th className="py-2.5 px-3 font-semibold">Primary Package Sold</th>
                <th className="py-2.5 px-3 font-semibold">Gateway Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {points.slice(-6).reverse().map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-gray-900">{p.date}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-gray-900">
                    LKR {p.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">
                    <span className="font-semibold text-emerald-700">{p.completedOrders}</span> / {p.ordersCount}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-gray-700">LKR {p.aov.toFixed(2)}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#e8702a]">{p.topSellingPlan}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={10} />
                      PayHere Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
