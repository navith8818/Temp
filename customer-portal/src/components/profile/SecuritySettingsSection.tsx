'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Check,
  Loader2,
  AlertCircle,
  Download,
} from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { useToast } from '@/components/ui/Toast';

export const SecuritySettingsSection: React.FC = () => {
  const { profile, toggle2FA } = useAccount();
  const { toast } = useToast();

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    await new Promise((res) => setTimeout(res, 600));

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsUpdatingPassword(false);
    toast('Password Changed', 'Your account credentials have been updated securely.', 'success');
  };

  const handle2FAToggle = () => {
    const newState = toggle2FA();
    toast(
      'Two-Factor Authentication',
      newState ? '2FA protection is now Enabled.' : '2FA protection has been Disabled.',
      newState ? 'success' : 'info'
    );
  };

  const handleDownloadRecoveryCodes = () => {
    toast(
      'Recovery Codes Exported',
      'A backup text file containing 10 emergency 2FA backup codes was downloaded.',
      'success'
    );
  };

  return (
    <div className="space-y-4">
      {/* 2FA Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-xs text-gray-500">
              Protect your cloud servers with TOTP authenticator app verification
            </p>
          </div>

          <button
            type="button"
            onClick={handle2FAToggle}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer self-start sm:self-center ${
              profile.twoFactorEnabled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            {profile.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
          </button>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Google Authenticator / 1Password</p>
              <p className="text-[11px] text-gray-500">
                {profile.twoFactorEnabled
                  ? 'Your mobile authenticator is active and enforced on every login.'
                  : 'Enable 2FA to prevent unauthorized access to your hosting environments.'}
              </p>
            </div>
          </div>

          {profile.twoFactorEnabled && (
            <button
              type="button"
              onClick={handleDownloadRecoveryCodes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors cursor-pointer self-start sm:self-center shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#e8702a]" />
              <span>Backup Codes</span>
            </button>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="pb-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Change Password</h3>
          <p className="text-xs text-gray-500">Ensure your password has at least 8 characters</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="pt-4 space-y-3.5">
          {passwordError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-[#e8702a] text-gray-900 font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars"
                  required
                  minLength={8}
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-[#e8702a] text-gray-900 font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-[#e8702a] text-gray-900 font-mono transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gray-900 hover:bg-black text-white shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
