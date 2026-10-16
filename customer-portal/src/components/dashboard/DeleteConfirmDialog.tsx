import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Website } from '@/types/hosting';

interface DeleteConfirmDialogProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (websiteId: string) => Promise<void>;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  website,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !website) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(website.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="fixed inset-0" onClick={() => !isDeleting && onClose()} />

      <div className="relative w-full max-w-md rounded-3xl border border-red-200 bg-white shadow-2xl p-7 sm:p-8 text-gray-900 z-10 animate-in zoom-in-95 duration-200 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="text-base font-bold text-gray-900">
              Remove Website
            </h3>
            <p className="text-xs text-red-600 font-medium">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Are you sure you want to remove <strong className="text-gray-900 font-bold">{website.domain}</strong> from
          this hosting plan? All web files, DNS pointers, and database mappings on HestiaCP will be
          unlinked.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <span>Confirm & Remove</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
