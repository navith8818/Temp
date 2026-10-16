import React from 'react';
import { HostingStatus, WebsiteStatus } from '@/types/hosting';

interface StatusBadgeProps {
  status: HostingStatus | WebsiteStatus | 'secured' | 'expiring_soon' | 'self_signed' | 'missing';
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  let text = label;
  let bgClass = 'bg-gray-100 text-gray-700 border-gray-200';
  let dotClass = 'bg-gray-400';

  switch (status) {
    case 'active':
    case 'secured':
      text = text || (status === 'secured' ? 'SSL Secured' : 'Active');
      bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
      dotClass = 'bg-emerald-500 animate-pulse';
      break;

    case 'needs_dns':
      text = text || 'Needs DNS Setup';
      bgClass = 'bg-amber-50 text-amber-800 border-amber-200/70';
      dotClass = 'bg-amber-500';
      break;

    case 'ssl_pending':
    case 'expiring_soon':
      text = text || (status === 'ssl_pending' ? 'SSL Pending' : 'SSL Expiring');
      bgClass = 'bg-amber-50 text-amber-800 border-amber-200/70';
      dotClass = 'bg-amber-500';
      break;

    case 'provisioning':
      text = text || 'Provisioning';
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200/70';
      dotClass = 'bg-blue-500 animate-pulse';
      break;

    case 'maintenance':
      text = text || 'Maintenance';
      bgClass = 'bg-gray-100 text-gray-700 border-gray-200';
      dotClass = 'bg-gray-400';
      break;

    case 'suspended':
    case 'missing':
      text = text || (status === 'missing' ? 'No SSL' : 'Suspended');
      bgClass = 'bg-red-50 text-red-700 border-red-200/70';
      dotClass = 'bg-red-500';
      break;

    default:
      text = text || String(status);
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${bgClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span>{text}</span>
    </span>
  );
};
