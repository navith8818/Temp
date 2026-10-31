'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NotificationsPopover } from '@/components/navigation/NotificationsPopover';
import { useAccount } from '@/context/AccountContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { profile } = useAccount();

  return (
    <header className="pt-3 px-4 sm:px-6 lg:px-8 shrink-0 z-30 w-full">
      <div className="w-full">
        {/* Lithos-Hero Floating Pill Navbar Style */}
        <nav className="w-full bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-full px-5 py-2.5 flex items-center justify-between shadow-xs">
          {/* Brand Logo - Matching Lithos Hero */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center shadow-2xs">
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
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-900 text-sm sm:text-base font-bold tracking-tight font-sans">
                Server Salad
              </span>
              <span className="hidden sm:inline text-[11px] font-playfair italic text-[#e8702a] font-medium">
                Cloud
              </span>
            </div>
          </Link>

          {/* Right Actions: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell Popover */}
            <NotificationsPopover />

            {/* User Profile in Header Bar */}
            <Link
              href="/profile"
              className={`inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all cursor-pointer focus:outline-none select-none ${
                pathname === '/profile'
                  ? 'bg-[#fcf5f1] border-[#e8702a] ring-2 ring-[#e8702a]/20 shadow-xs'
                  : 'bg-white hover:bg-gray-50 border-gray-200/80 hover:border-gray-300 shadow-2xs'
              }`}
              title={`Account Settings: ${profile.name} (${profile.email})`}
              aria-label="User Profile & Account Settings"
            >
              <div className="w-7 h-7 rounded-full bg-[#fcf5f1] border border-[#e8702a]/30 flex items-center justify-center text-xs font-bold text-[#e8702a] shrink-0 shadow-2xs">
                {profile.initials}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight pr-0.5">
                <span className="text-xs font-bold text-gray-900 truncate max-w-[120px]">
                  {profile.name}
                </span>
                <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                  {profile.email}
                </span>
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
