import React, { useState, useEffect } from 'react';
import { X, Globe, CheckCircle2, AlertCircle, Loader2, Server } from 'lucide-react';
import { HostingPlan, Website, AppType } from '@/types/hosting';
import { hostingService } from '@/data/mockHostingData';
import { useToast } from '@/components/ui/Toast';

interface AddWebsiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: HostingPlan;
  onWebsiteAdded: (website: Website) => void;
}

export const AddWebsiteDialog: React.FC<AddWebsiteDialogProps> = ({
  isOpen,
  onClose,
  plan,
  onWebsiteAdded,
}) => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [appType, setAppType] = useState<AppType>('WordPress');
  const [phpVersion, setPhpVersion] = useState('8.3');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [simulatedAvailability, setSimulatedAvailability] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
  } | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setDomain('');
      setAppType('WordPress');
      setPhpVersion(plan.phpVersion || '8.3');
      setValidationError(null);
      setSimulatedAvailability(null);
    }
  }, [isOpen, plan.phpVersion]);

  // Handle ESC key
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

  const validateDomain = (value: string): boolean => {
    const clean = value.trim().toLowerCase();
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,12}$/;
    if (!clean) {
      setValidationError('Domain name is required.');
      setSimulatedAvailability(null);
      return false;
    }
    if (!domainRegex.test(clean)) {
      setValidationError('Please enter a valid domain format (e.g., example.com or app.example.com).');
      setSimulatedAvailability(null);
      return false;
    }
    setValidationError(null);
    setSimulatedAvailability({
      checked: true,
      valid: true,
      message: 'Mock check: Syntax valid. Ready to link to HestiaCP Web Domain.',
    });
    return true;
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDomain(val);
    if (val.length > 3) {
      validateDomain(val);
    } else {
      setValidationError(null);
      setSimulatedAvailability(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDomain(domain)) {
      return;
    }

    if (plan.domainCount >= plan.domainLimit) {
      setValidationError(
        `Plan domain limit reached (${plan.domainLimit}/${plan.domainLimit}). Upgrade plan or remove an existing domain.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const newSite = await hostingService.addWebsite({
        domain,
        appType,
        phpVersion,
      });

      toast('Website Added', `${newSite.domain} was added to ${plan.name}.`, 'success');
      onWebsiteAdded(newSite);
      onClose();
    } catch {
      setValidationError('Failed to add website. Please check parameters and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-website-title"
    >
      <div
        className="fixed inset-0"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-2xl p-7 sm:p-8 text-gray-900 z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fcf5f1] border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
              <Globe className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 id="add-website-title" className="text-lg font-bold text-gray-900">
                Add Website to Hosting
              </h3>
              <p className="text-xs text-gray-500">
                Provision a new domain or subdomain on HestiaCP
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Plan Note */}
        <div className="my-5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <Server className="w-4 h-4 text-[#e8702a]" />
            <span>Target Plan: <strong className="font-bold text-gray-900">{plan.name}</strong></span>
          </div>
          <span className="text-gray-500">
            Capacity: <strong className="text-gray-900 font-bold">{plan.domainCount}</strong> / {plan.domainLimit} used
          </span>
        </div>

        {/* Form with Generous Spacing */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Domain Input */}
          <div>
            <label htmlFor="website-domain" className="block text-xs font-bold text-gray-700 mb-1.5">
              Domain or Subdomain Name <span className="text-[#e8702a]">*</span>
            </label>
            <div className="relative">
              <input
                id="website-domain"
                type="text"
                value={domain}
                onChange={handleDomainChange}
                placeholder="example.com or blog.mybrand.org"
                autoFocus
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-colors ${
                  validationError
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#e8702a]'
                }`}
              />
            </div>

            {/* Inline validation or Simulated check */}
            {validationError ? (
              <p className="flex items-center gap-1.5 text-xs text-red-600 mt-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationError}</span>
              </p>
            ) : simulatedAvailability ? (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{simulatedAvailability.message}</span>
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1.5">
                Enter your apex domain or subdomain without protocol (no https://).
              </p>
            )}
          </div>

          {/* Application Template */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="app-template" className="block text-xs font-bold text-gray-700 mb-1.5">
                Application Preset
              </label>
              <select
                id="app-template"
                value={appType}
                onChange={(e) => setAppType(e.target.value as AppType)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a] transition-colors"
              >
                <option value="WordPress">WordPress 6.9 (Auto-install)</option>
                <option value="PHP/Static">Standard PHP / HTML</option>
                <option value="Node.js">Node.js / Reverse Proxy</option>
                <option value="Laravel">Laravel Framework</option>
              </select>
            </div>

            <div>
              <label htmlFor="php-version" className="block text-xs font-bold text-gray-700 mb-1.5">
                PHP Version
              </label>
              <select
                id="php-version"
                value={phpVersion}
                onChange={(e) => setPhpVersion(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:bg-white focus:border-[#e8702a] transition-colors"
              >
                {plan.availablePhpVersions.map((v) => (
                  <option key={v} value={v}>
                    PHP {v} {v === '8.3' ? '(Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DNS Notice */}
          <div className="p-3.5 rounded-2xl bg-[#fcf5f1] border border-[#e8702a]/20 text-[11px] text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-900">DNS Setup Required:</span> After adding this
            website, point your domain&apos;s DNS A-record to Server IP{' '}
            <code className="text-gray-900 font-mono bg-white px-1.5 py-0.5 rounded border border-[#e8702a]/20">
              {plan.serverIp}
            </code>. SSL will be automatically issued once DNS propagates.
          </div>

          {/* Buttons - Lithos-Hero Pill Style */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-md shadow-[#e8702a]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Configuring on HestiaCP...</span>
                </>
              ) : (
                <span>Add Website</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
