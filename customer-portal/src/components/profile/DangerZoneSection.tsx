'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { useToast } from '@/components/ui/Toast';

export const DangerZoneSection: React.FC = () => {
  const { profile } = useAccount();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  const handleDeleteAccount = () => {
    if (confirmInput !== 'DELETE') {
      toast('Verification Failed', 'Please type DELETE in capital letters to confirm.', 'error');
      return;
    }
    setIsConfirmOpen(false);
    toast('Account Deletion Requested', 'A confirmation email with closing instructions has been dispatched.', 'info');
  };

  return (
    <div className="space-y-4">

      {/* Close Account */}
      <div className="rounded-3xl border border-red-200/70 bg-red-50/20 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100/70 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-950 tracking-tight">Close Customer Account</h3>
              <p className="text-xs text-red-700/80 mt-0.5">
                Permanently terminate your hosting servers, websites, DNS zones, and account history.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-2xs transition-colors cursor-pointer self-start sm:self-center shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Deactivate Account</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-gray-900">Are you sure?</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              This action cannot be undone. All active VPS instances, hosted domains, and SSL certificates associated with <strong>{profile.email}</strong> will be immediately deprovisioned.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Type <strong>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 uppercase font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={confirmInput !== 'DELETE'}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 transition-colors"
              >
                Permanently Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
