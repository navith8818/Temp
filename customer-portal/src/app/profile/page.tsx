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
      <section className="shrink-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-3 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
      <main className="flex-1 min-h-0 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-2.5 flex flex-col gap-3.5 overflow-hidden">
        {/* Top Profile Summary Banner */}
        <ProfileHeader />

        {/* Navigation Tabs Pill Bar */}
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <div className="inline-flex p-1 rounded-full bg-white border border-gray-200/80 shadow-2xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#e8702a]' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Area (Scrollable within viewport) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {activeTab === 'personal' && <PersonalDetailsSection />}
          {activeTab === 'security' && <SecuritySettingsSection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'danger' && <DangerZoneSection />}
        </div>
      </main>

      {/* Pinned Bottom Status Bar */}
      <footer className="shrink-0 border-t border-gray-200/80 bg-white/70 backdrop-blur-xs py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-gray-500">
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
