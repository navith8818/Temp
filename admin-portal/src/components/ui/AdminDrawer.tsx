'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl';
  side?: 'right' | 'left';
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'lg',
  side = 'right',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let widthClass = 'max-w-lg';
  if (width === 'md') widthClass = 'max-w-md';
  if (width === 'xl') widthClass = 'max-w-xl';
  if (width === '2xl') widthClass = 'max-w-2xl';

  const positionClass = side === 'right' ? 'right-0' : 'left-0';

  return (
    <div
      className="fixed inset-0 z-[130] overflow-hidden bg-black/35 backdrop-blur-2xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`fixed inset-y-0 ${positionClass} flex max-w-full z-10`}
        onClick={e => e.stopPropagation()}
      >
        <div
          className={`w-screen ${widthClass} bg-white shadow-2xl border-l border-gray-200/90 flex flex-col`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between bg-white shrink-0">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-xs text-gray-700 space-y-5">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/70 flex items-center justify-end gap-2 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
