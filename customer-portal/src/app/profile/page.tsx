'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  User,
  ShieldCheck,
  Bell,
  AlertTriangle,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PersonalDetailsSection } from '@/components/profile/PersonalDetailsSection';
import { SecuritySettingsSection } from '@/components/profile/SecuritySettingsSection';
import { NotificationsSection } from '@/components/profile/NotificationsSection';
import { DangerZoneSection } from '@/components/profile/DangerZoneSection';

type TabKey = 'personal' | 'security' | 'notifications' | 'danger';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('personal');

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'personal', label: 'Personal Information', icon: User },
    { key: 'security', label: 'Security & 2FA', icon: ShieldCheck },
    { key: 'notifications', label: 'Notification Preferences', icon: Bell },
    { key: 'danger', label: 'Account Actions', icon: AlertTriangle },
  ];

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col bg-[#f8f9fa] text-gray-900 overflow-hidden">
      {/* Top Subheader: Breadcrumb & Title */}
      <section className="shrink-0 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-0.5">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Customer Portal
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-gray-700 font-semibold">Profile & Account</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Account Settings & Security
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 max-w-xl truncate">
            Manage your personal profile, two-factor authentication, and notification channels.
          </p>
        </div>

        {/* Quick Link back to Dashboard */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs transition-all cursor-pointer"
          >
            <span>My Hosting Plans</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#e8702a]" />
          </Link>
        </div>
      </section>

      {/* Main Single-Section Grid */}
      <main className="flex-1 min-h-0 w-full px-4 sm:px-6 lg:px-8 pb-2.5 flex flex-col gap-3.5 overflow-hidden">
        {/* Top Profile Summary Banner */}
        <ProfileHeader />

        {/* Lower Content Area: Side Icon Bar ON LEFT SIDE + Tab Content */}
        <div className="flex-1 min-h-0 flex flex-row gap-3 overflow-hidden">
          {/* Side Icon Bar placed on the LEFT side of the sections with hover expansion */}
          <aside
            aria-label="Profile section tabs"
            className="group/rail shrink-0 w-12 sm:w-13 hover:w-56 transition-all duration-300 ease-in-out flex flex-col items-start py-2.5 px-1.5 bg-white border border-gray-200/80 rounded-3xl shadow-xs min-h-0 z-20 overflow-hidden"
          >
            <div className="flex flex-col items-start gap-1.5 w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`group/btn relative flex items-center w-full h-10 px-2 rounded-xl transition-all cursor-pointer overflow-hidden ${
                      isActive
                        ? 'bg-[#fcf5f1] text-[#e8702a]'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100/70'
                    }`}
                    aria-label={tab.label}
                    title={tab.label}
                  >
                    {/* Highlight the tab with a thin vertical line leftside of the icon */}
                    <span
                      className={`absolute left-0.5 top-2.5 bottom-2.5 w-[2.5px] rounded-full transition-all ${
                        isActive ? 'bg-[#e8702a]' : 'bg-transparent'
                      }`}
                    />

                    {/* Icon */}
                    <div className="w-6 h-6 flex items-center justify-center shrink-0 ml-1">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover/btn:scale-105 ${
                          isActive ? 'text-[#e8702a]' : 'text-gray-400 group-hover/btn:text-gray-700'
                        }`}
                      />
                    </div>

                    {/* Tab Name Label (Reveals on Hover Expansion) */}
                    <div className="ml-2.5 flex items-center flex-1 min-w-0 opacity-0 group-hover/rail:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      <span className={`text-xs font-semibold truncate ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                        {tab.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Space for expansion */}
            <div className="flex-1 w-full min-h-[40px]" />
          </aside>

          {/* Tab Content Area (Scrollable within viewport) */}
          <div className="flex-1 min-w-0 min-h-0 overflow-y-auto pr-1">
            {activeTab === 'personal' && <PersonalDetailsSection />}
            {activeTab === 'security' && <SecuritySettingsSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'danger' && <DangerZoneSection />}
          </div>
        </div>
      </main>

      {/* Pinned Bottom Status Bar */}
      <footer className="shrink-0 border-t border-gray-200/80 bg-white/70 backdrop-blur-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Session • GDPR & ISO 27001 Certified Infrastructure</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400">Need account assistance?</span>
            <a
              href="mailto:support@serversalad.com"
              className="text-[#e8702a] hover:underline font-medium"
            >
              support@serversalad.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
