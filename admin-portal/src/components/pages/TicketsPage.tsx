'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminData } from '@/context/AdminDataContext';
import type { SupportTicket, TicketStatus, TicketPriority } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import {
  Send,
  StickyNote,
  ExternalLink,
  Server
} from 'lucide-react';

export const TicketsPage: React.FC = () => {
  const router = useRouter();
  const {
    tickets,
    staff,
    replyToTicket,
    assignTicketAgent,
    updateTicketStatus,
    updateTicketPriority,
    currentStaff
  } = useAdminData();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    replyToTicket(selectedTicket.id, replyText.trim(), isInternalNote);

    // Update local drawer view
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderName: currentStaff.name,
      senderRole: 'STAFF' as const,
      isInternalNote,
      timestamp: 'Just now',
      content: replyText.trim(),
    };

    setSelectedTicket({
      ...selectedTicket,
      status: isInternalNote ? selectedTicket.status : 'WAITING_FOR_CUSTOMER',
      messages: [...selectedTicket.messages, newMsg],
    });

    setReplyText('');
    setIsInternalNote(false);
  };

  const columns: Column<SupportTicket>[] = [
    {
      key: 'ticketNumber',
      header: 'Ticket Reference',
      sortable: true,
      render: t => (
        <div>
          <span className="font-semibold text-gray-900 font-mono">{t.ticketNumber}</span>
          <div className="text-[11px] text-gray-400">{t.createdDate}</div>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject & Inquiry',
      render: t => (
        <div className="max-w-md">
          <div className="font-medium text-gray-900 truncate">{t.subject}</div>
          <div className="text-[11px] text-gray-400">
            {t.customerName} &bull; <span className="font-mono">{t.relatedServiceDomain || 'General'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: t => (
        <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
          {t.department.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'assignedAgentName',
      header: 'Assigned Agent',
      render: t => (
        <span className="font-medium text-gray-800">
          {t.assignedAgentName || <span className="text-gray-400 italic">Unassigned</span>}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: t => (
        <AdminBadge
          variant={
            t.priority === 'URGENT' || t.priority === 'HIGH'
              ? 'danger'
              : t.priority === 'MEDIUM'
              ? 'warning'
              : 'neutral'
          }
        >
          {t.priority}
        </AdminBadge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: t => (
        <AdminBadge
          variant={
            t.status === 'OPEN'
              ? 'warning'
              : t.status === 'IN_PROGRESS'
              ? 'info'
              : t.status === 'CLOSED'
              ? 'neutral'
              : 'success'
          }
        >
          {t.status.replace(/_/g, ' ')}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: t => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTicket(t)}
          >
            Open Thread
          </AdminButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
            Support Ticket Helpdesk
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Technical support queues, customer communication, internal staff notes, and service diagnostics.
          </p>
        </div>
      </div>

      <AdminTable
        data={tickets}
        columns={columns}
        keyExtractor={t => t.id}
        searchPlaceholder="Search tickets by reference, customer, domain, subject..."
        searchFilter={(t, q) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          (t.relatedServiceDomain || '').toLowerCase().includes(q)
        }
      />

      {/* Ticket Conversation Drawer (Scenario F) */}
      <AdminDrawer
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`${selectedTicket?.ticketNumber}: ${selectedTicket?.subject}`}
        subtitle={`Customer: ${selectedTicket?.customerName} (${selectedTicket?.customerEmail})`}
        width="xl"
      >
        {selectedTicket && (
          <div className="space-y-5 text-xs">
            {/* Meta Control Box */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Status</label>
                <select
                  value={selectedTicket.status}
                  onChange={e => {
                    const st = e.target.value as TicketStatus;
                    updateTicketStatus(selectedTicket.id, st);
                    setSelectedTicket({ ...selectedTicket, status: st });
                  }}
                  className="w-full bg-white border border-gray-200 rounded p-1 text-xs text-gray-800"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="WAITING_FOR_CUSTOMER">WAITING FOR CUSTOMER</option>
                  <option value="WAITING_FOR_STAFF">WAITING FOR STAFF</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Priority</label>
                <select
                  value={selectedTicket.priority}
                  onChange={e => {
                    const pr = e.target.value as TicketPriority;
                    updateTicketPriority(selectedTicket.id, pr);
                    setSelectedTicket({ ...selectedTicket, priority: pr });
                  }}
                  className="w-full bg-white border border-gray-200 rounded p-1 text-xs text-gray-800"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Assigned Agent</label>
                <select
                  value={selectedTicket.assignedAgentId || ''}
                  onChange={e => {
                    assignTicketAgent(selectedTicket.id, e.target.value);
                    const agent = staff.find(s => s.id === e.target.value);
                    setSelectedTicket({
                      ...selectedTicket,
                      assignedAgentId: agent?.id,
                      assignedAgentName: agent?.name,
                    });
                  }}
                  className="w-full bg-white border border-gray-200 rounded p-1 text-xs text-gray-800"
                >
                  <option value="">Unassigned</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Linked Service Card */}
            {selectedTicket.relatedServiceDomain && (
              <div
                onClick={() => router.push('/services')}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:border-[#e8702a] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-[#e8702a]" />
                  <div>
                    <span className="font-semibold text-gray-900">Linked Hosting: {selectedTicket.relatedServiceDomain}</span>
                    <span className="text-[10px] text-gray-400 block">Click to view server node & quotas</span>
                  </div>
                </div>
                <ExternalLink size={13} className="text-gray-400" />
              </div>
            )}

            {/* Conversation Messages */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="font-semibold text-gray-700 text-xs">Conversation Thread</h4>

              <div className="space-y-3">
                {selectedTicket.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border ${
                      msg.isInternalNote
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : msg.senderRole === 'CUSTOMER'
                        ? 'bg-gray-50 border-gray-200 text-gray-800'
                        : 'bg-white border-[#e8702a]/30 text-gray-900 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-black/5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{msg.senderName}</span>
                        {msg.isInternalNote ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                            Internal Note (Staff Only)
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium">
                            {msg.senderRole === 'CUSTOMER' ? 'Customer' : 'Staff Reply'}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Composer Form */}
            <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700 text-xs">Compose Message</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-amber-800">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={e => setIsInternalNote(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Post as Internal Staff Note</span>
                </label>
              </div>

              <textarea
                rows={4}
                required
                placeholder={isInternalNote ? 'Write internal note (hidden from customer)...' : 'Write customer reply...'}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className={`w-full p-3 text-xs rounded-xl border focus:outline-none transition-colors ${
                  isInternalNote
                    ? 'bg-amber-50/60 border-amber-300 text-amber-900 focus:border-amber-500'
                    : 'bg-white border-gray-200 text-gray-800 focus:border-[#e8702a]'
                }`}
              />

              <div className="flex justify-end gap-2">
                <AdminButton
                  type="submit"
                  variant={isInternalNote ? 'secondary' : 'primary'}
                  size="sm"
                  icon={isInternalNote ? <StickyNote size={13} /> : <Send size={13} />}
                >
                  {isInternalNote ? 'Save Internal Note' : 'Send Customer Reply'}
                </AdminButton>
              </div>
            </form>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
};
