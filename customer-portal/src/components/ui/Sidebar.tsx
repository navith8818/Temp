'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Server,
  Zap,
  Receipt,
  Activity,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  matchExact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'My Hosting',
    subtitle: 'Cluster Instances',
    icon: Server,
    matchExact: true,
  },
  {
    href: '/hosting/new',
    label: 'Products & Plans',
    subtitle: 'Deploy Cloud Node',
    icon: Zap,
  },
  {
    href: '/billing',
    label: 'Billing & Invoices',
    subtitle: 'PayHere & History',
    icon: Receipt,
  },
  {
    href: '/usage',
    label: 'Hosting Usage',
    subtitle: 'Disk, Bandwidth & RAM',
    icon: Activity,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (item.matchExact) {
      return pathname === '/' || (pathname.startsWith('/hosting') && pathname !== '/hosting/new');
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      aria-label="Portal Navigation"
      className="shrink-0 w-16 h-full relative z-40 select-none"
    >
      {/* Expanding Sidebar Container on Hover */}
      <div className="group/sidebar absolute top-0 left-0 bottom-0 w-16 hover:w-64 transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-xl border-r border-gray-200/80 shadow-xs hover:shadow-2xl flex flex-col justify-between py-3 px-2 overflow-hidden">
        {/* Top: Brand Logo with Expanding Title */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center h-10 px-2 rounded-2xl hover:bg-gray-50 transition-colors focus:outline-none"
            title="Server Salad Cloud Services"
          >
            {/* Geometric Server Salad Logo Icon */}
            <div className="w-8 h-8 rounded-xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center shrink-0 shadow-2xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 256 256"
                fill="#e8702a"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
            </div>

            {/* Brand Title (Fades in on Sidebar Hover Expansion) */}
            <div className="ml-3 flex flex-col opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-gray-900 tracking-tight font-sans">
                  Server Salad
                </span>
                <span className="text-[11px] font-playfair italic text-[#e8702a] font-semibold">
                  Cloud
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono -mt-0.5">
                Customer Portal
              </span>
            </div>
          </Link>

          {/* Section Divider */}
          <div className="h-px bg-gray-100 mx-1" />

          {/* Navigation Links / Tabs */}
          <nav className="flex flex-col gap-1.5 w-full">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group/btn relative flex items-center h-11 px-2 rounded-2xl transition-all cursor-pointer overflow-hidden ${
                    active
                      ? 'bg-[#fcf5f1] text-[#e8702a]'
                      : 'text-gray-400 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  title={item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  {/* Thin vertical line leftside of the icon to highlight active tab */}
                  <span
                    className={`absolute left-0.5 top-2.5 bottom-2.5 w-[2.5px] rounded-full transition-all ${
                      active ? 'bg-[#e8702a] opacity-100' : 'bg-transparent opacity-0'
                    }`}
                  />

                  {/* Tab Icon */}
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 ml-0.5">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover/btn:scale-105 ${
                        active ? 'text-[#e8702a]' : 'text-gray-400 group-hover/btn:text-gray-700'
                      }`}
                    />
                  </div>

                  {/* Tab Label & Subtitle (Fades in on Sidebar Hover Expansion) */}
                  <div className="ml-2.5 flex flex-col opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden flex-1">
                    <span
                      className={`text-xs font-bold leading-tight ${
                        active ? 'text-gray-900' : 'text-gray-600 group-hover/btn:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">
                      {item.subtitle}
                    </span>
                  </div>

                  {/* Active Chevron Indicator on Hover */}
                  {active && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#e8702a] ml-auto shrink-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity pr-1" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Space for Expansion */}
        <div className="flex-1 w-full min-h-[30px]" />

        {/* Bottom Section: Cluster Health Status */}
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          {/* Cluster Status Indicator */}
          <div className="flex items-center h-10 px-2 rounded-2xl bg-gray-50/80 text-gray-500 overflow-hidden">
            <div className="w-8 flex items-center justify-center shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="ml-2.5 flex flex-col opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
              <span className="text-[11px] font-semibold text-gray-800">Cluster EU-Central</span>
              <span className="text-[9px] text-emerald-600 font-medium">99.99% Operational</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
