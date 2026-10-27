import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  CheckCircle2, 
  Plus, 
  Minus
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export function PricingPage() {
  const navigate = useNavigate();
  const { selectPlan } = useOrder();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleChoosePlan = (planId: string) => {
    selectPlan(planId);
    navigate('/order/setup');
  };

  const hostingSpecs = [
    { name: 'Websites', starter: '1', standard: '3', premium: '10' },
    { name: 'NVMe SSD Storage', starter: '1 GB', standard: '9 GB', premium: '30 GB' },
    { name: 'Monthly Bandwidth', starter: '20 GB', standard: '500 GB', premium: '∞ Unmetered' },
    { name: 'MySQL Databases', starter: '2', standard: '∞ Unlimited', premium: '∞ Unlimited' },
    { name: 'Email Accounts', starter: '2', standard: '∞ Unlimited', premium: '∞ Unlimited' },
    { name: 'Sub Domains', starter: '2', standard: '∞ Unlimited', premium: '∞ Unlimited' },
    { name: 'FTP Accounts', starter: '1', standard: '∞ Unlimited', premium: '∞ Unlimited' },
    { name: 'Passenger Applications', starter: '2', standard: '3', premium: '5' },
    { name: 'Parked Domains', starter: '—', standard: '∞ Unlimited', premium: '∞ Unlimited' },
    { name: 'Mailing Lists', starter: '—', standard: '∞ Unlimited', premium: '∞ Unlimited' },
  ];

  const standardFeatures = [
    { name: 'cPanel Control Panel', starter: 'Yes', standard: 'Yes', premium: 'Yes' },
    { name: 'Tier-4 Data Centre', starter: 'London 🇬🇧', standard: 'London 🇬🇧', premium: 'London 🇬🇧' },
    { name: 'Dedicated CPU Cores', starter: '2 Cores', standard: '2 Cores', premium: '2 Cores' },
    { name: 'Dedicated RAM', starter: '2 GB', standard: '2 GB', premium: '2 GB' },
    { name: 'LiteSpeed Web Cache Manager', starter: true, standard: true, premium: true },
    { name: 'Auto-Renewing Free SSL', starter: true, standard: true, premium: true },
    { name: 'Advanced cPGuard Security & WAF', starter: true, standard: true, premium: true },
    { name: 'JetBackup Cloud Snapshots', starter: true, standard: true, premium: true },
    { name: 'WordPress 1-Click Toolkit', starter: true, standard: true, premium: true },
    { name: 'Softaculous 400+ App Installer', starter: true, standard: true, premium: true },
    { name: 'Python & Node.js Support', starter: true, standard: true, premium: true },
    { name: 'Sitejet & Site.pro Builders', starter: true, standard: true, premium: true },
    { name: '24/7 Expert Live Chat & Tickets', starter: true, standard: true, premium: true },
  ];

  const faqs = [
    {
      q: 'Can I switch between monthly and annual billing later?',
      a: 'Yes, you can upgrade, downgrade, or switch between billing cycles anytime from your account dashboard with pro-rated billing.'
    },
    {
      q: 'How does the 14-day money-back guarantee work?',
      a: 'If you are not completely satisfied with our performance or service within the first 14 days, contact our support team for a full refund—no questions asked.'
    },
    {
      q: 'Do you offer free website migrations?',
      a: 'Absolutely! Our migration specialists will seamlessly transfer your cPanel accounts, databases, files, and emails with zero downtime completely free of charge.'
    },
    {
      q: 'Where are your data centers located?',
      a: 'Our primary high-speed enterprise NVMe data centers are located in London, UK, connected directly to major global Internet Exchanges with low-latency routing.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Visa, MasterCard, American Express, PayPal, and local bank transfers in Sri Lankan Rupees (LKR).'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white tracking-[-0.02em] selection:bg-[#e8702a]/30" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Navbar */}
      <header className="fixed top-6 left-4 right-4 z-[100] flex justify-center pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-[1200px]">
          <nav className="bg-[#111111]/90 backdrop-blur-xl border border-white/5 rounded-full px-5 py-3.5 flex items-center justify-between w-full shadow-2xl relative z-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mr-8 group">
              <svg width="22" height="22" viewBox="0 0 256 256" fill="#e8702a" xmlns="http://www.w3.org/2000/svg">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
              <span className="text-white text-lg font-bold tracking-tight group-hover:text-white/90 transition-colors">Server Salad</span>
            </Link>

            {/* Navigation links */}
            <div className="hidden lg:flex items-center gap-7">
              <Link to="/" className="text-white/80 text-[13px] font-medium hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/#features" className="text-white/80 text-[13px] font-medium hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-white text-[13px] font-semibold flex items-center gap-1.5">
                Pricing
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a]" />
              </Link>
            </div>

            {/* Right CTAs */}
            <div className="flex items-center gap-4 ml-auto">
              <button 
                onClick={() => navigate('/login')}
                className="text-white/80 hover:text-white text-[13px] font-medium transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleChoosePlan('standard')}
                className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-[13px] font-semibold px-5 py-2 rounded-full transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md shadow-[#e8702a]/20"
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Hero Header */}
      <main className="pt-36 sm:pt-44 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#e8702a]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8702a]/10 border border-[#e8702a]/25 text-[#e8702a] text-xs font-bold tracking-wider uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-[#e8702a] animate-pulse" />
            Simple, Transparent Hosting Pricing
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
            High-Performance Cloud Hosting with{' '}
            <span className="font-playfair italic font-normal text-[#e8702a]">Zero Surprise Fees</span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
            100% genuine licensed cPanel, pure NVMe cloud performance in London, and complimentary 24/7 technical care on every tier.
          </p>

          {/* Billing Toggle */}
          <div className="mt-9 inline-flex items-center gap-3.5 bg-[#141417] p-2 px-4 rounded-full border border-white/10 shadow-xl">
            <span 
              onClick={() => setBillingPeriod('monthly')}
              className={`text-xs font-semibold cursor-pointer transition-colors ${
                billingPeriod === 'monthly' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              Monthly
            </span>

            <button
              type="button"
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out bg-[#e8702a] focus:outline-none"
              aria-label="Toggle Billing Cycle"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <div 
              onClick={() => setBillingPeriod('annual')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span 
                className={`text-xs font-semibold transition-colors ${
                  billingPeriod === 'annual' ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                Annually
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#e8702a] text-white shadow-sm shadow-[#e8702a]/30">
                2 MONTHS FREE
              </span>
            </div>
          </div>
        </div>

        {/* 3 Tier Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-20 relative z-10">
          
          {/* Plan 1: Starter Salad */}
          <div className="bg-[#121216] border border-white/10 hover:border-white/20 rounded-[32px] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-2xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  Starter Tier
                </span>
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Starter Salad</h3>
              <p className="text-sm text-white/50 min-h-[44px] leading-relaxed">
                Light appetizer portion with 2-Core power, prepped for personal blogs, testing, and staging.
              </p>

              {/* Price display */}
              <div className="mt-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {billingPeriod === 'monthly' ? 'LKR 549' : 'LKR 458'}
                  </span>
                  <span className="text-sm text-white/50">/month</span>
                </div>
                <p className="text-xs text-white/40 mt-2 font-medium">
                  {billingPeriod === 'monthly'
                    ? 'LKR 6,588 billed annually (switch to save 16%)'
                    : 'billed as LKR 5,490/year (16% Discount)'}
                </p>
              </div>

              {/* Quick specs preview */}
              <ul className="py-6 space-y-3.5 text-xs text-white/70">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>1</strong> Hosted Website</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>1 GB</strong> Pure NVMe Cloud Storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>20 GB</strong> Fast Monthly Bandwidth</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>2 Cores</strong> Dedicated CPU &amp; 2 GB RAM</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span>Free SSL, cPGuard &amp; cPanel included</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleChoosePlan('starter')}
                className="w-full py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                Order Starter Salad
              </button>
              <p className="text-[11px] text-center text-white/40 mt-2.5 font-medium">14-Day Money Back Guarantee</p>
            </div>
          </div>

          {/* Plan 2: Standard Salad (Featured / Most Popular) */}
          <div className="relative bg-gradient-to-b from-[#1a120c] via-[#141215] to-[#121216] border-2 border-[#e8702a] rounded-[32px] p-8 sm:p-9 flex flex-col justify-between shadow-[0_0_50px_rgba(232,112,42,0.18)] transition-all duration-300 hover:-translate-y-2 scale-[1.02] z-20">
            {/* Top Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#e8702a] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg shadow-[#e8702a]/30">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e8702a] bg-[#e8702a]/15 px-3 py-1 rounded-full border border-[#e8702a]/30">
                  Recommended Tier
                </span>
                <span className="text-2xl">🥗</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Standard Salad</h3>
              <p className="text-sm text-white/60 min-h-[44px] leading-relaxed">
                Hearty main course with 2-Core power, prepped for production sites, business portfolios, and live blogs.
              </p>

              {/* Price display */}
              <div className="mt-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-[#e8702a] tracking-tight">
                    {billingPeriod === 'monthly' ? 'LKR 649' : 'LKR 541'}
                  </span>
                  <span className="text-sm text-white/50">/month</span>
                </div>
                <p className="text-xs text-white/40 mt-2 font-medium">
                  {billingPeriod === 'monthly'
                    ? 'LKR 7,788 billed annually (switch to save 16%)'
                    : 'billed as LKR 6,490/year (16% Discount)'}
                </p>
              </div>

              {/* Quick specs preview */}
              <ul className="py-6 space-y-3.5 text-xs text-white/80">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>3</strong> Hosted Websites</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>9 GB</strong> Pure NVMe Cloud Storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>500 GB</strong> High-Speed Bandwidth</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>∞ Unlimited</strong> MySQL Databases &amp; Emails</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span>LiteSpeed Web Cache + JetBackup Snapshots</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleChoosePlan('standard')}
                className="w-full py-4 rounded-full bg-[#e8702a] hover:bg-[#d2611f] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#e8702a]/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Order Standard Salad
              </button>
              <p className="text-[11px] text-center text-white/50 mt-2.5 font-medium">14-Day Money Back Guarantee</p>
            </div>
          </div>

          {/* Plan 3: Premium Salad */}
          <div className="bg-[#121216] border border-white/10 hover:border-white/20 rounded-[32px] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-2xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  Power Tier
                </span>
                <span className="text-2xl">🍲</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Premium Salad</h3>
              <p className="text-sm text-white/50 min-h-[44px] leading-relaxed">
                Generous banquet platter with 2-Core power, prepped for agencies, client portfolios, and heavy traffic.
              </p>

              {/* Price display */}
              <div className="mt-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {billingPeriod === 'monthly' ? 'LKR 829' : 'LKR 691'}
                  </span>
                  <span className="text-sm text-white/50">/month</span>
                </div>
                <p className="text-xs text-white/40 mt-2 font-medium">
                  {billingPeriod === 'monthly'
                    ? 'LKR 9,948 billed annually (switch to save 16%)'
                    : 'billed as LKR 8,290/year (16% Discount)'}
                </p>
              </div>

              {/* Quick specs preview */}
              <ul className="py-6 space-y-3.5 text-xs text-white/70">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>10</strong> Hosted Websites</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>30 GB</strong> Pure NVMe Cloud Storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>∞ Unmetered</strong> High-Capacity Bandwidth</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span><strong>5</strong> Passenger (Node.js / Python) Apps</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#e8702a] flex-shrink-0" />
                  <span>Priority 24/7 VIP Infrastructure Support</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleChoosePlan('premium')}
                className="w-full py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                Order Premium Salad
              </button>
              <p className="text-[11px] text-center text-white/40 mt-2.5 font-medium">14-Day Money Back Guarantee</p>
            </div>
          </div>

        </div>

        {/* Detailed Feature Comparison Table matching Customer-Portal structure */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#e8702a] mb-2">Side-By-Side Comparison</h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Compare Every Plan Specification
            </h3>
            <p className="text-sm text-white/50 mt-2">
              Everything transparently listed. Every single plan is powered by 100% genuine licensed software and high-speed UK data centers.
            </p>
          </div>

          <div className="bg-[#111115] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            
            {/* Table Header Row */}
            <div className="grid grid-cols-4 bg-[#15151b] border-b border-white/10 p-5 sm:p-6 text-sm font-bold">
              <div className="text-white/60">Features &amp; Resources</div>
              <div className="text-center text-white">Starter Salad</div>
              <div className="text-center text-[#e8702a]">Standard Salad <span className="hidden sm:inline text-[10px] font-normal uppercase bg-[#e8702a]/20 text-[#e8702a] px-2 py-0.5 rounded-full ml-1">Popular</span></div>
              <div className="text-center text-white">Premium Salad</div>
            </div>

            {/* Core Specifications */}
            <div className="bg-white/[0.02] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#e8702a] border-b border-white/5">
              Core Specifications
            </div>
            <div className="divide-y divide-white/5 text-xs sm:text-sm">
              {hostingSpecs.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors">
                  <span className="font-medium text-white/70">{row.name}</span>
                  <span className="text-center text-white/90 font-medium">{row.starter}</span>
                  <span className="text-center font-bold text-white bg-[#e8702a]/10 py-1.5 rounded-lg border border-[#e8702a]/20">{row.standard}</span>
                  <span className="text-center text-white/90 font-medium">{row.premium}</span>
                </div>
              ))}
            </div>

            {/* Included with Every Plan */}
            <div className="bg-white/[0.02] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#e8702a] border-y border-white/5">
              Included with Every Plan
            </div>
            <div className="divide-y divide-white/5 text-xs sm:text-sm">
              {standardFeatures.map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 px-6 py-3.5 items-center hover:bg-white/[0.02] transition-colors">
                  <span className="font-medium text-white/70">{row.name}</span>
                  <div className="text-center flex items-center justify-center">
                    {typeof row.starter === 'boolean' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-white/90 font-medium">{row.starter}</span>
                    )}
                  </div>
                  <div className="text-center flex items-center justify-center bg-[#e8702a]/10 py-1.5 rounded-lg border border-[#e8702a]/20">
                    {typeof row.standard === 'boolean' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-white font-bold">{row.standard}</span>
                    )}
                  </div>
                  <div className="text-center flex items-center justify-center">
                    {typeof row.premium === 'boolean' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-white/90 font-medium">{row.premium}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Footer */}
            <div className="grid grid-cols-4 p-6 bg-[#15151b] border-t border-white/10 items-center">
              <div className="text-xs text-white/40 font-medium">Ready to deploy?</div>
              <div className="px-2">
                <button
                  onClick={() => handleChoosePlan('starter')}
                  className="w-full py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 text-xs font-bold transition-all"
                >
                  Order Starter
                </button>
              </div>
              <div className="px-2">
                <button
                  onClick={() => handleChoosePlan('standard')}
                  className="w-full py-2.5 rounded-xl bg-[#e8702a] hover:bg-[#d2611f] text-white text-xs font-bold transition-all shadow-md shadow-[#e8702a]/20"
                >
                  Order Standard
                </button>
              </div>
              <div className="px-2">
                <button
                  onClick={() => handleChoosePlan('premium')}
                  className="w-full py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 text-xs font-bold transition-all"
                >
                  Order Premium
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-[#e8702a] font-semibold tracking-wide uppercase text-xs mb-3">Answers</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div 
                  key={i} 
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-[#e8702a]/40 bg-[#161414]' : 'border-white/10 bg-[#111114] hover:border-white/20'
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer"
                  >
                    <span className={`font-semibold text-base sm:text-lg transition-colors pr-6 ${
                      isOpen ? 'text-[#e8702a]' : 'text-white'
                    }`}>
                      {faq.q}
                    </span>
                    <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#e8702a]' : 'text-white/40'
                    }`}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>
                  <div 
                    className={`px-5 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-white/60 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="rounded-[32px] bg-gradient-to-r from-[#e8702a] to-[#d2611f] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Need custom infrastructure for an enterprise project?
            </h3>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-8">
              From dedicated private clusters to hybrid multi-region CDN routing, speak with our cloud engineers for a tailored configuration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => handleChoosePlan('standard')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#e8702a] font-bold text-sm hover:bg-gray-100 transition-all shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Get Started Today
              </button>
              <a 
                href="mailto:sales@serversalad.com"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black/20 hover:bg-black/30 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer"
              >
                Contact Enterprise Sales
              </a>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#050505] pt-16 pb-12 text-white/60 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 256 256" fill="#e8702a">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="text-white font-bold font-playfair italic text-lg">Server Salad</span>
            <span className="text-white/40 ml-2">© 2015–2026 Server Salad S.A. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-white/50">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/pricing" className="text-white font-semibold">Pricing</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
