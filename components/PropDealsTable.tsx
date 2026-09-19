import React, { useState, useMemo, useEffect } from 'react';
import { Copy, Check, Info, Search, Sparkles, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { FALLBACK_FIRMS, withTimeout } from '../lib/fallbackData';
import {
  VerifiedPartnerDeal,
  getStoredPartnerDeals,
  PARTNER_DEALS_EVENT,
  DEFAULT_PARTNER_DEALS
} from '../lib/partnerDealsData';

// Re-export type for compatibility
export type DealItem = VerifiedPartnerDeal;
export const VERIFIED_DEALS_DATA = DEFAULT_PARTNER_DEALS;

// Helper Logo renderer with fallback
const FirmLogo: React.FC<{ name: string; url?: string; bg?: string }> = ({ name, url, bg }) => {
  const [imgError, setImgError] = useState(false);

  const renderIconFallback = () => {
    const n = name.toLowerCase();
    if (n.includes('ftmo')) {
      return <span className="text-white font-black text-xs tracking-tighter">FTMO</span>;
    }
    if (n.includes('fundednext')) {
      return <span className="text-blue-400 font-black text-xs tracking-tight">FN</span>;
    }
    if (n.includes('topstep')) {
      return <span className="text-amber-400 font-black text-xs tracking-tight">TS</span>;
    }
    if (n.includes('apex')) {
      return <span className="text-emerald-400 font-black text-xs tracking-tight">ATF</span>;
    }
    if (n.includes('the5ers')) {
      return <span className="text-[#F0C41B] font-black text-xs tracking-tight">5%</span>;
    }
    if (n.includes('alpha')) {
      return <span className="text-cyan-400 font-black text-xs tracking-tight">ACG</span>;
    }
    if (n.includes('funding pips') || n.includes('fundingpips')) {
      return (
        <div className="w-5 h-5 rounded bg-purple-600/60 flex items-center justify-center font-black text-[11px] text-white">
          P
        </div>
      );
    }
    if (n.includes('e8')) {
      return (
        <span className="text-white font-black text-sm tracking-tighter border border-white/30 rounded px-1 py-0.5">
          E8
        </span>
      );
    }
    if (n.includes('blue guardian') || n.includes('blueguardian')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400 fill-cyan-400/20" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (n.includes('myfundedfutures')) {
      return <span className="font-extrabold text-[10px] text-[#F0C41B]">MFF</span>;
    }

    return (
      <span className="text-white font-bold text-xs uppercase">
        {name.substring(0, 2)}
      </span>
    );
  };

  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-sm overflow-hidden p-1"
      style={{ backgroundColor: bg || '#141416' }}
    >
      {url && !imgError ? (
        <img
          src={url}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        renderIconFallback()
      )}
    </div>
  );
};

interface PropDealsTableProps {
  title?: string;
  subtitle?: string;
  initialCategory?: 'All' | 'Forex' | 'Futures' | 'Crypto';
  maxItems?: number;
  className?: string;
}

