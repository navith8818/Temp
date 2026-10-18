'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { StaffMember, StaffRole } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminModal } from '@/components/ui/AdminModal';
import {
  ShieldCheck,
  Plus,
  UserCheck,
  Lock,
  Unlock,
  Check,
  X
} from 'lucide-react';

export const StaffPage: React.FC = () => {
  const {
    staff,
    currentRole,
    setCurrentRole,
    addStaffMember,
    updateStaffRole,
    toggleStaffStatus
  } = useAdminData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<StaffRole>('SUPPORT_AGENT');
  const [formDepartment, setFormDepartment] = useState('Customer Support');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaffMember({
      name: formName,
      email: formEmail,
      role: formRole,
      department: formDepartment,
    });
    setIsAddModalOpen(false);
    setFormName('');
    setFormEmail('');
  };

  const columns: Column<StaffMember>[] = [
    {
      key: 'name',
      header: 'Staff Member',
      sortable: true,
      render: s => (
        <div>
          <span className="font-semibold text-gray-900">{s.name}</span>
          <div className="text-[11px] text-gray-400">{s.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      render: s => (
        <select
          value={s.role}
          onChange={e => updateStaffRole(s.id, e.target.value as StaffRole)}
          className="font-semibold text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded px-2 py-1 cursor-pointer focus:outline-none focus:border-[#e8702a]"
        >
          <option value="ADMINISTRATOR">ADMINISTRATOR</option>
          <option value="STAFF">STAFF</option>
          <option value="SUPPORT_AGENT">SUPPORT AGENT</option>
          <option value="BILLING_STAFF">BILLING STAFF</option>
        </select>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: s => <span className="text-gray-600">{s.department}</span>,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: s => <span className="text-gray-500">{s.lastActive}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: s => (
        <AdminBadge variant={s.status === 'ACTIVE' ? 'success' : 'neutral'}>
          {s.status}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: s => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant={currentRole === s.role ? 'primary' : 'outline'}
            size="sm"
            icon={<UserCheck size={12} />}
            onClick={() => setCurrentRole(s.role)}
            title="Simulate this role in the Admin Portal (Scenario G)"
          >
            {currentRole === s.role ? 'Active View' : 'Simulate View'}
          </AdminButton>

          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => toggleStaffStatus(s.id)}
            title={s.status === 'ACTIVE' ? 'Disable account' : 'Enable account'}
          >
            {s.status === 'ACTIVE' ? <Lock size={12} /> : <Unlock size={12} />}
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
            Staff & Permissions Matrix
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage administrative operators, role-based access restrictions, and simulate staff perspectives.
          </p>
        </div>

        <AdminButton
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Staff Member
        </AdminButton>
      </div>

      {/* Role Simulation Callout (Scenario G) */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#e8702a]" />
            <span>Demonstration Scenario G &bull; Active Role Simulator</span>
          </h3>
          <span className="text-xs font-bold text-[#e8702a] bg-[#fcf5f1] px-2 py-0.5 rounded border border-[#e8702a]/20">
            Current: {currentRole.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Switch roles using the buttons below or in the top bar to test security guard enforcement. For example, switching to <strong>Support Agent</strong> restricts financial refunds and hides server decommissioning; switching to <strong>Billing Staff</strong> hides infrastructure mutating actions.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {(['ADMINISTRATOR', 'STAFF', 'SUPPORT_AGENT', 'BILLING_STAFF'] as StaffRole[]).map(r => (
            <button
              key={r}
              onClick={() => setCurrentRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                currentRole === r
                  ? 'bg-[#e8702a] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      <AdminTable
        data={staff}
        columns={columns}
        keyExtractor={s => s.id}
        searchPlaceholder="Search staff by name or email..."
        searchFilter={(s, q) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)}
      />

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
          Role Permission Capabilities
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-200 rounded-lg">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-[11px] uppercase font-semibold">
              <tr>
                <th className="p-2.5">Module Capability</th>
                <th className="p-2.5 text-center">Admin</th>
                <th className="p-2.5 text-center">Staff</th>
                <th className="p-2.5 text-center">Support Agent</th>
                <th className="p-2.5 text-center">Billing Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="p-2.5 font-medium">Servers & Cluster Decommissioning</td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-rose-500 font-bold"><X size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-rose-500 font-bold"><X size={14} className="mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Product & Pricing Configuration</td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-rose-500 font-bold"><X size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-rose-500 font-bold"><X size={14} className="mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Payment Refunds & Invoice Adjustments</td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-rose-500 font-bold"><X size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-rose-500 font-bold"><X size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Tickets, Chat & Customer Notes</td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
                <td className="p-2.5 text-center text-emerald-600 font-bold"><Check size={14} className="mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Staff Member"
        subtitle="Provision a team login with specific operational responsibilities."
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleAddStaff}>
              Create Staff Account
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleAddStaff} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rachel Adams"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Company Email *</label>
            <input
              type="email"
              required
              placeholder="rachel@serversalad.com"
              value={formEmail}
              onChange={e => setFormEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Role *</label>
              <select
                value={formRole}
                onChange={e => setFormRole(e.target.value as StaffRole)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              >
                <option value="ADMINISTRATOR">Administrator</option>
                <option value="STAFF">Staff (Operations)</option>
                <option value="SUPPORT_AGENT">Support Agent</option>
                <option value="BILLING_STAFF">Billing Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={formDepartment}
                onChange={e => setFormDepartment(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
