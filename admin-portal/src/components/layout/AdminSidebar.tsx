'use client';

import React, { useState } from 'react';
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

export const AdminSidebar: React.FC = () => {
  const { currentRole, tickets, provisioningJobs, orders, invoices } = useAdminData();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

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
        { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
      ],
    },
    {
      title: 'Business',
      items: [
        { label: 'Customers', to: '/customers', icon: <Users size={18} /> },
        { label: 'Packages', to: '/packages', icon: <Package size={18} />, hidden: isSupportOnly },
        { label: 'Orders', to: '/orders', icon: <ShoppingCart size={18} />, count: pendingOrdersCount },
        { label: 'Services', to: '/services', icon: <HardDrive size={18} /> },
      ],
    },
    {
      title: 'Infrastructure',
      hidden: isBillingOnly,
      items: [
        { label: 'Servers', to: '/servers', icon: <Server size={18} />, hidden: isSupportOnly },
        { label: 'Server Groups', to: '/server-groups', icon: <Layers size={18} />, hidden: isSupportOnly },
        { label: 'Provisioning', to: '/provisioning', icon: <Cpu size={18} />, count: pendingJobsCount },
      ],
    },
    {
      title: 'Finance',
      hidden: isSupportOnly,
      items: [
        { label: 'Invoices', to: '/invoices', icon: <Receipt size={18} />, count: unpaidInvoicesCount },
        { label: 'Payments', to: '/payments', icon: <CreditCard size={18} /> },
        { label: 'Subscriptions', to: '/subscriptions', icon: <RefreshCw size={18} /> },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Tickets', to: '/tickets', icon: <LifeBuoy size={18} />, count: openTicketsCount },
        { label: 'Live Chat', to: '/live-chat', icon: <MessageSquare size={18} /> },
        { label: 'Notifications', to: '/notifications', icon: <Bell size={18} /> },
      ],
    },
    {
      title: 'Admin',
      items: [
        { label: 'Staff Roles', to: '/staff', icon: <ShieldCheck size={18} />, hidden: isSupportOnly || isBillingOnly },
        { label: 'Reports', to: '/reports', icon: <BarChart3 size={18} /> },
        { label: 'Audit Logs', to: '/audit-logs', icon: <FileClock size={18} />, hidden: isSupportOnly },
        { label: 'Domains', to: '/domains', icon: <Globe size={18} /> },
        { label: 'Settings', to: '/settings', icon: <Settings size={18} />, hidden: isSupportOnly || isBillingOnly },
      ],
    },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200/90 flex flex-col transition-all duration-300 ease-in-out select-none ${
        isHovered ? 'w-64 shadow-2xl' : 'w-16 shadow-xs'
      }`}
    >
      {/* Top Brand Logo Section */}
      <div className="h-14 flex items-center border-b border-gray-100 shrink-0 px-3.5 overflow-hidden">
        <Link href="/dashboard" className="flex items-center gap-3 w-full">
          {/* Circular Server Salad Mark */}
          <div className="w-9 h-9 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
          </div>

          {/* Text Title (Visible only when expanded) */}
          <div
            className={`transition-all duration-200 min-w-0 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none w-0'
            }`}
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bold text-gray-900 text-sm tracking-tight">Server Salad</span>
              <span className="text-[10px] font-bold text-[#e8702a] bg-[#fcf5f1] px-1.5 py-0.2 rounded border border-[#e8702a]/25">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Cloud Control</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Items (Icon-only collapsed, expands to full menu on hover) */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2.5 space-y-2.5 custom-scrollbar">
        {navGroups
          .filter(g => !g.hidden)
          .map((group, groupIdx) => {
            const visibleItems = group.items.filter(item => !item.hidden);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-0.5 px-2">
                {/* Section Heading with Constant Reserved Height (Icon positions never shift) */}
                <div className="h-6 flex items-center px-3 relative">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap transition-opacity duration-200 select-none ${
                      isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {group.title}
                  </span>

                  {/* Subtle divider line when collapsed to delineate sections without altering height */}
                  <span
                    className={`absolute inset-x-3.5 top-1/2 -translate-y-1/2 h-px bg-gray-100 transition-opacity duration-200 pointer-events-none ${
                      !isHovered && groupIdx > 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>

                {/* Items */}
                {visibleItems.map(item => {
                  const isActive = pathname === item.to || (item.to === '/dashboard' && pathname === '/');

                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      title={!isHovered ? item.label : undefined}
                      className={`group/item relative flex items-center h-10 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#fcf5f1] text-[#e8702a] font-semibold'
                          : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                      }`}
                    >
                      {/* Thin vertical highlight line on the left side of the active menu item icon */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#e8702a] rounded-r-md" />
                      )}

                      {/* Icon container - Always exactly centered in the 48px width of the button */}
                      <div className="w-12 h-10 shrink-0 flex items-center justify-center relative">
                        <span className={isActive ? 'text-[#e8702a]' : 'text-gray-500 group-hover/item:text-gray-900 transition-colors'}>
                          {item.icon}
                        </span>

                        {/* Collapsed notification indicator badge dot */}
                        {!isHovered && typeof item.count === 'number' && item.count > 0 && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e8702a] ring-2 ring-white" />
                        )}
                      </div>

                      {/* Text Label & Badge Count (Visible smoothly on sidebar hover) */}
                      <div
                        className={`flex-1 flex items-center justify-between pr-3 min-w-0 transition-all duration-200 ${
                          isHovered
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-2 pointer-events-none w-0 overflow-hidden'
                        }`}
                      >
                        <span className="text-xs truncate font-medium">{item.label}</span>

                        {typeof item.count === 'number' && item.count > 0 && (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ml-1.5 ${
                              isActive
                                ? 'bg-[#e8702a] text-white'
                                : 'bg-gray-200/80 text-gray-700'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
      </nav>

      {/* Footer Info Area */}
      <div className="p-3 border-t border-gray-100 shrink-0 bg-gray-50/50 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div
            className={`transition-all duration-200 min-w-0 text-[11px] ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none w-0'
            }`}
          >
            <div className="font-semibold text-gray-800 whitespace-nowrap">Operator Active</div>
            <div className="text-[10px] text-gray-400 truncate font-mono">Role: {currentRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
