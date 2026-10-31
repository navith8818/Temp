'use client';

import React, { useState, useEffect } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { HostingServer, ServerProvider, ServerType } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminModal } from '@/components/ui/AdminModal';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import { AdminConfirmDialog } from '@/components/ui/AdminConfirmDialog';
import { AdminTabs } from '@/components/ui/AdminTabs';
import {
  Plus,
  Activity,
  Wifi,
  Wrench,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const ServersPage: React.FC = () => {
  const {
    servers,
    services,
    serverGroups,
    provisioningJobs,
    addServer,
    toggleServerAllocation,
    markServerMaintenance,
    testServerConnection,
    checkServerHealth,
    decommissionServer,
    currentRole,
    addToast
  } = useAdminData();

  // Dialog & Drawer States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<HostingServer | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview');
  const [serverToDecommission, setServerToDecommission] = useState<HostingServer | null>(null);
  const [testingServerId, setTestingServerId] = useState<string | null>(null);

  // Add Server Form State
  const [formName, setFormName] = useState('');
  const [formHostname, setFormHostname] = useState('');
  const [formIp, setFormIp] = useState('');
  const [formProvider, setFormProvider] = useState<ServerProvider>('WHM_CPANEL');
  const [formType, setFormType] = useState<ServerType>('SHARED_HOSTING');
  const [formLocation, setFormLocation] = useState('Frankfurt, DE');
  const [formDatacenter, setFormDatacenter] = useState('Equinix FR2');
  const [formPort, setFormPort] = useState(2087);
  const [formApiUser, setFormApiUser] = useState('root');
  const [formApiToken, setFormApiToken] = useState('whm_token_demo_98412');
  const [formPveNode, setFormPveNode] = useState('pve-node-beta');
  const [formServerGroup, setFormServerGroup] = useState('sg_shared_eu');
  const [formAccountsLimit, setFormAccountsLimit] = useState(250);
  const [formTestSuccess, setFormTestSuccess] = useState<boolean | null>(null);
  const [isTestingConnectionInModal, setIsTestingConnectionInModal] = useState(false);

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  // Auto-open server inspector if id provided in URL query
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serverId = params.get('id');
      if (serverId) {
        const found = servers.find(s => s.id === serverId);
        if (found) setSelectedServer(found);
      }
    }
  }, [servers]);


  // Handle Add Server submit
  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addServer({
      name: formName || formHostname,
      hostname: formHostname,
      ipAddress: formIp,
      provider: formProvider,
      serverType: formType,
      datacenter: formDatacenter,
      location: formLocation,
      capacity: {
        cpuCores: 32,
        cpuUsagePct: 12,
        ramGb: 128,
        ramUsageGb: 18,
        storageGb: 2000,
        storageUsageGb: 40,
        accountsCount: 0,
        accountsLimit: Number(formAccountsLimit) || 250,
      },
      providerConfig: {
        port: Number(formPort),
        useSsl: true,
        apiUsername: formApiUser,
        hasApiToken: true,
        clusterNode: formProvider === 'PROXMOX_KVM' ? formPveNode : undefined,
        nameservers: ['ns1.serversalad.com', 'ns2.serversalad.com'],
      },
      notes: `Configured on ${formLocation} with group ${formServerGroup}.`,
    });

    if (success) {
      setIsAddModalOpen(false);
      // Reset form
      setFormName('');
      setFormHostname('');
      setFormIp('');
      setFormTestSuccess(null);
    }
  };

  // Test connection in modal
  const handleModalConnectionTest = async () => {
    if (!formHostname || !formIp) {
      addToast('error', 'Missing Information', 'Enter hostname and IP first to test connection.');
      return;
    }
    setIsTestingConnectionInModal(true);
    await new Promise(r => setTimeout(r, 600));
    setIsTestingConnectionInModal(false);
    setFormTestSuccess(true);
    addToast('success', 'Handshake Verified', `Simulated ping to ${formHostname}:${formPort} responded in 38ms.`);
  };

  // Inline connection test for row
  const handleTestConnection = async (serverId: string) => {
    setTestingServerId(serverId);
    const result = await testServerConnection(serverId);
    setTestingServerId(null);
    if (result.success) {
      addToast('success', 'Handshake Verified', result.message);
    } else {
      addToast('error', 'Connection Failed', result.message);
    }
  };

  // Table Columns
  const columns: Column<HostingServer>[] = [
    {
      key: 'name',
      header: 'Server Node',
      sortable: true,
      render: srv => (
        <div className="space-y-0.5">
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span>{srv.name}</span>
            {srv.provider === 'WHM_CPANEL' && (
              <span className="text-[10px] bg-amber-50 text-amber-700 px-1 rounded border border-amber-200">WHM</span>
            )}
            {srv.provider === 'PROXMOX_KVM' && (
              <span className="text-[10px] bg-purple-50 text-purple-700 px-1 rounded border border-purple-200">KVM</span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            {srv.hostname} &bull; {srv.ipAddress}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Health Status',
      sortable: true,
      render: srv => (
        <div className="space-y-1">
          <AdminBadge
            variant={
              srv.status === 'ONLINE'
                ? 'success'
                : srv.status === 'MAINTENANCE'
                ? 'warning'
                : 'danger'
            }
          >
            {srv.status}
          </AdminBadge>
          <div className="text-[10px] text-gray-400">
            Checked: {srv.lastHealthCheck}
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Datacenter / OS',
      render: srv => (
        <div>
          <div className="font-medium text-gray-800">{srv.location}</div>
          <div className="text-[11px] text-gray-400 truncate max-w-[140px]">{srv.os}</div>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'CPU / RAM Usage',
      render: srv => (
        <div className="space-y-1 w-32">
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>CPU: {srv.capacity.cpuUsagePct}%</span>
            <span>RAM: {srv.capacity.ramUsageGb}G</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                srv.capacity.cpuUsagePct > 80
                  ? 'bg-rose-500'
                  : srv.capacity.cpuUsagePct > 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${srv.capacity.cpuUsagePct}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'allocatedServicesCount',
      header: 'Allocations',
      sortable: true,
      render: srv => {
        const pct = Math.round((srv.capacity.accountsCount / srv.capacity.accountsLimit) * 100);
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-800 flex items-center gap-1">
              <span>{srv.capacity.accountsCount} / {srv.capacity.accountsLimit}</span>
              <span className="text-[10px] text-gray-400">({pct}%)</span>
            </div>
            <div>
              {srv.allocationEnabled ? (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Allocations Active
                </span>
              ) : (
                <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded border border-gray-200">
                  Disabled
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: srv => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedServer(srv);
              setActiveDrawerTab('overview');
            }}
          >
            Details
          </AdminButton>

          <AdminButton
            variant="secondary"
            size="sm"
            isLoading={testingServerId === srv.id}
            onClick={() => handleTestConnection(srv.id)}
            title="Run live ping/handshake test"
          >
            Test
          </AdminButton>

          {!isRestricted && (
            <AdminButton
              variant={srv.allocationEnabled ? 'outline' : 'subtle'}
              size="sm"
              onClick={() => toggleServerAllocation(srv.id)}
              title={srv.allocationEnabled ? 'Disable new accounts' : 'Enable new accounts'}
            >
              {srv.allocationEnabled ? 'Pause' : 'Enable'}
            </AdminButton>
          )}
        </div>
      ),
    },
  ];

  // Services allocated to selected server in drawer
  const serverServices = selectedServer
    ? services.filter(s => s.serverId === selectedServer.id)
    : [];

  const serverJobs = selectedServer
    ? provisioningJobs.filter(j => j.targetServerId === selectedServer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
            Server Infrastructure
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Register and monitor WHM/cPanel nodes, KVM hypervisors, capacity quotas, and connection health.
          </p>
        </div>

        {!isRestricted && (
          <div className="flex items-center gap-2">
            <AdminButton
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Server
            </AdminButton>
          </div>
        )}
      </div>

      {/* Main Server Table */}
      <AdminTable
        data={servers}
        columns={columns}
        keyExtractor={s => s.id}
        searchPlaceholder="Search servers by name, hostname, IP..."
        searchFilter={(s, q) =>
          s.name.toLowerCase().includes(q) ||
          s.hostname.toLowerCase().includes(q) ||
          s.ipAddress.includes(q) ||
          s.location.toLowerCase().includes(q)
        }
      />

      {/* Add Server Modal (Scenario B) */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Hosting Server"
        subtitle="Connect WHM/cPanel or KVM cloud hypervisor nodes to your hosting cluster."
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleCreateServer}>
              Register Server
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleCreateServer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Provider Type *
              </label>
              <select
                value={formProvider}
                onChange={e => {
                  const p = e.target.value as ServerProvider;
                  setFormProvider(p);
                  if (p === 'PROXMOX_KVM') {
                    setFormType('VPS_NODE');
                    setFormPort(8006);
                  } else {
                    setFormType('SHARED_HOSTING');
                    setFormPort(2087);
                  }
                }}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-[#e8702a]"
              >
                <option value="WHM_CPANEL">cPanel & WHM (Shared Hosting)</option>
                <option value="PROXMOX_KVM">Proxmox VE / KVM (VPS Node)</option>
                <option value="HETZNER_CLOUD">Hetzner Cloud Dedicated</option>
                <option value="AWS_EC2">Amazon Web Services (EC2)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. cp3.serversalad.com"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hostname or FQDN *
              </label>
              <input
                type="text"
                required
                placeholder="cp3.serversalad.com"
                value={formHostname}
                onChange={e => setFormHostname(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                IP Address *
              </label>
              <input
                type="text"
                required
                placeholder="198.51.100.95"
                value={formIp}
                onChange={e => setFormIp(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Location & Datacenter
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={e => {
                  setFormLocation(e.target.value);
                  setFormDatacenter(e.target.value);
                }}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-[#e8702a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Server Group
              </label>
              <select
                value={formServerGroup}
                onChange={e => setFormServerGroup(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-[#e8702a]"
              >
                {serverGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.purpose})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Provider Configuration */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              {formProvider === 'WHM_CPANEL' ? 'WHM API Handshake Credentials' : 'KVM Cluster Configuration'}
            </h4>

            {formProvider === 'WHM_CPANEL' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">WHM Port</label>
                  <input
                    type="number"
                    value={formPort}
                    onChange={e => setFormPort(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">API User</label>
                  <input
                    type="text"
                    value={formApiUser}
                    onChange={e => setFormApiUser(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">WHM API Token</label>
                  <input
                    type="password"
                    value={formApiToken}
                    onChange={e => setFormApiToken(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Cluster Node Name</label>
                  <input
                    type="text"
                    value={formPveNode}
                    onChange={e => setFormPveNode(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Management Port</label>
                  <input
                    type="number"
                    value={formPort}
                    onChange={e => setFormPort(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                  />
                </div>
              </div>
            )}

            {/* Test Connection Button Inside Form */}
            <div className="mt-3 flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200/80">
              <div className="text-[11px] text-gray-600">
                {formTestSuccess === true ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} /> Connection verified successfully
                  </span>
                ) : (
                  <span>Verify provider API socket connectivity before saving.</span>
                )}
              </div>
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                icon={<Wifi size={13} />}
                isLoading={isTestingConnectionInModal}
                onClick={handleModalConnectionTest}
              >
                Test Connection
              </AdminButton>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-600">Max Account Capacity:</span>
            <input
              type="number"
              value={formAccountsLimit}
              onChange={e => setFormAccountsLimit(Number(e.target.value))}
              className="w-24 bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-right text-gray-800"
            />
          </div>
        </form>
      </AdminModal>

      {/* Server Details Slide-Over Drawer */}
      <AdminDrawer
        isOpen={!!selectedServer}
        onClose={() => setSelectedServer(null)}
        title={selectedServer?.name || 'Server Details'}
        subtitle={`${selectedServer?.hostname} (${selectedServer?.ipAddress})`}
        width="xl"
      >
        {selectedServer && (
          <div className="space-y-5">
            {/* Drawer Tabs */}
            <AdminTabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'capacity', label: 'Capacity & Load' },
                { id: 'services', label: 'Allocated Services', count: serverServices.length },
                { id: 'jobs', label: 'Provisioning History', count: serverJobs.length },
              ]}
              activeTab={activeDrawerTab}
              onChange={setActiveDrawerTab}
            />

            {/* Tab: Overview */}
            {activeDrawerTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200/80">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Status</span>
                    <AdminBadge variant={selectedServer.status === 'ONLINE' ? 'success' : 'warning'}>
                      {selectedServer.status}
                    </AdminBadge>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Provider</span>
                    <span className="font-semibold text-gray-900">{selectedServer.provider}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Datacenter</span>
                    <span className="text-gray-800">{selectedServer.location} &bull; {selectedServer.datacenter}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Operating System</span>
                    <span className="text-gray-800">{selectedServer.os}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 text-xs">Provider Configuration</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-1.5 font-mono text-[11px] text-gray-600">
                    <div>Port: {selectedServer.providerConfig.port} ({selectedServer.providerConfig.useSsl ? 'SSL' : 'Plain'})</div>
                    {selectedServer.providerConfig.apiUsername && (
                      <div>API User: {selectedServer.providerConfig.apiUsername}</div>
                    )}
                    {selectedServer.providerConfig.nameservers && (
                      <div>Nameservers: {selectedServer.providerConfig.nameservers.join(', ')}</div>
                    )}
                  </div>
                </div>

                {/* Actions Inside Drawer */}
                <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center gap-2">
                  <AdminButton
                    variant="secondary"
                    size="sm"
                    icon={<Activity size={14} />}
                    onClick={() => checkServerHealth(selectedServer.id)}
                  >
                    Check Health Now
                  </AdminButton>

                  <AdminButton
                    variant="outline"
                    size="sm"
                    icon={<Wrench size={14} />}
                    onClick={() => markServerMaintenance(selectedServer.id)}
                  >
                    {selectedServer.status === 'MAINTENANCE' ? 'Exit Maintenance' : 'Set Maintenance'}
                  </AdminButton>

                  {!isRestricted && (
                    <AdminButton
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      onClick={() => setServerToDecommission(selectedServer)}
                    >
                      Decommission
                    </AdminButton>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Capacity & Load */}
            {activeDrawerTab === 'capacity' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-700">CPU Usage ({selectedServer.capacity.cpuCores} Cores)</span>
                      <span className="font-mono text-gray-800">{selectedServer.capacity.cpuUsagePct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[#e8702a] rounded-full"
                        style={{ width: `${selectedServer.capacity.cpuUsagePct}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-700">RAM Allocation ({selectedServer.capacity.ramGb} GB ECC)</span>
                      <span className="font-mono text-gray-800">{selectedServer.capacity.ramUsageGb} / {selectedServer.capacity.ramGb} GB</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(selectedServer.capacity.ramUsageGb / selectedServer.capacity.ramGb) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-gray-700">Storage Usage ({selectedServer.capacity.storageGb} GB NVMe)</span>
                      <span className="font-mono text-gray-800">{selectedServer.capacity.storageUsageGb} / {selectedServer.capacity.storageGb} GB</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(selectedServer.capacity.storageUsageGb / selectedServer.capacity.storageGb) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Allocated Services */}
            {activeDrawerTab === 'services' && (
              <div className="space-y-2">
                {serverServices.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No hosting services currently allocated to this node.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {serverServices.map(svc => (
                      <div key={svc.id} className="p-3 bg-white flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-gray-900">{svc.primaryDomain}</div>
                          <div className="text-[11px] text-gray-400">Customer: {svc.customerName}</div>
                        </div>
                        <AdminBadge variant={svc.status === 'ACTIVE' ? 'success' : 'warning'}>
                          {svc.status}
                        </AdminBadge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Provisioning History */}
            {activeDrawerTab === 'jobs' && (
              <div className="space-y-2">
                {serverJobs.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No recorded jobs targeting this node.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {serverJobs.map(job => (
                      <div key={job.id} className="p-3 bg-white space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">{job.jobCode}</span>
                          <AdminBadge variant={job.status === 'SUCCEEDED' ? 'success' : 'danger'}>
                            {job.status}
                          </AdminBadge>
                        </div>
                        <p className="text-[11px] text-gray-500">{job.operation} for {job.serviceDomain}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </AdminDrawer>

      {/* Safety Decommission Confirmation Dialog (Safety Guard) */}
      <AdminConfirmDialog
        isOpen={!!serverToDecommission}
        onClose={() => setServerToDecommission(null)}
        onConfirm={() => {
          if (serverToDecommission) {
            const res = decommissionServer(serverToDecommission.id);
            if (res.success) {
              setServerToDecommission(null);
              setSelectedServer(null);
            }
          }
        }}
        title="Decommission Server Node"
        description={`Are you sure you want to decommission ${serverToDecommission?.name}? If any active hosting accounts exist, decommissioning will be safely blocked until customer accounts are migrated.`}
        confirmLabel="Decommission Node"
        isDestructive={true}
      />
    </div>
  );
};
