import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Copy, Check, X, Sparkles, Building2, Coins, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTradeMode } from '../context/TradeModeContext';

// ── FIRM CARD ITEM INTERFACE ──
export interface MarketplaceFirm {
  id: string;
  name: string;
  logo: string;
  category: 'Forex' | 'Futures' | 'Crypto';
  featuredPlan: string;
  description: string;
  challengesCount: number;
  discount: number;
  code: string;
  website: string;
  affiliateUrl: string;
  brandColor: string;
  glowColor: string;
  challenges: Array<{
    id: string;
    tierName: string;
    accountSize: number;
    price: number;
    pointsRequired: number;
    stepType: '1-Step' | '2-Step' | 'Instant';
  }>;
}

// ── COMPREHENSIVE MARKETPLACE FIRMS DATA MATCHING USER SCREENSHOT ──
const MARKETPLACE_FIRMS: MarketplaceFirm[] = [
  {
    id: 'blueguardian',
    name: 'BlueGuardian',
    logo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    category: 'Forex',
    featuredPlan: 'BlueGuardian — 2 Step Pro — $5,000 Account',
    description: 'Redeem for a BlueGuardian 2 Step Pro $5,000 account.',
    challengesCount: 26,
    discount: 25,
    code: 'WEALTH',
    website: 'https://blueguardian.com',
    affiliateUrl: 'https://blueguardian.com',
    brandColor: '#00b4d8',
    glowColor: 'rgba(0, 180, 216, 0.45)',
    challenges: [
      { id: 'bg-5k', tierName: '2-Step Pro', accountSize: 5000, price: 47, pointsRequired: 160, stepType: '2-Step' },
      { id: 'bg-10k', tierName: '2-Step Standard', accountSize: 10000, price: 87, pointsRequired: 290, stepType: '2-Step' },
      { id: 'bg-25k', tierName: '2-Step Pro', accountSize: 25000, price: 177, pointsRequired: 580, stepType: '2-Step' },
      { id: 'bg-50k', tierName: '2-Step Pro', accountSize: 50000, price: 297, pointsRequired: 990, stepType: '2-Step' },
      { id: 'bg-100k', tierName: '2-Step Standard', accountSize: 100000, price: 497, pointsRequired: 1650, stepType: '2-Step' },
      { id: 'bg-200k', tierName: '2-Step Pro', accountSize: 200000, price: 947, pointsRequired: 3100, stepType: '2-Step' },
    ]
  },
  {
    id: 'blueguardian-futures',
    name: 'BlueGuardian Futures',
    logo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    category: 'Futures',
    featuredPlan: 'BlueGuardian Futures — Reserve — $25,000 Account',
    description: 'Redeem for a BlueGuardian Futures Reserve $25,000 account.',
    challengesCount: 23,
    discount: 25,
    code: 'WEALTH',
    website: 'https://blueguardian.com',
    affiliateUrl: 'https://blueguardian.com',
    brandColor: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.45)',
    challenges: [
      { id: 'bgf-25k', tierName: 'Futures Reserve', accountSize: 25000, price: 145, pointsRequired: 490, stepType: '1-Step' },
      { id: 'bgf-50k', tierName: 'Futures Reserve', accountSize: 50000, price: 265, pointsRequired: 890, stepType: '1-Step' },
      { id: 'bgf-100k', tierName: 'Futures Elite', accountSize: 100000, price: 465, pointsRequired: 1550, stepType: '1-Step' },
      { id: 'bgf-150k', tierName: 'Futures Elite', accountSize: 150000, price: 625, pointsRequired: 2100, stepType: '1-Step' },
    ]
  },
  {
    id: 'funded-trader-markets',
    name: 'Funded Trader Markets',
    logo: 'https://www.google.com/s2/favicons?domain=thefundedtraderprogram.com&sz=128',
    category: 'Forex',
    featuredPlan: 'Funded Trader Markets — Instant Pro — $5,000 Account',
    description: 'Redeem for a Funded Trader Markets Instant Pro $5,000 account.',
    challengesCount: 28,
    discount: 65,
    code: 'WEALTH',
    website: 'https://thefundedtraderprogram.com',
    affiliateUrl: 'https://thefundedtraderprogram.com',
    brandColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    challenges: [
      { id: 'ftm-5k', tierName: 'Instant Pro', accountSize: 5000, price: 89, pointsRequired: 280, stepType: 'Instant' },
      { id: 'ftm-10k', tierName: 'Standard 2-Step', accountSize: 10000, price: 79, pointsRequired: 260, stepType: '2-Step' },
      { id: 'ftm-25k', tierName: 'Rapid 1-Step', accountSize: 25000, price: 189, pointsRequired: 620, stepType: '1-Step' },
      { id: 'ftm-50k', tierName: 'Royal Challenge', accountSize: 50000, price: 319, pointsRequired: 1050, stepType: '2-Step' },
      { id: 'ftm-100k', tierName: 'Royal Challenge', accountSize: 100000, price: 549, pointsRequired: 1800, stepType: '2-Step' },
    ]
  },
  {
    id: 'fundednext',
    name: 'FundedNext',
    logo: 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundedNext_Logo_White_Christmas_2025.png&w=384&q=75',
    category: 'Forex',
    featuredPlan: 'FundedNext — Stellar 2-Step — $15,000 Account',
    description: 'Redeem for a FundedNext Stellar 2-Step $15,000 account.',
    challengesCount: 24,
    discount: 20,
    code: 'WEALTH',
    website: 'https://fundednext.com',
    affiliateUrl: 'https://fundednext.com',
    brandColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    challenges: [
      { id: 'fn-6k', tierName: 'Stellar 1-Step', accountSize: 6000, price: 59, pointsRequired: 190, stepType: '1-Step' },
      { id: 'fn-15k', tierName: 'Stellar 2-Step', accountSize: 15000, price: 119, pointsRequired: 390, stepType: '2-Step' },
      { id: 'fn-25k', tierName: 'Stellar 2-Step', accountSize: 25000, price: 199, pointsRequired: 650, stepType: '2-Step' },
      { id: 'fn-50k', tierName: 'Stellar 2-Step', accountSize: 50000, price: 299, pointsRequired: 990, stepType: '2-Step' },
      { id: 'fn-100k', tierName: 'Stellar 2-Step', accountSize: 100000, price: 549, pointsRequired: 1800, stepType: '2-Step' },
      { id: 'fn-200k', tierName: 'Stellar 2-Step', accountSize: 200000, price: 999, pointsRequired: 3300, stepType: '2-Step' },
    ]
  },
  {
    id: 'e8-markets',
    name: 'E8 Markets',
    logo: 'https://e8markets.com/images/logo/logo.svg',
    category: 'Forex',
    featuredPlan: 'E8 Markets — E8 Track — $25,000 Account',
    description: 'Redeem for an E8 Markets Track $25,000 account.',
    challengesCount: 18,
    discount: 10,
    code: 'WEALTH',
    website: 'https://e8markets.com',
    affiliateUrl: 'https://e8markets.com',
    brandColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    challenges: [
      { id: 'e8-10k', tierName: 'E8 Classic', accountSize: 10000, price: 88, pointsRequired: 290, stepType: '2-Step' },
      { id: 'e8-25k', tierName: 'E8 Track', accountSize: 25000, price: 178, pointsRequired: 590, stepType: '2-Step' },
      { id: 'e8-50k', tierName: 'E8 Classic', accountSize: 50000, price: 298, pointsRequired: 980, stepType: '2-Step' },
      { id: 'e8-100k', tierName: 'E8 Classic', accountSize: 100000, price: 498, pointsRequired: 1650, stepType: '2-Step' },
    ]
  },
  {
    id: 'funding-pips',
    name: 'Funding Pips',
    logo: 'https://www.google.com/s2/favicons?domain=fundingpips.com&sz=128',
    category: 'Forex',
    featuredPlan: 'Funding Pips — 2-Step Match — $10,000 Account',
    description: 'Redeem for a Funding Pips 2-Step Match $10,000 account.',
    challengesCount: 22,
    discount: 5,
    code: 'WEALTH',
    website: 'https://www.fundingpips.com',
    affiliateUrl: 'https://www.fundingpips.com',
    brandColor: '#9333ea',
    glowColor: 'rgba(147, 51, 234, 0.45)',
    challenges: [
      { id: 'fp-5k', tierName: '2-Step Match', accountSize: 5000, price: 32, pointsRequired: 110, stepType: '2-Step' },
      { id: 'fp-10k', tierName: '2-Step Match', accountSize: 10000, price: 60, pointsRequired: 200, stepType: '2-Step' },
      { id: 'fp-25k', tierName: '2-Step Match', accountSize: 25000, price: 139, pointsRequired: 460, stepType: '2-Step' },
      { id: 'fp-50k', tierName: '2-Step Match', accountSize: 50000, price: 239, pointsRequired: 790, stepType: '2-Step' },
      { id: 'fp-100k', tierName: '2-Step Match', accountSize: 100000, price: 399, pointsRequired: 1320, stepType: '2-Step' },
    ]
  },
  {
    id: 'goat-funded-futures',
    name: 'Goat Funded Futures',
    logo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif',
    category: 'Futures',
    featuredPlan: 'Goat Funded — No Time Limit — $25,000 Account',
    description: 'Redeem for a Goat Funded No Time Limit $25,000 account.',
    challengesCount: 25,
    discount: 50,
    code: 'WEALTH',
    website: 'https://goatfundedtrader.com',
    affiliateUrl: 'https://goatfundedtrader.com',
    brandColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    challenges: [
      { id: 'gft-25k', tierName: 'Classic 2-Step', accountSize: 25000, price: 165, pointsRequired: 550, stepType: '2-Step' },
      { id: 'gft-50k', tierName: 'No Time Limit', accountSize: 50000, price: 275, pointsRequired: 910, stepType: '1-Step' },
      { id: 'gft-100k', tierName: 'No Time Limit', accountSize: 100000, price: 475, pointsRequired: 1580, stepType: '1-Step' },
    ]
  },
  {
    id: 'apex-trader-funding',
    name: 'Apex Trader Funding',
    logo: 'https://www.google.com/s2/favicons?domain=apextraderfunding.com&sz=128',
    category: 'Futures',
    featuredPlan: 'Apex Trader — 50K Rithmic — $50,000 Account',
    description: 'Redeem for an Apex Trader 50K Rithmic $50,000 account.',
    challengesCount: 30,
    discount: 80,
    code: 'WEALTH',
    website: 'https://apextraderfunding.com',
    affiliateUrl: 'https://apextraderfunding.com',
    brandColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    challenges: [
      { id: 'atf-25k', tierName: 'Rithmic Combine', accountSize: 25000, price: 147, pointsRequired: 490, stepType: '1-Step' },
      { id: 'atf-50k', tierName: '50K Rithmic', accountSize: 50000, price: 167, pointsRequired: 550, stepType: '1-Step' },
      { id: 'atf-100k', tierName: '100K Rithmic', accountSize: 100000, price: 207, pointsRequired: 690, stepType: '1-Step' },
      { id: 'atf-150k', tierName: '150K Rithmic', accountSize: 150000, price: 297, pointsRequired: 990, stepType: '1-Step' },
      { id: 'atf-250k', tierName: '250K Static', accountSize: 250000, price: 477, pointsRequired: 1590, stepType: '1-Step' },
    ]
  },
  {
    id: 'topstep',
    name: 'Topstep',
    logo: 'https://www.google.com/s2/favicons?domain=topstep.com&sz=128',
    category: 'Futures',
    featuredPlan: 'Topstep — 50K Trading Combine — $50,000 Account',
    description: 'Redeem for a Topstep 50K Trading Combine $50,000 account.',
    challengesCount: 16,
    discount: 20,
    code: 'WEALTH',
    website: 'https://topstep.com',
    affiliateUrl: 'https://topstep.com',
    brandColor: '#F0C41B',
    glowColor: 'rgba(240, 196, 27, 0.45)',
    challenges: [
      { id: 'ts-50k', tierName: 'Trading Combine', accountSize: 50000, price: 49, pointsRequired: 165, stepType: '1-Step' },
      { id: 'ts-100k', tierName: 'Trading Combine', accountSize: 100000, price: 99, pointsRequired: 330, stepType: '1-Step' },
      { id: 'ts-150k', tierName: 'Trading Combine', accountSize: 150000, price: 149, pointsRequired: 495, stepType: '1-Step' },
    ]
  }
];

