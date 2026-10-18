'use client';

import React from 'react';
import { ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { useToast } from '@/components/ui/Toast';

export const ProfileHeader: React.FC = () => {
  const { profile } = useAccount();
  const { toast } = useToast();

  const handleSignOut = () => {
    toast('Session Terminated', 'You have been signed out of Server Salad Cloud.', 'info');
  };

  return (
    <section className="shrink-0 rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fcf5f1] border-2 border-[#e8702a]/30 flex items-center justify-center text-xl sm:text-2xl font-bold text-[#e8702a] shadow-xs select-none">
              {profile.initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Account Active">
              <CheckCircle2 className="w-3 h-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {profile.name}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/20">
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Security Status & Sign Out */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>2FA {profile.twoFactorEnabled ? 'Active' : 'Disabled'}</span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-transparent hover:border-red-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </section>
  );
};
