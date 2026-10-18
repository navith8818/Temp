'use client';

import React, { useState } from 'react';
import { AdminTopBar } from './AdminTopBar';
import { AdminNavDrawer } from './AdminNavDrawer';
import { AdminToastContainer } from '../ui/AdminToast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#111827] flex flex-col font-sans selection:bg-[#e8702a]/15 selection:text-[#e8702a]">
      {/* Top Header Bar */}
      <AdminTopBar onToggleDrawer={() => setIsDrawerOpen(prev => !prev)} />

      {/* Collapsible Overlay Navigation Drawer */}
      <AdminNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Main Content Workspace Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Reactive Global Toast Alerts */}
      <AdminToastContainer />
    </div>
  );
};
