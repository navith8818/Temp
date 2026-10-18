'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { Invoice } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminModal } from '@/components/ui/AdminModal';
import {
  Printer,
  Mail,
  Plus
} from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const {
    invoices,
    applyInvoiceCredit,
    resendInvoiceEmail,
    createManualInvoice,
    currentRole
  } = useAdminData();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState('5.00');
  const [creditNote, setCreditNote] = useState('Goodwill credit adjustment for service transition');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInvCustomerName, setNewInvCustomerName] = useState('Alex Chen');
  const [newInvCustomerEmail, setNewInvCustomerEmail] = useState('alex.chen@freshkitchen.io');
  const [newInvDescription, setNewInvDescription] = useState('Professional Migration Assistance');
  const [newInvAmount, setNewInvAmount] = useState('45.00');

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  const handleApplyCredit = () => {
    if (selectedInvoice && creditAmount) {
      applyInvoiceCredit(selectedInvoice.id, parseFloat(creditAmount), creditNote);
      setIsCreditModalOpen(false);
      setSelectedInvoice(null);
    }
  };

  const handleCreateManualInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    createManualInvoice({
      customerName: newInvCustomerName,
      customerEmail: newInvCustomerEmail,
      subtotal: parseFloat(newInvAmount),
      total: parseFloat(newInvAmount),
      items: [
        {
          description: newInvDescription,
          quantity: 1,
          unitPrice: parseFloat(newInvAmount),
          amount: parseFloat(newInvAmount),
        },
      ],
    });
    setIsCreateModalOpen(false);
  };

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortable: true,
      render: inv => (
        <div>
          <span className="font-semibold text-gray-900 font-mono">{inv.invoiceNumber}</span>
          <div className="text-[11px] text-gray-400">Issued: {inv.issueDate}</div>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: inv => (
        <div>
          <div className="font-medium text-gray-800">{inv.customerName}</div>
          <div className="text-[11px] text-gray-400">{inv.customerEmail}</div>
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: inv => <span className="text-gray-600">{inv.dueDate}</span>,
    },
    {
      key: 'total',
      header: 'Total Amount',
      sortable: true,
      render: inv => (
        <div>
          <div className="font-bold text-gray-900">${inv.total.toFixed(2)}</div>
          {inv.discountAmount > 0 && (
            <div className="text-[10px] text-emerald-600 font-medium">-${inv.discountAmount.toFixed(2)} credit</div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Settlement State',
      sortable: true,
      render: inv => (
        <AdminBadge
          variant={
            inv.status === 'PAID'
              ? 'success'
              : inv.status === 'UNPAID'
              ? 'warning'
              : inv.status === 'OVERDUE'
              ? 'danger'
              : 'neutral'
          }
        >
          {inv.status}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: inv => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedInvoice(inv);
              setIsPrintModalOpen(true);
            }}
            title="Preview and print invoice"
          >
            <Printer size={13} />
          </AdminButton>

          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => resendInvoiceEmail(inv.id)}
            title="Resend invoice email"
          >
            <Mail size={13} />
          </AdminButton>

          {!isRestricted && inv.status !== 'PAID' && inv.status !== 'CANCELLED' && (
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedInvoice(inv);
                setIsCreditModalOpen(true);
              }}
              title="Apply credit adjustment"
            >
              Credit
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
            Billing & Invoices
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Itemized customer invoices, payment settlements, tax adjustments, and printable statement views.
          </p>
        </div>

        {!isRestricted && (
          <AdminButton
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Invoice
          </AdminButton>
        )}
      </div>

      <AdminTable
        data={invoices}
        columns={columns}
        keyExtractor={i => i.id}
        searchPlaceholder="Search invoices by number, customer..."
        searchFilter={(i, q) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q) ||
          i.customerEmail.toLowerCase().includes(q)
        }
      />

      {/* Printable Invoice Modal */}
      <AdminModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Invoice Statement"
        maxWidth="2xl"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsPrintModalOpen(false)}>
              Close
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={<Printer size={13} />}
              onClick={() => window.print()}
            >
              Print / Save PDF
            </AdminButton>
          </>
        }
      >
        {selectedInvoice && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-xs text-gray-800 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
                  <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Server Salad Cloud Services</h2>
                  <p className="text-[11px] text-gray-400">2-4 Rue Edmond Reuter, L-5326 Contern, Luxembourg</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-base font-bold text-gray-900 block">{selectedInvoice.invoiceNumber}</span>
                <AdminBadge variant={selectedInvoice.status === 'PAID' ? 'success' : 'warning'}>
                  {selectedInvoice.status}
                </AdminBadge>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Billed To</span>
                <p className="font-semibold text-gray-900">{selectedInvoice.billingAddress.name}</p>
                <p className="text-gray-600">{selectedInvoice.billingAddress.line1}</p>
                <p className="text-gray-600">{selectedInvoice.billingAddress.city}, {selectedInvoice.billingAddress.country}</p>
                <p className="text-gray-500 mt-1">{selectedInvoice.customerEmail}</p>
              </div>

              <div className="text-right space-y-1">
                <div>
                  <span className="text-gray-400">Invoice Date:</span>{' '}
                  <span className="font-semibold text-gray-800">{selectedInvoice.issueDate}</span>
                </div>
                <div>
                  <span className="text-gray-400">Due Date:</span>{' '}
                  <span className="font-semibold text-gray-800">{selectedInvoice.dueDate}</span>
                </div>
                {selectedInvoice.paidAt && (
                  <div>
                    <span className="text-gray-400">Settled On:</span>{' '}
                    <span className="font-semibold text-emerald-700">{selectedInvoice.paidAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-gray-900">{item.description}</td>
                      <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="p-3 text-right text-gray-600">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-semibold text-gray-900">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-56 space-y-1.5 text-xs text-right">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Credit / Discount:</span>
                    <span>-${selectedInvoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-1.5">
                  <span>Total Amount:</span>
                  <span>${selectedInvoice.total.toFixed(2)} {selectedInvoice.currency}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Apply Credit Modal */}
      <AdminModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        title="Apply Credit Adjustment"
        subtitle={`Apply authorized credit adjustment to ${selectedInvoice?.invoiceNumber}.`}
        maxWidth="sm"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsCreditModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleApplyCredit}>
              Apply Credit
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Credit Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              value={creditAmount}
              onChange={e => setCreditAmount(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Authorization Note</label>
            <textarea
              rows={2}
              value={creditNote}
              onChange={e => setCreditNote(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>
        </div>
      </AdminModal>

      {/* Manual Invoice Creation Modal */}
      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Manual Invoice"
        subtitle="Issue an ad-hoc billable invoice for professional services or migration."
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleCreateManualInvoice}>
              Issue Invoice
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleCreateManualInvoice} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={newInvCustomerName}
                onChange={e => setNewInvCustomerName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Email</label>
              <input
                type="email"
                required
                value={newInvCustomerEmail}
                onChange={e => setNewInvCustomerEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Item Description</label>
            <input
              type="text"
              required
              value={newInvDescription}
              onChange={e => setNewInvDescription(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              required
              value={newInvAmount}
              onChange={e => setNewInvAmount(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
