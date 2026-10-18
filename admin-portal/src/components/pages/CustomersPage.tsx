'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminData } from '@/context/AdminDataContext';
import type { Customer } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminModal } from '@/components/ui/AdminModal';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import { AdminTabs } from '@/components/ui/AdminTabs';
import {
  Plus,
  KeyRound,
  Lock,
  Unlock,
  Download
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const router = useRouter();
  const {
    customers,
    orders,
    services,
    invoices,
    tickets,
    createCustomer,
    toggleCustomerLoginSuspended,
    addCustomerNote,
    triggerPasswordReset
  } = useAdminData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview');
  const [noteInput, setNoteInput] = useState('');

  // Add Customer Form
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLine1, setFormLine1] = useState('100 Commercial Way');
  const [formCity, setFormCity] = useState('London');
  const [formCountry, setFormCountry] = useState('United Kingdom');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomer({
      name: formName,
      email: formEmail,
      company: formCompany,
      phone: formPhone,
      billingAddress: {
        line1: formLine1,
        city: formCity,
        country: formCountry,
        postalCode: 'EC1A 1BB',
      },
    });
    setIsAddModalOpen(false);
    setFormName('');
    setFormEmail('');
    setFormCompany('');
    setFormPhone('');
  };

  const handleAddNote = () => {
    if (!noteInput.trim() || !selectedCustomer) return;
    addCustomerNote(selectedCustomer.id, noteInput.trim());
    setSelectedCustomer({
      ...selectedCustomer,
      internalNotes: [noteInput.trim(), ...selectedCustomer.internalNotes],
    });
    setNoteInput('');
  };

  const handleExportJson = () => {
    if (!selectedCustomer) return;
    const blob = new Blob([JSON.stringify(selectedCustomer, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer_${selectedCustomer.id}.json`;
    a.click();
  };

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: c => (
        <div>
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span>{c.name}</span>
            {c.company && (
              <span className="text-[10px] text-gray-400 font-normal">({c.company})</span>
            )}
          </div>
          <div className="text-[11px] text-gray-400">{c.email}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: c => (
        <div className="space-y-0.5">
          <AdminBadge variant={c.status === 'ACTIVE' ? 'success' : 'warning'}>
            {c.status}
          </AdminBadge>
          {c.loginSuspended && (
            <div className="text-[10px] font-semibold text-rose-600">Login Suspended</div>
          )}
        </div>
      ),
    },
    {
      key: 'services',
      header: 'Active Services',
      sortable: true,
      render: c => {
        const custServices = services.filter(s => s.customerId === c.id && s.status === 'ACTIVE');
        return (
          <span className="font-semibold text-gray-800">
            {custServices.length} {custServices.length === 1 ? 'Service' : 'Services'}
          </span>
        );
      },
    },
    {
      key: 'registeredDate',
      header: 'Member Since',
      render: c => <span className="text-gray-500">{c.registeredDate}</span>,
    },
    {
      key: 'outstandingBalance',
      header: 'Balance',
      render: c => (
        <span className={c.outstandingBalance > 0 ? 'text-amber-700 font-bold' : 'text-gray-600'}>
          ${c.outstandingBalance.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: c => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCustomer(c);
              setActiveDrawerTab('overview');
            }}
          >
            Inspect
          </AdminButton>

          <AdminButton
            variant={c.loginSuspended ? 'outline' : 'secondary'}
            size="sm"
            onClick={() => toggleCustomerLoginSuspended(c.id)}
            title={c.loginSuspended ? 'Restore login access' : 'Suspend login access'}
          >
            {c.loginSuspended ? <Unlock size={13} /> : <Lock size={13} />}
          </AdminButton>
        </div>
      ),
    },
  ];

  // Data for active customer in drawer
  const customerServices = selectedCustomer ? services.filter(s => s.customerId === selectedCustomer.id) : [];
  const customerOrders = selectedCustomer ? orders.filter(o => o.customerId === selectedCustomer.id) : [];
  const customerInvoices = selectedCustomer ? invoices.filter(i => i.customerId === selectedCustomer.id) : [];
  const customerTickets = selectedCustomer ? tickets.filter(t => t.customerId === selectedCustomer.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
            Customer Directory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer accounts, billing details, login access, and cross-module records.
          </p>
        </div>

        <AdminButton
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Customer
        </AdminButton>
      </div>

      <AdminTable
        data={customers}
        columns={columns}
        keyExtractor={c => c.id}
        searchPlaceholder="Search customers by name, email, or company..."
        searchFilter={(c, q) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company || '').toLowerCase().includes(q)
        }
      />

      {/* Add Customer Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
        subtitle="Create an administrative account record for a customer."
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleCreateCustomer}>
              Register Customer
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleCreateCustomer} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Alex Chen"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="alex.chen@freshkitchen.io"
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Organization</label>
              <input
                type="text"
                placeholder="Fresh Kitchen Labs Ltd"
                value={formCompany}
                onChange={e => setFormCompany(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+44 20 7946 0912"
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Billing Street Address</label>
              <input
                type="text"
                value={formLine1}
                onChange={e => setFormLine1(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formCity}
                  onChange={e => setFormCity(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formCountry}
                  onChange={e => setFormCountry(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                />
              </div>
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Customer Detail Inspector Drawer (Overview, Profile, Orders, Services, Billing, Support, Activity) */}
      <AdminDrawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || 'Customer Profile'}
        subtitle={selectedCustomer?.email}
        width="xl"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <AdminTabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'services', label: 'Services', count: customerServices.length },
                { id: 'orders', label: 'Orders', count: customerOrders.length },
                { id: 'billing', label: 'Billing', count: customerInvoices.length },
                { id: 'support', label: 'Support', count: customerTickets.length },
                { id: 'notes', label: 'Internal Notes' },
              ]}
              activeTab={activeDrawerTab}
              onChange={setActiveDrawerTab}
            />

            {/* Tab: Overview */}
            {activeDrawerTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Login Access</span>
                    <AdminBadge variant={selectedCustomer.loginSuspended ? 'danger' : 'success'}>
                      {selectedCustomer.loginSuspended ? 'Login Suspended' : 'Login Active'}
                    </AdminBadge>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Hosting Status</span>
                    <AdminBadge variant={selectedCustomer.hostingSuspended ? 'warning' : 'success'}>
                      {selectedCustomer.hostingSuspended ? 'Services Paused' : 'Services Operational'}
                    </AdminBadge>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Registered</span>
                    <span className="text-gray-800">{selectedCustomer.registeredDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Company</span>
                    <span className="text-gray-800">{selectedCustomer.company || 'Individual'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700">Billing Address</h4>
                  <p className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg p-3">
                    {selectedCustomer.billingAddress.line1}<br />
                    {selectedCustomer.billingAddress.city}, {selectedCustomer.billingAddress.country} ({selectedCustomer.billingAddress.postalCode})
                  </p>
                </div>

                {/* Quick Profile Actions */}
                <div className="pt-3 border-t border-gray-200 flex flex-wrap gap-2">
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    icon={<KeyRound size={14} />}
                    onClick={() => triggerPasswordReset(selectedCustomer.id)}
                  >
                    Reset Password
                  </AdminButton>

                  <AdminButton
                    variant={selectedCustomer.loginSuspended ? 'primary' : 'outline'}
                    size="sm"
                    icon={selectedCustomer.loginSuspended ? <Unlock size={14} /> : <Lock size={14} />}
                    onClick={() => {
                      toggleCustomerLoginSuspended(selectedCustomer.id);
                      setSelectedCustomer({
                        ...selectedCustomer,
                        loginSuspended: !selectedCustomer.loginSuspended,
                      });
                    }}
                  >
                    {selectedCustomer.loginSuspended ? 'Unsuspend Login' : 'Suspend Login'}
                  </AdminButton>

                  <AdminButton
                    variant="ghost"
                    size="sm"
                    icon={<Download size={14} />}
                    onClick={handleExportJson}
                  >
                    Export JSON
                  </AdminButton>
                </div>
              </div>
            )}

            {/* Tab: Services */}
            {activeDrawerTab === 'services' && (
              <div className="space-y-2 text-xs">
                {customerServices.length === 0 ? (
                  <p className="p-6 text-center text-gray-400">No active hosting services.</p>
                ) : (
                  customerServices.map(svc => (
                    <div
                      key={svc.id}
                      onClick={() => router.push('/services')}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{svc.primaryDomain}</div>
                        <div className="text-[11px] text-gray-400">{svc.productName} &bull; {svc.serverHostname}</div>
                      </div>
                      <AdminBadge variant={svc.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {svc.status}
                      </AdminBadge>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Orders */}
            {activeDrawerTab === 'orders' && (
              <div className="space-y-2 text-xs">
                {customerOrders.length === 0 ? (
                  <p className="p-6 text-center text-gray-400">No historical orders found.</p>
                ) : (
                  customerOrders.map(o => (
                    <div
                      key={o.id}
                      onClick={() => router.push('/orders')}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{o.orderNumber} &bull; ${o.total.toFixed(2)}</div>
                        <div className="text-[11px] text-gray-400">{o.orderDate} &bull; {o.items[0]?.productName}</div>
                      </div>
                      <AdminBadge variant={o.orderStatus === 'COMPLETED' ? 'success' : 'warning'}>
                        {o.orderStatus}
                      </AdminBadge>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Billing */}
            {activeDrawerTab === 'billing' && (
              <div className="space-y-2 text-xs">
                {customerInvoices.length === 0 ? (
                  <p className="p-6 text-center text-gray-400">No invoices on file.</p>
                ) : (
                  customerInvoices.map(inv => (
                    <div
                      key={inv.id}
                      onClick={() => router.push('/invoices')}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">{inv.invoiceNumber}</div>
                        <div className="text-[11px] text-gray-400">Issued: {inv.issueDate} &bull; Total: ${inv.total.toFixed(2)}</div>
                      </div>
                      <AdminBadge variant={inv.status === 'PAID' ? 'success' : 'warning'}>
                        {inv.status}
                      </AdminBadge>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Support */}
            {activeDrawerTab === 'support' && (
              <div className="space-y-2 text-xs">
                {customerTickets.length === 0 ? (
                  <p className="p-6 text-center text-gray-400">No support tickets submitted.</p>
                ) : (
                  customerTickets.map(t => (
                    <div
                      key={t.id}
                      onClick={() => router.push('/tickets')}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">{t.ticketNumber}</span>
                        <AdminBadge variant={t.status === 'OPEN' ? 'warning' : 'neutral'}>
                          {t.status}
                        </AdminBadge>
                      </div>
                      <p className="text-gray-700">{t.subject}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Internal Notes */}
            {activeDrawerTab === 'notes' && (
              <div className="space-y-3 text-xs">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an internal note..."
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                  <AdminButton variant="primary" size="sm" onClick={handleAddNote}>
                    Save Note
                  </AdminButton>
                </div>

                <div className="space-y-2 pt-2">
                  {selectedCustomer.internalNotes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-lg text-amber-900">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>
    </div>
  );
};
