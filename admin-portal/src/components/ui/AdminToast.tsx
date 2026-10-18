'use client';

import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const AdminToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAdminData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let borderClass = 'border-gray-200';
        let icon = <Info className="w-4 h-4 text-blue-500" />;

        switch (toast.type) {
          case 'success':
            borderClass = 'border-emerald-300 bg-white';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
            break;
          case 'error':
            borderClass = 'border-rose-300 bg-white';
            icon = <AlertCircle className="w-4 h-4 text-rose-600" />;
            break;
          case 'warning':
            borderClass = 'border-amber-300 bg-white';
            icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
            break;
          case 'info':
          default:
            borderClass = 'border-blue-300 bg-white';
            icon = <Info className="w-4 h-4 text-blue-600" />;
            break;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border ${borderClass} rounded-xl p-3.5 shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-gray-900 leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
