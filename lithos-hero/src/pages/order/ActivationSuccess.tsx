import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Globe, ArrowRight, 
  Copy, Check
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

export const ActivationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { order, resetOrder } = useOrder();
  const [copied, setCopied] = React.useState(false);

  const primaryDomain = order.domains[0]?.name || 'nodegen.com';

  const handleCopy = () => {
    navigator.clipboard.writeText('ns1.serversalad.com\nns2.serversalad.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    resetOrder();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 text-white font-sans overflow-y-auto">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#e8702a]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#e8702a]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-[700px] bg-[#0e0e13] border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-2xl space-y-8 my-auto">
        
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#e8702a]/15 border border-[#e8702a]/30 text-[#e8702a] flex items-center justify-center mx-auto shadow-xl shadow-[#e8702a]/20">
            <CheckCircle2 size={36} className="stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e8702a]">
            Provisioning Complete
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Service is Officially Active!
          </h2>
          <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
            Your {order.plan.name} container has been provisioned and linked to {primaryDomain}.
          </p>
        </div>

        {/* Credentials / Service Spec Card */}
        <div className="bg-[#14141a] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <span className="text-[11px] text-white/40 font-bold uppercase tracking-wider block">Service</span>
              <span className="text-base font-bold text-white">{order.plan.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-white/40 font-bold uppercase tracking-wider block">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e8702a] bg-[#e8702a]/10 px-2.5 py-0.5 rounded-full border border-[#e8702a]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a] animate-pulse" />
                Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-white/40 block mb-1">Primary Domain</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Globe size={14} className="text-[#e8702a]" />
                {primaryDomain}
              </span>
            </div>
            <div>
              <span className="text-white/40 block mb-1">Data Centre</span>
              <span className="font-bold text-white">London (LD4 Enterprise)</span>
            </div>
          </div>

          {/* DNS Nameservers to point */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-white/40 block text-[10px] uppercase font-bold">Point your domain DNS to:</span>
              <span className="font-mono text-white text-xs font-semibold">ns1.serversalad.com / ns2.serversalad.com</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-[#e8702a] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-full bg-[#e8702a] hover:bg-[#d2611f] text-white font-bold text-sm shadow-lg shadow-[#e8702a]/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
          >
            <span>Return to Server Salad Home</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
};
