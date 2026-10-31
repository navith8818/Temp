'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdminData } from '@/context/AdminDataContext';
import { AdminMetricCard } from '@/components/ui/AdminMetricCard';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { RevenueOrderVelocityChart } from '@/components/charts/RevenueOrderVelocityChart';
import { ClusterNodeCapacityChart } from '@/components/charts/ClusterNodeCapacityChart';
import { ProvisioningThroughputChart } from '@/components/charts/ProvisioningThroughputChart';
import { PackageTierDistributionChart } from '@/components/charts/PackageTierDistributionChart';

import {
  Users,
  HardDrive,
  Server,
  ShoppingCart,
  Receipt,
  LifeBuoy,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Plus,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const router = useRouter();
  const {
    customers,
    services,
    servers,
    orders,
    invoices,
    tickets,
    provisioningJobs,
    payments,
    auditLogs,
    retryProvisioningJob,
  } = useAdminData();

  // Metrics Calculations
  const totalCustomers = customers.length;
  const activeServices = services.filter(s => s.status === 'ACTIVE').length;
  const onlineServers = servers.filter(s => s.status === 'ONLINE').length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'AWAITING_PAYMENT' || o.orderStatus === 'PROCESSING').length;
  const unpaidInvoices = invoices.filter(i => i.status === 'UNPAID' || i.status === 'OVERDUE').length;
  const openTickets = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const failingJobs = provisioningJobs.filter(j => j.status === 'FAILED');
  const mtdRevenue = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  // Recent data slices
  const recentOrders = orders.slice(0, 4);
  const recentPayments = payments.slice(0, 4);
  const recentAudit = auditLogs.slice(0, 4);
  const highPriorityTickets = tickets.filter(t => t.status !== 'CLOSED').slice(0, 3);
  const attentionServers = servers.filter(s => s.status !== 'ONLINE' || !s.allocationEnabled);

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
            Operational Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time infrastructure health, billing status, and business operations for Server Salad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => router.push('/servers')}
          >
            Add Server
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => router.push('/packages')}
          >
            New Package
          </AdminButton>
        </div>
      </div>

      {/* Primary Metrics Grid (8 essential metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-8 gap-4">
        <AdminMetricCard
          label="Total Customers"
          value={totalCustomers}
          subtext="Active client accounts"
          icon={<Users size={16} />}
          onClick={() => router.push('/customers')}
        />
        <AdminMetricCard
          label="Active Services"
          value={activeServices}
          subtext={`${services.length} total provisioned`}
          icon={<HardDrive size={16} />}
          badge={{ text: '100% SLA', variant: 'positive' }}
          onClick={() => router.push('/services')}
        />
        <AdminMetricCard
          label="Infrastructure Nodes"
          value={`${onlineServers}/${servers.length}`}
          subtext={attentionServers.length > 0 ? `${attentionServers.length} in maintenance` : 'All nodes online'}
          icon={<Server size={16} />}
          badge={attentionServers.length > 0 ? { text: 'Maintenance', variant: 'warning' } : { text: 'Optimal', variant: 'positive' }}
          onClick={() => router.push('/servers')}
        />
        <AdminMetricCard
          label="Pending Orders"
          value={pendingOrders}
          subtext="Requiring payment or action"
          icon={<ShoppingCart size={16} />}
          badge={pendingOrders > 0 ? { text: `${pendingOrders} Pending`, variant: 'warning' } : undefined}
          onClick={() => router.push('/orders')}
        />

        <AdminMetricCard
          label="Unpaid Invoices"
          value={unpaidInvoices}
          subtext="Awaiting settlement"
          icon={<Receipt size={16} />}
          badge={unpaidInvoices > 0 ? { text: 'Follow Up', variant: 'warning' } : undefined}
          onClick={() => router.push('/invoices')}
        />
        <AdminMetricCard
          label="Open Tickets"
          value={openTickets}
          subtext="Awaiting staff reply"
          icon={<LifeBuoy size={16} />}
          badge={openTickets > 0 ? { text: `${openTickets} Open`, variant: 'warning' } : { text: 'All Caught Up', variant: 'positive' }}
          onClick={() => router.push('/tickets')}
        />
        <AdminMetricCard
          label="Provisioning Attention"
          value={failingJobs.length}
          subtext={failingJobs.length > 0 ? 'Retry available' : 'Queue clean'}
          icon={<Cpu size={16} />}
          badge={failingJobs.length > 0 ? { text: 'Action Needed', variant: 'negative' } : { text: 'Healthy', variant: 'positive' }}
          onClick={() => router.push('/provisioning')}
        />
        <AdminMetricCard
          label="Revenue (MTD)"
          value={`$${mtdRevenue.toFixed(2)}`}
          subtext="Processed via PayHere Gateway"
          icon={<DollarSign size={16} />}
          badge={{ text: '+14% MoM', variant: 'positive' }}
          onClick={() => router.push('/payments')}
        />
      </div>

      {/* Critical Alert Banner if there are failing jobs (Scenario D quick view) */}
      {failingJobs.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/90 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0 mt-0.5">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-rose-900">
                {failingJobs.length} Provisioning Job Failed ({failingJobs[0].jobCode} for {failingJobs[0].serviceDomain})
              </h3>
              <p className="text-[11px] text-rose-700 mt-0.5">
                {failingJobs[0].customerSafeError || 'WHM socket timeout during account creation.'} Safe idempotent retry is available.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => router.push('/provisioning')}
            >
              Inspect Error
            </AdminButton>
            <AdminButton
              variant="danger"
              size="sm"
              icon={<RefreshCw size={13} />}
              onClick={() => retryProvisioningJob(failingJobs[0].id)}
            >
              Retry Job
            </AdminButton>
          </div>
        </div>
      )}

      
      {/* Advanced Interactive Infrastructure & Revenue Analytics Charts */}
      <div className="space-y-6">
        {/* Row 1: High Visual Priority — Revenue & Order Velocity (2 cols) + Automated Provisioning Throughput (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 flex flex-col">
            <RevenueOrderVelocityChart />
          </div>
          <div className="lg:col-span-1 flex flex-col">
            <ProvisioningThroughputChart />
          </div>
        </div>

        {/* Row 2: Infrastructure & Distribution — Hosting Package Distribution & MRR (Left, 1 col) + Cluster Node Capacity & Density (Right, 2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <PackageTierDistributionChart />
          </div>
          <div className="lg:col-span-2">
            <ClusterNodeCapacityChart />
          </div>
        </div>
      </div>

      {/* Secondary Operational Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Orders & Recent Payments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Orders Card */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Recent Orders
                </h3>
              </div>
              <button
                onClick={() => router.push('/orders')}
                className="text-xs font-medium text-[#e8702a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => router.push('/orders')}
                  className="p-3.5 sm:px-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{order.orderNumber}</span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="font-medium text-gray-700 truncate">{order.customerName}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {order.items[0]?.productName} &bull; <span className="font-mono text-gray-600">{order.items[0]?.domain}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold font-mono text-gray-900 text-sm">LKR {order.total.toFixed(2)}</span>
                    <AdminBadge
                      variant={
                        order.orderStatus === 'COMPLETED'
                          ? 'success'
                          : order.orderStatus === 'AWAITING_PAYMENT'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {order.orderStatus}
                    </AdminBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments Card */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Recent Payments & Transactions
                </h3>
              </div>
              <button
                onClick={() => router.push('/payments')}
                className="text-xs font-medium text-[#e8702a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {recentPayments.map(payment => (
                <div
                  key={payment.id}
                  onClick={() => router.push('/payments')}
                  className="p-3.5 sm:px-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{payment.customerName}</span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="font-semibold text-gray-700">{payment.provider}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      Ref: <span className="font-mono">{payment.transactionRef}</span> &bull; <span className="font-mono font-medium">{payment.invoiceNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold font-mono text-gray-900 text-sm">LKR {payment.amount.toFixed(2)}</span>
                    <AdminBadge
                      variant={
                        payment.status === 'SUCCESS'
                          ? 'success'
                          : payment.status === 'REFUNDED'
                          ? 'neutral'
                          : 'danger'
                      }
                    >
                      {payment.status}
                    </AdminBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: High Priority Support & Administrative Audit Trail */}
        <div className="space-y-6">
          
          {/* Support Tickets Card */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                High Priority Support
              </h3>
              <button
                onClick={() => router.push('/tickets')}
                className="text-xs font-medium text-[#e8702a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Tickets</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {highPriorityTickets.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
                  All support tickets are handled!
                </div>
              ) : (
                highPriorityTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => router.push('/tickets')}
                    className="p-3.5 hover:bg-gray-50/80 transition-colors cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{ticket.ticketNumber}</span>
                      <AdminBadge variant={ticket.priority === 'HIGH' ? 'danger' : 'info'}>
                        {ticket.priority}
                      </AdminBadge>
                    </div>
                    <p className="text-gray-700 font-medium line-clamp-1">
                      {ticket.subject}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{ticket.customerName}</span>
                      <span>Assigned: {ticket.assignedAgentName || 'Unassigned'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Administrative Activity Log */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Recent Admin Activity
              </h3>
              <button
                onClick={() => router.push('/audit-logs')}
                className="text-xs font-medium text-[#e8702a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Audit</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {recentAudit.map(log => (
                <div key={log.id} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-[11px]">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    {log.details}
                  </p>
                  <div className="text-[10px] text-gray-400">
                    By: <span className="font-medium text-gray-600">{log.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