export const PropDealsTable: React.FC<PropDealsTableProps> = ({
  title = "Exclusive Prop Firm Discounts & Codes",
  subtitle = "Save up to 80% on verified listed prop firms. All coupon codes and referral discounts updated daily.",
  initialCategory = "All",
  maxItems,
  className = ""
}) => {
  const [deals, setDeals] = useState<VerifiedPartnerDeal[]>(() => getStoredPartnerDeals(FALLBACK_FIRMS));
  const [activeCategory, setActiveCategory] = useState<'All' | 'Forex' | 'Futures' | 'Crypto'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<{ firmName: string; code: string } | null>(null);

  // Load latest deals and synchronize with live firms
  useEffect(() => {
    const fetchFirmsAndSync = async () => {
      try {
        const fetchPromise = supabase
          .from('firms')
          .select('id, name, website, affiliate_link, logo_url, trading_type, discount_code')
          .eq('status', 'active');

        const res = await withTimeout(fetchPromise, 2500, { data: null, error: null });
        const liveFirms = res?.data && res.data.length > 0 ? res.data : FALLBACK_FIRMS;
        setDeals(getStoredPartnerDeals(liveFirms));
      } catch (err) {
        setDeals(getStoredPartnerDeals(FALLBACK_FIRMS));
      }
    };

    fetchFirmsAndSync();

    // Listen to admin panel updates in real-time
    const handleDealsUpdate = () => {
      fetchFirmsAndSync();
    };

    window.addEventListener(PARTNER_DEALS_EVENT, handleDealsUpdate);
    window.addEventListener('storage', handleDealsUpdate);

    return () => {
      window.removeEventListener(PARTNER_DEALS_EVENT, handleDealsUpdate);
      window.removeEventListener('storage', handleDealsUpdate);
    };
  }, []);

  const handleCopyCode = (id: string, code: string, firmName: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setCopiedNotification({ firmName, code });
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2500);
      setTimeout(() => {
        setCopiedNotification(null);
      }, 3500);
    });
  };

  const activeDeals = useMemo(() => {
    return deals.filter((d) => d.isActive !== false);
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return activeDeals.filter((item) => {
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch =
        item.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highlightOffer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).slice(0, maxItems || activeDeals.length);
  }, [activeDeals, activeCategory, searchQuery, maxItems]);

  const categories = ['All', 'Futures', 'Forex', 'Crypto'] as const;

  // Render Top 3 Gold, Silver, Bronze badges + rank styling
  const renderRankBadge = (position: number, customBadge?: string) => {
    if (position === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/25 via-yellow-400/30 to-amber-500/25 text-yellow-300 border border-yellow-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)] animate-pulse">
          <span className="text-xs">🥇</span>
          <span>{customBadge || 'Gold Partner'}</span>
        </span>
      );
    }
    if (position === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-slate-300/25 via-slate-100/30 to-slate-400/25 text-slate-100 border border-slate-300/60 shadow-[0_0_12px_rgba(203,213,225,0.3)]">
          <span className="text-xs">🥈</span>
          <span>{customBadge || 'Silver Partner'}</span>
        </span>
      );
    }
    if (position === 3) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-700/30 via-amber-600/35 to-amber-800/30 text-amber-200 border border-amber-600/60 shadow-[0_0_12px_rgba(180,83,9,0.35)]">
          <span className="text-xs">🥉</span>
          <span>{customBadge || 'Bronze Partner'}</span>
        </span>
      );
    }
    if (customBadge) {
      return (
        <span className="inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#F0C41B]/15 text-[#F0C41B] border border-[#F0C41B]/30">
          {customBadge}
        </span>
      );
    }
    return null;
  };

  const renderRankNumber = (position: number) => {
    if (position === 1) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black text-xs flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.5)]">
          1
        </div>
      );
    }
    if (position === 2) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-400 to-slate-100 text-black font-black text-xs flex items-center justify-center shadow-[0_0_8px_rgba(203,213,225,0.4)]">
          2
        </div>
      );
    }
    if (position === 3) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-800 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-[0_0_8px_rgba(180,83,9,0.4)]">
          3
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-bold text-[11px] flex items-center justify-center">
        {position}
      </div>
    );
  };

  return (
    <section className={`w-full relative py-12 ${className}`}>
      {/* Background aura in theme color #F0C41B */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[#F0C41B]/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0d0f] border border-[#F0C41B]/40 text-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(240,196,27,0.2)] flex items-center gap-3 animate-fade-in-up backdrop-blur-lg">
          <div className="w-8 h-8 rounded-full bg-[#F0C41B]/20 border border-[#F0C41B] flex items-center justify-center text-[#F0C41B]">
            <Check size={16} className="stroke-[3]" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Promo Code Copied!</div>
            <div className="text-[11px] text-neutral-400">
              <span className="text-[#F0C41B] font-mono font-bold">{copiedNotification.code}</span> copied for {copiedNotification.firmName}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0C41B]/10 border border-[#F0C41B]/30 text-[#F0C41B] text-[11px] font-black uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(240,196,27,0.15)]">
              <Sparkles size={12} className="fill-[#F0C41B]" />
              Verified Partner Discounts
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
              {title}
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl font-normal">
              {subtitle}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search firm, category, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111114] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F0C41B] focus:ring-1 focus:ring-[#F0C41B] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? activeDeals.length
                : activeDeals.filter((d) => d.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#F0C41B] text-black shadow-[0_0_15px_rgba(240,196,27,0.35)] scale-[1.02]'
                    : 'bg-[#111114] text-neutral-400 border border-white/5 hover:border-white/15 hover:text-white'
                }`}
              >
                <span>{cat === 'All' ? 'All Offers' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-white/5 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* The Exact Table Card Container */}
        <div className="w-full bg-[#0c0c0e] border border-white/[0.08] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Table for Desktop & Tablet */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              {/* Header Row */}
              <thead>
                <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] font-bold text-neutral-400 tracking-wider uppercase">
                  <th className="py-4 px-6 font-semibold w-16 text-center">RANK</th>
                  <th className="py-4 px-6 font-semibold">FIRM NAME</th>
                  <th className="py-4 px-6 font-semibold">CATEGORY</th>
                  <th className="py-4 px-6 font-semibold">OFFER</th>
                  <th className="py-4 px-6 font-semibold">DISCOUNT CODE</th>
                  <th className="py-4 px-6 font-semibold text-right sm:text-center">CLAIM OFFER</th>
                </tr>
              </thead>

              {/* Body Rows */}
              <tbody className="divide-y divide-white/[0.04]">
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => {
                    const isCopied = copiedId === deal.id;
                    const isTooltipOpen = activeTooltipId === deal.id;
                    const isTopThree = deal.position <= 3;

                    return (
                      <tr
                        key={deal.id}
                        className={`group transition-colors duration-150 ${
                          deal.position === 1
                            ? 'bg-amber-500/[0.03] hover:bg-amber-500/[0.06]'
                            : deal.position === 2
                            ? 'bg-slate-400/[0.02] hover:bg-slate-400/[0.05]'
                            : deal.position === 3
                            ? 'bg-amber-700/[0.02] hover:bg-amber-700/[0.05]'
                            : 'hover:bg-white/[0.025]'
                        }`}
                      >
                        {/* 0. RANK NUMBER */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center">
                            {renderRankNumber(deal.position)}
                          </div>
                        </td>

                        {/* 1. FIRM NAME & BADGE */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <FirmLogo name={deal.firmName} url={deal.logoUrl} bg={deal.logoBg} />
                            <div>
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="font-extrabold text-white text-sm sm:text-base tracking-tight group-hover:text-white transition-colors">
                                  {deal.firmName}
                                </span>
                                {renderRankBadge(deal.position, deal.badge)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. CATEGORY */}
                        <td className="py-4 px-6">
                          <span className="text-neutral-400 text-sm font-medium">
                            {deal.category}
                          </span>
                        </td>

                        {/* 3. OFFER */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="text-[11px] text-neutral-400 font-medium leading-none mb-1">
                                {deal.discountText}
                              </span>
                              <span className="text-[#F0C41B] text-sm sm:text-base font-black tracking-tight leading-none">
                                {deal.highlightOffer}
                              </span>
                            </div>

                            {/* Info Tooltip Icon */}
                            <div className="relative">
                              <button
                                type="button"
                                onMouseEnter={() => setActiveTooltipId(deal.id)}
                                onMouseLeave={() => setActiveTooltipId(null)}
                                onClick={() => setActiveTooltipId(isTooltipOpen ? null : deal.id)}
                                className="text-neutral-500 hover:text-white p-1 transition-colors cursor-pointer"
                                aria-label="Offer Details"
                              >
                                <Info size={14} />
                              </button>

                              {/* Tooltip Content */}
                              {isTooltipOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-30 w-64 p-3 rounded-xl bg-[#141418] border border-white/10 text-[11px] text-neutral-300 leading-relaxed shadow-2xl backdrop-blur-md animate-fade-in-up">
                                  <div className="text-white font-bold mb-1 flex items-center gap-1 text-[11px]">
                                    <ShieldCheck size={12} className="text-[#F0C41B]" />
                                    Official Partner Offer
                                  </div>
                                  {deal.infoTooltip}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#141418]" />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 4. DISCOUNT CODE */}
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(deal.id, deal.code, deal.firmName)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#F0C41B]/40 transition-all cursor-pointer group/btn"
                            title="Click to copy promo code"
                          >
                            <span className="text-[#F0C41B] font-mono font-bold text-sm tracking-wider">
                              {deal.code}
                            </span>
                            {isCopied ? (
                              <Check size={14} className="text-green-400 stroke-[2.5]" />
                            ) : (
                              <Copy
                                size={14}
                                className="text-neutral-400 group-hover/btn:text-[#F0C41B] transition-colors"
                              />
                            )}
                          </button>
                        </td>

                        {/* 5. CLAIM OFFER BUTTON (Guaranteed Referral Link) */}
                        <td className="py-4 px-6 text-right sm:text-center">
                          <a
                            href={deal.claimUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F0C41B] to-[#d4ab0e] text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_15px_rgba(240,196,27,0.25)] hover:shadow-[0_0_25px_rgba(240,196,27,0.45)] hover:brightness-110 active:scale-95 transition-all duration-150 cursor-pointer group/cta"
                          >
                            <span>Buy Now</span>
                            <ArrowRight size={14} className="stroke-[2.5] group-hover/cta:translate-x-0.5 transition-transform" />
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-neutral-500">
                      <p className="text-sm font-medium">No partner offers found matching your criteria.</p>
                      <button
                        onClick={() => {
                          setActiveCategory('All');
                          setSearchQuery('');
                        }}
                        className="mt-3 text-xs text-[#F0C41B] font-bold underline cursor-pointer hover:brightness-110"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Summary Bar */}
          <div className="py-3.5 px-6 bg-black/60 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>All {activeDeals.length} partner discounts verified & active on live listed firms</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              Discounts automatically apply at checkout with promo code <strong className="text-[#F0C41B]">WEALTHX</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropDealsTable;
