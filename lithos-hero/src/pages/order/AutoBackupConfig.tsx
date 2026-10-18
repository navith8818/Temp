import React from 'react';
import { Database, ShieldCheck, Check, Clock, RefreshCw } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { OrderModalLayout } from '../../components/OrderModalLayout';

export const AutoBackupConfig: React.FC = () => {
  const { order, toggleAutoBackup } = useOrder();

  return (
    <OrderModalLayout 
      currentStep="backup"
      skipAction={{
        label: order.includeAutoBackup ? "Disable Auto-Backup" : "Skip backup",
        onClick: () => {
          if (order.includeAutoBackup) toggleAutoBackup();
        }
      }}
    >
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e8702a]">Protection</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-3">
            Automated Cloud Backups
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl">
            Never risk losing your codebase or database. Daily snapshot retention stored safely offsite in London with 1-click restore.
          </p>
        </div>

        {/* Feature Card */}
        <div 
          onClick={toggleAutoBackup}
          className={`p-7 rounded-3xl border transition-all cursor-pointer relative ${
            order.includeAutoBackup
              ? 'bg-[#141418] border-[#e8702a]'
              : 'bg-[#111115] border-white/5 hover:border-white/15'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e8702a]/10 border border-[#e8702a]/30 flex items-center justify-center text-[#e8702a]">
                <Database size={18} />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Daily AutoBackup Suite</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#e8702a]/15 text-[#e8702a] border border-[#e8702a]/30 px-2 py-0.5 rounded-full">
                  Included
                </span>
              </div>
            </div>

            {order.includeAutoBackup && (
              <span className="text-xs font-bold text-[#e8702a] flex items-center gap-1.5 bg-[#e8702a]/10 px-3 py-1 rounded-full border border-[#e8702a]/20">
                <Check size={14} className="stroke-[3]" /> Enabled
              </span>
            )}
          </div>

          <ul className="space-y-2 text-xs text-white/70 mb-6 pl-1">
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-[#e8702a]" />
              Automated daily incremental snapshots (7-day rolling retention)
            </li>
            <li className="flex items-center gap-2">
              <RefreshCw size={14} className="text-[#e8702a]" />
              Instant 1-click full site and MySQL database rollback
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#e8702a]" />
              Offsite immutable storage protected from ransomware
            </li>
          </ul>

          <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white">LKR 0</span>
                <span className="text-xs text-white/50 font-medium">/month</span>
              </div>
              <span className="text-[11px] text-white/40 block mt-0.5">
                Included at no cost with your {order.plan.name} package
              </span>
            </div>

            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                order.includeAutoBackup
                  ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30' 
                  : 'bg-[#e8702a] text-white hover:bg-[#d2611f]'
              }`}
            >
              {order.includeAutoBackup ? 'Disable' : 'Enable Backup'}
            </button>
          </div>
        </div>

      </div>
    </OrderModalLayout>
  );
};
