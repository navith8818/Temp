'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { PaymentTransaction } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import { AdminModal } from '@/components/ui/AdminModal';
import {
  RotateCcw,
  FileCode
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const {
    payments,
    refundPayment,
    currentRole
  } = useAdminData();

  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('Customer requested duplicate charge reversal');
  const [refundAmount, setRefundAmount] = useState('');

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  const handleOpenRefund = (pay: PaymentTransaction) => {
    setSelectedPayment(pay);
    setRefundAmount(String(pay.amount));
    setIsRefundModalOpen(true);
  };

  const handleExecuteRefund = () => {
    if (selectedPayment && refundAmount) {
      refundPayment(selectedPayment.id, parseFloat(refundAmount), refundReason);
      setIsRefundModalOpen(false);
      setSelectedPayment(null);
    }
  };

  const columns: Column<PaymentTransaction>[] = [
    {
      key: 'transactionRef',
      header: 'Transaction Reference',
      sortable: true,
      render: p => (
        <div>
          <span className="font-semibold text-gray-900 font-mono">{p.transactionRef}</span>
          <div className="text-[11px] text-gray-400">{p.date}</div>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: p => (
        <div>
          <div className="font-medium text-gray-800">{p.customerName}</div>
          <div className="text-[11px] text-gray-400 font-mono">Invoice: {p.invoiceNumber}</div>
        </div>
      ),
    },
    {
      key: 'provider',
      header: 'Gateway Provider',
      render: p => (
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
          {p.provider}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Settled Amount',
      sortable: true,
      render: p => (
        <span className="font-bold text-gray-900">
          ${p.amount.toFixed(2)} {p.currency}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Payment Status',
      sortable: true,
      render: p => (
        <div className="space-y-0.5">
          <AdminBadge
            variant={
              p.status === 'SUCCESS'
                ? 'success'
                : p.status === 'REFUNDED'
                ? 'neutral'
                : 'danger'
            }
          >
            {p.status}
          </AdminBadge>
          {p.refundedAmount && (
            <div className="text-[10px] text-gray-500">Refunded: ${p.refundedAmount.toFixed(2)}</div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: p => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPayment(p)}
          >
            Details
          </AdminButton>

          {!isRestricted && p.status === 'SUCCESS' && (
            <AdminButton
              variant="outline"
              size="sm"
              icon={<RotateCcw size={12} />}
              onClick={() => handleOpenRefund(p)}
              title="Initiate authorized mock refund (Scenario E)"
            >
              Refund
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
            Payments & Gateway Transactions
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time settlement logs, PayHere gateway payloads, automated reconciliations, and refunds.
          </p>
        </div>
      </div>

      <AdminTable
        data={payments}
        columns={columns}
        keyExtractor={p => p.id}
        searchPlaceholder="Search payments by transaction reference, customer, invoice..."
        searchFilter={(p, q) =>
          p.transactionRef.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.invoiceNumber.toLowerCase().includes(q) ||
          p.provider.toLowerCase().includes(q)
        }
      />

      {/* Payment Details Drawer */}
      <AdminDrawer
        isOpen={!!selectedPayment && !isRefundModalOpen}
        onClose={() => setSelectedPayment(null)}
        title={`Payment Details: ${selectedPayment?.transactionRef}`}
        subtitle={`Invoice: ${selectedPayment?.invoiceNumber} (${selectedPayment?.provider})`}
        width="lg"
      >
        {selectedPayment && (
          <div className="space-y-5 text-xs">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Gateway Status</span>
                <AdminBadge variant={selectedPayment.status === 'SUCCESS' ? 'success' : 'neutral'}>
                  {selectedPayment.status}
                </AdminBadge>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Amount</span>
                <span className="text-sm font-bold text-gray-900">${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Date Processed</span>
                <span className="text-gray-800">{selectedPayment.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Customer</span>
                <span className="text-gray-800 font-medium">{selectedPayment.customerName}</span>
              </div>
            </div>

            {/* Provider Metadata */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-xs flex items-center gap-1.5">
                <FileCode size={13} className="text-gray-400" />
                <span>Provider Webhook & Gateway Payload</span>
              </h4>
              <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-[11px] text-gray-700 space-y-1">
                <div>gateway_status: {selectedPayment.gatewayResponseCode || '2 (SUCCESS)'}</div>
                {selectedPayment.metadata && Object.entries(selectedPayment.metadata).map(([k, v]) => (
                  <div key={k}>{k}: {v}</div>
                ))}
              </div>
            </div>

            {/* Refund Info if already refunded */}
            {selectedPayment.status === 'REFUNDED' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1 text-amber-900">
                <div className="font-semibold text-xs">Refund Recorded</div>
                <p className="text-[11px]">
                  Amount: ${selectedPayment.refundedAmount?.toFixed(2)} &bull; Reason: {selectedPayment.refundReason}
                </p>
                <div className="text-[10px] text-amber-700">Refunded on {selectedPayment.refundedAt || 'today'}</div>
              </div>
            )}

            {/* Refund Action Button */}
            {selectedPayment.status === 'SUCCESS' && !isRestricted && (
              <div className="pt-3 border-t border-gray-200 flex justify-end">
                <AdminButton
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw size={13} />}
                  onClick={() => setIsRefundModalOpen(true)}
                >
                  Initiate Refund
                </AdminButton>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>

      {/* Scenario E — Refund Confirmation Modal */}
      <AdminModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        title="Authorize Payment Refund (Scenario E)"
        subtitle="Reverse transaction charges and update associated invoice & financial audit trail."
        maxWidth="sm"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsRefundModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={handleExecuteRefund}>
              Execute Refund
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3.5">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
            <span className="font-bold block mb-0.5">Financial Authorization Notice</span>
            Issuing a refund will adjust transaction status to REFUNDED and mark invoice {selectedPayment?.invoiceNumber} accordingly.
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Refund Amount ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={refundAmount}
              onChange={e => setRefundAmount(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Authorized Refund Reason *
            </label>
            <textarea
              rows={2}
              required
              value={refundReason}
              onChange={e => setRefundReason(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
