import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, CreditCard, Lock,
  Info, ArrowRight, Loader2
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { 
    order, applyPromoCode, removePromoCode, updateInvoiceDetails, 
    completeOrder 
  } = useOrder();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const acceptedTerms = true;

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 8920 1204 8821');
  const [cardHolder, setCardHolder] = useState('Alex Jayawardena');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [saveCard, setSaveCard] = useState(true);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const parts = val.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(val);
  };

  // Calculations
  const baseMonthly = order.plan.priceMonthlyLkr;
  const domainCharges = order.domains.reduce((sum, d) => sum + d.priceLkr, 0);
  const discountAmount = Math.round((baseMonthly * order.discountPercentage) / 100);
  
  // If plan is trial, initial charge is 0
  const initialTotalLkr = order.plan.trial ? 0 : Math.max(0, baseMonthly - discountAmount + domainCharges);
  const renewalTotalLkr = baseMonthly + domainCharges;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    const ok = applyPromoCode(promoInput);
    if (ok) {
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon. Try SALAD50 or COMMUNITY');
    }
  };

  const handlePayNow = () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
    setIsSubmitting(true);
    completeOrder();

    // Smooth transition to processing state after 1.2s
    setTimeout(() => {
      navigate('/order/processing');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Keyframe animations for gentle floating spheres */}
      <style>{`
        @keyframes checkout-float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes checkout-float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(8px) translateX(-5px); }
        }
        .animate-float-sphere-1 {
          animation: checkout-float-1 6s ease-in-out infinite;
        }
        .animate-float-sphere-2 {
          animation: checkout-float-2 7.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#e8702a]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container: Split Stage */}
      <div className="relative w-full max-w-[1280px] h-[92vh] min-h-[660px] bg-[#0c0c0f] border border-white/10 rounded-[28px] shadow-2xl flex overflow-hidden text-white font-sans">
        
        {/* Left Side: Brand Atmosphere Stage */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden bg-gradient-to-b from-[#0e0e13] to-[#070709] border-r border-white/5 text-center">
          
          {/* Top Logo */}
          <div className="absolute top-8 left-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#e8702a] flex items-center justify-center text-white shadow-lg shadow-[#e8702a]/30">
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Server Salad</span>
          </div>

          {/* Central 2 Floating Brand Spheres */}
          <div className="relative mb-8 flex items-center justify-center w-56 h-56">
            {/* Primary Sphere */}
            <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-[#180e07] via-[#26150b] to-[#0d0d12] shadow-2xl shadow-[#e8702a]/20 border border-[#e8702a]/30 relative flex items-center justify-center animate-float-sphere-1">
              <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#e8702a]/35 via-[#e8702a]/10 to-transparent blur-lg" />
              {/* Subtle specular reflection */}
              <div className="absolute top-4 left-6 w-12 h-6 rounded-full bg-white/10 blur-[3px] transform -rotate-12" />
            </div>

            {/* Secondary Overlapping Floating Sphere */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#e8702a]/35 via-[#1d1008]/85 to-[#0e0e14]/95 backdrop-blur-md absolute -top-2 left-6 border border-[#e8702a]/40 shadow-xl shadow-[#e8702a]/20 animate-float-sphere-2 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#e8702a]/25 blur-md" />
            </div>
          </div>

          <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Almost done!
          </h3>
          <p className="text-sm text-white/50 max-w-sm leading-relaxed">
            Configure your payment method on the right to complete setup and trigger instant automated provisioning.
          </p>

          <div className="absolute bottom-8 left-8 right-8 text-center text-xs text-white/30 flex items-center justify-center gap-2">
            <Lock size={12} className="text-[#e8702a]/60" />
            <span>256-bit SSL encrypted PCI-DSS compliant checkout</span>
          </div>
        </div>

        {/* Right Side: Checkout Drawer */}
        <div className="w-full lg:w-[480px] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-[#101014] relative z-20">
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Checkout</h2>
              <button
                onClick={() => navigate('/order/review')}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items Summary Row */}
            <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">
                  {1 + order.domains.length + (order.selectedEmailPlan ? 1 : 0)} items in order
                </span>
                <span className="text-lg font-extrabold text-white">
                  LKR {initialTotalLkr.toLocaleString()}
                </span>
              </div>

              {/* Unified Brand Tag Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase bg-[#e8702a]/15 text-[#e8702a] border border-[#e8702a]/30 px-2.5 py-0.5 rounded-full tracking-wider">
                  {order.plan.name} Trial
                </span>
                {order.selectedEmailPlan && (
                  <span className="text-[10px] font-bold uppercase bg-[#e8702a]/15 text-[#e8702a] border border-[#e8702a]/30 px-2.5 py-0.5 rounded-full tracking-wider">
                    Spacemail Trial
                  </span>
                )}
                {order.includeAutoBackup && (
                  <span className="text-[10px] font-bold uppercase bg-[#e8702a]/15 text-[#e8702a] border border-[#e8702a]/30 px-2.5 py-0.5 rounded-full tracking-wider">
                    AutoBackup Free
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                <span>Renewal price after trial:</span>
                <span className="font-semibold text-white/70">LKR {renewalTotalLkr.toLocaleString()}/mo</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/70">Payment method</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e8702a]/10 text-[#e8702a] border border-[#e8702a]/20 px-2 py-0.5 rounded-full">
                  Required
                </span>
              </div>

              {/* Payment Method Details Card */}
              <div className="bg-[#15151a] border border-white/10 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={18} className="text-[#e8702a]" />
                    <span className="text-xs font-bold text-white">Credit / Debit Card</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/50">
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">VISA</span>
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">MC</span>
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">AMEX</span>
                  </div>
                </div>

                {/* Card Input Fields */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  {/* Card Number */}
                  <div>
                    <label className="text-[11px] font-semibold text-white/50 block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 0000 0000 0000"
                        className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors tracking-wider"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                        <Lock size={12} className="text-[#e8702a]/60" />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-white/50 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on card"
                      className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors"
                    />
                  </div>

                  {/* Expiry & CVC Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-white/50 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-white/50 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={handleCvcChange}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-[#0a0a0e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#e8702a] transition-colors tracking-widest"
                      />
                    </div>
                  </div>

                  {/* Save Card Checkbox */}
                  <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-[#0a0a0e] border-white/20 text-[#e8702a] focus:ring-[#e8702a] accent-[#e8702a]"
                    />
                    <span className="text-[11px] text-white/50">Save card securely for future renewals</span>
                  </label>
                </div>
              </div>

              <p className="text-[11px] text-white/40 flex items-start gap-1.5 leading-snug">
                <Info size={13} className="text-[#e8702a] flex-shrink-0 mt-0.5" />
                <span>To verify your payment method, a temporary pre-auth of $0.05 will be held and instantly released.</span>
              </p>
            </div>

            {/* Invoice Details Accordion */}
            <div className="mb-6">
              <div 
                onClick={() => setShowInvoiceModal(!showInvoiceModal)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Invoice Details:</span>
                  <span className="text-white/60 truncate max-w-[180px]">{order.invoiceDetails.fullName}</span>
                </div>
                <span className="text-[11px] text-[#e8702a] font-bold">Edit</span>
              </div>

              {showInvoiceModal && (
                <div className="mt-3 p-4 rounded-2xl bg-[#141419] border border-white/10 space-y-3 animate-fadeIn text-xs">
                  <div>
                    <label className="text-white/50 block mb-1">Billing Name</label>
                    <input
                      type="text"
                      value={order.invoiceDetails.fullName}
                      onChange={(e) => updateInvoiceDetails({ fullName: e.target.value })}
                      className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-white/50 block mb-1">Billing Email</label>
                      <input
                        type="email"
                        value={order.invoiceDetails.email}
                        onChange={(e) => updateInvoiceDetails({ email: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 block mb-1">Country</label>
                      <input
                        type="text"
                        value={order.invoiceDetails.country}
                        onChange={(e) => updateInvoiceDetails({ country: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trial Terms & Conditions Box */}
            <div className="p-4 rounded-2xl bg-[#e8702a]/5 border border-[#e8702a]/20 text-xs text-white/70 space-y-2 mb-6">
              <div className="flex items-center gap-2 font-bold text-[#e8702a]">
                <Info size={14} className="text-[#e8702a]" /> Trial terms &amp; conditions
              </div>
              <p className="text-[11px] leading-relaxed text-white/60">
                A trial entitles you to full access to these products without upfront charge. After the trial period, you will automatically start a standard billing cycle for your server. Cancel anytime in 1 click.
              </p>
            </div>

            {/* Promo Code Expandable */}
            <div className="mb-6">
              {order.promoCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#e8702a]/10 border border-[#e8702a]/30 text-xs">
                  <span className="font-bold text-[#e8702a]">Coupon '{order.promoCode}' Applied (-{order.discountPercentage}%)</span>
                  <button onClick={removePromoCode} className="text-white/40 hover:text-white">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Have a promo code? (e.g. SALAD50)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-[#15151a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#e8702a]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-[#e8702a] mt-1">{promoError}</p>}
            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-white/70">Total Due Today:</span>
              <span className="text-2xl font-extrabold text-white">
                LKR {initialTotalLkr.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handlePayNow}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#e8702a] hover:bg-[#d2611f] text-white font-bold text-sm shadow-lg shadow-[#e8702a]/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing secure order...</span>
                </>
              ) : (
                <>
                  <span>Pay Now &amp; Activate</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/order/review')}
              className="w-full text-xs font-semibold text-white/40 hover:text-white transition-colors cursor-pointer text-center"
            >
              Cancel and return to review
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
