'use client';

import React from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import type { CustomerDomain } from '@/types';
import { AdminTable } from '@/components/ui/AdminTable';
import type { Column } from '@/components/ui/AdminTable';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';

export const DomainsPage: React.FC = () => {
  const {
    domains,
    recheckDomainDns,
    reissueDomainSsl
  } = useAdminData();

  const columns: Column<CustomerDomain>[] = [
    {
      key: 'domainName',
      header: 'Domain Name',
      sortable: true,
      render: d => (
        <div>
          <span className="font-semibold text-gray-900">{d.domainName}</span>
          <div className="text-[11px] text-gray-400">Owner: {d.customerName}</div>
        </div>
      ),
    },
    {
      key: 'linkedServiceDomain',
      header: 'Mapped Hosting Service',
      render: d => (
        <div>
          {d.linkedServiceDomain ? (
            <span className="text-gray-800 font-medium">{d.linkedServiceDomain}</span>
          ) : (
            <span className="text-gray-400 italic">Unmapped</span>
          )}
        </div>
      ),
    },
    {
      key: 'dnsStatus',
      header: 'DNS Propagation',
      render: d => (
        <AdminBadge
          variant={
            d.dnsStatus === 'POINTED'
              ? 'success'
              : d.dnsStatus === 'PENDING_PROPAGATION'
              ? 'warning'
              : 'danger'
          }
        >
          {d.dnsStatus.replace(/_/g, ' ')}
        </AdminBadge>
      ),
    },
    {
      key: 'nameservers',
      header: 'Active Nameservers',
      render: d => (
        <div className="font-mono text-[11px] text-gray-500">
          {d.nameservers.join(', ')}
        </div>
      ),
    },
    {
      key: 'sslStatus',
      header: 'AutoSSL Status',
      render: d => (
        <div className="space-y-0.5">
          <AdminBadge variant={d.sslStatus === 'ACTIVE_LETS_ENCRYPT' ? 'success' : 'warning'}>
            {d.sslStatus === 'ACTIVE_LETS_ENCRYPT' ? 'Let\'s Encrypt' : d.sslStatus}
          </AdminBadge>
          {d.sslExpiryDays && (
            <div className="text-[10px] text-gray-400">Renews in {d.sslExpiryDays} days</div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: d => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => recheckDomainDns(d.id)}
            title="Recheck nameservers and DNS pointers"
          >
            Check DNS
          </AdminButton>

          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => reissueDomainSsl(d.id)}
            title="Force reissue Let's Encrypt certificate"
          >
            Reissue SSL
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
            Domains & SSL Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer domains, authoritative nameserver routing, and Let's Encrypt TLS certificates.
          </p>
        </div>
      </div>

      <AdminTable
        data={domains}
        columns={columns}
        keyExtractor={d => d.id}
        searchPlaceholder="Search domains by name or customer..."
        searchFilter={(d, q) => d.domainName.toLowerCase().includes(q) || d.customerName.toLowerCase().includes(q)}
      />
    </div>
  );
};
