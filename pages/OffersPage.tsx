import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useModal } from '../context/ModalContext';
import { useTradeMode } from '../context/TradeModeContext';
import { Loader2, Ticket, CheckCircle2, Copy, ExternalLink, Timer, Zap, ShieldCheck } from 'lucide-react';
import PropDealsTable from '../components/PropDealsTable';

import { FALLBACK_OFFERS, withTimeout } from '../lib/fallbackData';

interface Offer {
  id: string;
  firm_id: string;
  title: string;
  code: string | null;
  discount: string | null;
  expiry_date: string | null;
  verified: boolean;
  status: string;
  firms?: {
    name: string;
    logo_url: string;
    website: string;
    affiliate_link: string;
    trading_type?: string;
    tags?: string[];
  };
}

const OffersPage: React.FC = () => {
  const { mode } = useTradeMode();
  const { user } = useAuth();
  const { showModal } = useModal();
  const [offers, setOffers] = useState<Offer[]>(FALLBACK_OFFERS as any);
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const modeLabel = mode === 'futures' ? 'Futures' : mode === 'crypto' ? 'Crypto' : 'Prop';

  useEffect(() => {
    fetchOffers();
  }, [mode]);

  const fetchOffers = async () => {
    try {
      const fetchPromise = supabase
        .from('offers')
        .select('*, firms(name, logo_url, website, affiliate_link, trading_type, tags)')
        .eq('status', 'active')
        .order('verified', { ascending: false })
        .order('created_at', { ascending: false });

      const res = await withTimeout(fetchPromise, 2500, { data: null, error: null });

      if (res?.data && res.data.length > 0) {
        setOffers(res.data);
      }
    } catch (err) {
      console.warn('Using resilient offers dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayedOffers = useMemo(() => {
    return offers.filter(offer => {
      if (selectedCategory === 'all') return true;
      const firmType = (offer.firms?.trading_type || '').toLowerCase();
      const tags = (offer.firms?.tags || []).map(t => t.toLowerCase());
      const title = (offer.title || '').toLowerCase();
      if (selectedCategory === 'futures') {
        return firmType === 'futures' || tags.includes('futures') || title.includes('futures');
      }
      if (selectedCategory === 'crypto') {
        return firmType === 'crypto' || tags.includes('crypto') || title.includes('crypto') || title.includes('btc');
      }
      if (selectedCategory === 'forex') {
        return firmType === 'forex' || tags.includes('forex') || (!tags.includes('futures') && !tags.includes('crypto'));
      }
      return true;
    });
  }, [offers, selectedCategory]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showModal({ type: 'success', title: 'Copied!', message: `Promo code ${code} copied to clipboard.` });
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="pt-36 pb-24 min-h-screen bg-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-brand-accent/10 rounded-full blur-[120px] animate-aurora"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-brand-accent/5 rounded-full blur-[120px] animate-aurora-reverse"></div>
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-black uppercase tracking-widest mb-6 animate-fade-in-up">
              <Zap size={14} /> VIP Trading Benefits
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Exclusive <span className="text-brand-accent">{modeLabel} Deals</span>
            </h1>
            <p className="text-brand-muted text-lg font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Unlock massive savings on the world's most reputable prop firms. 
              Our team negotiates directly with firms to bring you the best discounts and exclusive bonuses.
            </p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-6 rounded-3xl flex flex-col items-center gap-2 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
             <div className="flex items-center gap-2 text-brand-accent">
                <ShieldCheck size={20} />
                <span className="text-xl font-black">{offers.filter(o => o.verified).length}</span>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 text-center">Verified {modeLabel} Offers<br/>Available Today</span>
          </div>
        </div>

        {/* Featured Deal Spotlight */}
        <div className="mb-16 relative group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-brand-accent/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative rounded-[40px] border border-white/5 bg-gradient-to-br from-[#0d0d0d] to-[#050505] p-8 md:p-12 overflow-hidden shadow-2xl">
            {/* Animated background elements */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-accent/20 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1 rounded-full bg-brand-accent text-black text-[10px] font-black uppercase tracking-widest animate-shine relative overflow-hidden">
                    Deal of the Month
                  </span>
                  <span className="text-amber-500 text-sm font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <Timer size={14} /> Limited availability
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                  SUPERCHARGE YOUR <br/>
                  <span className="text-brand-accent">TRADING JOURNEY</span>
                </h2>
                <p className="text-neutral-400 text-xl font-medium max-w-xl mb-8">
                  Get up to 30% discount on all challenge phases this week only. Use code <span className="text-white font-black">WEALTHX</span> for maximum benefit.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-10 py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-300 shadow-xl active:scale-[0.98]">
                    Browse All Rewards
                  </button>
                </div>
              </div>
              
              {/* Graphic Element */}
              <div className="hidden lg:flex items-center justify-center relative w-64 h-64">
                <div className="absolute inset-0 bg-brand-accent/30 rounded-full blur-3xl animate-breathing-glow"></div>
                <Ticket size={160} className="text-brand-accent transform -rotate-12 drop-shadow-brand-glow animate-float" />
              </div>
            </div>
          </div>
        </div>

        {/* ── VERIFIED PARTNER PROP DEALS TABLE ── */}
        <PropDealsTable 
          title="All Active Prop Firm Coupons" 
          subtitle="Explore our verified partner network discounts with guaranteed working coupon codes." 
        />

        {/* Filters / Categories */}
        <div className="flex flex-wrap items-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {[
            { key: 'all', label: 'All Offers' },
            { key: 'futures', label: 'Futures Deals' },
            { key: 'forex', label: 'Forex Deals' },
            { key: 'crypto', label: 'Crypto Deals' },
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat.key
                  ? 'bg-brand-accent text-black shadow-brand-glow'
                  : 'bg-[#0a0a0a] border border-[#1f1f1f] text-neutral-500 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Offer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-neutral-500 gap-6 animate-fade-in-up">
              <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin"></div>
              <p className="font-black uppercase tracking-widest text-xs">Accessing Market Deals...</p>
            </div>
          ) : displayedOffers.length > 0 ? (
            displayedOffers.map((offer, idx) => (
              <div 
                key={offer.id} 
                className="group relative flex flex-col bg-[#0a0a0a] border border-[#1f1f1f] rounded-[32px] p-8 transition-all duration-500 hover:border-brand-accent/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-fade-in-up"
                style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-10 w-20 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#111] p-3 border border-[#1f1f1f] flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      {offer.firms?.logo_url ? (
                        <img src={offer.firms.logo_url} alt={offer.firms.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="font-black text-brand-accent text-xl">{offer.firms?.name?.substring(0, 1)}</div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg tracking-tight leading-tight uppercase">{offer.firms?.name || 'Unknown Firm'}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <CheckCircle2 size={12} className="text-brand-accent" />
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Authorized Partner</span>
                      </div>
                    </div>
                  </div>
                  
                  {offer.verified && (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                       Verified
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mb-8">
                  <div className="text-5xl font-black text-white tracking-tighter group-hover:text-brand-accent transition-colors duration-500 uppercase">
                    {offer.discount || 'PROMO'}
                  </div>
                  <p className="text-neutral-400 font-medium text-sm leading-relaxed">{offer.title}</p>
                </div>

                <div className="mt-auto">
                  {/* Expiry Info */}
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-6 py-3 border-t border-[#1f1f1f]">
                    <Timer size={12} />
                    {offer.expiry_date ? (
                      <span>Valid until {new Date(offer.expiry_date).toLocaleDateString()}</span>
                    ) : (
                      <span>Active Indefinitely</span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={offer.firms?.affiliate_link || offer.firms?.website || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 h-12 flex items-center justify-center rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all duration-300 shadow-lg active:scale-[0.95]"
                    >
                      Activate <ExternalLink size={14} className="ml-1.5" />
                    </a>
                    
                    {offer.code && (
                      <button
                        className={`h-12 px-5 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 active:scale-[0.95] ${
                          copiedCode === offer.code 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-[#0d0d0d] border-[#1f1f1f] text-neutral-400 hover:text-white hover:border-white/20'
                        }`}
                        onClick={() => copyCode(offer.code || '')}
                      >
                        {copiedCode === offer.code ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                        {copiedCode === offer.code ? 'Copied' : 'Code'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center flex flex-col items-center animate-fade-in-up">
              <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-neutral-700 mb-8 shadow-inner">
                <Zap size={40} />
              </div>
              <h3 className="text-white font-black text-2xl uppercase tracking-tight mb-3">No Active Campaigns</h3>
              <p className="text-neutral-500 font-medium max-w-sm">We're currently negotiating new deals. Sign up for our newsletter to get notified first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
