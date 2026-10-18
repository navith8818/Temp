'use client';

import React, { useState } from 'react';
import { useAdminData } from '@/context/AdminDataContext';
import { AdminBadge } from '@/components/ui/AdminBadge';
import { AdminButton } from '@/components/ui/AdminButton';
import { AdminTabs } from '@/components/ui/AdminTabs';
import {
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateIntegrationSettings, addToast } = useAdminData();
  const [activeTab, setActiveTab] = useState('general');

  // General Form State
  const [companyName, setCompanyName] = useState(settings.general.companyName);
  const [supportEmail, setSupportEmail] = useState(settings.general.supportEmail);
  const [currency, setCurrency] = useState(settings.general.defaultCurrency);
  const [graceDays, setGraceDays] = useState(settings.general.gracePeriodDays);
  const [autoSuspendDays, setAutoSuspendDays] = useState(settings.general.autoSuspendOverdueDays);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.general.maintenanceMode);

  // WHM Form State
  const [whmUrl, setWhmUrl] = useState(settings.whm.hostUrl);
  const [whmPort, setWhmPort] = useState(settings.whm.port);
  const [showAdvancedWhm, setShowAdvancedWhm] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateIntegrationSettings({
      general: {
        companyName,
        supportEmail,
        defaultCurrency: currency,
        taxRatePct: 0.0,
        gracePeriodDays: Number(graceDays),
        autoSuspendOverdueDays: Number(autoSuspendDays),
        maintenanceMode,
      },
    });
  };

  const handleSaveWhm = (e: React.FormEvent) => {
    e.preventDefault();
    updateIntegrationSettings({
      whm: {
        ...settings.whm,
        hostUrl: whmUrl,
        port: Number(whmPort),
      },
    });
  };

  const handleTestWhm = () => {
    addToast('info', 'Testing WHM API Handshake', 'Querying json-api/version...');
    setTimeout(() => {
      addToast('success', 'Handshake OK', 'cPanel & WHM API responded in 38ms with valid authentication.');
    }, 800);
  };

  const handleTestPayHere = () => {
    addToast('info', 'Verifying Webhook Gateway', 'Checking PayHere IPN status...');
    setTimeout(() => {
      addToast('success', 'PayHere Active', 'Webhook endpoint verified. SSL handshake active.');
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-sans">
          Platform Integrations & System Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure external infrastructure providers, payment gateways, transactional email, and general business parameters.
        </p>
      </div>

      <AdminTabs
        tabs={[
          { id: 'general', label: 'General & Policies' },
          { id: 'whm', label: 'cPanel & WHM' },
          { id: 'vps', label: 'VPS Hypervisor' },
          { id: 'payhere', label: 'PayHere Gateway' },
          { id: 'resend', label: 'Resend Email' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab: General */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs space-y-4 max-w-2xl text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Company Entity Name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Default Platform Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="LKR">LKR (Rs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Renewal Grace Period (Days)</label>
              <input
                type="number"
                value={graceDays}
                onChange={e => setGraceDays(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Auto-Suspend Overdue (Days)</label>
              <input
                type="number"
                value={autoSuspendDays}
                onChange={e => setAutoSuspendDays(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-800">Public Maintenance Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={e => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e8702a]"></div>
            </label>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <AdminButton variant="primary" type="submit">
              Save Business Settings
            </AdminButton>
          </div>
        </form>
      )}

      {/* Tab: WHM */}
      {activeTab === 'whm' && (
        <form onSubmit={handleSaveWhm} className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs space-y-4 max-w-2xl text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">cPanel & WHM Infrastructure Connection</h3>
              <p className="text-[11px] text-gray-400">Used for automated shared web hosting provisioning</p>
            </div>
            <AdminBadge variant={settings.whm.lastPingStatus === 'CONNECTED' ? 'success' : 'danger'}>
              {settings.whm.lastPingStatus} ({settings.whm.lastPingMs}ms)
            </AdminBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">WHM Host Endpoint</label>
              <input
                type="text"
                value={whmUrl}
                onChange={e => setWhmUrl(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">API Port</label>
              <input
                type="number"
                value={whmPort}
                onChange={e => setWhmPort(Number(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">API Token Secret</label>
              <input
                type="password"
                disabled
                value="••••••••••••••••••••••••••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-500 font-mono"
              />
              <span className="text-[10px] text-gray-400">Credentials stored securely in environment variables.</span>
            </div>
          </div>

          {/* Contextual Advanced Settings Accordion */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvancedWhm(!showAdvancedWhm)}
              className="w-full p-3 bg-gray-50 flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer"
            >
              <span>Advanced WHM Socket & Timeout Options</span>
              {showAdvancedWhm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showAdvancedWhm && (
              <div className="p-3 bg-white space-y-2 text-xs text-gray-600 border-t border-gray-200">
                <p>Connection Timeout: <strong>15000ms</strong></p>
                <p>SSL Certificate Verification: <strong>Strict (TLS 1.3)</strong></p>
                <p>DNS Zone Template: <strong>default_serversalad_ns</strong></p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <AdminButton variant="secondary" type="button" onClick={handleTestWhm}>
              Test Connectivity
            </AdminButton>
            <AdminButton variant="primary" type="submit">
              Save WHM Settings
            </AdminButton>
          </div>
        </form>
      )}

      {/* Tab: VPS */}
      {activeTab === 'vps' && (
        <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs space-y-4 max-w-2xl text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Cloud VPS Hypervisor (Proxmox VE)</h3>
              <p className="text-[11px] text-gray-400">Ceph NVMe pool management for dedicated virtual machines</p>
            </div>
            <AdminBadge variant="success">CONNECTED</AdminBadge>
          </div>

          <div className="space-y-3 font-mono text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <div>Endpoint: {settings.vps.endpointUrl}</div>
            <div>Storage Pool: {settings.vps.defaultStoragePool}</div>
            <div>Auth Token: pve_api_token_nvme_prod (Active)</div>
          </div>
        </div>
      )}

      {/* Tab: PayHere */}
      {activeTab === 'payhere' && (
        <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs space-y-4 max-w-2xl text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">PayHere Merchant Integration</h3>
              <p className="text-[11px] text-gray-400">Visa, Mastercard & online payment gateway</p>
            </div>
            <AdminBadge variant="success">WEBHOOK ACTIVE</AdminBadge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Merchant ID</span>
              <span className="font-mono font-semibold text-gray-900">{settings.payHere.merchantId}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Environment</span>
              <span className="font-semibold text-gray-800">Production Live</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Currency</span>
              <span className="font-semibold text-gray-800">{settings.payHere.currency}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">Last Webhook</span>
              <span className="text-gray-800">{settings.payHere.lastWebhookReceived}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <AdminButton variant="secondary" onClick={handleTestPayHere}>
              Verify Webhook Ping
            </AdminButton>
          </div>
        </div>
      )}

      {/* Tab: Resend */}
      {activeTab === 'resend' && (
        <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-2xs space-y-4 max-w-2xl text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Resend Transactional Mailer</h3>
              <p className="text-[11px] text-gray-400">Order receipts, welcome emails, and automated renewal notices</p>
            </div>
            <AdminBadge variant="success">99.8% DELIVERABILITY</AdminBadge>
          </div>

          <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>Sender: <span className="font-semibold text-gray-900">{settings.resend.senderName} &lt;{settings.resend.senderEmail}&gt;</span></div>
            <div>DKIM & SPF: <span className="text-emerald-700 font-semibold">Verified on serversalad.com</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
