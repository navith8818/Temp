'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="pt-3 px-4 sm:px-6 shrink-0 z-30 w-full">
      <div className="max-w-6xl mx-auto">
        {/* Lithos-Hero Floating Pill Navbar Style */}
        <nav className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-full px-5 py-2.5 flex items-center justify-between shadow-xs">
          {/* Brand Logo - Matching Lithos Hero */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center">
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

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                pathname === '/' || (pathname.startsWith('/hosting') && pathname !== '/hosting/new')
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              My Hosting
            </Link>
            <Link
              href="/hosting/new"
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                pathname === '/hosting/new'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Products & Plans
            </Link>
            <Link
              href="/billing"
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                pathname === '/billing'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Billing
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">

            {/* Notification Bell */}
            <button
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            {/* User Profile Avatar */}
            <div
              className="w-7 h-7 rounded-full bg-[#fcf5f1] border border-[#e8702a]/30 flex items-center justify-center text-xs font-bold text-[#e8702a] select-none cursor-pointer hover:border-[#e8702a] transition-colors"
              title="Customer Account: usr_salad_84"
            >
              SS
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
