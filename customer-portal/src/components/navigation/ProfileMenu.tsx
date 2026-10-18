'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  KeyRound,
  Mail,
  CreditCard,
  Server,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { useToast } from '@/components/ui/Toast';

export const ProfileMenu: React.FC = () => {
  const { profile, toggle2FA, toggleEmailDigest } = useAccount();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handle2FAToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggle2FA();
    toast(
      'Two-Factor Authentication',
      newState ? '2FA protection has been enabled.' : '2FA protection has been disabled.',
      newState ? 'success' : 'info'
    );
  };

  const handleDigestToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = toggleEmailDigest();
    toast(
      'Notification Preferences',
      newState ? 'Weekly hosting digest enabled.' : 'Weekly hosting digest disabled.',
      'info'
    );
  };

  const handleSignOut = () => {
    setIsOpen(false);
    toast('Session Terminated', 'You have been signed out of Server Salad Cloud.', 'info');
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* User Profile Avatar Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-8 h-8 rounded-full bg-[#fcf5f1] border flex items-center justify-center text-xs font-bold text-[#e8702a] select-none cursor-pointer transition-all focus:outline-none ${
            isOpen
              ? 'border-[#e8702a] ring-2 ring-[#e8702a]/20 shadow-xs'
              : 'border-[#e8702a]/40 hover:border-[#e8702a]'
          }`}
          title={`${profile.name} (${profile.email})`}
          aria-label="User Profile & Settings"
          aria-expanded={isOpen}
        >
          {profile.initials}
        </button>

        {/* Floating Profile Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2.5 w-72 sm:w-80 rounded-2xl bg-white border border-gray-200/90 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header: User Info */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#fcf5f1] border border-[#e8702a]/30 flex items-center justify-center text-sm font-bold text-[#e8702a] shrink-0">
                  {profile.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-gray-900 tracking-tight truncate">
                      {profile.name}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-500 font-mono truncate">{profile.email}</p>
                  <div className="mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-block">
                      {profile.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-0.5 text-xs text-gray-700">
              {/* Edit Profile */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsEditProfileOpen(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-100/70 transition-colors cursor-pointer text-left font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Personal Information</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* 2FA Toggle */}
              <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">2FA Protection</span>
                </div>
                <button
                  type="button"
                  onClick={handle2FAToggle}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    profile.twoFactorEnabled
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Change Password */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsChangePasswordOpen(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-100/70 transition-colors cursor-pointer text-left font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-gray-400" />
                  <span>Change Password</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Email Digest Toggle */}
              <div className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Weekly Digest</span>
                </div>
                <button
                  type="button"
                  onClick={handleDigestToggle}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    profile.emailDigest
                      ? 'bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/20'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {profile.emailDigest ? 'Active' : 'Off'}
                </button>
              </div>

              <div className="h-px bg-gray-100 my-1.5" />

              {/* Quick Links */}
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-100/70 transition-colors cursor-pointer text-left font-medium text-gray-700"
              >
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-gray-400" />
                  <span>My Hosting Plans</span>
                </div>
              </Link>

              <Link
                href="/billing"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-100/70 transition-colors cursor-pointer text-left font-medium text-gray-700"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span>Billing & Invoices</span>
                </div>
              </Link>

              <div className="h-px bg-gray-100 my-1.5" />

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors cursor-pointer text-left font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
};
