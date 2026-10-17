import React, { useState } from 'react';
import { 
  Globe, Plus, Trash2, AlertCircle
} from 'lucide-react';
import { useOrder, type DomainItem } from '../../context/OrderContext';
import { OrderModalLayout } from '../../components/OrderModalLayout';

export const DomainConfig: React.FC = () => {
  const { order, addDomain, removeDomain, clearDomains } = useOrder();
  const [showAddForm, setShowAddForm] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [domainType, setDomainType] = useState<'external' | 'registered'>('external');
  const [error, setError] = useState('');

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const clean = domainInput.trim().toLowerCase().replace(/^(https?:\/\/)/, '').replace(/\/.*$/, '');
    
    if (!clean) {
      setError('Please enter a valid domain name.');
      return;
    }

    if (!clean.includes('.') || clean.length < 4) {
      setError('Domain must include a valid extension (e.g. .com, .lk, .net)');
      return;
    }

    if (order.domains.some(d => d.name === clean)) {
      setError('This domain is already added to your order.');
      return;
    }

    if (order.domains.length >= order.plan.domainsAllowed) {
      setError(`Your current plan allows up to ${order.plan.domainsAllowed} domains. Upgrade to add more.`);
      return;
    }

    const newDomain: DomainItem = {
      name: clean,
      type: domainType,
      priceLkr: domainType === 'registered' ? 3850 : 0,
      status: 'valid'
    };

    addDomain(newDomain);
    setDomainInput('');
    setShowAddForm(false);
  };

  const slotsAvailable = order.plan.domainsAllowed - order.domains.length;

  return (
    <OrderModalLayout 
      currentStep="domain"
      nextDisabled={order.domains.length === 0}
    >
      <div className="space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e8702a]">Domain</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-3">
            Connect domains to {order.plan.name}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-xl">
            Select a Server Salad domain, purchase a new one, or connect a domain registered with an external provider.
          </p>
        </div>

        {/* Domain Selection Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white/80">Select domains:</span>
            {order.domains.length > 0 && (
              <button
                onClick={clearDomains}
                className="text-xs font-medium text-white/50 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear domains
              </button>
            )}
          </div>

          {/* List of configured domains */}
          <div className="space-y-3">
            {order.domains.map((dom, idx) => (
              <div
                key={idx}
                className="bg-[#121217] border border-white/10 hover:border-white/20 rounded-2xl p-4.5 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                    <Globe size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{dom.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70 px-2 py-0.5 rounded-md">
                        {dom.type === 'external' ? 'External' : 'New Registration'}
                      </span>
                    </div>
                    <span className="text-xs text-white/40 block mt-0.5">
                      {dom.type === 'external' 
                        ? 'Point DNS nameservers to Server Salad (ns1.serversalad.com)' 
                        : 'LKR 3,850/yr renewal'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => removeDomain(dom.name)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove domain"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {order.domains.length === 0 && (
              <div className="p-8 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
                <Globe size={32} className="mx-auto text-white/20 mb-3" />
                <p className="text-sm font-semibold text-white/70">No domain selected yet</p>
                <p className="text-xs text-white/40 mt-1">You must connect at least 1 domain to proceed with your hosting plan.</p>
              </div>
            )}
          </div>

          {/* Add Domain Trigger / Form */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              disabled={slotsAvailable <= 0}
              className="w-full py-4 rounded-2xl border border-dashed border-white/20 hover:border-[#e8702a]/60 bg-white/[0.02] hover:bg-[#e8702a]/5 text-sm font-semibold text-white/80 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={18} className="text-[#e8702a]" />
              <span>Add domain</span>
            </button>
          ) : (
            <form onSubmit={handleAddDomain} className="p-5 rounded-2xl bg-[#141419] border border-white/15 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-white">Add New Domain</span>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="text-xs text-white/40 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-[#0b0b0e] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDomainType('external')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    domainType === 'external' ? 'bg-[#e8702a] text-white shadow' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Existing / External Domain (Free)
                </button>
                <button
                  type="button"
                  onClick={() => setDomainType('registered')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    domainType === 'registered' ? 'bg-[#e8702a] text-white shadow' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Register New (+LKR 3,850/yr)
                </button>
              </div>

              {/* Input */}
              <div>
                <input
                  type="text"
                  placeholder={domainType === 'external' ? 'e.g. mycompany.com' : 'e.g. newstartupsrilanka.com'}
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e8702a] transition-colors"
                />
                {error && (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
                    <AlertCircle size={14} /> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#e8702a] hover:bg-[#d2611f] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Confirm &amp; Add Domain
              </button>
            </form>
          )}

          {/* Slots Status Footnote */}
          <div className="pt-2 flex items-center justify-between text-xs text-white/40">
            <span>
              {slotsAvailable} {slotsAvailable === 1 ? 'slot' : 'slots'} available on this plan.
            </span>
            <span className="text-[#e8702a] hover:underline cursor-pointer">
              Upgrade plan for unlimited slots
            </span>
          </div>

        </div>

      </div>
    </OrderModalLayout>
  );
};