const BrowseFirmsPage: React.FC = () => {
  const { mode } = useTradeMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFirm, setSelectedFirm] = useState<MarketplaceFirm | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [hoveredFirmId, setHoveredFirmId] = useState<string | null>(null);

  // Available user credits from state/localStorage (default 0 as shown in screenshot)
  const [userCredits] = useState<number>(() => {
    const saved = localStorage.getItem('propx_user_credits');
    return saved ? Number(saved) : 0;
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Filter firms by search query and trade mode if relevant
  const filteredFirms = useMemo(() => {
    return MARKETPLACE_FIRMS.filter(firm => {
      const matchesSearch = !searchTerm || 
        firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firm.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  return (
    <main className="flex-grow pt-24 sm:pt-28 pb-24 bg-[#050608] min-h-screen text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#F0C41B]/[0.03] blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ═══════════════════ MARKETPLACE HEADER (Matches Screenshot) ═══════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
              Marketplace
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              Redeem your Wealth Credits for prop firm challenges, subscriptions, gift cards, and exclusive experiences.
            </p>
          </div>

          {/* Available Credits Card (Top Right from Screenshot) */}
          <div className="rounded-2xl bg-[#0f1117] border border-white/10 px-5 py-3.5 flex items-center gap-4 shadow-xl shrink-0 self-start">
            {/* Gold Coin Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd700] via-[#F0C41B] to-[#b37f00] p-0.5 shadow-[0_0_15px_rgba(240,196,27,0.4)] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ffe57f] to-[#d49e00] flex items-center justify-center border border-[#fff2a3]/60">
                <span className="text-black font-black text-xs">W</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-neutral-400">Available credits</div>
              <div className="text-2xl font-black text-white tracking-tight leading-none mt-0.5">
                {userCredits}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════ SECTION TITLE ROW (Removed Tabs, Direct Grid) ═══════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            {/* Green Icon */}
            <div className="w-6 h-6 rounded-md bg-[#bbf426]/15 flex items-center justify-center text-[#bbf426]">
              <Building2 size={16} />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Prop Firm Challenges
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#1b2210] border border-[#bbf426]/30 text-[#bbf426] text-[10px] font-bold">
              Firms
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search firm challenges..."
              className="w-full bg-[#0d0f15] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#bbf426]/60 transition-colors"
            />
          </div>
        </div>

        {/* ═══════════════════ 3-COLUMN CARDS GRID (Matches Screenshot) ═══════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFirms.map((firm, index) => {
            const isHovered = hoveredFirmId === firm.id;
            const categoryBadgeColor = 
              firm.category === 'Forex' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
              firm.category === 'Futures' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

            return (
              <div
                key={firm.id}
                onMouseEnter={() => setHoveredFirmId(firm.id)}
                onMouseLeave={() => setHoveredFirmId(null)}
                style={{
                  boxShadow: isHovered 
                    ? `0 0 35px ${firm.glowColor}, 0 20px 40px rgba(0,0,0,0.9)` 
                    : '0 10px 28px rgba(0,0,0,0.55)'
                }}
                className="group relative rounded-2xl p-[1.5px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* ── BASE TRACK BORDER ── */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none z-0" />

                {/* ── ALWAYS ANIMATING LASER RAY BORDER (Matching Logo Color) ── */}
                <div 
                  className="absolute top-1/2 left-1/2 w-[340%] aspect-square animate-border-ray pointer-events-none z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    animationDelay: `${index * -0.6}s`,
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, ${firm.brandColor}40 310deg, ${firm.brandColor} 342deg, #ffffff 357deg, transparent 360deg)`
                    }}
                  />
                </div>

                {/* ── SOFT AURA GLOW TRAILING THE RAY ── */}
                <div 
                  className="absolute top-1/2 left-1/2 w-[340%] aspect-square animate-border-ray pointer-events-none z-0 opacity-40 group-hover:opacity-75 blur-md transition-opacity duration-300"
                  style={{
                    animationDelay: `${index * -0.6}s`,
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 260deg, ${firm.brandColor} 340deg, transparent 360deg)`
                    }}
                  />
                </div>

                {/* ── INNER CARD BODY ── */}
                <div className="relative z-10 w-full h-full rounded-[14.5px] bg-[#0c0d12] overflow-hidden flex flex-col justify-between">
                  {/* ── TOP HERO LOGO GRAPHIC BOX (Matches Screenshot) ── */}
                  <div className="h-52 sm:h-56 relative w-full flex items-center justify-center bg-gradient-to-b from-[#11141c]/95 via-[#0c0d13]/95 to-[#08090d] border-b border-white/5 overflow-hidden">
                    {/* Matching Logo Radial Glow Light */}
                    <div 
                      className="absolute w-36 h-36 rounded-full blur-2xl opacity-20 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none"
                      style={{ backgroundColor: firm.brandColor }}
                    />

                    {/* Logo Center Display with Dark Frame */}
                    <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#08090d]/90 border border-white/10 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.8)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={firm.logo}
                        alt={firm.name}
                        onError={(e) => {
                          // Fallback text avatar if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                        className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                      />
                      {/* Fallback Letter Avatar */}
                      <span className="hidden font-black text-2xl text-white">
                        {firm.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* ── CARD CONTENT BODY (Matches Screenshot) ── */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Title + Category Badge Row */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                          {firm.name}
                        </h3>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${categoryBadgeColor} shrink-0`}>
                          {firm.category}
                        </span>
                      </div>

                      {/* Highlight Challenge Plan */}
                      <div className="text-xs sm:text-[13px] font-bold text-white mb-1.5 leading-snug">
                        {firm.featuredPlan}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-2">
                        {firm.description}
                      </p>
                    </div>

                    <div>
                      {/* Challenges Row */}
                      <div className="flex items-center justify-between text-xs mb-4 pt-3 border-t border-white/5">
                        <span className="text-neutral-400">Challenges</span>
                        <span className="font-bold text-white">{firm.challengesCount} available</span>
                      </div>

                      {/* ── BOTTOM ACTION BUTTONS (Matches Screenshot) ── */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Left: View Challenges (Opens Modal) */}
                        <button
                          type="button"
                          onClick={() => setSelectedFirm(firm)}
                          className="w-full py-2.5 px-3 rounded-xl border border-white/15 hover:border-white/40 text-white font-bold text-xs sm:text-[13px] transition-all hover:bg-white/5 flex items-center justify-center cursor-pointer select-none"
                        >
                          View Challenges
                        </button>

                        {/* Right: Visit Firm (Redirects to Website) */}
                        <button
                          type="button"
                          onClick={() => window.open(firm.affiliateUrl || firm.website, '_blank', 'noopener,noreferrer')}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#bbf426] hover:bg-[#a6f208] text-black font-black text-xs sm:text-[13px] transition-all hover:scale-[1.02] shadow-[0_2px_12px_rgba(187,244,38,0.3)] flex items-center justify-center cursor-pointer select-none"
                        >
                          Visit Firm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ═══════════════════ "VIEW CHALLENGES" POPUP MODAL ═══════════════════ */}
      {selectedFirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div 
            className="relative max-w-4xl w-full bg-[#0d0f14] border border-white/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
            style={{
              boxShadow: `0 0 45px ${selectedFirm.glowColor}, 0 25px 60px rgba(0,0,0,0.95)`
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedFirm(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#141822] border border-white/10 p-2 flex items-center justify-center shrink-0">
                  <img src={selectedFirm.logo} alt={selectedFirm.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white">{selectedFirm.name}</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                      {selectedFirm.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {selectedFirm.challengesCount} available evaluation challenges with verified payout proof.
                  </p>
                </div>
              </div>

              {/* Promo Code Badge */}
              <div 
                onClick={() => copyCode(selectedFirm.code)}
                className="flex items-center gap-2 bg-[#1b1c22] hover:bg-[#252630] border border-white/10 px-3.5 py-2 rounded-xl cursor-pointer transition-colors shrink-0 self-start sm:self-auto"
                title="Click to copy promo code"
              >
                <Tag size={14} className="text-[#F0C41B]" />
                <span className="text-xs font-bold text-neutral-400">CODE:</span>
                <span className="text-xs font-black text-[#F0C41B] tracking-wider">{selectedFirm.code}</span>
                {copiedCode === selectedFirm.code ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} className="text-neutral-500" />
                )}
              </div>
            </div>

            {/* Challenges List Table */}
            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Available Challenge Sizes & Pricing</span>
                <span className="text-[#bbf426]">Claim with Wealth Points or Buy Direct</span>
              </div>

              <div className="space-y-2.5">
                {selectedFirm.challenges.map((c) => {
                  const discountedPrice = Math.round(c.price * (1 - selectedFirm.discount / 100));

                  return (
                    <div 
                      key={c.id} 
                      className="p-4 rounded-xl bg-[#12151d] border border-white/5 hover:border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                    >
                      {/* Left: Account Size & Plan Type */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-black text-sm text-white shrink-0">
                          ${(c.accountSize / 1000)}K
                        </div>
                        <div>
                          <div className="text-sm font-black text-white flex items-center gap-2">
                            <span>${c.accountSize.toLocaleString()} Account</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 uppercase">
                              {c.stepType}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            {c.tierName} • Standard Drawdown • 80-95% Profit Split
                          </div>
                        </div>
                      </div>

                      {/* Right: Price, Points, and Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        {/* Price & Discount */}
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-neutral-500 line-through">${c.price}</div>
                          <div className="text-base font-black text-white leading-tight">
                            ${discountedPrice}
                          </div>
                        </div>

                        {/* Points Required to Claim */}
                        <div className="text-left sm:text-right px-3 py-1.5 rounded-lg bg-[#bbf426]/10 border border-[#bbf426]/20 shrink-0">
                          <div className="text-[10px] font-bold text-[#bbf426] uppercase">Points Required</div>
                          <div className="text-xs font-black text-white flex items-center gap-1 sm:justify-end">
                            <Coins size={12} className="text-[#bbf426]" />
                            <span>{c.pointsRequired} pts</span>
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => window.open(selectedFirm.affiliateUrl || selectedFirm.website, '_blank', 'noopener,noreferrer')}
                            className="px-3.5 py-2 rounded-xl bg-[#bbf426] hover:bg-[#a6f208] text-black font-black text-xs transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <span>Visit & Buy</span>
                            <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <ShieldCheck size={14} className="text-green-400" />
                <span>Verified Prop Firm • Code {selectedFirm.code} applied for highest discount</span>
              </div>
              <button
                type="button"
                onClick={() => window.open(selectedFirm.affiliateUrl || selectedFirm.website, '_blank', 'noopener,noreferrer')}
                className="text-xs font-black text-white hover:text-[#bbf426] transition-colors flex items-center gap-1 self-end sm:self-auto cursor-pointer"
              >
                <span>Go to Official {selectedFirm.name} Site</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BrowseFirmsPage;
