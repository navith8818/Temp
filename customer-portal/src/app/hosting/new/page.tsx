'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Zap,
  HardDrive,
  Globe,
  Info,
} from 'lucide-react';
import { HOSTING_PRODUCTS } from '@/data/mockHostingData';
import { useToast } from '@/components/ui/Toast';

export default function NewHostingPage() {
  const { toast } = useToast();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedRegion, setSelectedRegion] = useState('lon1');
  const [selectedPlanId, setSelectedPlanId] = useState('tier_essential');

  const regions = [
    { id: 'lon1', name: 'London, UK', flag: '🇬🇧', desc: 'Enterprise Data Centre' },
    { id: 'sri1', name: 'Colombo, LK', flag: '🇱🇰', desc: 'Local Data Center' },
  ];

  const handleSelectPlan = (planName: string) => {
    toast(
      'Plan Selected',
      `${planName} selected in ${regions.find((r) => r.id === selectedRegion)?.name}. Redirecting to order setup...`,
      'info'
    );
    window.location.href = 'http://localhost:5173/order/setup';
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f8f9fa] text-gray-900">
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Back Link & Header with Increased Space */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Hosting</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                New Hosting Instance
              </h1>
              <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
                Deploy high-speed NVMe cloud hosting powered by Server Salad enterprise infrastructure with automated HestiaCP provisioning.
              </p>
            </div>

            {/* Monthly / Annual Toggle - Lithos-Hero Pill Style */}
            <div className="flex items-center p-1.5 rounded-full bg-white border border-gray-200/90 shadow-xs self-start md:self-auto">
              <button
                type="button"
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  billingPeriod === 'monthly'
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod('annual')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  billingPeriod === 'annual'
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#fcf5f1] text-[#e8702a]">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Datacenter Region Selector */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              1. Select Datacenter Location
            </h2>
            <span className="text-xs text-gray-400">London & Frankfurt Enterprise Hubs</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {regions.map((region) => {
              const isSelected = selectedRegion === region.id;
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setSelectedRegion(region.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#e8702a] shadow-md shadow-[#e8702a]/10 ring-2 ring-[#e8702a]/20'
                      : 'bg-white border-gray-200/80 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{region.flag}</span>
                    <span className="text-[10px] font-mono text-gray-400 font-semibold">{region.id.toUpperCase()}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900">{region.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{region.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Choose Hosting Plan - Full Plan Comparison */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                2. CHOOSE HOSTING PLAN
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Instant provisioning upon checkout with 14-day money back guarantee
              </p>
            </div>

            {/* Billing Cycle Toggle - Match Screenshot */}
            <div className="inline-flex items-center gap-2.5 self-start sm:self-auto bg-white py-1.5 px-3.5 rounded-full border border-gray-200/90 shadow-2xs">
              <span
                className={`text-xs cursor-pointer select-none transition-colors ${
                  billingPeriod === 'monthly' ? 'text-slate-800 font-semibold' : 'text-slate-400 font-medium'
                }`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </span>

              {/* Orange Pill Switch */}
              <button
                type="button"
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out bg-[#e8702a] focus:outline-none"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    billingPeriod === 'annual' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setBillingPeriod('annual')}
              >
                <span
                  className={`text-xs transition-colors ${
                    billingPeriod === 'annual' ? 'text-slate-800 font-semibold' : 'text-slate-400 font-medium'
                  }`}
                >
                  Annually
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-[#e8702a] border border-orange-200/60">
                  2 MONTHS FREE
                </span>
              </div>
            </div>
          </div>

          {/* Plan Comparison Table Container */}
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
            {/* Header / Pricing Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              {/* Col 0: Dark Navy Topic Banner - Fits top, left, bottom flush with rounded-tl-3xl */}
              <div className="bg-[#0e1726] text-white p-8 sm:p-9 flex flex-col justify-center text-left">
                <h3 className="text-[28px] sm:text-[30px] font-black tracking-tight leading-[1.15] text-white">
                  Fast, Secure &amp;<br />Reliable Web<br />Hosting
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-300/80 mt-8 leading-relaxed font-normal">
                  High-speed enterprise NVMe storage in London with automated cPanel infrastructure.
                </p>
              </div>

              {/* Col 1: Starter Salad */}
              <div
                onClick={() => setSelectedPlanId('starter')}
                className={`p-7 sm:p-8 flex flex-col justify-between cursor-pointer transition-all ${
                  selectedPlanId === 'starter'
                    ? 'bg-[#fcf5f1]/40 ring-2 ring-inset ring-[#e8702a]'
                    : 'hover:bg-gray-50/60'
                }`}
              >
                <div>
                  <h4 className="text-xl font-extrabold text-gray-900 tracking-tight">Starter Salad</h4>
                  <p className="text-xs text-gray-500 mt-1.5 min-h-[36px] leading-relaxed">
                    Light appetizer portion with 2-Core power, prepped for testing and staging.
                  </p>
                  <div className="mt-5 pb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">
                        {billingPeriod === 'monthly' ? 'LKR 549' : 'LKR 458'}
                      </span>
                      <span className="text-xs font-medium text-gray-500">/month</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                      {billingPeriod === 'monthly'
                        ? 'LKR 6,588/year (switch to Annual to save)'
                        : 'billed as LKR 5,490/year (16% Discount)'}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId('starter');
                      handleSelectPlan('Starter Salad');
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPlanId === 'starter'
                        ? 'bg-[#e8702a] text-white border-[#e8702a] shadow-sm'
                        : 'bg-white text-[#e8702a] border-[#e8702a] hover:bg-[#e8702a]/10'
                    }`}
                  >
                    Order Starter Salad
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-2">14-Day Money Back Guarantee</p>
                </div>
              </div>

              {/* Col 2: Standard Salad (Most Popular) */}
              <div
                onClick={() => setSelectedPlanId('standard')}
                className={`p-7 sm:p-8 pt-9 sm:pt-10 relative flex flex-col justify-between cursor-pointer transition-all ${
                  selectedPlanId === 'standard'
                    ? 'bg-[#fcf5f1]/60 ring-2 ring-inset ring-[#e8702a]'
                    : 'bg-gradient-to-b from-orange-50/20 to-white hover:bg-orange-50/40'
                }`}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#e8702a] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                  MOST POPULAR
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">Standard Salad</h4>
                  <p className="text-xs text-gray-500 mt-1.5 min-h-[36px] leading-relaxed">
                    Hearty main course with 2-Core power, prepped for live blogs and freelancers.
                  </p>
                  <div className="mt-5 pb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#e8702a]">
                        {billingPeriod === 'monthly' ? 'LKR 649' : 'LKR 541'}
                      </span>
                      <span className="text-xs font-medium text-gray-500">/month</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                      {billingPeriod === 'monthly'
                        ? 'LKR 7,788/year (switch to Annual to save)'
                        : 'billed as LKR 6,490/year (16% Discount)'}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId('standard');
                      handleSelectPlan('Standard Salad');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-md shadow-[#e8702a]/20 transition-all cursor-pointer"
                  >
                    Order Standard Salad
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">14-Day Money Back Guarantee</p>
                </div>
              </div>

              {/* Col 3: Premium Salad */}
              <div
                onClick={() => setSelectedPlanId('premium')}
                className={`p-7 sm:p-8 flex flex-col justify-between cursor-pointer transition-all rounded-tr-3xl ${
                  selectedPlanId === 'premium'
                    ? 'bg-[#fcf5f1]/40 ring-2 ring-inset ring-[#e8702a]'
                    : 'hover:bg-gray-50/60'
                }`}
              >
                <div>
                  <h4 className="text-xl font-extrabold text-gray-900 tracking-tight">Premium Salad</h4>
                  <p className="text-xs text-gray-500 mt-1.5 min-h-[36px] leading-relaxed">
                    Generous banquet platter with 2-Core power, prepped for multi-site creators.
                  </p>
                  <div className="mt-5 pb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">
                        {billingPeriod === 'monthly' ? 'LKR 829' : 'LKR 691'}
                      </span>
                      <span className="text-xs font-medium text-gray-500">/month</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                      {billingPeriod === 'monthly'
                        ? 'LKR 9,948/year (switch to Annual to save)'
                        : 'billed as LKR 8,290/year (16% Discount)'}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId('premium');
                      handleSelectPlan('Premium Salad');
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPlanId === 'premium'
                        ? 'bg-[#e8702a] text-white border-[#e8702a] shadow-sm'
                        : 'bg-white text-[#e8702a] border-[#e8702a] hover:bg-[#e8702a]/10'
                    }`}
                  >
                    Order Premium Salad
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-2">14-Day Money Back Guarantee</p>
                </div>
              </div>
            </div>

            {/* Resource Specifications Section */}
            <div className="border-t border-gray-200">
              <div className="bg-gray-50/80 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100">
                Core Specifications
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                {[
                  { name: 'Websites', starter: '1', standard: '3', premium: '10' },
                  { name: 'Storage', starter: '1 GB NVMe', standard: '9 GB NVMe', premium: '30 GB NVMe' },
                  { name: 'Bandwidth', starter: '20 GB', standard: '500 GB', premium: '∞ Unmetered' },
                  { name: 'MySQL Databases', starter: '2', standard: '∞ Unlimited', premium: '∞ Unlimited' },
                  { name: 'Email Accounts', starter: '2', standard: '∞ Unlimited', premium: '∞ Unlimited' },
                  { name: 'Sub Domains', starter: '2', standard: '∞ Unlimited', premium: '∞ Unlimited' },
                  { name: 'FTP Accounts', starter: '1', standard: '∞ Unlimited', premium: '∞ Unlimited' },
                  { name: 'Passenger Applications', starter: '2', standard: '3', premium: '5' },
                  { name: 'Parked Domains', starter: '—', standard: '∞ Unlimited', premium: '∞ Unlimited' },
                  { name: 'Mailing Lists', starter: '—', standard: '∞ Unlimited', premium: '∞ Unlimited' },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-4 px-6 py-3 items-center hover:bg-gray-50/50 transition-colors">
                    <span className="font-semibold text-gray-700">{row.name}</span>
                    <span className="text-center text-gray-900 font-medium">{row.starter}</span>
                    <span className="text-center font-bold text-gray-900 bg-[#fcf5f1]/50 py-1 rounded">{row.standard}</span>
                    <span className="text-center text-gray-900 font-medium">{row.premium}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included with Every Plan Section */}
            <div className="border-t border-gray-200">
              <div className="bg-gray-50/80 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100">
                Included with Every Plan
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                {[
                  { name: 'cPanel Control Panel', starter: 'Yes', standard: 'Yes', premium: 'Yes' },
                  { name: 'Data Centre', starter: 'United Kingdom 🇬🇧', standard: 'United Kingdom 🇬🇧', premium: 'United Kingdom 🇬🇧' },
                  { name: 'CPU', starter: '2 Cores', standard: '2 Cores', premium: '2 Cores' },
                  { name: 'RAM', starter: '2 GB', standard: '2 GB', premium: '2 GB' },
                  { name: 'LiteSpeed Web Cache Manager', starter: true, standard: true, premium: true },
                  { name: 'Free SSL', starter: true, standard: true, premium: true },
                  { name: 'cPGuard Security', starter: true, standard: true, premium: true },
                  { name: 'JetBackup', starter: true, standard: true, premium: true },
                  { name: 'WordPress Support', starter: true, standard: true, premium: true },
                  { name: 'Softaculous 1-Click App Installer', starter: true, standard: true, premium: true },
                  { name: 'Python Support', starter: true, standard: true, premium: true },
                  { name: 'Node.js Support', starter: true, standard: true, premium: true },
                  { name: 'Website Builders (Sitejet & Site.pro)', starter: true, standard: true, premium: true },
                  { name: '24/7 Support', starter: true, standard: true, premium: true },
                ].map((feature, idx) => (
                  <div key={idx} className="grid grid-cols-4 px-6 py-3 items-center hover:bg-gray-50/50 transition-colors">
                    <span className="font-semibold text-gray-700">{feature.name}</span>
                    <div className="text-center flex items-center justify-center">
                      {typeof feature.starter === 'boolean' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-gray-900 font-medium">{feature.starter}</span>
                      )}
                    </div>
                    <div className="text-center flex items-center justify-center bg-[#fcf5f1]/50 py-1 rounded">
                      {typeof feature.standard === 'boolean' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-gray-900 font-bold">{feature.standard}</span>
                      )}
                    </div>
                    <div className="text-center flex items-center justify-center">
                      {typeof feature.premium === 'boolean' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-gray-900 font-medium">{feature.premium}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Backend readiness note */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3.5 text-xs text-gray-500 shadow-xs">
          <Info className="w-4 h-4 text-[#e8702a] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-gray-900 font-bold">API Integration Notice:</strong> In production, plan
            selection routes customer checkout via Server Salad NestJS API (`/api/v1/orders/checkout`)
            and invokes HestiaCP cluster webhook for automated account provisioning.
          </p>
        </div>
      </main>
    </div>
  );
}
