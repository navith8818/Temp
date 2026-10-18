'use client';

import React from 'react';
import { AdminModal } from './AdminModal';
import { AdminButton } from './AdminButton';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <AdminButton variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={isDestructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </AdminButton>
        </>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div
          className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center ${
            isDestructive
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}
        >
          {isDestructive ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
          {isDestructive && (
            <p className="text-[11px] font-semibold text-rose-600">
              This action cannot be undone.
            </p>
          )}
        </div>
      </div>
    </AdminModal>
  );
};
