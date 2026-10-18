'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { ServerGroup, ServerProvider } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminModal } from '@/components/ui/AdminModal';
import {
  Plus,
  ShieldCheck
} from 'lucide-react';

export const ServerGroupsPage: React.FC = () => {
  const {
    serverGroups,
    servers,
    createServerGroup,
    updateServerGroup,
    toggleServerGroup,
    currentRole
  } = useAdminData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPurpose, setFormPurpose] = useState<ServerGroup['purpose']>('SHARED_HOSTING');
  const [formProvider, setFormProvider] = useState<ServerProvider>('WHM_CPANEL');
  const [formLocation, setFormLocation] = useState('Frankfurt, Germany (FRA-1)');
  const [formPolicy, setFormPolicy] = useState<ServerGroup['allocationPolicy']>('BALANCED');
  const [formSelectedServers, setFormSelectedServers] = useState<string[]>([]);
  const [formDesc, setFormDesc] = useState('');

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  const handleOpenCreate = () => {
    setEditingGroupId(null);
    setFormName('');
    setFormPurpose('SHARED_HOSTING');
    setFormProvider('WHM_CPANEL');
    setFormLocation('Frankfurt, Germany (FRA-1)');
    setFormPolicy('BALANCED');
    setFormSelectedServers(['srv_cpanel_01']);
    setFormDesc('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroupId) {
      updateServerGroup(editingGroupId, {
        name: formName,
        purpose: formPurpose,
        provider: formProvider,
        location: formLocation,
        allocationPolicy: formPolicy,
        serverIds: formSelectedServers,
        description: formDesc,
      });
    } else {
      createServerGroup({
        name: formName,
        purpose: formPurpose,
        provider: formProvider,
        location: formLocation,
        allocationPolicy: formPolicy,
        serverIds: formSelectedServers,
        description: formDesc,
      });
    }
    setIsModalOpen(false);
  };

  const columns: Column<ServerGroup>[] = [
    {
      key: 'name',
      header: 'Server Cluster / Group',
      sortable: true,
      render: g => (
        <div>
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span>{g.name}</span>
            <AdminBadge variant={g.purpose === 'SHARED_HOSTING' ? 'info' : 'neutral'}>
              {g.purpose.replace('_', ' ')}
            </AdminBadge>
          </div>
          <div className="text-[11px] text-gray-400">{g.description}</div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Region / Location',
      render: g => <span className="text-gray-700 font-medium">{g.location}</span>,
    },
    {
      key: 'servers',
      header: 'Registered Nodes',
      render: g => {
        const assignedServers = servers.filter(s => g.serverIds.includes(s.id));
        return (
          <div className="space-y-0.5">
            <div className="font-semibold text-gray-900">{assignedServers.length} Nodes</div>
            <div className="text-[11px] text-gray-400 truncate max-w-xs">
              {assignedServers.map(s => s.name).join(', ') || 'No servers assigned'}
            </div>
          </div>
        );
      },
    },
    {
      key: 'allocationPolicy',
      header: 'Allocation Policy',
      render: g => (
        <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
          {g.allocationPolicy}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: g => (
        <AdminBadge variant={g.enabled ? 'success' : 'neutral'}>
          {g.enabled ? 'Accepting Traffic' : 'Disabled'}
        </AdminBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: g => (
        <div className="flex items-center justify-end gap-1.5">
          {!isRestricted && (
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => toggleServerGroup(g.id)}
            >
              {g.enabled ? 'Pause' : 'Enable'}
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
            Server Groups & Allocation Rules
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Ensure package compatibility, prevent accidental cross-provisioning, and balance server load.
          </p>
        </div>

        {!isRestricted && (
          <AdminButton
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={handleOpenCreate}
          >
            Create Group
          </AdminButton>
        )}
      </div>

      {/* Allocation Rules Compatibility Matrix */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Provisioning Isolation & Compatibility Guard</span>
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
          Automated provisioning routes packages strictly to matched server groups. WHM/cPanel packages will never be allocated to VPS hypervisors, and KVM templates require approved virtualization pools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200/80 text-xs space-y-1">
            <div className="font-semibold text-gray-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Shared Hosting Pipeline &bull; cPanel & WHM</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Assigned Packages: <strong>Web Hosting Starter, Essential, Pro</strong>
            </p>
            <p className="text-[11px] text-gray-500">
              Eligible Target Nodes: <strong>cp1.serversalad.com, cp2.serversalad.com</strong>
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200/80 text-xs space-y-1">
            <div className="font-semibold text-gray-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Cloud VPS Pipeline &bull; Proxmox VE KVM</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Assigned Packages: <strong>Cloud VPS Standard</strong>
            </p>
            <p className="text-[11px] text-gray-500">
              Eligible Target Nodes: <strong>kvm1-fra.serversalad.net</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Groups Table */}
      <AdminTable
        data={serverGroups}
        columns={columns}
        keyExtractor={g => g.id}
        searchPlaceholder="Search server groups..."
        searchFilter={(g, q) => g.name.toLowerCase().includes(q) || g.location.toLowerCase().includes(q)}
      />

      {/* Create Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroupId ? 'Edit Server Group' : 'Create Server Group'}
        subtitle="Group servers into regional clusters and define allocation distribution."
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave}>
              Save Group
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Group Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. EU-West Production Cluster"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Purpose *</label>
              <select
                value={formPurpose}
                onChange={e => setFormPurpose(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              >
                <option value="SHARED_HOSTING">Shared Web Hosting</option>
                <option value="VPS_CLUSTER">VPS Cloud Cluster</option>
                <option value="DEDICATED_ISOLATION">Dedicated Isolation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Allocation Policy</label>
              <select
                value={formPolicy}
                onChange={e => setFormPolicy(e.target.value as any)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              >
                <option value="BALANCED">Balanced (Spread Load Evenly)</option>
                <option value="PACK_FIRST">Pack First (Fill Node to 80%)</option>
                <option value="MANUAL">Manual Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Region / Location</label>
            <input
              type="text"
              value={formLocation}
              onChange={e => setFormLocation(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={formDesc}
              onChange={e => setFormDesc(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
            />
          </div>
        </form>
      </AdminModal>
    </div>
  );
};
