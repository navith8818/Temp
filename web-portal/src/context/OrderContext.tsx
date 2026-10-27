import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HostingPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthlyLkr: number;
  priceRenewalUsd: number;
  cpu: string;
  storage: string;
  domainsAllowed: number;
  trial: boolean;
}

export interface DomainItem {
  name: string;
  type: 'registered' | 'external' | 'existing';
  priceLkr: number;
  status: 'valid' | 'checking';
}

export interface EmailPlan {
  id: string;
  name: string;
  mailboxCount: number;
  storageGb: number;
  aliasesCount: number;
  trialDays: number;
  renewalPriceYearlyUsd: number;
  assignedDomain: string | null;
}

export interface OrderState {
  plan: HostingPlan;
  setupMode: 'new' | 'migrate';
  migrationDetails: {
    sourceUrl: string;
    cpanelUser: string;
    notes: string;
  };
  domains: DomainItem[];
  selectedEmailPlan: EmailPlan | null;
  includeAutoBackup: boolean;
  promoCode: string;
  discountPercentage: number;
  invoiceDetails: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    vatNumber: string;
  };
  paymentMethod: string;
  orderCompletedAt: string | null;
}

export const DEFAULT_PLANS: Record<string, HostingPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter Salad',
    tagline: 'Light appetizer portion with 2-Core power',
    priceMonthlyLkr: 549,
    priceRenewalUsd: 1.80,
    cpu: '2 Cores CPU',
    storage: '1 GB NVMe Storage',
    domainsAllowed: 1,
    trial: true,
  },
  standard: {
    id: 'standard',
    name: 'Standard Salad',
    tagline: 'Hearty main course with 2-Core power',
    priceMonthlyLkr: 649,
    priceRenewalUsd: 2.15,
    cpu: '2 Cores CPU',
    storage: '9 GB NVMe Storage',
    domainsAllowed: 3,
    trial: true,
  },
  premium: {
    id: 'premium',
    name: 'Premium Salad',
    tagline: 'Generous banquet platter with 2-Core power',
    priceMonthlyLkr: 829,
    priceRenewalUsd: 2.75,
    cpu: '2 Cores CPU',
    storage: '30 GB NVMe Storage',
    domainsAllowed: 10,
    trial: true,
  },
  web: {
    id: 'web',
    name: 'Web Hosting',
    tagline: 'Essential',
    priceMonthlyLkr: 458,
    priceRenewalUsd: 2.99,
    cpu: '2x CPU Performance',
    storage: '50 GB SSD Cloud storage',
    domainsAllowed: 5,
    trial: true,
  },
  vps: {
    id: 'vps',
    name: 'VPS Hosting',
    tagline: 'Pro Dedicated',
    priceMonthlyLkr: 2450,
    priceRenewalUsd: 12.50,
    cpu: '4x Dedicated vCPU',
    storage: '100 GB NVMe Storage',
    domainsAllowed: 10,
    trial: false,
  }
};

const DEFAULT_EMAIL_PLAN: EmailPlan = {
  id: 'spacemail-pro',
  name: 'Spacemail Pro',
  mailboxCount: 1,
  storageGb: 5,
  aliasesCount: 10,
  trialDays: 30,
  renewalPriceYearlyUsd: 11.76,
  assignedDomain: null,
};

