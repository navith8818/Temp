import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, ChevronDown, Search, Zap, CreditCard, MessageCircle, 
  Globe, Cpu, Cloud, Shield,
  Gamepad2, Database, ShoppingCart, DollarSign, Video,
  GraduationCap, Store, Server, Smartphone, FileText, 
  Code, PenTool, MessageSquare, Briefcase, BarChart, 
  Calendar, Wrench, RefreshCw, ArrowRight, CheckCircle2, Rocket, HelpCircle,
  Plus, Minus
} from 'lucide-react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useOrder } from './context/OrderContext';
import baseImage from './assets/Base_Image.jpeg';
import revealImage from './assets/Reveal_Image.jpeg';
import worldMapSvg from './assets/World_map_blank_without_borders.svg';

const BG_IMAGE_1 = baseImage;
const BG_IMAGE_2 = revealImage;
const SPOTLIGHT_R = 260;

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const isHovered = cursorX !== -999 && cursorY !== -999;
  const maskStyle = isHovered
    ? `radial-gradient(circle ${SPOTLIGHT_R}px at ${cursorX}px ${cursorY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 70%, transparent 100%)`
    : 'none';

  return (
    <div
      className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none transition-opacity duration-150"
      style={{
        backgroundImage: `url(${image})`,
        maskImage: maskStyle,
        WebkitMaskImage: maskStyle,
        opacity: isHovered ? 1 : 0,
      }}
    />
  );
}

function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsInView(true);
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

