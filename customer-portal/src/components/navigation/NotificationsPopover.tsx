'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  ShieldCheck,
  HardDrive,
  CreditCard,
  Server,
  Trash2,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { NotificationItem, NotificationType } from '@/types/account';
import { useToast } from '@/components/ui/Toast';

export const NotificationsPopover: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useAccount();

  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'security':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
      case 'backup':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
        );
      case 'billing':
        return (
          <div className="w-8 h-8 rounded-full bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a] shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 shrink-0">
            <Server className="w-4 h-4" />
          </div>
        );
    }
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.read) {
      markNotificationAsRead(item.id);
    }
    if (item.link) {
      setIsOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    toast('Notifications Updated', 'All notifications marked as read.', 'info');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast('Notifications Cleared', 'All notifications removed.', 'info');
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none ${
          isOpen
            ? 'bg-gray-100 text-gray-900 ring-2 ring-[#e8702a]/20'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
        }`}
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />

        {/* Unread Indicator Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#e8702a] text-[10px] font-bold text-white shadow-2xs animate-in zoom-in-50 duration-200">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 rounded-2xl bg-white border border-gray-200/90 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 tracking-tight">Notifications</span>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#fcf5f1] text-[#e8702a] border border-[#e8702a]/20">
                  {unreadCount} new
                </span>
              ) : (
                <span className="text-[10px] font-medium text-gray-400">All caught up</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-[#e8702a] hover:text-[#d2611f] transition-colors cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                    item.read
                      ? 'bg-white hover:bg-gray-50/70 opacity-80 hover:opacity-100'
                      : 'bg-[#fcf5f1]/40 hover:bg-[#fcf5f1]/70'
                  }`}
                >
                  {/* Icon */}
                  {getNotificationIcon(item.type)}

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-5">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-xs font-bold text-gray-900 tracking-tight truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#e8702a] hover:underline mt-1.5"
                      >
                        <span>View details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>

                  {/* Actions / Unread dot */}
                  <div className="absolute right-3 top-3.5 flex flex-col items-center gap-2">
                    {!item.read && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#e8702a]"
                        title="Unread notification"
                      />
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                      title="Dismiss notification"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-400 mx-auto mb-2.5">
                  <Sparkles className="w-4 h-4 text-[#e8702a]" />
                </div>
                <p className="text-xs font-bold text-gray-800">No Notifications</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  You are completely up to date with hosting activities.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gray-400">{notifications.length} total messages</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
