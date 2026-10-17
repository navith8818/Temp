import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Server } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

const TIMELINE_STEPS = [
  { id: 1, label: 'Order confirmed & invoice generated' },
  { id: 2, label: 'Payment authorization verified' },
  { id: 3, label: 'Provisioning NVMe cloud storage container' },
  { id: 4, label: 'Configuring cPanel & WHM control environment' },
  { id: 5, label: 'Issuing Let\'s Encrypt wildcard SSL certificate' },
  { id: 6, label: 'Hosting service activated & live' },
];

export const Provisioning: React.FC = () => {
  const navigate = useNavigate();
  const { order } = useOrder();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    // Progressively complete steps
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < TIMELINE_STEPS.length) {
          setCompletedSteps(c => [...c, prev]);
          return prev + 1;
        } else {
          clearInterval(interval);
          setCompletedSteps(c => [...c, prev]);
          setTimeout(() => {
            navigate('/order/success');
          }, 1000);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 text-white font-sans">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#e8702a]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[#e8702a]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative w-full max-w-[620px] bg-[#0f0f14] border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#e8702a]/15 border border-[#e8702a]/30 text-[#e8702a] flex items-center justify-center mx-auto shadow-lg shadow-[#e8702a]/20">
            <Server size={30} className="animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Provisioning Your Infrastructure
          </h2>
          <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
            Please wait while our automated deployment engine provisions your server container in our London enterprise data centre.
          </p>
        </div>

        {/* Status Timeline */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          {TIMELINE_STEPS.map((step) => {
            const isDone = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id && !isDone;

            return (
              <div key={step.id} className="flex items-center gap-3.5 transition-all">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 size={20} className="text-[#e8702a]" />
                  ) : isCurrent ? (
                    <Loader2 size={18} className="text-[#e8702a] animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  )}
                </div>
                <span className={`text-xs font-semibold ${
                  isDone 
                    ? 'text-white' 
                    : isCurrent 
                    ? 'text-[#e8702a]' 
                    : 'text-white/30'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="text-center">
          <span className="text-[11px] text-white/40">
            Target Domain: <span className="font-bold text-white">{order.domains[0]?.name || 'nodegen.com'}</span> · Package: <span className="font-bold text-white">{order.plan.name}</span>
          </span>
        </div>

      </div>

    </div>
  );
};
