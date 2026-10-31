'use client';

import React from 'react';
import { AdminTopBar } from './AdminTopBar';
import { AdminSidebar } from './AdminSidebar';
import { AdminToastContainer } from '../ui/AdminToast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#111827] flex flex-col font-sans selection:bg-[#e8702a]/15 selection:text-[#e8702a]">
      {/* Permanent Icon Sidebar Rail (Expands to full menu on Hover) */}
      <AdminSidebar />

      {/* Content Area offset by pl-16 so the collapsed sidebar is permanently visible without overlapping content */}
      <div className="pl-16 flex flex-col min-h-screen flex-1">
        {/* Top Header Bar */}
        <AdminTopBar />

        {/* Main Content Workspace Area */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 2xl:px-10 py-6 sm:py-8">
          {children}
        </main>
      </div>

      {/* Reactive Global Toast Alerts */}
      <AdminToastContainer />
    </div>
  );
};
