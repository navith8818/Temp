'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { AuditLog } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminModal } from '@/components/ui/AdminModal';
import { AdminButton } from '@/components/ui/AdminButton';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useAdminData();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: l => <span className="text-gray-500 font-mono text-[11px]">{l.timestamp}</span>,
    },
    {
      key: 'actor',
      header: 'Staff Actor',
      sortable: true,
      render: l => (
        <div>
          <span className="font-semibold text-gray-900">{l.actor}</span>
          <div className="text-[10px] text-gray-400 font-medium">{l.actorRole}</div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Event Action',
      render: l => (
        <span className="font-mono text-[11px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-medium">
          {l.action}
        </span>
      ),
    },
    {
      key: 'resource',
      header: 'Target Entity',
      render: l => (
        <div className="text-xs">
          <span className="text-gray-500 uppercase text-[10px] block font-semibold">{l.resourceType}</span>
          <span className="font-semibold text-gray-800 font-mono text-[11px]">{l.resourceId}</span>
        </div>
      ),
    },
    {
      key: 'outcome',
      header: 'Result',
      render: l => (
        <AdminBadge
          variant={
            l.outcome === 'SUCCESS'
              ? 'success'
              : l.outcome === 'WARNING'
              ? 'warning'
              : 'danger'
          }
        >
          {l.outcome}
        </AdminBadge>
      ),
    },
    {
      key: 'details',
      header: 'Audit Note',
      render: l => (
        <p className="text-gray-600 truncate max-w-sm" title={l.details}>
          {l.details}
        </p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: l => (
        <AdminButton
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLog(l)}
        >
          View Record
        </AdminButton>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
          Platform Security & Audit Trail
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Immutable historical telemetry recording administrative changes, server mutations, refunds, and access events.
        </p>
      </div>

      <AdminTable
        data={auditLogs}
        columns={columns}
        keyExtractor={l => l.id}
        searchPlaceholder="Search audit events by action, actor, or target entity..."
        searchFilter={(l, q) =>
          l.action.toLowerCase().includes(q) ||
          l.actor.toLowerCase().includes(q) ||
          l.resourceId.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q)
        }
      />

      {/* Log Detail Modal */}
      <AdminModal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Log Entry"
        subtitle={`Event ID: ${selectedLog?.id}`}
        maxWidth="md"
        footer={
          <AdminButton variant="secondary" onClick={() => setSelectedLog(null)}>
            Dismiss
          </AdminButton>
        }
      >
        {selectedLog && (
          <div className="space-y-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Timestamp</span>
                <span className="font-mono text-gray-800">{selectedLog.timestamp}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Outcome</span>
                <AdminBadge variant={selectedLog.outcome === 'SUCCESS' ? 'success' : 'warning'}>
                  {selectedLog.outcome}
                </AdminBadge>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Operator</span>
                <span className="font-semibold text-gray-900">{selectedLog.actor} ({selectedLog.actorRole})</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Target</span>
                <span className="font-mono text-gray-900">{selectedLog.resourceType}: {selectedLog.resourceId}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-gray-800 text-xs block">Event Details</span>
              <p className="text-xs text-gray-700 bg-white border border-gray-200 rounded-lg p-3 leading-relaxed">
                {selectedLog.details}
              </p>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};
