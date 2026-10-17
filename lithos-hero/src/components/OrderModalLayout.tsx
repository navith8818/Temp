import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Check, ArrowLeft, ArrowRight,
  Layers
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';

interface OrderModalLayoutProps {
  children: React.ReactNode;
  currentStep: 'setup' | 'domain' | 'email' | 'backup' | 'review';
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  onBack?: () => void;
  skipAction?: {
    label: string;
    onClick: () => void;
  };
}

const STEPS = [
  { id: 'setup', label: 'Get started', path: '/order/setup' },
  { id: 'domain', label: 'Domain', path: '/order/domain' },
  { id: 'email', label: 'Email', path: '/order/email' },
  { id: 'backup', label: 'Auto backup', path: '/order/backup' },
  { id: 'review', label: 'Review', path: '/order/review' },
];

export const OrderModalLayout: React.FC<OrderModalLayoutProps> = ({
  children,
  currentStep,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  onBack,
  skipAction
}) => {
  const navigate = useNavigate();
  const { order } = useOrder();

  const currentIdx = STEPS.findIndex(s => s.id === currentStep);

  const handleStepClick = (stepIndex: number, path: string) => {
    // Only allow clicking steps up to current or visited
    if (stepIndex <= currentIdx) {
      navigate(path);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleDefaultBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (currentIdx > 0) {
      navigate(STEPS[currentIdx - 1].path);
    } else {
      navigate('/');
    }
  };

  const handleDefaultNext = () => {
    if (onNext) {
      onNext();
      return;
    }
    if (currentIdx < STEPS.length - 1) {
      navigate(STEPS[currentIdx + 1].path);
    } else {
      navigate('/order/checkout');
    }
  };

  // Calculate product counts for the bottom pill summary
  const productCount = 1 + order.domains.length + (order.selectedEmailPlan ? 1 : 0) + (order.includeAutoBackup ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Background ambient glow matching theme */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#e8702a]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-[1240px] h-[92vh] min-h-[640px] bg-[#0e0e11] border border-white/10 rounded-[28px] shadow-2xl flex flex-col overflow-hidden text-white font-sans">
        
        {/* Top Header */}
        <div className="h-16 px-8 border-b border-white/5 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e8702a] to-[#d2611f] flex items-center justify-center text-white shadow-lg shadow-[#e8702a]/20">
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">Server Salad</span>
              <span className="text-xs font-semibold text-[#e8702a] uppercase tracking-wider bg-[#e8702a]/10 px-2 py-0.5 rounded-full border border-[#e8702a]/20">
                Setup
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Left Stepper Sidebar + Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Vertical Stepper (matches the screenshots) */}
          <aside className="w-[280px] border-r border-white/5 p-8 flex flex-col justify-between flex-shrink-0 bg-[#0b0b0e]">
            <div>
              {/* Selected Hosting Product Header */}
              <div className="flex items-start gap-3 mb-10 pb-6 border-b border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#e8702a] flex-shrink-0 shadow-inner">
                  <Layers size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px] leading-tight">{order.plan.name}</h4>
                  <span className="text-xs text-white/40 block mt-0.5">{order.plan.tagline}</span>
                </div>
              </div>

              {/* Steps Vertical Timeline */}
              <div className="pl-1 space-y-0">
                {STEPS.map((step, idx) => {
                  const isCompleted = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  const isClickable = idx <= currentIdx;
                  const isLast = idx === STEPS.length - 1;

                  return (
                    <div 
                      key={step.id}
                      onClick={() => isClickable && handleStepClick(idx, step.path)}
                      className={`flex items-start gap-3.5 group ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'}`}
                    >
                      {/* Left Column: Circle Node + Dedicated Connector Segment */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        {/* Step Circle Node with Solid Opaque Background */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${
                          isCurrent 
                            ? 'bg-[#e8702a] text-white ring-4 ring-[#e8702a]/20 shadow-lg shadow-[#e8702a]/30 scale-105'
                            : isCompleted
                            ? 'bg-[#18110b] text-[#e8702a] border border-[#e8702a]/60 shadow-sm'
                            : 'bg-[#141418] text-white/40 border border-white/10'
                        }`}>
                          {isCompleted ? (
                            <Check size={14} className="stroke-[3]" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        {/* Connector line between this node and the next node - stops completely at node 5 */}
                        {!isLast && (
                          <div className={`w-[2px] h-7 my-1 rounded-full transition-colors duration-300 ${
                            idx < currentIdx ? 'bg-[#e8702a] shadow-[0_0_6px_rgba(232,112,42,0.4)]' : 'bg-white/10'
                          }`} />
                        )}
                      </div>

                      {/* Step Text Label */}
                      <div className="pt-1.5 flex flex-col">
                        <span className={`text-[14px] font-semibold transition-colors leading-tight ${
                          isCurrent 
                            ? 'text-white' 
                            : isCompleted 
                            ? 'text-white/80 group-hover:text-white' 
                            : 'text-white/40'
                        }`}>
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] text-[#e8702a] font-medium tracking-wide mt-1">In progress</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Note */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/50">
              <span className="text-white font-medium block mb-1">Need help setting up?</span>
              Our 24/7 technical team is available on live chat.
            </div>
          </aside>

          {/* Main Stage View */}
          <main className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12 relative flex flex-col justify-between">
            <div className="max-w-[740px] w-full mx-auto">
              {children}
            </div>

            {/* Bottom Spacer so content is not clipped by sticky footer */}
            <div className="h-6" />
          </main>
        </div>

        {/* Bottom Floating Bar */}
        <div className="h-20 px-8 border-t border-white/5 bg-[#09090c] flex items-center justify-between flex-shrink-0 z-30">
          
          {/* Left Back Arrow */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleDefaultBack}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Go back"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Product count tag and item pills with unified theme color */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs font-semibold text-white/80">
                {productCount} items configured:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/5 text-white/90 border border-white/10 px-2.5 py-0.5 rounded-full">
                  1 {order.plan.name}
                </span>
                {order.domains.map((d, i) => (
                  <span key={i} className="text-[11px] font-semibold uppercase tracking-wider bg-white/5 text-white/90 border border-white/10 px-2.5 py-0.5 rounded-full">
                    {d.name}
                  </span>
                ))}
                {order.selectedEmailPlan && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/5 text-white/90 border border-white/10 px-2.5 py-0.5 rounded-full">
                    1 {order.selectedEmailPlan.name}
                  </span>
                )}
                {order.includeAutoBackup && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/5 text-white/90 border border-white/10 px-2.5 py-0.5 rounded-full">
                    Auto-Backup
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Actions: Optional Skip Action + Primary Action */}
          <div className="flex items-center gap-4">
            {skipAction && (
              <button
                onClick={skipAction.onClick}
                className="text-xs font-semibold text-white/60 hover:text-white transition-colors px-3 py-2 cursor-pointer"
              >
                {skipAction.label}
              </button>
            )}

            <button
              onClick={handleDefaultNext}
              disabled={nextDisabled}
              className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                nextDisabled
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-lg shadow-[#e8702a]/25 hover:scale-[1.02] active:scale-95'
              }`}
            >
              <span>{nextLabel}</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
