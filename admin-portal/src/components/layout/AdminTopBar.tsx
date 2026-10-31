'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminData } from '../../context/AdminDataContext';
import type { StaffRole } from '../../types';
import {
  RotateCcw,
  ExternalLink,
  ChevronDown,
  UserCheck
} from 'lucide-react';

interface AdminTopBarProps {
  onToggleDrawer?: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = () => {
  const { currentRole, setCurrentRole, resetDemoData, servers } = useAdminData();
  const pathname = usePathname();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Derive breadcrumb from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const currentSection = pathParts[0]
    ? pathParts[0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Dashboard';

  const roles: { role: StaffRole; label: string; desc: string }[] = [
    { role: 'ADMINISTRATOR', label: 'Administrator', desc: 'Full unrestricted platform access' },
    { role: 'STAFF', label: 'Operations Staff', desc: 'Server & provisioning management' },
    { role: 'SUPPORT_AGENT', label: 'Support Agent', desc: 'Tickets & chats only (Finance restricted)' },
    { role: 'BILLING_STAFF', label: 'Billing Staff', desc: 'Invoices & payments (Infrastructure hidden)' },
  ];

  const onlineServersCount = servers.filter(s => s.status === 'ONLINE').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Menu Trigger, Brand & Breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4">


          {/* Brand Mark */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
              <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
            </div>
            <div className="hidden md:flex items-baseline gap-1.5">
              <span className="text-gray-900 text-xs sm:text-sm font-bold tracking-tight">
                Server Salad
              </span>
              <span className="text-[11px] font-playfair italic text-[#e8702a] font-medium">
                Admin
              </span>
            </div>
          </Link>

          {/* Breadcrumb Separator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 pl-2 border-l border-gray-200">
            <span className="text-gray-400">Admin</span>
            <span>/</span>
            <span className="font-semibold text-gray-800">{currentSection}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Infrastructure Health Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-medium text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span suppressHydrationWarning>{onlineServersCount}/{servers.length} Nodes Online</span>
          </div>

          {/* Role Switcher (Demonstrating Scenario G) */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-700 font-medium transition-colors cursor-pointer"
              title="Simulate staff role view"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#e8702a]" />
              <span className="hidden sm:inline text-gray-500 text-[11px]">Role:</span>
              <span className="font-semibold text-gray-900">{currentRole.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isRoleDropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 text-xs animate-in fade-in duration-150"
                onClick={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 border-b border-gray-100">
                  Switch Active Staff View
                </div>
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setCurrentRole(r.role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex flex-col hover:bg-gray-50 transition-colors cursor-pointer ${
                      currentRole === r.role ? 'bg-[#fcf5f1] text-[#e8702a]' : 'text-gray-700'
                    }`}
                  >
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-[10px] text-gray-400">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
