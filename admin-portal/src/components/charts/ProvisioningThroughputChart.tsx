'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  ExternalLink,
  ShieldAlert,
  Server,
  User,
  Globe
} from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { analyticsService, TimeRange, ProvisioningDayPoint } from '@/services/analyticsService';
import type { ProvisioningJob } from '@/types';

interface ProvisioningThroughputChartProps {
  jobs?: ProvisioningJob[];
  onRetryJob?: (jobId: string) => void;
}

export const ProvisioningThroughputChart: React.FC<ProvisioningThroughputChartProps> = ({
  jobs: propJobs,
  onRetryJob: propOnRetryJob
}) => {
  const router = useRouter();
  const adminData = useAdminData();

  const jobs = propJobs || adminData.provisioningJobs;
  const onRetryJob = propOnRetryJob || adminData.retryProvisioningJob;

  const [timeRange, setTimeRange] = useState<TimeRange>('14d' as any);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Series visibility toggles for clickable legend isolation
  const [visibleSeries, setVisibleSeries] = useState<{
    succeeded: boolean;
    queuedRetrying: boolean;
    failed: boolean;
  }>({
    succeeded: true,
    queuedRetrying: true,
    failed: true,
  });

  // Slide-over state for inspecting failed jobs
  const [selectedFailedJob, setSelectedFailedJob] = useState<ProvisioningJob | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const summary = useMemo(() => {
    return analyticsService.getProvisioningThroughput(timeRange, jobs);
  }, [timeRange, jobs]);

  const points = summary.points;

  // Chart bounds
  const width = 500;
  const height = 180;
  const padding = { top: 15, right: 15, bottom: 25, left: 35 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Calculate maximum total jobs across days for Y-axis scale
  const maxJobs = Math.max(...points.map(p => p.total), 20) * 1.15;

  const toggleSeries = (key: 'succeeded' | 'queuedRetrying' | 'failed') => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  const handleBarClick = (p: ProvisioningDayPoint) => {
    if (p.failed > 0) {
      // Find a failed job from the jobs list or synthesize the inspection
      const failedJob = jobs.find(j => j.status === 'FAILED') || jobs[0];
      setSelectedFailedJob(failedJob);
    } else {
      router.push('/provisioning');
    }
  };

  const handleRetry = async (jobId: string) => {
    setIsRetrying(true);
    try {
      await analyticsService.retryProvisioningJob(jobId);
      if (onRetryJob) {
        onRetryJob(jobId);
      }
      setTimeout(() => {
        setIsRetrying(false);
        setSelectedFailedJob(null);
      }, 600);
    } catch {
      setIsRetrying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-2xs h-full flex flex-col justify-between relative transition-all">
      {/* Header Row */}
      <div className="pb-3 border-b border-gray-100 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
            <Cpu size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight truncate">
              Automated Provisioning Throughput
            </h3>

          </div>
        </div>

        {/* Legend with interactive isolation click */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-4 text-xs pt-0.5">
          <button
            onClick={() => toggleSeries('succeeded')}
            className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${
              visibleSeries.succeeded ? 'opacity-100 font-semibold' : 'opacity-35 line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-gray-700">Success</span>
          </button>

          <button
            onClick={() => toggleSeries('queuedRetrying')}
            className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${
              visibleSeries.queuedRetrying ? 'opacity-100 font-semibold' : 'opacity-35 line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
            <span className="text-gray-700">Queue/Retry</span>
          </button>

          <button
            onClick={() => toggleSeries('failed')}
            className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${
              visibleSeries.failed ? 'opacity-100 font-semibold' : 'opacity-35 line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
            <span className="text-gray-700">Failed</span>
          </button>
        </div>
      </div>

      {/* Numerical Summary Headline */}
      <div className="pt-4 pb-2 flex items-baseline justify-between text-xs">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold tracking-tight text-gray-900 font-sans">
            {summary.successRatePct}%
          </span>
          <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            {summary.succeededJobs} / {summary.totalJobs} Succeeded
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 font-mono text-[11px]">
          <Clock size={12} className="text-gray-400" />
          <span>Median Speed: <strong className="text-gray-800 font-semibold">{summary.medianDurationSec}s</strong></span>
        </div>
      </div>

      {/* Interactive Stacked Column Chart */}
      <div className="relative w-full mt-2 flex-1 flex flex-col justify-end">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-52 overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Horizontal Grid Lines */}
          {[0, 0.5, 1].map((pct, idx) => {
            const y = padding.top + plotH * pct;
            const val = Math.round(maxJobs * (1 - pct));
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-gray-400 text-[10px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Stacked Columns */}
          {points.map((p, idx) => {
            const colWidth = Math.max(12, Math.min(24, (plotW / points.length) * 0.65));
            const x = padding.left + (idx / (points.length - 1 || 1)) * (plotW - colWidth);

            const succCount = visibleSeries.succeeded ? p.succeeded : 0;
            const queueCount = visibleSeries.queuedRetrying ? (p.queued + p.retrying) : 0;
            const failCount = visibleSeries.failed ? p.failed : 0;

            const succH = (succCount / maxJobs) * plotH;
            const queueH = (queueCount / maxJobs) * plotH;
            const failH = (failCount / maxJobs) * plotH;

            const baseBottom = padding.top + plotH;
            const succY = baseBottom - succH;
            const queueY = succY - queueH;
            const failY = queueY - failH;

            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => handleBarClick(p)}
              >
                {/* Background Hover bar column highlight */}
                {isHovered && (
                  <rect
                    x={x - 4}
                    y={padding.top}
                    width={colWidth + 8}
                    height={plotH}
                    fill="#f8fafc"
                    rx="4"
                  />
                )}

                {/* Succeeded Segment */}
                {succH > 0 && (
                  <rect
                    x={x}
                    y={succY}
                    width={colWidth}
                    height={succH}
                    fill="#10b981"
                    rx="2"
                    className="transition-all duration-300"
                  />
                )}

                {/* Queued / Retrying Segment */}
                {queueH > 0 && (
                  <rect
                    x={x}
                    y={queueY}
                    width={colWidth}
                    height={queueH}
                    fill="#f59e0b"
                    rx="2"
                    className="transition-all duration-300"
                  />
                )}

                {/* Failed Segment */}
                {failH > 0 && (
                  <rect
                    x={x}
                    y={failY}
                    width={colWidth}
                    height={failH}
                    fill="#f43f5e"
                    rx="2"
                    className="animate-pulse"
                  />
                )}

                {/* Date Label on Bottom */}
                {(idx % 2 === 0 || idx === points.length - 1) && (
                  <text
                    x={x + colWidth / 2}
                    y={height - 6}
                    textAnchor="middle"
                    className="fill-gray-400 text-[9px] font-sans font-medium"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        {activePoint && hoveredIndex !== null && (
          <div className="absolute top-2 right-4 pointer-events-none z-10">
            <div className="bg-gray-900/95 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 backdrop-blur-xs border border-gray-700/60 min-w-[170px]">
              <div className="flex items-center justify-between border-b border-gray-700/80 pb-1">
                <span className="font-semibold text-gray-200 text-[11px]">{activePoint.date}</span>
                <span className="text-[10px] text-gray-400 font-mono">{activePoint.total} total</span>
              </div>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between text-emerald-400">
                  <span>Succeeded:</span>
                  <span className="font-semibold">{activePoint.succeeded}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Queued / Retry:</span>
                  <span className="font-semibold">{activePoint.queued + activePoint.retrying}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Failed:</span>
                  <span className="font-semibold">{activePoint.failed}</span>
                </div>
                <div className="flex justify-between text-gray-300 pt-0.5 border-t border-gray-800 text-[10px]">
                  <span>Median Time:</span>
                  <span className="font-mono">{activePoint.medianDurationSec}s</span>
                </div>
              </div>
              {activePoint.failed > 0 && (
                <div className="text-[9px] text-rose-300 font-medium text-center pt-0.5">
                  Click to inspect failure & retry &rarr;
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Slide-Over Panel for Inspecting and Retrying Failed Provisioning Jobs */}
      {selectedFailedJob && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Provisioning Failure Diagnostic
                    </h3>
                    <span className="font-mono text-xs text-rose-600 font-semibold">
                      {selectedFailedJob.jobCode}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFailedJob(null)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Service & Customer Details */}
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/70 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe size={14} className="text-gray-400" />
                  <span className="text-gray-400">Domain:</span>
                  <span className="font-bold text-gray-900 font-mono">{selectedFailedJob.serviceDomain}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={14} className="text-gray-400" />
                  <span className="text-gray-400">Customer:</span>
                  <span className="font-semibold text-gray-900">{selectedFailedJob.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Server size={14} className="text-gray-400" />
                  <span className="text-gray-400">Target Node:</span>
                  <span className="font-semibold text-gray-900">{selectedFailedJob.targetServerName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-700">{selectedFailedJob.createdAt}</span>
                </div>
              </div>

              {/* Error Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Error Diagnostic & Trace
                </h4>
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1.5">
                  <p className="font-medium text-[11px] leading-relaxed">
                    {selectedFailedJob.customerSafeError || 'WHM socket timeout during account creation on target hypervisor.'}
                  </p>
                  {selectedFailedJob.internalErrorDetails && (
                    <pre className="font-mono text-[10px] bg-white/80 p-2 rounded border border-rose-200 text-rose-950 overflow-x-auto whitespace-pre-wrap">
                      {selectedFailedJob.internalErrorDetails}
                    </pre>
                  )}
                </div>
              </div>

              {/* Provisioning Steps Audit */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Pipeline Steps
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedFailedJob.steps.map((st, i) => (
                    <div
                      key={i}
                      className="p-2 rounded border border-gray-100 flex items-center justify-between"
                    >
                      <span className="text-gray-700">{st.name}</span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          st.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : st.status === 'FAILED'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedFailedJob(null);
                  router.push('/provisioning');
                }}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Queue</span>
                <ExternalLink size={12} />
              </button>

              <button
                onClick={() => handleRetry(selectedFailedJob.id)}
                disabled={isRetrying}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={isRetrying ? 'animate-spin' : ''} />
                <span>{isRetrying ? 'Retrying Job...' : 'Execute Idempotent Retry'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
