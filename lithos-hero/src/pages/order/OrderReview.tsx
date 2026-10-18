import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Mail, Layers, Database,
  Edit2, Lock
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { OrderModalLayout } from '../../components/OrderModalLayout';

export const OrderReview: React.FC = () => {
  const navigate = useNavigate();
  const { order } = useOrder();

  const primaryDomain = order.domains[0]?.name || 'nodegen.com';

  return (
    <OrderModalLayout 
      currentStep="review"
      nextLabel="Proceed to Checkout"
      onNext={() => navigate('/order/checkout')}
    >
      <div className="space-y-8">
        
        {/* Header (matches Screenshot 3: "Ready to Unbox™?") */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e8702a]">Review</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-3">
            Ready to deploy your service?
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl">
            Review the connected products and domain associations below. Once confirmed, proceed to final checkout and instant provisioning.
          </p>
        </div>

        {/* Association Tree Card (matches Screenshot 3 structure) */}
        <div className="bg-[#121217] border border-white/10 rounded-3xl p-7 relative overflow-hidden">
          
          {/* Root Domain Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#e8702a]/10 border border-[#e8702a]/20 flex items-center justify-center text-[#e8702a]">
                <Globe size={20} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">Target Domain</span>
                <span className="text-xl font-bold text-white">{primaryDomain}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/order/domain')}
              className="text-xs font-semibold text-white/50 hover:text-[#e8702a] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit2 size={13} />
              <span>Change</span>
            </button>
          </div>

          {/* Connected Children Items */}
          <div className="pt-6 space-y-4 relative z-10">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest block mb-4">
              To be connected to:
            </span>

            {/* Hosting Product */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 text-[#e8702a] flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{order.plan.name}</span>
                    <span className="text-xs text-white/50">({order.plan.tagline})</span>
                    {order.plan.trial && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e8702a]/15 text-[#e8702a] border border-[#e8702a]/30 px-2 py-0.2 rounded-full">
                        Trial
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/40">{order.plan.cpu} · {order.plan.storage}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-white">LKR {order.plan.priceMonthlyLkr}/mo</span>
            </div>

            {/* SSL Certificate Included */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 text-[#e8702a] flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Secured by SSL</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/10 px-2 py-0.2 rounded-full">
                      Free Lifetime
                    </span>
                  </div>
                  <span className="text-xs text-white/40">Automated Let's Encrypt Wildcard certificate</span>
                </div>
              </div>
              <span className="text-xs font-bold text-white/80">Included</span>
            </div>

            {/* Email Product if selected */}
            {order.selectedEmailPlan && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 text-[#e8702a] flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{order.selectedEmailPlan.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e8702a]/15 text-[#e8702a] border border-[#e8702a]/30 px-2 py-0.2 rounded-full">
                        30-Day Trial
                      </span>
                    </div>
                    <span className="text-xs text-white/40">5 GB Cloud Storage · 10 Aliases</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white">$0.00</span>
                  <span className="text-[10px] text-white/40 block">$11.76/yr after</span>
                </div>
              </div>
            )}

            {/* Auto-Backup if selected */}
            {order.includeAutoBackup && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 text-[#e8702a] flex items-center justify-center">
                    <Database size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Daily AutoBackup</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/10 px-2 py-0.2 rounded-full">
                        Included
                      </span>
                    </div>
                    <span className="text-xs text-white/40">7-Day Snapshot Offsite Retention</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-white/80">LKR 0</span>
              </div>
            )}

          </div>

        </div>

        {/* Pricing Subtotal Footnote */}
        <div className="p-5 rounded-2xl bg-[#09090c] border border-white/5 flex items-center justify-between text-xs text-white/60">
          <span>Initial charge today:</span>
          <span className="text-base font-extrabold text-white">
            {order.plan.trial ? 'LKR 0 (Free Trial)' : `LKR ${order.plan.priceMonthlyLkr}`}
          </span>
        </div>

      </div>
    </OrderModalLayout>
  );
};