interface OrderContextType {
  order: OrderState;
  selectPlan: (planId: string) => void;
  setSetupMode: (mode: 'new' | 'migrate') => void;
  setMigrationDetails: (details: Partial<OrderState['migrationDetails']>) => void;
  addDomain: (domain: DomainItem) => void;
  removeDomain: (name: string) => void;
  clearDomains: () => void;
  setEmailPlan: (plan: EmailPlan | null) => void;
  toggleAutoBackup: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  updateInvoiceDetails: (details: Partial<OrderState['invoiceDetails']>) => void;
  setPaymentMethod: (method: string) => void;
  resetOrder: () => void;
  completeOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = 'serversalad_order_session_v1';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<OrderState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      plan: DEFAULT_PLANS.web,
      setupMode: 'new',
      migrationDetails: { sourceUrl: '', cpanelUser: '', notes: '' },
      domains: [{ name: 'nodegen.com', type: 'external', priceLkr: 0, status: 'valid' }],
      selectedEmailPlan: { ...DEFAULT_EMAIL_PLAN, assignedDomain: 'nodegen.com' },
      includeAutoBackup: true,
      promoCode: '',
      discountPercentage: 0,
      invoiceDetails: {
        fullName: 'Alex Jayawardena',
        email: 'alex@nodegen.com',
        address: '42 Galle Road',
        city: 'Colombo 03',
        country: 'Sri Lanka',
        vatNumber: '',
      },
      paymentMethod: 'card',
      orderCompletedAt: null,
    };
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    } catch {
      // ignore
    }
  }, [order]);

  const selectPlan = (planId: string) => {
    const selected = DEFAULT_PLANS[planId] || DEFAULT_PLANS.web;
    setOrder(prev => ({ ...prev, plan: selected }));
  };

  const setSetupMode = (mode: 'new' | 'migrate') => {
    setOrder(prev => ({ ...prev, setupMode: mode }));
  };

  const setMigrationDetails = (details: Partial<OrderState['migrationDetails']>) => {
    setOrder(prev => ({
      ...prev,
      migrationDetails: { ...prev.migrationDetails, ...details }
    }));
  };

  const addDomain = (domain: DomainItem) => {
    setOrder(prev => {
      if (prev.domains.some(d => d.name.toLowerCase() === domain.name.toLowerCase())) {
        return prev;
      }
      const updatedDomains = [...prev.domains, domain];
      // update email domain if not set
      let email = prev.selectedEmailPlan;
      if (email && !email.assignedDomain) {
        email = { ...email, assignedDomain: domain.name };
      }
      return { ...prev, domains: updatedDomains, selectedEmailPlan: email };
    });
  };

  const removeDomain = (name: string) => {
    setOrder(prev => {
      const updated = prev.domains.filter(d => d.name.toLowerCase() !== name.toLowerCase());
      let email = prev.selectedEmailPlan;
      if (email && email.assignedDomain === name) {
        email = updated.length > 0 ? { ...email, assignedDomain: updated[0].name } : null;
      }
      return { ...prev, domains: updated, selectedEmailPlan: email };
    });
  };

  const clearDomains = () => {
    setOrder(prev => ({
      ...prev,
      domains: [],
      selectedEmailPlan: prev.selectedEmailPlan ? { ...prev.selectedEmailPlan, assignedDomain: null } : null
    }));
  };

  const setEmailPlan = (plan: EmailPlan | null) => {
    setOrder(prev => ({ ...prev, selectedEmailPlan: plan }));
  };

  const toggleAutoBackup = () => {
    setOrder(prev => ({ ...prev, includeAutoBackup: !prev.includeAutoBackup }));
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SALAD50' || clean === 'LAUNCH2026') {
      setOrder(prev => ({ ...prev, promoCode: clean, discountPercentage: 50 }));
      return true;
    }
    if (clean === 'COMMUNITY') {
      setOrder(prev => ({ ...prev, promoCode: clean, discountPercentage: 20 }));
      return true;
    }
    return false;
  };

  const removePromoCode = () => {
    setOrder(prev => ({ ...prev, promoCode: '', discountPercentage: 0 }));
  };

  const updateInvoiceDetails = (details: Partial<OrderState['invoiceDetails']>) => {
    setOrder(prev => ({
      ...prev,
      invoiceDetails: { ...prev.invoiceDetails, ...details }
    }));
  };

  const setPaymentMethod = (method: string) => {
    setOrder(prev => ({ ...prev, paymentMethod: method }));
  };

  const resetOrder = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setOrder({
      plan: DEFAULT_PLANS.web,
      setupMode: 'new',
      migrationDetails: { sourceUrl: '', cpanelUser: '', notes: '' },
      domains: [{ name: 'nodegen.com', type: 'external', priceLkr: 0, status: 'valid' }],
      selectedEmailPlan: { ...DEFAULT_EMAIL_PLAN, assignedDomain: 'nodegen.com' },
      includeAutoBackup: true,
      promoCode: '',
      discountPercentage: 0,
      invoiceDetails: {
        fullName: 'Alex Jayawardena',
        email: 'alex@nodegen.com',
        address: '42 Galle Road',
        city: 'Colombo 03',
        country: 'Sri Lanka',
        vatNumber: '',
      },
      paymentMethod: 'card',
      orderCompletedAt: null,
    });
  };

  const completeOrder = () => {
    setOrder(prev => ({ ...prev, orderCompletedAt: new Date().toISOString() }));
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        selectPlan,
        setSetupMode,
        setMigrationDetails,
        addDomain,
        removeDomain,
        clearDomains,
        setEmailPlan,
        toggleAutoBackup,
        applyPromoCode,
        removePromoCode,
        updateInvoiceDetails,
        setPaymentMethod,
        resetOrder,
        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
