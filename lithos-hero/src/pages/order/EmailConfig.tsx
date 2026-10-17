import React from 'react';
import { Mail, Check, ChevronDown } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { OrderModalLayout } from '../../components/OrderModalLayout';

export const EmailConfig: React.FC = () => {
  const { order, setEmailPlan } = useOrder();

  const isSelected = order.selectedEmailPlan !== null;

  const handleTogglePlan = () => {
    if (isSelected) {
      setEmailPlan(null);
    } else {
      const defaultDomain = order.domains[0]?.name || null;
      setEmailPlan({
        id: 'spacemail-pro',
        name: 'Spacemail Pro',
        mailboxCount: 1,
        storageGb: 5,
        aliasesCount: 10,
        trialDays: 30,
        renewalPriceYearlyUsd: 11.76,
        assignedDomain: defaultDomain,
      });
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (order.selectedEmailPlan) {
      setEmailPlan({
        ...order.selectedEmailPlan,
        assignedDomain: e.target.value
      });
    }
  };

  return (
    <OrderModalLayout 
      currentStep="email"
      skipAction={{
        label: isSelected ? "I don't want Spacemail" : "Skip this step",
        onClick: () => {
          setEmailPlan(null);
        }
      }}
    >
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e8702a]">Email</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-3">
            Connect your email
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl">
            Use Spacemail to create and manage professional email accounts with your domain. Simple, spam-free, and secure.
          </p>
        </div>

        {/* Product Card (matches Screenshot 2) */}
        <div 
          onClick={handleTogglePlan}
          className={`p-7 rounded-3xl border transition-all cursor-pointer relative ${
            isSelected
              ? 'bg-[#141418] border-[#e8702a] shadow-xl shadow-[#e8702a]/10 ring-1 ring-[#e8702a]/40'
              : 'bg-[#111115] border-white/5 hover:border-white/15'
          }`}
        >
          {/* Top Row: Name + Trial Badge + Applied indicator */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e8702a]/10 border border-[#e8702a]/30 flex items-center justify-center text-[#e8702a]">
                <Mail size={18} />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Spacemail Pro</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#e8702a]/15 text-[#e8702a] border border-[#e8702a]/30 px-2 py-0.5 rounded-full">
                  Trial
                </span>
              </div>
            </div>

            {isSelected && (
              <span className="text-xs font-bold text-[#e8702a] flex items-center gap-1.5 bg-[#e8702a]/10 px-3 py-1 rounded-full border border-[#e8702a]/20">
                <Check size={14} className="stroke-[3]" /> Applied
              </span>
            )}
          </div>

          {/* Feature Specs */}
          <ul className="space-y-1.5 text-xs text-white/70 mb-6 pl-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a]" />
              1 mailbox per domain
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a]" />
              5 GB of cloud storage per mailbox
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a]" />
              10 custom aliases included
            </li>
          </ul>

          {/* Pricing Info */}
          <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white">$0.00</span>
                <span className="text-xs text-white/50 font-medium">for 30 days</span>
              </div>
              <span className="text-[11px] text-white/40 block mt-0.5">
                $11.76/yr after the trial · Cancel anytime
              </span>
            </div>

            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSelected 
                  ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30' 
                  : 'bg-[#e8702a] text-white hover:bg-[#d2611f]'
              }`}
            >
              {isSelected ? 'Remove' : 'Select Plan'}
            </button>
          </div>
        </div>

        {/* Domain Association Dropdown (matches screenshot: "Select a plan for your domain") */}
        {isSelected && (
          <div className="space-y-3 pt-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-semibold">Assign mailbox to domain:</span>
              <button 
                onClick={() => setEmailPlan(null)} 
                className="text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                Clear selection
              </button>
            </div>

            <div className="bg-[#121217] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-bold text-white">
                  {order.selectedEmailPlan?.assignedDomain || 'No domain assigned'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40 font-mono">⇄</span>
                <div className="relative">
                  <select
                    value={order.selectedEmailPlan?.assignedDomain || ''}
                    onChange={handleDomainChange}
                    className="appearance-none bg-[#1a1a22] border border-white/15 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-white focus:outline-none focus:border-[#e8702a] cursor-pointer"
                  >
                    {order.domains.map((dom, i) => (
                      <option key={i} value={dom.name}>
                        {dom.name} (Spacemail Pro - $0.00)
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </OrderModalLayout>
  );
};
