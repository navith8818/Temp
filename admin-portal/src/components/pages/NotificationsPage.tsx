'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { NotificationLog, EmailTemplate } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import { AdminTabs } from '@/components/ui/AdminTabs';
import {
  RefreshCw
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    emailTemplates,
    retryNotification,
    updateEmailTemplate
  } = useAdminData();

  const [activeTab, setActiveTab] = useState('logs');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');

  const handleOpenEditTemplate = (tmpl: EmailTemplate) => {
    setSelectedTemplate(tmpl);
    setTemplateSubject(tmpl.subject);
    setTemplateBody(tmpl.body);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTemplate) {
      updateEmailTemplate(selectedTemplate.id, templateSubject, templateBody);
      setSelectedTemplate(null);
    }
  };

  const logColumns: Column<NotificationLog>[] = [
    {
      key: 'event',
      header: 'Event Trigger',
      sortable: true,
      render: n => (
        <div>
          <span className="font-semibold text-gray-900 font-mono text-[11px]">{n.event}</span>
          <div className="text-[11px] text-gray-400">{n.timestamp}</div>
        </div>
      ),
    },
    {
      key: 'recipientEmail',
      header: 'Recipient',
      render: n => (
        <div>
          <div className="font-medium text-gray-800">{n.recipientName}</div>
          <div className="text-[11px] text-gray-400">{n.recipientEmail}</div>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Message Subject',
      render: n => (
        <div className="text-gray-700 font-medium truncate max-w-sm">
          {n.subject}
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Channel',
      render: n => (
        <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
          {n.channel}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Delivery Status',
      sortable: true,
      render: n => (
        <div className="space-y-0.5">
          <AdminBadge
            variant={
              n.status === 'DELIVERED'
                ? 'success'
                : n.status === 'FAILED'
                ? 'danger'
                : 'warning'
            }
          >
            {n.status}
          </AdminBadge>
          {n.errorDetails && (
            <div className="text-[10px] text-rose-600 truncate max-w-[120px]" title={n.errorDetails}>
              {n.errorDetails}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: n => (
        <div className="flex items-center justify-end gap-1.5">
          {n.status === 'FAILED' && (
            <AdminButton
              variant="outline"
              size="sm"
              icon={<RefreshCw size={12} />}
              onClick={() => retryNotification(n.id)}
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
            Notifications & Transactional Email
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Dispatch logs, Resend gateway deliveries, and customizable customer email templates.
          </p>
        </div>
      </div>

      <AdminTabs
        tabs={[
          { id: 'logs', label: 'Delivery Logs & Alerts', count: notifications.length },
          { id: 'templates', label: 'Email Templates', count: emailTemplates.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'logs' ? (
        <AdminTable
          data={notifications}
          columns={logColumns}
          keyExtractor={n => n.id}
          searchPlaceholder="Search delivery logs by recipient, subject, event..."
          searchFilter={(n, q) =>
            n.recipientEmail.toLowerCase().includes(q) ||
            n.subject.toLowerCase().includes(q) ||
            n.event.toLowerCase().includes(q)
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emailTemplates.map(tmpl => (
            <div
              key={tmpl.id}
              className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-gray-900">{tmpl.name}</span>
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                    {tmpl.code}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1">
                  Subj: {tmpl.subject}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {tmpl.variables.map(v => (
                    <span key={v} className="text-[10px] font-mono text-[#e8702a] bg-[#fcf5f1] px-1 rounded">
                      {`{${v}}`}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400">Updated: {tmpl.lastUpdated}</span>
                <AdminButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenEditTemplate(tmpl)}
                >
                  Edit Template
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Template Drawer */}
      <AdminDrawer
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        title={`Edit Template: ${selectedTemplate?.name}`}
        subtitle={`Template Identifier: ${selectedTemplate?.code}`}
        width="lg"
      >
        {selectedTemplate && (
          <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                required
                value={templateSubject}
                onChange={e => setTemplateSubject(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Template Body (Plain text / Markdown)
              </label>
              <textarea
                rows={9}
                required
                value={templateBody}
                onChange={e => setTemplateBody(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-800 font-mono leading-relaxed"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 space-y-1">
              <span className="font-semibold block text-[11px] text-gray-800">Available Merge Variables:</span>
              <p className="text-[11px] text-[#e8702a] font-mono">
                {selectedTemplate.variables.map(v => `{${v}}`).join(', ')}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
              <AdminButton variant="secondary" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </AdminButton>
              <AdminButton variant="primary" type="submit">
                Save Template
              </AdminButton>
            </div>
          </form>
        )}
      </AdminDrawer>
    </div>
  );
};
