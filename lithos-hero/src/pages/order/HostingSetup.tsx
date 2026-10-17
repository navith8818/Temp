import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { OrderModalLayout } from '../../components/OrderModalLayout';

export const HostingSetup: React.FC = () => {
  const { order, setSetupMode, setMigrationDetails } = useOrder();

  return (
    <OrderModalLayout currentStep="setup" nextLabel="Continue">
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e8702a]">Hosting Setup</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-3">
            How would you like to get started?
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl">
            Choose whether to provision a fresh hosting container or seamlessly migrate an existing website with zero downtime.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Option A: New Account */}
          <div
            onClick={() => setSetupMode('new')}
            className={`relative p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              order.setupMode === 'new'
                ? 'bg-[#141418] border-[#e8702a] shadow-xl shadow-[#e8702a]/10 ring-1 ring-[#e8702a]/40'
                : 'bg-[#111115] border-white/5 hover:border-white/15 hover:bg-[#141418]'
            }`}
          >
            {order.setupMode === 'new' && (
              <div className="absolute top-5 right-5 bg-[#e8702a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                Recommended
              </div>
            )}
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#e8702a] block mb-2">Option A</span>
              <h3 className="text-xl font-bold text-white mb-3">Start a New Hosting Account</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-8">
                Get a clean, high-performance environment provisioned instantly with genuine cPanel &amp; high-speed NVMe storage.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
              <span className={order.setupMode === 'new' ? 'text-[#e8702a]' : 'text-white/40'}>
                {order.setupMode === 'new' ? 'Selected' : 'Select option'}
              </span>
              <CheckCircle2 size={18} className={order.setupMode === 'new' ? 'text-[#e8702a]' : 'text-white/20'} />
            </div>
          </div>

          {/* Option B: Migrate */}
          <div
            onClick={() => setSetupMode('migrate')}
            className={`relative p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              order.setupMode === 'migrate'
                ? 'bg-[#141418] border-[#e8702a] shadow-xl shadow-[#e8702a]/10 ring-1 ring-[#e8702a]/40'
                : 'bg-[#111115] border-white/5 hover:border-white/15 hover:bg-[#141418]'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#e8702a] block mb-2">Option B</span>
              <h3 className="text-xl font-bold text-white mb-3">Migrate Existing Hosting</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-8">
                Moving from another host? Our certified migration engineers handle everything for you at zero extra charge with no downtime.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
              <span className={order.setupMode === 'migrate' ? 'text-[#e8702a]' : 'text-white/40'}>
                {order.setupMode === 'migrate' ? 'Selected' : 'Select option'}
              </span>
              <CheckCircle2 size={18} className={order.setupMode === 'migrate' ? 'text-[#e8702a]' : 'text-white/20'} />
            </div>
          </div>

        </div>

        {/* Dynamic Details based on selection */}
        {order.setupMode === 'migrate' && (
          <div className="p-6 rounded-3xl bg-[#141419] border border-white/10 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e8702a]">
              <ShieldCheck size={16} /> Free Migration Concierge Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Current Website URL</label>
                <input
                  type="text"
                  placeholder="https://mycurrentsite.com"
                  value={order.migrationDetails.sourceUrl}
                  onChange={(e) => setMigrationDetails({ sourceUrl: e.target.value })}
                  className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e8702a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Current Host / Control Panel</label>
                <input
                  type="text"
                  placeholder="e.g. cPanel, Plesk, Bluehost"
                  value={order.migrationDetails.cpanelUser}
                  onChange={(e) => setMigrationDetails({ cpanelUser: e.target.value })}
                  className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e8702a] transition-colors"
                />
              </div>
            </div>
            <p className="text-[11px] text-white/40">
              * We will contact you securely after order completion to coordinate the migration. Your site remains online the entire time.
            </p>
          </div>
        )}

      </div>
    </OrderModalLayout>
  );
};
