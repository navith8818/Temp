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
    { id: 'fra1', name: 'Frankfurt, DE', flag: '🇪🇺', desc: 'Central European Core' },
    { id: 'iad1', name: 'Virginia, US', flag: '🇺🇸', desc: 'North America East' },
    { id: 'sin1', name: 'Singapore, SG', flag: '🇸🇬', desc: 'Asia-Pacific Gateway' },
  ];

  const handleSelectPlan = (planName: string) => {
    toast(
      'Plan Selected',
      `${planName} selected in ${regions.find((r) => r.id === selectedRegion)?.name}. Ready for backend order submission.`,
      'info'
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f8f9fa] text-gray-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
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

        {/* Product Cards Grid - Rounded-3xl Matching Lithos-Hero */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              2. Choose Hosting Plan
            </h2>
            <span className="text-xs text-gray-400">Instant provisioning upon checkout</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOSTING_PRODUCTS.map((prod) => {
              const isPopular = prod.popular;
              const isSelected = selectedPlanId === prod.id;
              const price =
                billingPeriod === 'monthly'
                  ? prod.priceMonthly
                  : (prod.priceAnnual / 12).toFixed(2);

              return (
                <div
                  key={prod.id}
                  className={`relative flex flex-col justify-between rounded-3xl border p-8 transition-all ${
                    isSelected
                      ? 'bg-white border-[#e8702a] shadow-xl shadow-[#e8702a]/10 ring-2 ring-[#e8702a]/20'
                      : 'bg-white border-gray-200/80 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#e8702a] text-white text-[10px] font-bold tracking-wider uppercase shadow-md shadow-[#e8702a]/30">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{prod.name}</h3>
                    <p className="text-xs text-gray-500 mt-1.5 min-h-[32px] leading-relaxed">{prod.tagline}</p>

                    <div className="mt-6 pb-6 border-b border-gray-100 flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-gray-900">${price}</span>
                      <span className="text-xs text-gray-500">/month</span>
                      {billingPeriod === 'annual' && (
                        <span className="text-[11px] text-gray-400 ml-2">
                          (billed ${prod.priceAnnual}/yr)
                        </span>
                      )}
                    </div>

                    {/* Key Resource Limits */}
                    <div className="py-6 border-b border-gray-100 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-500">
                          <HardDrive className="w-4 h-4 text-[#e8702a]" />
                          Storage
                        </span>
                        <span className="font-bold text-gray-900">{prod.storageGb} GB NVMe</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-500">
                          <Globe className="w-4 h-4 text-[#e8702a]" />
                          Domain Limit
                        </span>
                        <span className="font-bold text-gray-900">
                          Up to {prod.domainLimit} {prod.domainLimit === 1 ? 'domain' : 'domains'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-500">
                          <Zap className="w-4 h-4 text-[#e8702a]" />
                          Bandwidth
                        </span>
                        <span className="font-bold text-gray-900">{prod.bandwidthGb} GB/mo</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="py-6 space-y-3 text-xs text-gray-600">
                      {prod.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlanId(prod.id);
                        handleSelectPlan(prod.name);
                      }}
                      className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-lg shadow-[#e8702a]/20 hover:-translate-y-0.5'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {isSelected ? 'Selected Plan' : 'Select Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
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
