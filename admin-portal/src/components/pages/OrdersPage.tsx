'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminData } from '@/context/AdminDataContext';
import type { Order } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import {
  Ban,
  Cpu
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const router = useRouter();
  const {
    orders,
    cancelOrder,
    triggerNewProvisioning,
    addOrderNote,
    currentRole
  } = useAdminData();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderNoteInput, setOrderNoteInput] = useState('');

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order Reference',
      sortable: true,
      render: o => (
        <div>
          <span className="font-semibold text-gray-900">{o.orderNumber}</span>
          <div className="text-[11px] text-gray-400">{o.orderDate}</div>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: o => (
        <div>
          <div className="font-medium text-gray-800">{o.customerName}</div>
          <div className="text-[11px] text-gray-400">{o.customerEmail}</div>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Purchased Products',
      render: o => (
        <div className="space-y-0.5">
          {o.items.map((item, idx) => (
            <div key={idx} className="text-gray-700">
              <span>{item.productName}</span>{' '}
              <span className="text-[11px] text-gray-400 font-mono">({item.domain})</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: o => <span className="font-bold text-gray-900">${o.total.toFixed(2)}</span>,
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: o => (
        <AdminBadge
          variant={
            o.paymentStatus === 'PAID'
              ? 'success'
              : o.paymentStatus === 'PENDING'
              ? 'warning'
              : 'danger'
          }
        >
          {o.paymentStatus}
        </AdminBadge>
      ),
    },
    {
      key: 'orderStatus',
      header: 'Fulfillment',
      render: o => (
        <AdminBadge
          variant={
            o.orderStatus === 'COMPLETED'
              ? 'success'
              : o.orderStatus === 'CANCELLED'
              ? 'neutral'
              : 'warning'
          }
        >
          {o.orderStatus}
        </AdminBadge>
      ),
    },
    {
      key: 'provisioningStatus',
      header: 'Provisioning',
      render: o => (
        <AdminBadge
          variant={
            o.provisioningStatus === 'COMPLETED'
              ? 'success'
              : o.provisioningStatus === 'FAILED'
              ? 'danger'
              : o.provisioningStatus === 'IN_PROGRESS'
              ? 'info'
              : 'neutral'
          }
        >
          {o.provisioningStatus}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: o => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedOrder(o);
              setOrderNoteInput(o.notes || '');
            }}
          >
            Review
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
            Order Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review customer orders, verify payment settlement, and monitor automated provisioning dispatch.
          </p>
        </div>
      </div>

      <AdminTable
        data={orders}
        columns={columns}
        keyExtractor={o => o.id}
        searchPlaceholder="Search orders by number, customer, domain..."
        searchFilter={(o, q) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items.some(i => i.domain.toLowerCase().includes(q) || i.productName.toLowerCase().includes(q))
        }
      />

      {/* Order Detail Drawer */}
      <AdminDrawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details: ${selectedOrder?.orderNumber}`}
        subtitle={`Placed on ${selectedOrder?.orderDate}`}
        width="lg"
      >
        {selectedOrder && (
          <div className="space-y-5 text-xs">
            {/* Status overview banner */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Order Status</span>
                <AdminBadge variant={selectedOrder.orderStatus === 'COMPLETED' ? 'success' : 'warning'}>
                  {selectedOrder.orderStatus}
                </AdminBadge>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Payment Status</span>
                <AdminBadge variant={selectedOrder.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                  {selectedOrder.paymentStatus}
                </AdminBadge>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Amount</span>
                <span className="text-sm font-bold text-gray-900">${selectedOrder.total.toFixed(2)} USD</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Invoice Link</span>
                <span
                  onClick={() => router.push('/invoices')}
                  className="font-medium text-[#e8702a] hover:underline cursor-pointer"
                >
                  {selectedOrder.invoiceId}
                </span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-xs">Order Line Items</h4>
              <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{item.productName}</div>
                      <div className="text-[11px] text-gray-400 font-mono">Domain: {item.domain} ({item.billingCycle})</div>
                    </div>
                    <span className="font-semibold text-gray-900">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Provisioning trigger for Scenario C */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <Cpu size={14} className="text-blue-600" />
                  <span>Provisioning Engine</span>
                </span>
                <AdminBadge variant={selectedOrder.provisioningStatus === 'COMPLETED' ? 'success' : 'info'}>
                  {selectedOrder.provisioningStatus}
                </AdminBadge>
              </div>
              <p className="text-[11px] text-blue-700 leading-snug">
                {selectedOrder.provisioningStatus === 'COMPLETED'
                  ? 'Infrastructure resources allocated and cPanel account is active.'
                  : 'Trigger simulated workflow to allocate server, issue Let\'s Encrypt AutoSSL, and activate service (Scenario C).'}
              </p>

              {selectedOrder.provisioningStatus !== 'COMPLETED' && !isRestricted && (
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    triggerNewProvisioning(selectedOrder.id);
                    setSelectedOrder({
                      ...selectedOrder,
                      provisioningStatus: 'IN_PROGRESS',
                    });
                  }}
                >
                  Dispatch Provisioning Workflow
                </AdminButton>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-xs">Administrative Note</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Record note regarding this order..."
                  value={orderNoteInput}
                  onChange={e => setOrderNoteInput(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                />
                <AdminButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    addOrderNote(selectedOrder.id, orderNoteInput);
                    setSelectedOrder({ ...selectedOrder, notes: orderNoteInput });
                  }}
                >
                  Save Note
                </AdminButton>
              </div>
            </div>

            {/* Cancel Action */}
            {selectedOrder.orderStatus !== 'CANCELLED' && !isRestricted && (
              <div className="pt-3 border-t border-gray-200 flex justify-end">
                <AdminButton
                  variant="outline"
                  size="sm"
                  icon={<Ban size={13} />}
                  onClick={() => {
                    cancelOrder(selectedOrder.id);
                    setSelectedOrder({ ...selectedOrder, orderStatus: 'CANCELLED' });
                  }}
                >
                  Cancel Order
                </AdminButton>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>
    </div>
  );
};
