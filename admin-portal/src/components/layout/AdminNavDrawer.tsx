'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminData } from '../../context/AdminDataContext';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Server,
  Layers,
  Cpu,
  Receipt,
  CreditCard,
  RefreshCw,
  LifeBuoy,
  MessageSquare,
  Bell,
  ShieldCheck,
  BarChart3,
  FileClock,
  Globe,
  Settings,
  X,
  HardDrive
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  count?: number;
  hidden?: boolean;
}

interface NavGroup {
  title: string;
  hidden?: boolean;
  items: NavItem[];
}

interface AdminNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminNavDrawer: React.FC<AdminNavDrawerProps> = ({ isOpen, onClose }) => {
  const { currentRole, tickets, provisioningJobs, orders, invoices } = useAdminData();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Counters
  const openTicketsCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const pendingJobsCount = provisioningJobs.filter(j => j.status === 'FAILED' || j.status === 'RETRYING' || j.status === 'RUNNING').length;
  const unpaidInvoicesCount = invoices.filter(i => i.status === 'UNPAID' || i.status === 'OVERDUE').length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'AWAITING_PAYMENT' || o.orderStatus === 'PROCESSING').length;

  // Filter items by role
  const isSupportOnly = currentRole === 'SUPPORT_AGENT';
  const isBillingOnly = currentRole === 'BILLING_STAFF';

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      title: 'Business',
      items: [
        { label: 'Customers', to: '/customers', icon: <Users size={16} /> },
        { label: 'Products & Packages', to: '/packages', icon: <Package size={16} />, hidden: isSupportOnly },
        { label: 'Orders', to: '/orders', icon: <ShoppingCart size={16} />, count: pendingOrdersCount },
        { label: 'Hosting Services', to: '/services', icon: <HardDrive size={16} /> },
      ],
    },
    {
      title: 'Infrastructure',
      hidden: isBillingOnly,
      items: [
        { label: 'Servers', to: '/servers', icon: <Server size={16} />, hidden: isSupportOnly },
        { label: 'Server Groups & Allocation', to: '/server-groups', icon: <Layers size={16} />, hidden: isSupportOnly },
        { label: 'Provisioning Jobs', to: '/provisioning', icon: <Cpu size={16} />, count: pendingJobsCount },
      ],
    },
    {
      title: 'Finance',
      hidden: isSupportOnly,
      items: [
        { label: 'Billing & Invoices', to: '/invoices', icon: <Receipt size={16} />, count: unpaidInvoicesCount },
        { label: 'Payments & Refunds', to: '/payments', icon: <CreditCard size={16} /> },
        { label: 'Subscriptions & Renewals', to: '/subscriptions', icon: <RefreshCw size={16} /> },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Support Tickets', to: '/tickets', icon: <LifeBuoy size={16} />, count: openTicketsCount },
        { label: 'Live Chat', to: '/live-chat', icon: <MessageSquare size={16} /> },
        { label: 'Notifications & Email', to: '/notifications', icon: <Bell size={16} /> },
      ],
    },
    {
      title: 'Administration',
      items: [
        { label: 'Staff & Permissions', to: '/staff', icon: <ShieldCheck size={16} />, hidden: isSupportOnly || isBillingOnly },
        { label: 'Reports & Analytics', to: '/reports', icon: <BarChart3 size={16} /> },
        { label: 'Audit Logs', to: '/audit-logs', icon: <FileClock size={16} />, hidden: isSupportOnly },
        { label: 'Domains & SSL', to: '/domains', icon: <Globe size={16} /> },
        { label: 'Integrations & Settings', to: '/settings', icon: <Settings size={16} />, hidden: isSupportOnly || isBillingOnly },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[150] overflow-hidden bg-black/40 backdrop-blur-2xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 w-full max-w-[300px] sm:max-w-[320px] bg-white shadow-2xl border-r border-gray-200 flex flex-col z-10 animate-in slide-in-from-left duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
              <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                <span>Server Salad</span>
                <span className="text-[10px] font-semibold text-[#e8702a] bg-[#fcf5f1] px-1.5 py-0.2 rounded border border-[#e8702a]/20">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Cloud Infrastructure Control</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close navigation drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Links Scrollable */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 custom-scrollbar space-y-6 text-xs">
          {navGroups.filter(g => !g.hidden).map(group => {
            const visibleItems = group.items.filter(item => !item.hidden);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                <h4 className="px-3 text-[10px] font-semibold tracking-wider uppercase text-gray-400 mb-1.5">
                  {group.title}
                </h4>

                <div className="space-y-0.5">
                  {visibleItems.map(item => {
                    const isActive = pathname === item.to || (item.to === '/dashboard' && pathname === '/');

                    return (
                      <Link
                        key={item.to}
                        href={item.to}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                          isActive
                            ? 'bg-[#fcf5f1] text-[#e8702a] font-semibold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-[#e8702a]' : 'text-gray-400'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>

                        {typeof item.count === 'number' && item.count > 0 && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-[#e8702a] text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/70 text-[11px] text-gray-500 space-y-1 shrink-0">
          <div className="flex justify-between items-center text-gray-700 font-semibold">
            <span>Operator Mode</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
              STAFF-ACTIVE
            </span>
          </div>
          <div className="text-[10px] text-gray-400">
            Esc closes drawer &bull; Tab to navigate
          </div>
        </div>

      </div>
    </div>
  );
};
