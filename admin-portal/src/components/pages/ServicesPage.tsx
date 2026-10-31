'use client';

import React, { useState, useEffect } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { HostingService } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import { AdminModal } from '@/components/ui/AdminModal';
import { AdminConfirmDialog } from '@/components/ui/AdminConfirmDialog';
import {
  PauseCircle,
  PlayCircle,
  Trash2,
  ExternalLink,
  Server,
  Layers
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const {
    services,
    servers,
    products,
    suspendService,
    unsuspendService,
    terminateService,
    changeServiceServer,
    changeServiceProduct,
    currentRole
  } = useAdminData();

  const [selectedService, setSelectedService] = useState<HostingService | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('Terms of Service non-compliance or billing overdue');
  const [serviceToTerminate, setServiceToTerminate] = useState<HostingService | null>(null);

  // Upgrade / Server migration state
  const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
  const [targetServerId, setTargetServerId] = useState('');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [productFilter, setProductFilter] = useState<string>('ALL');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product');
      if (prodId) {
        setProductFilter(prodId);
      }
    }
  }, []);

  const [targetProductId, setTargetProductId] = useState('');

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  const handleConfirmSuspend = () => {
    if (selectedService) {
      suspendService(selectedService.id, suspendReason);
      setSelectedService({
        ...selectedService,
        status: 'SUSPENDED',
        suspensionReason: suspendReason,
      });
      setIsSuspendModalOpen(false);
    }
  };

  const handleConfirmTerminate = () => {
    if (serviceToTerminate) {
      terminateService(serviceToTerminate.id);
      if (selectedService?.id === serviceToTerminate.id) {
        setSelectedService({ ...selectedService, status: 'TERMINATED' });
      }
      setServiceToTerminate(null);
    }
  };

  const handleMigrateServer = () => {
    if (selectedService && targetServerId) {
      changeServiceServer(selectedService.id, targetServerId);
      const newSrv = servers.find(s => s.id === targetServerId);
      if (newSrv) {
        setSelectedService({
          ...selectedService,
          serverId: newSrv.id,
          serverHostname: newSrv.hostname,
          serverIp: newSrv.ipAddress,
        });
      }
      setIsMigrateModalOpen(false);
    }
  };

  const handleUpgradePackage = () => {
    if (selectedService && targetProductId) {
      changeServiceProduct(selectedService.id, targetProductId);
      const newProd = products.find(p => p.id === targetProductId);
      if (newProd) {
        setSelectedService({
          ...selectedService,
          productId: newProd.id,
          productName: newProd.name,
        });
      }
      setIsUpgradeModalOpen(false);
    }
  };

  const columns: Column<HostingService>[] = [
    {
      key: 'primaryDomain',
      header: 'Domain / Instance',
      sortable: true,
      render: s => (
        <div>
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span>{s.primaryDomain}</span>
            <AdminBadge variant={s.serviceType === 'SHARED' ? 'info' : 'neutral'}>
              {s.serviceType}
            </AdminBadge>
          </div>
          <div className="text-[11px] text-gray-400 font-mono">
            User: {s.controlPanelUsername}
          </div>
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: s => (
        <div>
          <div className="font-medium text-gray-800">{s.customerName}</div>
          <div className="text-[11px] text-gray-400">{s.customerEmail}</div>
        </div>
      ),
    },
    {
      key: 'serverHostname',
      header: 'Assigned Infrastructure Node',
      render: s => (
        <div>
          <div className="font-semibold text-gray-800 flex items-center gap-1">
            <Server size={12} className="text-gray-400" />
            <span>{s.serverHostname}</span>
          </div>
          <div className="text-[11px] text-gray-400 font-mono">{s.serverIp}</div>
        </div>
      ),
    },
    {
      key: 'storageUsedGb',
      header: 'Disk & Bandwidth Quotas',
      render: s => (
        <div className="text-[11px] space-y-0.5 text-gray-600">
          <div>Storage: {s.storageUsedGb} / {s.storageLimitGb} GB</div>
          <div className="text-gray-400">Bandwidth: {s.bandwidthUsedGb} / {s.bandwidthLimitGb} GB</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Service State',
      sortable: true,
      render: s => (
        <div className="space-y-0.5">
          <AdminBadge
            variant={
              s.status === 'ACTIVE'
                ? 'success'
                : s.status === 'SUSPENDED'
                ? 'danger'
                : s.status === 'PROVISIONING'
                ? 'info'
                : 'neutral'
            }
          >
            {s.status}
          </AdminBadge>
          {s.suspensionReason && (
            <div className="text-[10px] text-rose-600 truncate max-w-[120px]" title={s.suspensionReason}>
              {s.suspensionReason}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'nextRenewalDate',
      header: 'Next Renewal',
      render: s => (
        <div className="text-xs">
          <div className="font-medium text-gray-800">{s.nextRenewalDate}</div>
          <div className="text-[11px] text-gray-400">LKR {s.renewalPrice.toFixed(2)} ({s.billingCycle.toLowerCase()})</div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: s => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedService(s)}
          >
            Manage
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
            Hosting Services Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Active cPanel accounts, cloud VPS nodes, telemetry metrics, and hosting lifecycle operations.
          </p>
        </div>
      </div>

      <AdminTable
        data={productFilter === 'ALL' ? services : services.filter(s => s.productId === productFilter)}
        columns={columns}
        keyExtractor={s => s.id}
        searchPlaceholder="Search services by domain, customer, server..."
        searchFilter={(s, q) =>
          s.primaryDomain.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.serverHostname.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q)
        }
      />

      {/* Service Details Drawer */}
      <AdminDrawer
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={`Hosting: ${selectedService?.primaryDomain}`}
        subtitle={`${selectedService?.productName} &bull; ${selectedService?.serverHostname}`}
        width="xl"
      >
        {selectedService && (
          <div className="space-y-5 text-xs">
            {/* Status Card */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Service State</span>
                <AdminBadge
                  variant={
                    selectedService.status === 'ACTIVE'
                      ? 'success'
                      : selectedService.status === 'SUSPENDED'
                      ? 'danger'
                      : 'neutral'
                  }
                >
                  {selectedService.status}
                </AdminBadge>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">cPanel / Control Panel</span>
                <a
                  href={selectedService.controlPanelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#e8702a] hover:underline flex items-center gap-1"
                >
                  <span>Launch Web Panel</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Customer</span>
                <span className="font-semibold text-gray-900">{selectedService.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Assigned Node</span>
                <span className="font-semibold text-gray-900">{selectedService.serverHostname}</span>
              </div>
            </div>

            {/* Quota gauges */}
            <div className="space-y-3 bg-white p-4 border border-gray-200 rounded-xl">
              <h4 className="font-semibold text-gray-800 text-xs">Resource Utilization</h4>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Storage Quota</span>
                  <span>{selectedService.storageUsedGb} / {selectedService.storageLimitGb} GB</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(selectedService.storageUsedGb / selectedService.storageLimitGb) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Bandwidth Quota</span>
                  <span>{selectedService.bandwidthUsedGb} / {selectedService.bandwidthLimitGb} GB</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#e8702a] rounded-full"
                    style={{ width: `${(selectedService.bandwidthUsedGb / selectedService.bandwidthLimitGb) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Lifecycle Control Actions */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800 text-xs">Lifecycle Operations</h4>

              <div className="grid grid-cols-2 gap-2">
                {selectedService.status === 'ACTIVE' ? (
                  <AdminButton
                    variant="outline"
                    size="sm"
                    icon={<PauseCircle size={14} className="text-amber-600" />}
                    onClick={() => setIsSuspendModalOpen(true)}
                  >
                    Suspend Service
                  </AdminButton>
                ) : selectedService.status === 'SUSPENDED' ? (
                  <AdminButton
                    variant="primary"
                    size="sm"
                    icon={<PlayCircle size={14} />}
                    onClick={() => {
                      unsuspendService(selectedService.id);
                      setSelectedService({ ...selectedService, status: 'ACTIVE' });
                    }}
                  >
                    Unsuspend Service
                  </AdminButton>
                ) : null}

                {!isRestricted && (
                  <>
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      icon={<Layers size={14} />}
                      onClick={() => {
                        setTargetProductId(selectedService.productId);
                        setIsUpgradeModalOpen(true);
                      }}
                    >
                      Change Package
                    </AdminButton>

                    <AdminButton
                      variant="secondary"
                      size="sm"
                      icon={<Server size={14} />}
                      onClick={() => {
                        setTargetServerId(selectedService.serverId);
                        setIsMigrateModalOpen(true);
                      }}
                    >
                      Reassign Server
                    </AdminButton>

                    {selectedService.status !== 'TERMINATED' && (
                      <AdminButton
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => setServiceToTerminate(selectedService)}
                      >
                        Terminate Service
                      </AdminButton>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* Suspend Reason Modal */}
      <AdminModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        title="Suspend Hosting Account"
        subtitle="This disables web serving, mail delivery, and cPanel logins for the customer."
        maxWidth="sm"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsSuspendModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={handleConfirmSuspend}>
              Confirm Suspension
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-700">
            Administrative Suspension Reason
          </label>
          <textarea
            rows={3}
            value={suspendReason}
            onChange={e => setSuspendReason(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
          />
        </div>
      </AdminModal>

      {/* Reassign Server Modal */}
      <AdminModal
        isOpen={isMigrateModalOpen}
        onClose={() => setIsMigrateModalOpen(false)}
        title="Reassign Server Node"
        subtitle="Migrate or map hosting account to a different active infrastructure node."
        maxWidth="sm"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsMigrateModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleMigrateServer}>
              Reassign Node
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-700">Select Target Server Node</label>
          <select
            value={targetServerId}
            onChange={e => setTargetServerId(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
          >
            {servers.filter(s => s.status === 'ONLINE').map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.location} - {s.provider})</option>
            ))}
          </select>
        </div>
      </AdminModal>

      {/* Change Package Modal */}
      <AdminModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Change Service Package"
        subtitle="Upgrade or downgrade storage limits and recurring renewal fees."
        maxWidth="sm"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsUpgradeModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleUpgradePackage}>
              Apply New Package
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-700">Select New Hosting Tier</label>
          <select
            value={targetProductId}
            onChange={e => setTargetProductId(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} (LKR {p.priceMonthly}/mo - {p.storageGb}GB)</option>
            ))}
          </select>
        </div>
      </AdminModal>

      {/* Strict Termination Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!serviceToTerminate}
        onClose={() => setServiceToTerminate(null)}
        onConfirm={handleConfirmTerminate}
        title="Terminate Hosting Account"
        description={`Are you completely sure you want to terminate hosting for ${serviceToTerminate?.primaryDomain}? This immediately revokes the account on ${serviceToTerminate?.serverHostname} and deletes web files, databases, and mailboxes.`}
        confirmLabel="Terminate Permanently"
        isDestructive={true}
      />
    </div>
  );
};
