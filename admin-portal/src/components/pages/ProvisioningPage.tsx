'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { ProvisioningJob } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import {
  RefreshCw,
  Ban,
  Terminal,
  ShieldAlert
} from 'lucide-react';

export const ProvisioningPage: React.FC = () => {
  const {
    provisioningJobs,
    retryProvisioningJob,
    cancelProvisioningJob,
    currentRole
  } = useAdminData();

  const [selectedJob, setSelectedJob] = useState<ProvisioningJob | null>(null);

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  const columns: Column<ProvisioningJob>[] = [
    {
      key: 'jobCode',
      header: 'Job Reference',
      sortable: true,
      render: j => (
        <div>
          <span className="font-semibold text-gray-900 font-mono">{j.jobCode}</span>
          <div className="text-[11px] text-gray-400">{j.createdAt}</div>
        </div>
      ),
    },
    {
      key: 'serviceDomain',
      header: 'Target Service & Customer',
      render: j => (
        <div>
          <div className="font-semibold text-gray-900">{j.serviceDomain}</div>
          <div className="text-[11px] text-gray-400">{j.customerName}</div>
        </div>
      ),
    },
    {
      key: 'operation',
      header: 'Operation',
      render: j => (
        <span className="text-[11px] font-mono bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
          {j.operation}
        </span>
      ),
    },
    {
      key: 'targetServerName',
      header: 'Target Node',
      render: j => (
        <div>
          <div className="font-medium text-gray-800">{j.targetServerName}</div>
          <div className="text-[11px] text-gray-400">{j.provider}</div>
        </div>
      ),
    },
    {
      key: 'attemptsCount',
      header: 'Attempts',
      render: j => (
        <span className="text-xs text-gray-600 font-semibold">
          Attempt {j.attemptsCount}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Workflow State',
      sortable: true,
      render: j => (
        <AdminBadge
          variant={
            j.status === 'SUCCEEDED'
              ? 'success'
              : j.status === 'FAILED'
              ? 'danger'
              : j.status === 'RUNNING'
              ? 'info'
              : 'neutral'
          }
        >
          {j.status}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: j => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedJob(j)}
          >
            Inspect Steps
          </AdminButton>

          {j.status === 'FAILED' && !isRestricted && (
            <AdminButton
              variant="danger"
              size="sm"
              icon={<RefreshCw size={12} />}
              onClick={() => retryProvisioningJob(j.id)}
            >
              Retry
            </AdminButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
            Provisioning Jobs & Task Queue
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Automated background provisioning pipeline, multi-step job telemetry, and error recovery.
          </p>
        </div>
      </div>

      <AdminTable
        data={provisioningJobs}
        columns={columns}
        keyExtractor={j => j.id}
        searchPlaceholder="Search jobs by code, domain, customer, server..."
        searchFilter={(j, q) =>
          j.jobCode.toLowerCase().includes(q) ||
          j.serviceDomain.toLowerCase().includes(q) ||
          j.customerName.toLowerCase().includes(q) ||
          j.targetServerName.toLowerCase().includes(q)
        }
      />

      {/* Inspect Steps Drawer (Demonstrating Scenario D) */}
      <AdminDrawer
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={`Provisioning Job: ${selectedJob?.jobCode}`}
        subtitle={`${selectedJob?.operation} for ${selectedJob?.serviceDomain}`}
        width="lg"
      >
        {selectedJob && (
          <div className="space-y-5 text-xs">
            {/* Summary Banner */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Execution Status</span>
                <AdminBadge
                  variant={
                    selectedJob.status === 'SUCCEEDED'
                      ? 'success'
                      : selectedJob.status === 'FAILED'
                      ? 'danger'
                      : 'info'
                  }
                >
                  {selectedJob.status}
                </AdminBadge>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Target Node</span>
                <span className="font-semibold text-gray-900">{selectedJob.targetServerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Attempts</span>
                <span className="text-gray-800">{selectedJob.attemptsCount} attempt(s)</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Customer</span>
                <span className="text-gray-800">{selectedJob.customerName}</span>
              </div>
            </div>

            {/* Error Details (Scenario D Step 3) */}
            {selectedJob.status === 'FAILED' && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold">
                  <ShieldAlert size={16} className="text-rose-600" />
                  <span>Execution Failure Diagnosed</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-rose-800 block">Customer-Safe Explanation</span>
                  <p className="text-xs text-rose-800 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-rose-200">
                    {selectedJob.customerSafeError || 'Temporary server connection issue.'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-rose-800 block flex items-center gap-1">
                    <Terminal size={12} />
                    <span>Internal Technical Stack / API Log (Staff Only)</span>
                  </span>
                  <pre className="text-[11px] font-mono text-rose-950 bg-rose-100/70 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {selectedJob.internalErrorDetails || 'whm_api_socket_timeout'}
                  </pre>
                </div>

                {!isRestricted && (
                  <div className="pt-2 flex justify-end">
                    <AdminButton
                      variant="danger"
                      size="sm"
                      icon={<RefreshCw size={13} />}
                      onClick={() => {
                        retryProvisioningJob(selectedJob.id);
                        setSelectedJob({
                          ...selectedJob,
                          status: 'RUNNING',
                          attemptsCount: selectedJob.attemptsCount + 1,
                        });
                      }}
                    >
                      Safe Idempotent Retry
                    </AdminButton>
                  </div>
                )}
              </div>
            )}

            {/* Multi-Step Workflow Visualizer */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wider text-gray-500">
                Pipeline Execution Steps
              </h4>

              <div className="space-y-2 border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white overflow-hidden">
                {selectedJob.steps.map((step, idx) => (
                  <div key={idx} className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{step.name}</span>
                      <AdminBadge
                        variant={
                          step.status === 'COMPLETED'
                            ? 'success'
                            : step.status === 'FAILED'
                            ? 'danger'
                            : step.status === 'RUNNING'
                            ? 'info'
                            : 'neutral'
                        }
                      >
                        {step.status}
                      </AdminBadge>
                    </div>

                    {step.log && (
                      <p className="text-[11px] text-gray-500 font-mono bg-gray-50 p-2 rounded border border-gray-100 mt-1">
                        {step.log}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Option for Queued Jobs */}
            {selectedJob.status === 'QUEUED' && !isRestricted && (
              <div className="pt-3 border-t border-gray-200 flex justify-end">
                <AdminButton
                  variant="outline"
                  size="sm"
                  icon={<Ban size={13} />}
                  onClick={() => {
                    cancelProvisioningJob(selectedJob.id);
                    setSelectedJob({ ...selectedJob, status: 'CANCELLED' });
                  }}
                >
                  Cancel Queued Job
                </AdminButton>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>
    </div>
  );
};
