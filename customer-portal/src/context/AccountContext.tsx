'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { NotificationItem, UserProfile, SSHKey, ActiveSession } from '@/types/account';
import { INITIAL_NOTIFICATIONS, INITIAL_USER_PROFILE } from '@/data/mockAccountData';

interface AccountContextType {
  profile: UserProfile;
  notifications: NotificationItem[];
  unreadCount: number;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggle2FA: () => boolean;
  toggleEmailDigest: () => boolean;
  toggleSecurityAlerts: () => boolean;
  toggleBillingAlerts: () => boolean;
  addSSHKey: (name: string, keyString: string) => void;
  deleteSSHKey: (id: string) => void;
  revokeSession: (id: string) => void;
  revokeAllOtherSessions: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'SS';
}

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const newName = updates.name !== undefined ? updates.name : prev.name;
      const initials = computeInitials(newName);
      return {
        ...prev,
        ...updates,
        initials,
      };
    });
  };

  const toggle2FA = () => {
    let nextState = false;
    setProfile((prev) => {
      nextState = !prev.twoFactorEnabled;
      return { ...prev, twoFactorEnabled: nextState };
    });
    return nextState;
  };

  const toggleEmailDigest = () => {
    let nextState = false;
    setProfile((prev) => {
      nextState = !prev.emailDigest;
      return { ...prev, emailDigest: nextState };
    });
    return nextState;
  };

  const toggleSecurityAlerts = () => {
    let nextState = false;
    setProfile((prev) => {
      nextState = !prev.securityAlerts;
      return { ...prev, securityAlerts: nextState };
    });
    return nextState;
  };

  const toggleBillingAlerts = () => {
    let nextState = false;
    setProfile((prev) => {
      nextState = !prev.billingAlerts;
      return { ...prev, billingAlerts: nextState };
    });
    return nextState;
  };

  const addSSHKey = (name: string, keyString: string) => {
    const newKey: SSHKey = {
      id: `ssh_${Date.now()}`,
      name,
      fingerprint: `SHA256:${keyString.slice(0, 8)}...${keyString.slice(-6)}`,
      addedDate: 'Just now',
    };
    setProfile((prev) => ({
      ...prev,
      sshKeys: [newKey, ...prev.sshKeys],
    }));
  };

  const deleteSSHKey = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      sshKeys: prev.sshKeys.filter((k) => k.id !== id),
    }));
  };

  const revokeSession = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      activeSessions: prev.activeSessions.filter((s) => s.id !== id),
    }));
  };

  const revokeAllOtherSessions = () => {
    setProfile((prev) => ({
      ...prev,
      activeSessions: prev.activeSessions.filter((s) => s.isCurrent),
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AccountContext.Provider
      value={{
        profile,
        notifications,
        unreadCount,
        updateProfile,
        toggle2FA,
        toggleEmailDigest,
        toggleSecurityAlerts,
        toggleBillingAlerts,
        addSSHKey,
        deleteSSHKey,
        revokeSession,
        revokeAllOtherSessions,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
