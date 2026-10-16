import React, { useState } from 'react';
import { ChevronDown, ExternalLink, ShieldCheck, Copy, Check, Terminal } from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { useToast } from '@/components/ui/Toast';

interface HestiaAccessSectionProps {
  plan: HostingPlan;
  defaultExpanded?: boolean;
}

export const HestiaAccessSection: React.FC<HestiaAccessSectionProps> = ({
  plan,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    toast('Copied to clipboard', `${label} copied.`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLaunchHestia = () => {
    toast(
      'Launching HestiaCP',
      `Starting single sign-on (SSO) session for ${plan.hestiaUsername}... (Simulated link)`,
      'info'
    );
    window.open(
      `https://${plan.serverHost}:${plan.controlPanelPort}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="py-4 border-b border-gray-100">
      {/* Header with Chevron */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-1 text-left group focus:outline-none cursor-pointer"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 group-hover:text-[#e8702a] transition-colors">
          <Terminal className="w-4 h-4 text-[#e8702a]" />
          <span>HestiaCP Access</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="mt-4 space-y-3.5 animate-in fade-in duration-200">
          {/* Primary Action Button - Lithos-Hero Pill Style */}
          <button
            type="button"
            onClick={handleLaunchHestia}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#e8702a] hover:bg-[#d2611f] text-white text-xs font-bold shadow-md shadow-[#e8702a]/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Open HestiaCP Web Console</span>
          </button>

          {/* Access Credentials Display */}
          <div className="rounded-2xl bg-gray-50/90 border border-gray-200/80 p-4 space-y-2.5 text-xs text-gray-700">
            {/* Control Panel URL */}
            <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Panel URL</span>
              <div className="flex items-center gap-2">
                <code className="text-gray-900 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200">
                  https://{plan.serverHost}:{plan.controlPanelPort}
                </code>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('url', `https://${plan.serverHost}:${plan.controlPanelPort}`, 'Panel URL')
                  }
                  className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 cursor-pointer"
                  aria-label="Copy panel URL"
                >
                  {copiedKey === 'url' ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-center justify-between py-1 border-b border-gray-200/60">
              <span className="text-gray-500 font-medium">Username</span>
              <div className="flex items-center gap-2">
                <code className="text-gray-900 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200">
                  {plan.hestiaUsername}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy('user', plan.hestiaUsername, 'Username')}
                  className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 cursor-pointer"
                  aria-label="Copy username"
                >
                  {copiedKey === 'user' ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Server IP */}
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-500 font-medium">Server IP</span>
              <div className="flex items-center gap-2">
                <code className="text-gray-900 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200">
                  {plan.serverIp}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy('ip', plan.serverIp, 'Server IP')}
                  className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 cursor-pointer"
                  aria-label="Copy server IP"
                >
                  {copiedKey === 'ip' ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Single Sign-On (SSO) is active. Passwords and API tokens are never exposed in plaintext in the customer portal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
