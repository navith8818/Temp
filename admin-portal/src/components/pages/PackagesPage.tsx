'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { HostingProduct, ProductType } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminModal } from '@/components/ui/AdminModal';
import { AdminDrawer } from '@/components/ui/AdminDrawer';
import {
  Plus,
  Copy,
  Eye,
  EyeOff,
  Archive
} from 'lucide-react';

export const PackagesPage: React.FC = () => {
  const {
    products,
    serverGroups,
    services,
    createProduct,
    updateProduct,
    duplicateProduct,
    toggleProductPublished,
    toggleNewSales,
    archiveProduct,
    currentRole
  } = useAdminData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<HostingProduct | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<ProductType>('SHARED');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriceMonthly, setFormPriceMonthly] = useState('9.99');
  const [formPriceAnnual, setFormPriceAnnual] = useState('99.90');
  const [formStorageGb, setFormStorageGb] = useState('25');
  const [formDomainLimit, setFormDomainLimit] = useState('5');
  const [formBandwidthGb, setFormBandwidthGb] = useState('500');
  const [formEmailAccounts, setFormEmailAccounts] = useState('10');
  const [formDatabases, setFormDatabases] = useState('5');
  const [formWhmPackage, setFormWhmPackage] = useState('salad_essential_v2');
  const [formServerGroupId, setFormServerGroupId] = useState('sg_shared_eu');
  const [formVCpu, setFormVCpu] = useState('2');
  const [formRamGb, setFormRamGb] = useState('4');
  const [formDiskType, setFormDiskType] = useState<'NVMe SSD' | 'Standard SSD'>('NVMe SSD');
  const [formPublished, setFormPublished] = useState(true);

  const isRestricted = currentRole === 'SUPPORT_AGENT';

  const handleOpenCreate = () => {
    setEditingProductId(null);
    setFormName('');
    setFormType('SHARED');
    setFormTagline('');
    setFormDescription('');
    setFormPriceMonthly('9.99');
    setFormPriceAnnual('99.90');
    setFormStorageGb('25');
    setFormDomainLimit('5');
    setFormBandwidthGb('500');
    setFormEmailAccounts('10');
    setFormDatabases('5');
    setFormWhmPackage('salad_custom_pkg');
    setFormServerGroupId('sg_shared_eu');
    setFormPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: HostingProduct) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormType(prod.type);
    setFormTagline(prod.tagline);
    setFormDescription(prod.description);
    setFormPriceMonthly(String(prod.priceMonthly));
    setFormPriceAnnual(String(prod.priceAnnual));
    setFormStorageGb(String(prod.storageGb));
    setFormDomainLimit(String(prod.domainLimit));
    setFormBandwidthGb(String(prod.bandwidthGb));
    setFormEmailAccounts(String(prod.emailAccounts));
    setFormDatabases(String(prod.databases));
    setFormWhmPackage(prod.whmPackageName || 'salad_custom_pkg');
    setFormServerGroupId(prod.serverGroupId);
    setFormVCpu(String(prod.vCpuCores || 2));
    setFormRamGb(String(prod.ramGb || 4));
    setFormDiskType(prod.diskType || 'NVMe SSD');
    setFormPublished(prod.published);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName,
        tagline: formTagline,
        description: formDescription,
        priceMonthly: parseFloat(formPriceMonthly),
        priceAnnual: parseFloat(formPriceAnnual),
        storageGb: parseInt(formStorageGb, 10),
        domainLimit: parseInt(formDomainLimit, 10),
        bandwidthGb: parseInt(formBandwidthGb, 10),
        emailAccounts: parseInt(formEmailAccounts, 10),
        databases: parseInt(formDatabases, 10),
        whmPackageName: formType === 'SHARED' ? formWhmPackage : undefined,
        serverGroupId: formServerGroupId,
        vCpuCores: formType === 'VPS' ? parseInt(formVCpu, 10) : undefined,
        ramGb: formType === 'VPS' ? parseInt(formRamGb, 10) : undefined,
        diskType: formType === 'VPS' ? formDiskType : undefined,
        published: formPublished,
      });
    } else {
      createProduct({
        name: formName,
        type: formType,
        tagline: formTagline,
        description: formDescription,
        priceMonthly: parseFloat(formPriceMonthly),
        priceAnnual: parseFloat(formPriceAnnual),
        storageGb: parseInt(formStorageGb, 10),
        domainLimit: parseInt(formDomainLimit, 10),
        bandwidthGb: parseInt(formBandwidthGb, 10),
        emailAccounts: parseInt(formEmailAccounts, 10),
        databases: parseInt(formDatabases, 10),
        whmPackageName: formType === 'SHARED' ? formWhmPackage : undefined,
        serverGroupId: formServerGroupId,
        vCpuCores: formType === 'VPS' ? parseInt(formVCpu, 10) : undefined,
        ramGb: formType === 'VPS' ? parseInt(formRamGb, 10) : undefined,
        diskType: formType === 'VPS' ? formDiskType : undefined,
        published: formPublished,
      });
    }
    setIsModalOpen(false);
  };

  const columns: Column<HostingProduct>[] = [
    {
      key: 'name',
      header: 'Product Tier',
      sortable: true,
      render: prod => (
        <div>
          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
            <span>{prod.name}</span>
            <AdminBadge variant={prod.type === 'SHARED' ? 'info' : 'neutral'}>
              {prod.type}
            </AdminBadge>
          </div>
          <div className="text-[11px] text-gray-400 truncate max-w-xs">{prod.tagline}</div>
        </div>
      ),
    },
    {
      key: 'priceMonthly',
      header: 'Pricing (Mo / Yr)',
      sortable: true,
      render: prod => (
        <div>
          <div className="font-semibold text-gray-900">${prod.priceMonthly.toFixed(2)}/mo</div>
          <div className="text-[11px] text-gray-400">${prod.priceAnnual.toFixed(2)}/yr prepaid</div>
        </div>
      ),
    },
    {
      key: 'resources',
      header: 'Resource Quotas',
      render: prod => (
        <div className="text-gray-600 space-y-0.5">
          {prod.type === 'SHARED' ? (
            <>
              <div>{prod.storageGb} GB NVMe &bull; {prod.domainLimit} Websites</div>
              <div className="text-[11px] text-gray-400">{prod.bandwidthGb} GB Bandwidth &bull; {prod.emailAccounts} Mailboxes</div>
            </>
          ) : (
            <>
              <div>{prod.vCpuCores} vCPU &bull; {prod.ramGb} GB RAM</div>
              <div className="text-[11px] text-gray-400">{prod.storageGb} GB {prod.diskType} &bull; 1 Dedicated IP</div>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'provisioningMapping',
      header: 'Infrastructure Mapping',
      render: prod => {
        const group = serverGroups.find(g => g.id === prod.serverGroupId);
        return (
          <div className="space-y-0.5 text-xs">
            <div className="text-gray-800 font-medium">Group: {group?.name || 'Unassigned'}</div>
            {prod.type === 'SHARED' && (
              <div className="text-[10px] text-gray-400 font-mono">WHM: {prod.whmPackageName}</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Visibility',
      render: prod => (
        <div className="space-y-1">
          {prod.published ? (
            <AdminBadge variant="success">Published</AdminBadge>
          ) : (
            <AdminBadge variant="neutral">Draft / Hidden</AdminBadge>
          )}
          {prod.isNewSalesDisabled && (
            <div className="text-[10px] text-amber-700 font-medium">New Sales Paused</div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: prod => (
        <div className="flex items-center justify-end gap-1">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedProduct(prod)}
          >
            Inspect
          </AdminButton>

          {!isRestricted && (
            <>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => handleOpenEdit(prod)}
              >
                Edit
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => duplicateProduct(prod.id)}
                title="Duplicate package"
              >
                <Copy size={13} />
              </AdminButton>
            </>
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
            Products & Hosting Packages
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure purchasable plans, resource ceilings, WHM package mappings, and cluster targets.
          </p>
        </div>

        {!isRestricted && (
          <AdminButton
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={handleOpenCreate}
          >
            Create Package
          </AdminButton>
        )}
      </div>

      <AdminTable
        data={products}
        columns={columns}
        keyExtractor={p => p.id}
        searchPlaceholder="Search packages by name, limits, or WHM mapping..."
        searchFilter={(p, q) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.whmPackageName || '').toLowerCase().includes(q)
        }
      />

      {/* Create / Edit Modal (Scenario A) */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProductId ? 'Edit Hosting Package' : 'Create New Hosting Package'}
        subtitle="Specify resource limits, pricing cycles, and automated WHM cluster mapping."
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveProduct}>
              {editingProductId ? 'Save Package Changes' : 'Publish Package'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Type *
              </label>
              <select
                value={formType}
                disabled={!!editingProductId}
                onChange={e => {
                  const t = e.target.value as ProductType;
                  setFormType(t);
                  setFormServerGroupId(t === 'VPS' ? 'sg_vps_eu' : 'sg_shared_eu');
                }}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 disabled:bg-gray-100"
              >
                <option value="SHARED">Shared Web Hosting (cPanel / WHM)</option>
                <option value="VPS">Cloud VPS (KVM Virtual Machine)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Package Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Web Hosting Business NVMe"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-[#e8702a]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tagline / Summary
              </label>
              <input
                type="text"
                placeholder="Brief one-line summary for customer catalog"
                value={formTagline}
                onChange={e => setFormTagline(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Monthly Recurring Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formPriceMonthly}
                onChange={e => setFormPriceMonthly(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Annual Prepaid Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formPriceAnnual}
                onChange={e => setFormPriceAnnual(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
          </div>

          {/* Conditional Resource Ceilings */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              {formType === 'SHARED' ? 'Shared Hosting Resource Limits' : 'VPS Hardware Specifications'}
            </h4>

            {formType === 'SHARED' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">NVMe Disk (GB)</label>
                  <input
                    type="number"
                    value={formStorageGb}
                    onChange={e => setFormStorageGb(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Domains Limit</label>
                  <input
                    type="number"
                    value={formDomainLimit}
                    onChange={e => setFormDomainLimit(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Bandwidth (GB)</label>
                  <input
                    type="number"
                    value={formBandwidthGb}
                    onChange={e => setFormBandwidthGb(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Mailboxes</label>
                  <input
                    type="number"
                    value={formEmailAccounts}
                    onChange={e => setFormEmailAccounts(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">vCPU Cores</label>
                  <input
                    type="number"
                    value={formVCpu}
                    onChange={e => setFormVCpu(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">RAM (GB)</label>
                  <input
                    type="number"
                    value={formRamGb}
                    onChange={e => setFormRamGb(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Disk (GB)</label>
                  <input
                    type="number"
                    value={formStorageGb}
                    onChange={e => setFormStorageGb(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Infrastructure & Provisioning Mappings (Scenario A step 4 & 5) */}
          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Provisioning & Infrastructure Target
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Compatible Server Group *
                </label>
                <select
                  value={formServerGroupId}
                  onChange={e => setFormServerGroupId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                >
                  {serverGroups.map(g => (
                    <option key={g.id} value={g.id}>{g.name} &bull; {g.purpose}</option>
                  ))}
                </select>
              </div>

              {formType === 'SHARED' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    WHM Package Mapping Key *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. salad_essential_v2"
                    value={formWhmPackage}
                    onChange={e => setFormWhmPackage(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 font-mono"
                  />
                  <span className="text-[10px] text-gray-400">Maps to identical package on target WHM servers.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="pubToggle"
              checked={formPublished}
              onChange={e => setFormPublished(e.target.checked)}
              className="rounded text-[#e8702a] focus:ring-[#e8702a]"
            />
            <label htmlFor="pubToggle" className="text-xs text-gray-700 font-medium">
              Publish immediately to customer catalog
            </label>
          </div>
        </form>
      </AdminModal>

      {/* Package Inspector Drawer */}
      <AdminDrawer
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || 'Package Inspector'}
        subtitle={`Identifier: ${selectedProduct?.slug}`}
        width="lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Pricing</span>
                <span className="text-sm font-bold text-gray-900">${selectedProduct.priceMonthly}/mo (${selectedProduct.priceAnnual}/yr)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Target Cluster</span>
                <span className="text-xs font-semibold text-gray-800">{serverGroups.find(g => g.id === selectedProduct.serverGroupId)?.name || 'Default'}</span>
              </div>
              {selectedProduct.whmPackageName && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">WHM Package</span>
                  <span className="text-xs font-mono text-gray-800">{selectedProduct.whmPackageName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Associated Hosting Services</h4>
              <p className="text-xs text-gray-600">
                {services.filter(s => s.productId === selectedProduct.id).length} active hosting accounts provisioned using this package.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center gap-2">
              <AdminButton
                variant={selectedProduct.published ? 'outline' : 'primary'}
                size="sm"
                icon={selectedProduct.published ? <EyeOff size={14} /> : <Eye size={14} />}
                onClick={() => {
                  toggleProductPublished(selectedProduct.id);
                  setSelectedProduct({ ...selectedProduct, published: !selectedProduct.published });
                }}
              >
                {selectedProduct.published ? 'Unpublish' : 'Publish'}
              </AdminButton>

              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => toggleNewSales(selectedProduct.id)}
              >
                {selectedProduct.isNewSalesDisabled ? 'Enable New Sales' : 'Pause New Sales'}
              </AdminButton>

              <AdminButton
                variant="ghost"
                size="sm"
                icon={<Archive size={14} />}
                onClick={() => {
                  archiveProduct(selectedProduct.id);
                  setSelectedProduct(null);
                }}
              >
                Archive
              </AdminButton>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
};
