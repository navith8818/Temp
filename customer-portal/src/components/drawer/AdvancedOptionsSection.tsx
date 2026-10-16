import React, { useState } from 'react';
import {
  Settings,
  ChevronDown,
  Sliders,
  Radio,
  Lock,
  Mail,
  Archive,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { HostingPlan } from '@/types/hosting';
import { hostingService } from '@/data/mockHostingData';
import { useToast } from '@/components/ui/Toast';

interface AdvancedOptionsSectionProps {
  plan: HostingPlan;
  onPlanUpdated: (plan: HostingPlan) => void;
}

export const AdvancedOptionsSection: React.FC<AdvancedOptionsSectionProps> = ({
  plan,
  onPlanUpdated,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [openSubSection, setOpenSubSection] = useState<string | null>('config');
  const { toast } = useToast();

  // Configuration state
  const [selectedPhp, setSelectedPhp] = useState(plan.phpVersion);
  const [isSavingPhp, setIsSavingPhp] = useState(false);

  // Cancellation state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const toggleSubSection = (key: string) => {
    setOpenSubSection(openSubSection === key ? null : key);
  };

  const handleUpdatePhp = async (newVersion: string) => {
    setSelectedPhp(newVersion);
    setIsSavingPhp(true);
    try {
      await hostingService.updatePhpVersion(newVersion);
      onPlanUpdated({ ...plan, phpVersion: newVersion });
      toast('PHP Version Updated', `Default runtime changed to PHP ${newVersion}. (Simulated)`, 'success');
    } catch {
      toast('Error', 'Failed to update PHP version.', 'error');
    } finally {
      setIsSavingPhp(false);
    }
  };

  const handleLaunchWebmail = () => {
    toast(
      'Roundcube Webmail',
      `Opening secure Roundcube webmail portal for ${plan.primaryDomain}... (Simulated link)`,
      'info'
    );
    window.open(`https://${plan.serverHost}/webmail/`, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadBackup = () => {
    toast(
      'Backup Snapshot',
      `Generating snapshot archive download (${plan.backupSummary.snapshotSizeGb} GB)... (Simulated)`,
      'info'
    );
  };

  const handleRequestCancellation = async () => {
    if (!cancelReason.trim()) {
      toast('Reason Required', 'Please provide a brief reason for cancellation.', 'error');
      return;
    }
    setIsCancelling(true);
    try {
      const res = await hostingService.requestCancellation(cancelReason);
      toast(
        'Cancellation Ticket Created',
        `Ticket #${res.ticketId} opened. Support will confirm within 24 hours. (Simulated)`,
        'success'
      );
      setCancelModalOpen(false);
      setCancelReason('');
    } catch {
      toast('Error', 'Failed to submit cancellation request.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="pt-3 pb-6">
      {/* Advanced Main Row - Matching Green Arrow 2 in Reference 1 */}
      <button
        type="button"
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100/90 border border-gray-200 text-left transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8702a]"
        aria-expanded={isAdvancedOpen}
      >
        <div className="flex items-center gap-3">
          <Settings className="w-4 h-4 text-gray-500 group-hover:text-[#e8702a] transition-colors" />
          <div>
            <span className="text-xs font-bold text-gray-900">Advanced options</span>
            <p className="text-[11px] text-gray-500">
              DNS, PHP runtime, backups, SSL & mail config
            </p>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isAdvancedOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded Area - Progressive Disclosure Downwards */}
      {isAdvancedOpen && (
        <div className="mt-4 space-y-3 animate-in fade-in duration-200">
          {/* Sub-item 1: Detailed Hosting Configuration */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSubSection('config')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#e8702a]" />
                <span>Hosting Configuration & PHP</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                  openSubSection === 'config' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubSection === 'config' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/60 space-y-3.5 text-xs">
                <div>
                  <label htmlFor="php-version-select" className="block text-[11px] font-medium text-gray-600 mb-1.5">
                    Default PHP Version
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="php-version-select"
                      value={selectedPhp}
                      onChange={(e) => handleUpdatePhp(e.target.value)}
                      disabled={isSavingPhp}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-[#e8702a]"
                    >
                      {plan.availablePhpVersions.map((v) => (
                        <option key={v} value={v}>
                          PHP {v} {v === '8.3' ? '(Recommended)' : ''}
                        </option>
                      ))}
                    </select>
                    {isSavingPhp && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#e8702a]" />}
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-[11px] text-gray-600">
                  <div className="flex justify-between">
                    <span>Web Server Stack:</span>
                    <span className="text-gray-900 font-mono font-medium">{plan.webServer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory Limit:</span>
                    <span className="text-gray-900 font-mono font-medium">512 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Execution Time:</span>
                    <span className="text-gray-900 font-mono font-medium">300s</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sub-item 2: DNS Settings */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSubSection('dns')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#e8702a]" />
                <span>DNS Zone & Nameservers</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                  openSubSection === 'dns' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubSection === 'dns' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/60 space-y-2.5 text-xs">
                <p className="text-[11px] text-gray-500">
                  Configure your domain registrar with Server Salad authoritative nameservers:
                </p>
                <div className="space-y-1.5">
                  {plan.dnsNameservers.map((ns) => (
                    <div
                      key={ns}
                      className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-900 font-mono text-[11px] flex justify-between items-center"
                    >
                      <span>{ns}</span>
                      <span className="text-[10px] text-emerald-600 font-sans font-semibold">Active</span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 flex justify-between text-[11px] text-gray-500">
                  <span>Server A-Record Target:</span>
                  <code className="text-gray-900 font-mono font-semibold">{plan.serverIp}</code>
                </div>
              </div>
            )}
          </div>

          {/* Sub-item 3: SSL Certificate Status */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSubSection('ssl')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSL Certificate Status</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                  openSubSection === 'ssl' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubSection === 'ssl' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Certificate Type:</span>
                  <span className="text-gray-900 font-medium">Let&apos;s Encrypt Wildcard</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-emerald-600 font-bold">Active & Auto-renewing</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Auto-renew window:</span>
                  <span className="text-gray-900">74 days remaining</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                  <span className="text-gray-500">Force HTTPS:</span>
                  <span className="text-gray-900 font-semibold">Enabled (Nginx 301)</span>
                </div>
              </div>
            )}
          </div>

          {/* Sub-item 4: Email Accounts */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSubSection('mail')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#e8702a]" />
                <span>Email Accounts & Webmail</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                  openSubSection === 'mail' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubSection === 'mail' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/60 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Active Mailboxes:</span>
                  <span className="text-gray-900 font-bold">
                    {plan.mailboxesUsed} of {plan.mailboxesLimit} used
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLaunchWebmail}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#e8702a]" />
                    <span>Open Roundcube Webmail</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Sub-item 5: Automated Backups */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSubSection('backups')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Archive className="w-3.5 h-3.5 text-[#e8702a]" />
                <span>Automated Backups</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                  openSubSection === 'backups' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubSection === 'backups' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/60 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Snapshot:</span>
                  <span className="text-gray-900 font-semibold">{plan.backupSummary.lastBackup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Retention Policy:</span>
                  <span className="text-gray-900">{plan.backupSummary.retentionDays} Days rolling</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="w-full mt-1.5 py-2 px-4 rounded-full bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 border border-gray-200 shadow-xs transition-colors cursor-pointer"
                >
                  Download Latest Snapshot ({plan.backupSummary.snapshotSizeGb} GB)
                </button>
              </div>
            )}
          </div>

          {/* Sub-item 6: Service Cancellation Request */}
          <div className="rounded-2xl border border-red-200 bg-red-50/40 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => toggleSubSection('cancel')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span>Service Cancellation Request</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-red-400 transition-transform ${
                  openSubSection === 'cancel' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSubSection === 'cancel' && (
              <div className="p-4 border-t border-red-100 bg-white space-y-3 text-xs">
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Canceling will decommission this hosting instance and all associated HestiaCP web
                  vhosts, databases, and mailboxes at the end of the billing period.
                </p>

                {cancelModalOpen ? (
                  <div className="space-y-2.5 pt-1 border-t border-red-100">
                    <label htmlFor="cancel-reason" className="block text-[11px] font-semibold text-red-700">
                      Reason for cancellation:
                    </label>
                    <textarea
                      id="cancel-reason"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="e.g. Project migrated or no longer needed"
                      className="w-full p-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500"
                      rows={2}
                    />
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setCancelModalOpen(false)}
                        className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800"
                      >
                        Abort
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestCancellation}
                        disabled={isCancelling}
                        className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors cursor-pointer"
                      >
                        {isCancelling ? 'Submitting...' : 'Confirm Request'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(true)}
                    className="w-full py-2 px-4 rounded-full bg-white hover:bg-red-50 text-xs font-semibold text-red-600 border border-red-200 transition-colors cursor-pointer"
                  >
                    Request Plan Cancellation
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