function FeaturesSection() {
  const { ref, isInView } = useInView();
  
  const features = [
    {
      num: "01",
      tag: "24/7 SUPPORT",
      pillIcon: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />,
      bgImage: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=400",
      title: "Free 24/7 Expert Support",
      desc: "Get free 24/7 technical support via ticket, email, phone, WhatsApp and live chat, included with every plan. Never pay extra for the guidance you need.",
      widget: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-gray-200/90 shadow-sm w-full max-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-[#e8702a] text-[10px] text-white font-bold flex items-center justify-center border-2 border-white">S1</div>
              <div className="w-6 h-6 rounded-full bg-gray-800 text-[10px] text-white font-bold flex items-center justify-center border-2 border-white">S2</div>
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-[10px] text-white font-bold flex items-center justify-center border-2 border-white">S3</div>
            </div>
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Avg &lt; 2m reply
            </span>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-[11px] text-gray-700 leading-snug border border-gray-100 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
            <span className="truncate font-medium">Engineer assigned to your ticket</span>
          </div>
        </div>
      )
    },
    {
      num: "02",
      tag: "WEEKLY LABS",
      pillIcon: <span className="w-2 h-2 rounded-full bg-[#e8702a] inline-block" />,
      bgImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400",
      title: "Saturday Live Help Sessions",
      desc: "Book a spot in our weekly Saturday live sessions for interactive setup assistance and real-time troubleshooting with our support team.",
      widget: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-gray-200/90 shadow-sm w-full max-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
              Every Saturday
            </span>
            <span className="text-[10px] font-semibold text-[#e8702a] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a] animate-ping" />
              10:00 AM
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-600 bg-orange-50/60 rounded-xl p-2 border border-orange-100/80">
            <span className="font-semibold text-gray-900">Live 1-on-1 Q&A</span>
            <span className="text-[10px] text-[#e8702a] font-bold bg-white px-2 py-0.5 rounded shadow-2xs">Free Access</span>
          </div>
        </div>
      )
    },
    {
      num: "03",
      tag: "COMPLIANCE",
      pillIcon: <CheckCircle2 size={12} className="text-emerald-500 inline-block" />,
      bgImage: "https://images.unsplash.com/photo-1555949963-aa79dcee57d5?auto=format&fit=crop&q=80&w=400",
      title: "100% Licensed Software",
      desc: "Zero nulled or grey-market tools. Every control panel, security tool, and management utility runs on 100% genuine software licences.",
      widget: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-gray-200/90 shadow-sm w-full max-w-[240px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={12} />
            </div>
            <span className="text-[11px] font-bold text-gray-900">Authentic Software Seal</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
            <span className="text-emerald-600 font-bold">VERIFIED:</span>
            <span>LIC-2026-cPanel-OK</span>
          </div>
        </div>
      )
    },
    {
      num: "04",
      tag: "COMMUNITY",
      pillIcon: <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />,
      bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400",
      title: "Creator & Community Perks",
      desc: "Unlock exclusive hosting discounts for Sri Lankan students and academic clubs, new startups, and web agencies and freelancers.",
      widget: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-gray-200/90 shadow-sm w-full max-w-[240px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Special Grant
            </span>
            <span className="text-[11px] font-black text-[#e8702a]">Up to 70% Off</span>
          </div>
          <p className="text-[10px] text-gray-500 font-medium truncate">Students · Startups · Dev Agencies</p>
        </div>
      )
    },
    {
      num: "05",
      tag: "ACTIVE SHIELD",
      pillIcon: <Shield size={12} className="text-[#e8702a] inline-block" />,
      bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400",
      title: "Advanced cPGuard Security",
      desc: "Keep your site safe with automated malware scanning, real-time threat isolation, and automated malware removal at no additional cost.",
      widget: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-gray-200/90 shadow-sm w-full max-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-bold text-gray-900 uppercase">WAF Active</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">0 Threats</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-full" />
          </div>
        </div>
      )
    },
    {
      num: "06",
      tag: "GLOBAL ROUTING",
      pillIcon: <Globe size={12} className="text-blue-500 inline-block" />,
      bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400",
      title: "Local Care, European Power",
      desc: "Experience dedicated 24/7 local support backed by high-speed enterprise data centres in London for reliable uptime and fast performance.",
      widget: (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-gray-200/90 shadow-sm w-full max-w-[240px]">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-900 mb-1.5">
            <span className="flex items-center gap-1">🇬🇧 London</span>
            <span className="text-gray-400 font-mono text-[10px]">⟷</span>
            <span className="flex items-center gap-1">🇱🇰 Colombo</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-500 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
            <span>Enterprise SLA</span>
            <span className="font-semibold text-blue-600">99.99% Uptime</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section ref={ref} className="bg-[#fafafa] py-28 sm:py-36 relative overflow-hidden border-t border-gray-200/80">
      {/* Background ambient decorative grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#e8702a]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`max-w-3xl mb-20 scroll-hidden ${isInView ? 'scroll-visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8702a]/10 border border-[#e8702a]/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8702a]" />
            <span className="text-[#e8702a] font-semibold tracking-wider uppercase text-xs">Features & Infrastructure</span>
          </div>
          <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Why Choose <span className="font-playfair italic text-[#e8702a]">Server Salad</span> for High-Performance Hosting?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div 
              key={i} 
              className={`relative overflow-hidden rounded-[32px] p-8 sm:p-9 min-h-[380px] bg-gradient-to-b from-white via-white/95 to-[#f8f9fb] border border-gray-200/80 hover:border-[#e8702a]/40 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-all duration-500 scroll-hidden flex flex-col justify-between text-left group ${isInView ? 'scroll-visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#e8702a] transition-all duration-500" />

              {/* Blended Background Image - Bottom Right */}
              <div 
                className="absolute -bottom-8 -right-8 w-56 h-56 opacity-10 mix-blend-multiply group-hover:scale-110 group-hover:opacity-20 transition-all duration-700 pointer-events-none"
                style={{ 
                  backgroundImage: `url('${f.bgImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
                  WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)'
                }}
              />

              {/* Top Card Section: Eyebrow + Monospace Number */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200/80 text-[10px] font-bold tracking-wider uppercase text-gray-700 shadow-2xs group-hover:border-[#e8702a]/30 transition-colors">
                    {f.pillIcon}
                    {f.tag}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-[#e8702a] transition-colors">
                    {f.num}
                  </span>
                </div>

                {/* Title & Description: Top Left Aligned */}
                <h4 className="text-xl sm:text-[22px] font-bold text-gray-900 mb-3 tracking-tight leading-snug group-hover:text-black transition-colors">
                  {f.title}
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {f.desc}
                </p>
              </div>

              {/* Bottom Card Section: Interactive Micro-Widget + Hover link */}
              <div className="relative z-10 pt-4 flex flex-col gap-4">
                <div className="flex justify-end transform group-hover:scale-[1.03] group-hover:-translate-y-1 transition-transform duration-500">
                  {f.widget}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs font-semibold text-gray-400 group-hover:text-[#e8702a] transition-colors">
                  <span className="flex items-center gap-1.5">
                    <span>Learn more</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#e8702a] transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { ref, isInView } = useInView();
  const navigate = useNavigate();
  const { selectPlan } = useOrder();

  const handleChoosePlan = (planId: string) => {
    selectPlan(planId);
    navigate('/order/setup');
  };

  return (
    <section ref={ref} className="bg-[#0a0a0a] py-24 sm:py-32 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-20 scroll-hidden ${isInView ? 'scroll-visible' : ''}`}>
          <h2 className="text-[#e8702a] font-semibold tracking-wide uppercase text-sm mb-4">Pricing</h2>
          <h3 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Simple, Transparent Pricing
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Web Hosting */}
          <div className={`bg-[#111111] border border-white/10 rounded-[32px] p-10 hover:border-white/20 transition-colors duration-300 scroll-hidden ${isInView ? 'scroll-visible' : ''}`}>
            <h4 className="text-2xl font-bold text-white mb-2">Web Hosting</h4>
            <p className="text-white/50 text-sm mb-8">Perfect for personal sites and small businesses.</p>
            <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-white/10">
              <span className="text-5xl font-bold text-white">LKR 458</span>
              <span className="text-white/50">/month</span>
            </div>
            
            <ul className="space-y-4 mb-10">
              {['Fully optimised for WordPress', '2x CPU Performance', '50 GB SSD Cloud storage', 'Unlimited hosted domains', 'Unlimited websites', 'Secured by SSL', '5 mailboxes per domain free for 1 year'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                  <CheckCircle2 size={18} className="text-[#e8702a] flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleChoosePlan('web')}
              className="w-full py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* VPS Hosting */}
          <div className={`bg-gradient-to-b from-[#1a1310] to-[#111111] border border-[#e8702a]/30 rounded-[32px] p-10 relative scroll-hidden ${isInView ? 'scroll-visible' : ''}`} style={{ transitionDelay: '150ms' }}>
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#e8702a] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">VPS Hosting</h4>
            <p className="text-white/50 text-sm mb-8">Dedicated resources for growing applications.</p>
            <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-white/10">
              <span className="text-5xl font-bold text-white">LKR 2,450</span>
              <span className="text-white/50">/month</span>
            </div>
            
            <ul className="space-y-4 mb-10">
              {['Dedicated IP Address', '4x Dedicated vCPU', '100 GB NVMe Storage', 'Unlimited Bandwidth', 'Root Access Included', 'Advanced cPGuard Security', 'Free Weekly Backups'].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                  <CheckCircle2 size={18} className="text-[#e8702a] flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleChoosePlan('vps')}
              className="w-full py-4 rounded-full bg-[#e8702a] hover:bg-[#d2611f] text-white font-semibold transition-all hover:-translate-y-0.5 hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              Deploy Server
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  const { ref, isInView } = useInView();
  
  return (
    <section ref={ref} className="bg-[#f8f9fa] py-24 sm:py-32 relative overflow-hidden border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 scroll-hidden ${isInView ? 'scroll-visible' : ''}`}>
          <h2 className="text-[#e8702a] font-semibold tracking-wide uppercase text-sm mb-4">Global Network</h2>
          <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Always close to your users
          </h3>
        </div>

        <div className={`relative w-full mx-auto aspect-[2/1] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden scroll-hidden ${isInView ? 'scroll-visible' : ''}`} style={{ transitionDelay: '150ms' }}>
          {/* Simple Vector World Map Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${worldMapSvg})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
          
          {/* Map Points */}
          
          {/* UK Marker */}
          <div className="absolute group cursor-pointer" style={{ top: '18%', left: '47%' }}>
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8702a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e8702a] border-[1.5px] border-white"></span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🇬🇧</span>
                <span className="font-bold text-gray-900 text-sm">London, UK</span>
              </div>
              <span className="text-gray-500 text-xs">Enterprise Data Centre</span>
              {/* Tooltip caret */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-white"></div>
            </div>
          </div>

          {/* Sri Lanka Marker */}
          <div className="absolute group cursor-pointer" style={{ top: '44%', left: '67%' }}>
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8702a] opacity-75" style={{ animationDelay: '0.5s' }}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e8702a] border-[1.5px] border-white"></span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🇱🇰</span>
                <span className="font-bold text-gray-900 text-sm">Colombo, LK</span>
              </div>
              <span className="text-gray-500 text-xs">Local Support Hub</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-white"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const { ref, isInView } = useInView();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes Server Salad different from other hosts?",
      a: "We prioritize performance and reliability above all else. Every server runs on 100% genuine licensed software, high-speed NVMe storage, and is backed by our free 24/7 technical expert team."
    },
    {
      q: "Do you offer free website migrations?",
      a: "Yes! Our migration experts will seamlessly transfer your cPanel accounts, databases, and emails from your old host to Server Salad with zero downtime and completely free of charge."
    },
    {
      q: "Can I upgrade my hosting plan later?",
      a: "Absolutely. As your traffic grows, you can easily scale up your CPU, RAM, and storage with a single click from your dashboard—no hidden fees or complex migrations required."
    },
    {
      q: "What is included in the Advanced cPGuard Security?",
      a: "cPGuard offers real-time malware scanning, a powerful Web Application Firewall (WAF), brute-force login protection, and automatic threat isolation to ensure your site remains secure 24/7."
    },
    {
      q: "Where are your data centres located?",
      a: "Our primary enterprise data centres are located in London, UK, ensuring rapid delivery to European audiences. We also maintain local support hubs in Colombo, Sri Lanka."
    }
  ];

  return (
    <section ref={ref} className="bg-white py-24 sm:py-32 relative overflow-hidden border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 scroll-hidden ${isInView ? 'scroll-visible' : ''}`}>
          <h2 className="text-[#e8702a] font-semibold tracking-wide uppercase text-sm mb-4">FAQ</h2>
          <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className={`space-y-4 scroll-hidden ${isInView ? 'scroll-visible' : ''}`} style={{ transitionDelay: '150ms' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'border-[#e8702a]/30 bg-[#fcf5f1]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-semibold text-lg transition-colors pr-8 ${isOpen ? 'text-[#e8702a]' : 'text-gray-900'}`}>
                    {faq.q}
                  </span>
                  <div className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#e8702a]' : 'text-gray-400'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-[#050505] pt-24 pb-12 relative overflow-hidden text-white/70 border-t border-white/10">
      {/* Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#e8702a] opacity-[0.04] blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#e8702a] rounded-full flex items-center justify-center">
                <Globe size={18} className="text-white" />
              </div>
              <span className="text-white text-2xl font-playfair italic font-bold">Server Salad</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 max-w-sm">
              Powerful solutions to help your business grow globally. Experience our superior performance, proven by the largest online businesses.
            </p>
            <div className="flex items-center gap-4 text-white/40">
              <a href="#" className="hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h5 className="text-white font-semibold mb-6">Products</h5>
            <ul className="space-y-3 text-sm">
              {['CDN', 'Hosting', 'Streaming Platform', 'Storage', 'DDoS Protection', 'Software Development', 'Cloud', 'IT Infrastructure Management'].map((link, i) => (
                <li key={i}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-6">Company</h5>
            <ul className="space-y-3 text-sm">
              {['About', 'Customers', 'Case studies', 'Careers', 'Blog', 'Press', 'Legal information', 'Site map'].map((link, i) => (
                <li key={i}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-6">Resources</h5>
            <ul className="space-y-3 text-sm">
              {['Status page', 'API Documentation', 'Internet peering points', 'Product Documentation', 'Looking Glass', 'Developer Tools'].map((link, i) => (
                <li key={i}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-6">Contact</h5>
            <div className="space-y-6 text-sm">
              <div>
                <p className="mb-2">+352 208 80 507</p>
                <a href="#" className="hover:text-white transition-colors text-[#e8702a]">sales@serversalad.com</a>
              </div>
              <div>
                <h6 className="text-white font-semibold mb-2">Support</h6>
                <a href="#" className="block hover:text-white transition-colors mb-1">support@serversalad.com</a>
                <a href="#" className="block hover:text-white transition-colors">info@serversalad.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between py-10 border-y border-white/10 mb-10 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs">ISO</div>
            <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs">PCI</div>
          </div>
          
          <div className="text-center md:text-left flex-1 max-w-md">
            <p className="text-white font-semibold text-sm">Subscribe to discover the latest updates, news, and features</p>
          </div>

          <div className="relative w-full md:w-80">
            <input 
              type="email" 
              placeholder="Enter your E-mail" 
              className="w-full bg-[#111] border border-white/10 rounded-full py-3.5 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-[#e8702a]/50 transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#e8702a] hover:text-white transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs text-white/40">
          <div className="max-w-2xl">
            <p className="mb-2">
              This site is protected by reCAPTCHA. Google's <a href="#" className="text-white hover:underline">Privacy Policy</a> and <a href="#" className="text-white hover:underline">Terms of Service</a> apply.
            </p>
            <p>
              Server Salad S.A. © 2015–2026 All rights reserved. Principal place of business and postal address: 2-4, Rue Edmond Reuter, L-5326 Contern, Luxembourg
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-white/50">
            <CreditCard size={24} />
            <DollarSign size={24} />
            <span className="font-bold tracking-tight">Visa</span>
            <span className="font-bold italic tracking-tight">PayPal</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { selectPlan } = useOrder();
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Smooth scrolling setup with a "heavy" feel
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.5, // Increase duration for heavier/slower stop
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (smooth.current.x === -999) {
        smooth.current = { x: e.clientX, y: e.clientY };
        setCursorPos({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const update = () => {
      if (smooth.current.x !== -999) {
        smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
        smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
        
        setCursorPos({
          x: smooth.current.x,
          y: smooth.current.y
        });
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed top-6 left-4 right-4 z-[100] flex justify-center pointer-events-none">
        
        {/* Navbar Container */}
        <div 
          className="pointer-events-auto relative w-full max-w-[1200px]"
          onMouseLeave={() => setHoveredMenu(null)}
        >
          {/* Main Nav Pill */}
          <nav className="bg-[#111111]/90 backdrop-blur-xl border border-white/5 rounded-full px-5 py-3.5 flex items-center justify-between w-full shadow-2xl relative z-20">
            
            {/* Logo */}
            <div className="flex items-center gap-2 mr-8">
              <svg width="22" height="22" viewBox="0 0 256 256" fill="#e8702a" xmlns="http://www.w3.org/2000/svg">
                <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
              </svg>
              <span className="text-white text-lg font-bold tracking-tight">Server Salad</span>
            </div>

            {/* Center Links */}
            <div className="hidden lg:flex items-center gap-7">
              <button 
                className={`flex items-center gap-1 text-[13px] font-medium transition-colors ${hoveredMenu === 'products' ? 'text-white' : 'text-white/80 hover:text-white'}`}
                onMouseEnter={() => setHoveredMenu('products')}
              >
                Products <ChevronDown size={14} className="opacity-50" />
              </button>
              <button 
                className={`flex items-center gap-1 text-[13px] font-medium transition-colors ${hoveredMenu === 'solutions' ? 'text-white' : 'text-white/80 hover:text-white'}`}
                onMouseEnter={() => setHoveredMenu('solutions')}
              >
                Solutions <ChevronDown size={14} className="opacity-50" />
              </button>
              <button 
                className="text-white/80 text-[13px] font-medium hover:text-white transition-colors"
                onMouseEnter={() => setHoveredMenu(null)}
              >
                Infrastructure
              </button>
              <button 
                className="text-white/80 text-[13px] font-medium hover:text-white transition-colors"
                onMouseEnter={() => setHoveredMenu(null)}
              >
                Pricing
              </button>
              <button 
                className={`flex items-center gap-1 text-[13px] font-medium transition-colors ${hoveredMenu === 'documentation' ? 'text-white' : 'text-white/80 hover:text-white'}`}
                onMouseEnter={() => setHoveredMenu('documentation')}
              >
                Documentation <ChevronDown size={14} className="opacity-50" />
              </button>
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-5 ml-auto" onMouseEnter={() => setHoveredMenu(null)}>
              <button className="text-white/60 hover:text-white transition-colors">
                <Search size={16} />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="text-white/80 hover:text-white text-[13px] font-medium transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-[13px] font-semibold px-5 py-2 rounded-full transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Get Started
              </button>
            </div>
            
            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => navigate('/login')}
                className="text-white p-1 cursor-pointer"
                aria-label="Account"
              >
                <Menu size={24} />
              </button>
            </div>
          </nav>

          {/* Mega Menus */}
          {/* Products Mega Menu */}
          <div className={`absolute top-full left-0 right-0 pt-3 transition-all duration-300 origin-top transform ${hoveredMenu === 'products' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} z-10`}>
            <div className="bg-[#111111]/95 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden flex">
              <div className="w-[280px] bg-gradient-to-br from-[#e8702a] to-[#a3440e] p-8 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-[0.1em] mb-4">Overview</span>
                <button className="flex items-center gap-3 p-3 rounded-xl bg-white/20 border border-white/20 text-white text-[14px] font-semibold text-left transition-colors">
                  <Globe size={20} className="opacity-80" /> Edge Network
                  <ChevronDown size={14} className="ml-auto -rotate-90 opacity-80" />
                </button>
                <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white text-[14px] font-semibold text-left transition-colors">
                  <Cpu size={20} className="opacity-80" /> AI
                </button>
                <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white text-[14px] font-semibold text-left transition-colors">
                  <Cloud size={20} className="opacity-80" /> Cloud
                </button>
                <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white text-[14px] font-semibold text-left transition-colors">
                  <Shield size={20} className="opacity-80" /> Security
                </button>
              </div>

              <div className="flex-1 p-8 pr-12 flex flex-col">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em] mb-6">Edge Network</span>
                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                  <div className="flex flex-col cursor-pointer group">
                    <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">CDN</span>
                    <span className="text-[12px] text-white/50 mt-1.5 leading-relaxed">Accelerate dynamic and static content delivery</span>
                  </div>
                  <div className="flex flex-col cursor-pointer group">
                    <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">DNS</span>
                    <span className="text-[12px] text-white/50 mt-1.5 leading-relaxed">Keep services reachable with fast & global DNS</span>
                  </div>
                  <div className="flex flex-col cursor-pointer group">
                    <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Streaming</span>
                    <span className="text-[12px] text-white/50 mt-1.5 leading-relaxed">Stream on-demand and live videos at any scale</span>
                  </div>
                  <div className="flex flex-col cursor-pointer group">
                    <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Fast Edge</span>
                    <span className="text-[12px] text-white/50 mt-1.5 leading-relaxed">Run serverless apps at the edge with ultra-low latency</span>
                  </div>
                  <div className="flex flex-col cursor-pointer group">
                    <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Image Optimization</span>
                    <span className="text-[12px] text-white/50 mt-1.5 leading-relaxed">Optimize and compress images automatically</span>
                  </div>
                </div>
                
                <div className="mt-10 bg-gradient-to-r from-[#e8702a] to-[#d2611f] rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-[14px] text-white font-medium">Working on a larger project?</span>
                  <button className="bg-white text-[#e8702a] text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                    Talk to Sales
                  </button>
                </div>
              </div>

              <div className="w-[300px] border-l border-white/5 p-8 flex flex-col">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em] mb-6">Spotlight</span>
                <div className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden flex flex-col group cursor-pointer">
                  <div className="h-[120px] bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105"></div>
                    <span className="text-white font-bold text-2xl relative z-10 italic">Microsoft</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[14px] font-semibold text-white leading-snug">How Microsoft scaled global content delivery</span>
                    <span className="text-[12px] text-white/50 mt-2 mb-6">Find out how Microsoft used Server Salad to strengthen delivery across regions.</span>
                    <div className="mt-auto flex items-center gap-2 text-white/80 text-[12px] font-medium group-hover:text-white transition-colors">
                      Read the case study <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solutions Mega Menu */}
          <div className={`absolute top-full left-0 right-0 pt-3 transition-all duration-300 origin-top transform ${hoveredMenu === 'solutions' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} z-10`}>
            <div className="bg-[#111111]/95 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden flex">
              <div className="w-[280px] bg-gradient-to-br from-[#e8702a] to-[#a3440e] p-8 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-[0.1em] mb-4">Overview</span>
                <button className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/20 text-white text-[14px] font-semibold text-left transition-colors">
                  By industry
                  <ChevronDown size={14} className="-rotate-90 opacity-80" />
                </button>
                <button className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white text-[14px] font-semibold text-left transition-colors">
                  By need
                </button>
              </div>

              <div className="flex-1 p-8 pr-12 flex flex-col">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em] mb-6">By Industry</span>
                <div className="grid grid-cols-3 gap-x-8 gap-y-8">
                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <Gamepad2 size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Gaming</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Keep lag out of play</span>
                    </div>
                  </div>
                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <Video size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Media & Streaming</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Stream live and on demand</span>
                    </div>
                  </div>
                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <Store size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Ecommerce & Retail</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Keep carts moving at peak</span>
                    </div>
                  </div>

                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <Database size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">ERP Hosting</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Keep critical systems running</span>
                    </div>
                  </div>
                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <DollarSign size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Fintech</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Keep payments & apps reachable</span>
                    </div>
                  </div>
                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <Server size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Hosting Providers</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Protect every tenant you host</span>
                    </div>
                  </div>

                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <ShoppingCart size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Ecommerce Agencies</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Build ecommerce sites that scale</span>
                    </div>
                  </div>
                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <GraduationCap size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Online Education</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Deliver seamless learning online</span>
                    </div>
                  </div>
                  <div className="flex gap-4 cursor-pointer group">
                    <div className="w-10 h-10 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-xl flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                      <Smartphone size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">iGaming</span>
                      <span className="text-[12px] text-white/50 mt-1 leading-relaxed">Power every high-stakes moment</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 bg-[#e8702a] rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-[14px] text-white font-medium">Need something specific? Tell us your use case and we'll shape the right setup.</span>
                  <button className="bg-white text-[#e8702a] text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                    Talk to an expert
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation Mega Menu */}
          <div className={`absolute top-full left-0 right-0 pt-3 transition-all duration-300 origin-top transform ${hoveredMenu === 'documentation' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} z-10`}>
            <div className="bg-[#111111]/95 backdrop-blur-3xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden flex">
              <div className="flex-1 p-8 grid grid-cols-4 gap-8">
                
                {/* Using Server Salad */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em] mb-6">Using Server Salad</span>
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <FileText size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Docs</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Browse product docs</span>
                      </div>
                    </div>
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <Code size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">API</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Automate API endpoints</span>
                      </div>
                    </div>
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <PenTool size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Developer Tools</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Test and debug</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em] mb-6">Insights</span>
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <MessageSquare size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Blog</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Read product updates</span>
                      </div>
                    </div>
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <Briefcase size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Case studies</span>
                        <span className="text-[12px] text-white/50 mt-0.5">See how we help you win</span>
                      </div>
                    </div>
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <BarChart size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Reports</span>
                        <span className="text-[12px] text-white/50 mt-0.5">See the research</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em] mb-6">Community</span>
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <Calendar size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Events</span>
                        <span className="text-[12px] text-white/50 mt-0.5">See upcoming events</span>
                      </div>
                    </div>
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <Rocket size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Startup Program</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Grow with Server Salad</span>
                      </div>
                    </div>
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <MessageCircle size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Discord</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Connect with developers</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em] mb-6">Help</span>
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <HelpCircle size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Help center</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Find answers fast</span>
                      </div>
                    </div>
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <Wrench size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Support</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Get help 24/7</span>
                      </div>
                    </div>
                    <div className="flex gap-4 cursor-pointer group">
                      <div className="w-9 h-9 border border-[#e8702a]/30 bg-[#e8702a]/10 rounded-lg flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:bg-[#e8702a]/20 transition-colors">
                        <RefreshCw size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-white group-hover:text-[#e8702a] transition-colors">Changelog</span>
                        <span className="text-[12px] text-white/50 mt-0.5">Read what's new</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="w-[300px] p-8 border-l border-white/5 flex flex-col">
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.1em] mb-6">Service Status</span>
                <div className="flex-1 bg-gradient-to-br from-[#e8702a] to-[#a3440e] rounded-2xl p-6 flex flex-col cursor-pointer group hover:opacity-90 transition-opacity">
                  <span className="text-[15px] font-bold text-white mb-3">Server Salad status page</span>
                  <span className="text-[13px] text-white/90 leading-relaxed mb-6">
                    Track uptime, service availability, incidents and maintenances across the platform and services.
                  </span>
                  <div className="mt-auto flex items-center gap-2 text-white text-[13px] font-semibold">
                    See live status <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="relative w-full overflow-hidden h-screen bg-[#0a0a0a]" style={{ height: '100dvh' }}>
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom opacity-80"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />
        
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* Center Title */}
        <div className="absolute top-[22%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[1.05]">
            <span 
              className="block font-playfair italic font-normal text-6xl sm:text-7xl md:text-[88px] hero-anim hero-reveal" 
              style={{ letterSpacing: '-0.02em', animationDelay: '0.2s' }}
            >
              Infrastructure
            </span>
            <span 
              className="block font-bold text-5xl sm:text-7xl md:text-[84px] tracking-tight hero-anim hero-reveal" 
              style={{ letterSpacing: '-0.04em', animationDelay: '0.35s' }}
            >
              provisioned instantly
            </span>
          </h1>
        </div>

        {/* Left Side 3 Cards */}
        <div className="hidden lg:flex absolute top-[48%] -translate-y-1/2 left-10 md:left-[10%] flex-col gap-4 z-50 pointer-events-none">
          
          <div className="pointer-events-auto cursor-pointer group flex items-center gap-3.5 bg-[#111111]/90 backdrop-blur-xl border border-white/5 p-2 pr-8 rounded-full hero-anim hero-fade shadow-2xl w-max hover:bg-[#1a1a1a]/95 hover:border-white/15 hover:-translate-y-1 hover:shadow-black/50 transition-all duration-300" style={{ animationDelay: '0.5s' }}>
            <div className="w-11 h-11 bg-[#e8702a]/15 rounded-full flex items-center justify-center text-[#e8702a] flex-shrink-0 group-hover:scale-110 group-hover:bg-[#e8702a]/25 transition-all duration-300">
              <Zap size={20} className="fill-[#e8702a]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-[13px] group-hover:text-[#e8702a] transition-colors duration-300">Automated WHM</span>
              <span className="text-white/40 text-[11px] font-medium mt-0.5 group-hover:text-white/60 transition-colors duration-300">Zero-touch cPanel creation</span>
            </div>
          </div>

          <div className="pointer-events-auto cursor-pointer group flex items-center gap-3.5 bg-[#111111]/90 backdrop-blur-xl border border-white/5 p-2 pr-8 rounded-full hero-anim hero-fade shadow-2xl w-max ml-10 hover:bg-[#1a1a1a]/95 hover:border-white/15 hover:-translate-y-1 hover:shadow-black/50 transition-all duration-300" style={{ animationDelay: '0.6s' }}>
            <div className="w-11 h-11 bg-[#3b82f6]/15 rounded-full flex items-center justify-center text-[#3b82f6] flex-shrink-0 group-hover:scale-110 group-hover:bg-[#3b82f6]/25 transition-all duration-300">
              <CreditCard size={18} className="fill-[#3b82f6]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-[13px] group-hover:text-[#3b82f6] transition-colors duration-300">Smart Billing</span>
              <span className="text-white/40 text-[11px] font-medium mt-0.5 group-hover:text-white/60 transition-colors duration-300">Invoices & suspension auto-sync</span>
            </div>
          </div>

          <div className="pointer-events-auto cursor-pointer group flex items-center gap-3.5 bg-[#111111]/90 backdrop-blur-xl border border-white/5 p-2 pr-8 rounded-full hero-anim hero-fade shadow-2xl w-max hover:bg-[#1a1a1a]/95 hover:border-white/15 hover:-translate-y-1 hover:shadow-black/50 transition-all duration-300" style={{ animationDelay: '0.7s' }}>
            <div className="w-11 h-11 bg-[#10b981]/15 rounded-full flex items-center justify-center text-[#10b981] flex-shrink-0 group-hover:scale-110 group-hover:bg-[#10b981]/25 transition-all duration-300">
              <MessageCircle size={20} className="fill-[#10b981]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-[13px] group-hover:text-[#10b981] transition-colors duration-300">Unified Support</span>
              <span className="text-white/40 text-[11px] font-medium mt-0.5 group-hover:text-white/60 transition-colors duration-300">Live chat & ticketing system</span>
            </div>
          </div>

        </div>

        {/* Bottom Left Paragraph */}
        <div 
          className="hidden sm:block absolute bottom-12 left-10 md:left-[10%] max-w-[320px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.8s' }}
        >
          <p className="text-[13px] text-white/50 leading-[1.6]">
            Every layer of your cloud infrastructure is managed from one unified platform. From automated cPanel account creation to suspending inactive services, scale your hosting business without the manual overhead.
          </p>
        </div>

        {/* Bottom Right Box */}
        <div 
          className="absolute bottom-8 sm:bottom-12 left-5 right-5 sm:left-auto sm:right-10 md:right-[10%] max-w-full sm:max-w-[340px] bg-[#111111]/90 backdrop-blur-xl border border-white/5 p-7 rounded-[20px] shadow-2xl z-50 hero-anim hero-fade flex flex-col gap-6"
          style={{ animationDelay: '0.9s' }}
        >
          <p className="text-[13px] text-white/60 leading-[1.6]">
            Our integrated systems let you peel back the complexity of hosting management. Automate invoices, track real-time payments, and resolve support tickets instantly from a single dashboard.
          </p>
          <button 
            onClick={() => { selectPlan('web'); navigate('/order/setup'); }}
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-[13px] font-semibold py-3 px-6 rounded-full transition-all hover:scale-[1.03] active:scale-95 w-fit pointer-events-auto cursor-pointer"
          >
            Deploy Now
          </button>
        </div>

      </section>

      {/* New Sections */}
      <FeaturesSection />
      <PricingSection />
      <MapSection />
      <FaqSection />
      <FooterSection />

    </div>
  );
}
