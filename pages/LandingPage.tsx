import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Flame, Gift, Trophy, Zap, ShieldCheck, Sparkles, CheckCircle2, ChevronDown, Award, Percent, DollarSign, Tag, BarChart3, Users, Check, MessageSquare, Globe } from 'lucide-react';
import { formatFunding } from '../lib/format';
import { PropFirm } from '../types';
import { useTradeMode } from '../context/TradeModeContext';
import { FirmService } from '../lib/services';
import PropDealsTable from '../components/PropDealsTable';
import KineticGrid from '../components/KineticGrid';

// FAQ Accordion Item Component
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-[#F0C41B]/40' : ''}`}>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${isOpen ? 'from-[#F0C41B]/10 via-[#F0C41B]/5 to-transparent' : 'from-white/[0.04] via-white/[0.02] to-white/[0.01]'} transition-all duration-300`}></div>
      <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]/95 backdrop-blur-md"></div>
      <button onClick={() => setIsOpen(!isOpen)} className="relative z-[2] w-full flex items-center justify-between p-6 text-left cursor-pointer">
        <span className={`font-bold text-base sm:text-lg ${isOpen ? 'text-[#F0C41B]' : 'text-white'} transition-colors pr-4`}>{question}</span>
        <ChevronDown size={20} className={`text-neutral-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F0C41B]' : ''}`} />
      </button>
      <div className={`relative z-[2] overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-6 pb-6 text-neutral-400 text-sm sm:text-base leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const { mode, getModePath } = useTradeMode();
  const [topFirms, setTopFirms] = useState<PropFirm[]>([]);
  const [copiedFirm, setCopiedFirm] = useState<{name: string; logo: string; rating: number; code: string; discount: string; website: string; affiliate: string} | null>(null);
  const modeLabel = mode === 'futures' ? 'Futures' : mode === 'crypto' ? 'Crypto' : 'Prop';

  // Static logos for the infinite ticker
  const TICKER_LOGOS = [
    { name: 'Goat Funded Trader', logo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif' },
    { name: 'ATS Funded', logo: 'https://atsfunded.com/ats-logo.png' },
    { name: 'Blueberry Funded', logo: 'https://blueberryfunded.com/wp-content/themes/blueberryfunded-xmas/assets/img/logo.svg' },
    { name: 'Funding Pips', logo: 'https://media.propxwealth.com/system/b5filxasbwwrg110uhxvgv4v/675854fe6df8f98dc09b6caf_FundingPips-Logotype.svg' },
    { name: 'Alpha Capital', logo: 'https://alphacapitalgroup.uk/static/media/companyLogoInitials.879d8bbc8b528b1fd27761f4e43c34a0.svg' },
    { name: 'The5ers', logo: 'https://the5ers.com/images/menu/logo.svg' },
    { name: 'FundedNext', logo: 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundednext%20logo_White%20(1).png&w=384&q=75' },
    { name: 'E8 Markets', logo: 'https://e8markets.com/images/logo/logo.svg' },
  ];

  const tickerFirms = useMemo(() => {
    return [...TICKER_LOGOS, ...TICKER_LOGOS, ...TICKER_LOGOS];
  }, []);

  // Copy promo code handler
  const handleCopyCode = (firm: PropFirm) => {
    const code = firm.promoCode || 'WEALTHX';
    navigator.clipboard.writeText(code).then(() => {
      setCopiedFirm({
        name: firm.name,
        logo: firm.logo,
        rating: Number(firm.rating),
        code,
        discount: firm.discountValue ? `${firm.discountValue}% OFF` : 'Exclusive Deal',
        website: firm.websiteUrl || '',
        affiliate: firm.affiliateLink || firm.websiteUrl || ''
      });
      setTimeout(() => setCopiedFirm(null), 4000);
    });
  };

  useEffect(() => {
    fetchTopFirms();
  }, [mode]);

  const fetchTopFirms = async () => {
    try {
      const firms = await FirmService.getActiveFirms(mode);
      const getFaviconUrl = (websiteUrl: string | null | undefined, fallbackLogo: string | null) => {
        if (!websiteUrl) return fallbackLogo || 'https://placehold.co/400x400/181611/F6AE13?text=No+Logo';
        try {
          const hostname = new URL(websiteUrl).hostname;
          return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
        } catch {
          return fallbackLogo || 'https://placehold.co/400x400/181611/F6AE13?text=No+Logo';
        }
      };

      const mappedFirms = firms.map(f => ({
        ...f,
        favicon: getFaviconUrl(f.websiteUrl || f.website, f.logo)
      }));

      setTopFirms(mappedFirms.slice(0, 12));
    } catch (err) {
      console.error("Error fetching top firms for landing:", err);
    }
  };

  return (
    <KineticGrid globalColor="monochrome">
      <div className="flex flex-col min-h-screen text-white overflow-x-hidden bg-[#050505] font-sans">

        {/* ═══════════════════ CINEMATIC HERO SECTION (FITS IN ONE FRAME) ═══════════════════ */}
        <section className="relative w-full min-h-screen lg:h-screen lg:max-h-[900px] flex flex-col justify-between items-center pt-24 sm:pt-28 lg:pt-32 pb-5 sm:pb-6 text-center overflow-hidden">
          
          {/* ── FULL-WIDTH CINEMATIC BACKGROUND (Matches reference image with light beams & rocky terrain, no square grid) ── */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            {/* Pure Black Base */}
            <div className="absolute inset-0 bg-[#050505]" />
            
            {/* High-Resolution Cinematic Hero Background */}
            <img 
              src="/hero-bg.jpg" 
              alt="Cinematic Background" 
              className="w-full h-full object-cover object-center opacity-95 pointer-events-none select-none"
            />

            {/* Soft Ambient Core Glow behind Center Emblem */}
            <div 
              className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[600px] h-[350px] pointer-events-none opacity-40 blur-[80px]"
              style={{
                background: 'radial-gradient(circle, rgba(240, 196, 27, 0.4) 0%, rgba(240, 196, 27, 0.08) 55%, transparent 80%)'
              }}
            />

            {/* Subtle Gradient Vignette to seamlessly blend top navbar and bottom edges */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]/70" />
          </div>

          {/* ── CENTERED HERO CONTENT CONTAINER (Unified flex column aligned with navbar) ── */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between items-center h-full flex-1">

            {/* ── Top Header Title Block (Shifted up with clean navbar clearance) ── */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-0 sm:pt-1">
              
              {/* Small Gold Eyebrow */}
              <div className="text-[11px] sm:text-xs font-bold tracking-[0.35em] text-[#E5B824] uppercase mb-1.5">
                THE PROP TRADER'S ADVANTAGE
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-black tracking-tight leading-[1.04] mb-1.5">
                <span className="block text-white">TRADE MORE.</span>
                <span className="block bg-gradient-to-r from-[#F7CD37] via-[#FFE071] to-[#E2B019] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(240,196,27,0.45)]">
                  GET REWARDED.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="max-w-lg mx-auto text-neutral-300 text-xs sm:text-sm leading-normal mb-2 sm:mb-3">
                Compare prop firms. Unlock exclusive deals.<br className="hidden sm:block" />
                Earn rewards on every challenge — only at Prop X Wealth.
              </p>

            </div>

            {/* ── Central 3D Visual & 3D Tilted Floating Cards ── */}
            <div className="relative w-full max-w-4xl mx-auto my-auto flex flex-col items-center justify-center">
              
              {/* Ambient Radial Core Glow */}
              <div className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[360px] h-[260px] sm:h-[360px] bg-[#F0C41B]/15 rounded-full blur-[80px] pointer-events-none -z-10" />

              {/* 3D Stack: Emblem + New Rock Stand + Buttons */}
              <div className="relative flex flex-col items-center justify-center w-full max-w-2xl lg:max-w-3xl">
                
                {/* Floating Gold "W" Token Emblem */}
                <div className="relative z-20 animate-float transition-transform duration-500 hover:scale-105 cursor-pointer">
                  <img 
                    src="/w-emblem.png" 
                    alt="PROPxWEALTH Gold Emblem" 
                    className="w-[180px] sm:w-[220px] md:w-[250px] h-auto object-contain drop-shadow-[0_15px_35px_rgba(240,196,27,0.4)]"
                  />
                </div>

                {/* Concentrated Golden Glow on Rock Stand Top Surface */}
                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-[220px] sm:w-[320px] h-[60px] sm:h-[80px] bg-gradient-to-t from-[#F0C41B]/45 via-[#ffe46b]/25 to-transparent blur-xl pointer-events-none z-10" />

                {/* New Authentic Lava Rock Stand Base */}
                <div className="relative -mt-10 sm:-mt-14 md:-mt-16 z-10 w-full max-w-[520px] sm:max-w-[680px] md:max-w-[780px] pointer-events-none">
                  <img 
                    src="/rock-stand.png" 
                    alt="Cracked Lava Stone Stand" 
                    className="w-full h-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] select-none pointer-events-none"
                  />
                </div>

                {/* CTA Buttons Nestled on the Front Face of the Rock Stand */}
                <div className="relative -mt-16 sm:-mt-20 md:-mt-24 mb-4 sm:mb-6 z-20 flex items-center justify-center gap-3 sm:gap-4">
                  <Link to={getModePath('/offers')}>
                    <button className="bg-[#F0C41B] hover:bg-[#ffe359] text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-[0_0_25px_rgba(240,196,27,0.45)] hover:shadow-[0_0_40px_rgba(240,196,27,0.75)] hover:scale-[1.04] active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer">
                      <span>Start Earning</span>
                      <ArrowRight size={16} className="stroke-[2.5]" />
                    </button>
                  </Link>

                  <Link to={getModePath('/firms')}>
                    <button className="bg-[#101116]/85 hover:bg-white/10 text-white font-bold text-xs sm:text-sm px-6 py-2.5 sm:px-7 sm:py-3 rounded-full border border-white/15 hover:border-[#F0C41B]/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer">
                      Explore Firms
                    </button>
                  </Link>
                </div>

                {/* ── 3D TILTED FLOATING CARDS (DESKTOP) ── */}

                {/* CARD 1: TOP LEFT - Up to 90% OFF (Aligned with Upper-Left of Logo Card) */}
                <div 
                  className="hidden md:block absolute top-0 sm:top-1 right-[calc(50%+108px)] sm:right-[calc(50%+122px)] lg:right-[calc(50%+134px)] animate-float z-30 pointer-events-auto" 
                  style={{ animationDelay: '0s' }}
                >
                  <div 
                    className="bg-[#0b0c11]/85 border border-white/[0.12] hover:border-[#F0C41B]/50 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_15px_rgba(240,196,27,0.06)] flex items-center gap-3 text-left transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
                    style={{
                      transform: 'perspective(600px) rotateY(16deg) rotateX(4deg) rotateZ(-2deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] shrink-0">
                      <Tag size={19} className="stroke-[2.2] fill-[#F0C41B]/20" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 leading-tight">Up to</div>
                      <div className="text-sm sm:text-base font-black text-white leading-tight">90% OFF</div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: BOTTOM LEFT - Compare 50+ Firms (Aligned with Lower-Left of Logo Card) */}
                <div 
                  className="hidden md:block absolute top-30 sm:top-34 lg:top-38 right-[calc(50%+116px)] sm:right-[calc(50%+130px)] lg:right-[calc(50%+142px)] animate-float z-30 pointer-events-auto" 
                  style={{ animationDelay: '1.4s' }}
                >
                  <div 
                    className="bg-[#0b0c11]/85 border border-white/[0.12] hover:border-[#F0C41B]/50 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_15px_rgba(240,196,27,0.06)] flex items-center gap-3 text-left transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
                    style={{
                      transform: 'perspective(600px) rotateY(16deg) rotateX(-5deg) rotateZ(1deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] shrink-0">
                      <BarChart3 size={19} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 leading-tight">Compare</div>
                      <div className="text-sm sm:text-base font-black text-white leading-tight">50+ Firms</div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: TOP RIGHT - Earn Rewards (Aligned with Upper-Right of Logo Card) */}
                <div 
                  className="hidden md:block absolute top-0 sm:top-1 left-[calc(50%+108px)] sm:left-[calc(50%+122px)] lg:left-[calc(50%+134px)] animate-float z-30 pointer-events-auto" 
                  style={{ animationDelay: '0.7s' }}
                >
                  <div 
                    className="bg-[#0b0c11]/85 border border-white/[0.12] hover:border-[#F0C41B]/50 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_15px_rgba(240,196,27,0.06)] flex items-center gap-3 text-left transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
                    style={{
                      transform: 'perspective(600px) rotateY(-16deg) rotateX(4deg) rotateZ(2deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] shrink-0">
                      <Gift size={19} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-black text-white leading-tight">Earn Rewards</div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 leading-tight">On Every Purchase</div>
                    </div>
                  </div>
                </div>

                {/* CARD 4: BOTTOM RIGHT - Exclusive Perks (Aligned with Lower-Right of Logo Card) */}
                <div 
                  className="hidden md:block absolute top-30 sm:top-34 lg:top-38 left-[calc(50%+116px)] sm:left-[calc(50%+130px)] lg:left-[calc(50%+142px)] animate-float z-30 pointer-events-auto" 
                  style={{ animationDelay: '2.1s' }}
                >
                  <div 
                    className="bg-[#0b0c11]/85 border border-white/[0.12] hover:border-[#F0C41B]/50 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_15px_rgba(240,196,27,0.06)] flex items-center gap-3 text-left transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
                    style={{
                      transform: 'perspective(600px) rotateY(-16deg) rotateX(-5deg) rotateZ(-1deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] shrink-0">
                      <Zap size={19} className="stroke-[2.2] fill-[#F0C41B]/20" />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-black text-white leading-tight">Exclusive Perks</div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 leading-tight">Only at Prop X Wealth</div>
                    </div>
                  </div>
                </div>

              </div>

          </div>

          {/* Mobile Cards (Compact 2x2 grid below visual on phones) */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-3 md:hidden z-20">
              <div className="bg-[#0c0d12]/90 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-left">
                <Tag size={15} className="text-[#F0C41B] shrink-0" />
                <div>
                  <div className="text-[9px] text-neutral-400 leading-none">Up to</div>
                  <div className="text-xs font-bold text-white mt-0.5">90% OFF</div>
                </div>
              </div>
              <div className="bg-[#0c0d12]/90 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-left">
                <Gift size={15} className="text-[#F0C41B] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white leading-none">Earn Rewards</div>
                  <div className="text-[9px] text-neutral-400 mt-0.5">On Purchases</div>
                </div>
              </div>
              <div className="bg-[#0c0d12]/90 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-left">
                <BarChart3 size={15} className="text-[#F0C41B] shrink-0" />
                <div>
                  <div className="text-[9px] text-neutral-400 leading-none">Compare</div>
                  <div className="text-xs font-bold text-white mt-0.5">50+ Firms</div>
                </div>
              </div>
              <div className="bg-[#0c0d12]/90 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-left">
                <Zap size={15} className="text-[#F0C41B] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white leading-none">Exclusive Perks</div>
                  <div className="text-[9px] text-neutral-400 mt-0.5">Prop X Wealth</div>
                </div>
              </div>
            </div>

            {/* ── Bottom Section: Horizontal Stats Bar & Metrics ── */}
            <div className="w-full flex flex-col items-center pt-2 pb-1 sm:pb-2">
              {/* Horizontal Stats Bar Card */}
              <div className="w-full max-w-4xl lg:max-w-5xl mx-auto bg-[#0a0b0f]/85 border border-white/10 rounded-2xl backdrop-blur-xl px-4 py-2 sm:px-6 sm:py-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y-0 divide-x-0 md:divide-x divide-white/10">
                  
                  {/* 50+ Verified Top Futures Firms */}
                  <div className="flex items-center gap-3 px-2 sm:px-3 justify-center md:justify-start">
                    <div className="w-8 h-8 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-lg sm:text-xl font-black text-white leading-tight">50+</div>
                      <div className="text-[10px] sm:text-[11px] text-neutral-400 font-medium leading-tight">
                        {mode === 'crypto' ? 'Verified Top Crypto Firms' : mode === 'forex' ? 'Verified Top Prop Firms' : 'Verified Top Futures Firms'}
                      </div>
                    </div>
                  </div>

                  {/* 1,000+ Evaluation Challenges */}
                  <div className="flex items-center gap-3 px-2 sm:px-3 justify-center md:justify-start">
                    <div className="w-8 h-8 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] shrink-0">
                      <Trophy size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-lg sm:text-xl font-black text-white leading-tight">1,000+</div>
                      <div className="text-[10px] sm:text-[11px] text-neutral-400 font-medium leading-tight">Evaluation Challenges</div>
                    </div>
                  </div>

                  {/* 9,000+ Real Trader Reviews */}
                  <div className="flex items-center gap-3 px-2 sm:px-3 justify-center md:justify-start">
                    <div className="w-8 h-8 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] shrink-0">
                      <MessageSquare size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-lg sm:text-xl font-black text-white leading-tight">9,000+</div>
                      <div className="text-[10px] sm:text-[11px] text-neutral-400 font-medium leading-tight">Real Trader Reviews</div>
                    </div>
                  </div>

                  {/* 4M+ Monthly Website Views */}
                  <div className="flex items-center gap-3 px-2 sm:px-3 justify-center md:justify-start">
                    <div className="w-8 h-8 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] shrink-0">
                      <Globe size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-lg sm:text-xl font-black text-white leading-tight">4M+</div>
                      <div className="text-[10px] sm:text-[11px] text-neutral-400 font-medium leading-tight">Monthly Website Views</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ════════════════ TRUST SECTION & LOGO TICKER ════════════════ */}
        <section className="relative z-10 mt-12 sm:mt-16 md:mt-20 py-9 sm:py-11 bg-white/[0.02] border-y border-white/[0.06] overflow-hidden">
          <div className="text-center text-[10px] sm:text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase mb-4">
            TRUSTED BY TRADERS WORLDWIDE
          </div>
          <div className="flex gap-12 items-center animate-grid-flow whitespace-nowrap opacity-70">
            {tickerFirms.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 shrink-0 px-4">
                <img src={item.logo} alt={item.name} className="h-6 sm:h-7 object-contain max-w-[120px] filter brightness-90 contrast-125 grayscale hover:grayscale-0 transition-all" />
                <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════ FEATURED DEALS & PROP FIRMS TABLE ════════════════ */}
        <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F0C41B]/10 border border-[#F0C41B]/20 text-[#F0C41B] text-xs font-bold uppercase tracking-wider mb-2">
                <Flame size={14} /> Hot Deals & Offers
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Compare Top {modeLabel} Prop Firms
              </h2>
            </div>
            <Link to={getModePath('/firms')} className="inline-flex items-center gap-2 text-sm font-bold text-[#F0C41B] hover:underline">
              <span>View All 50+ Prop Firms</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <PropDealsTable firms={topFirms} onCopyCode={handleCopyCode} />
        </section>

        {/* ════════════════ REWARDS & TOKEN STORE SECTION ════════════════ */}
        <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
          <div className="rounded-3xl bg-gradient-to-b from-[#141418]/90 via-[#0d0d10]/95 to-[#09090b]/90 border border-[#F0C41B]/30 p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(240,196,27,0.12)]">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#F0C41B]/10 text-[#F0C41B] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F0C41B]/20">
                  <Gift size={14} /> Token Cashback Ecosystem
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                  Earn Wealth Tokens<br />
                  <span className="text-[#F0C41B]">Redeem Free Challenges & Reset Perks</span>
                </h2>
                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                  Every time you buy a funded evaluation using code <strong>WEALTHX</strong> or post verified payout proof, you earn Wealth Tokens directly into your trader wallet.
                </p>

                <div className="space-y-3.5 mb-8">
                  <div className="flex items-center gap-3 text-sm sm:text-base font-semibold text-neutral-200">
                    <CheckCircle2 size={18} className="text-[#F0C41B] shrink-0" />
                    <span>Free Evaluation Accounts & Resets</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm sm:text-base font-semibold text-neutral-200">
                    <CheckCircle2 size={18} className="text-[#F0C41B] shrink-0" />
                    <span>+10% Extra Profit Split Vouchers</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm sm:text-base font-semibold text-neutral-200">
                    <CheckCircle2 size={18} className="text-[#F0C41B] shrink-0" />
                    <span>VIP Trading Discord Signals & Tools</span>
                  </div>
                </div>

                <Link to={getModePath('/rewards')}>
                  <button className="bg-[#F0C41B] hover:bg-[#ffe359] text-black font-black px-8 py-3.5 rounded-full transition-colors flex items-center gap-2 text-sm sm:text-base shadow-[0_0_25px_rgba(240,196,27,0.35)] cursor-pointer">
                    <span>Explore Rewards Store</span>
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                  <Trophy size={32} className="text-[#F0C41B] mx-auto mb-3" />
                  <div className="font-bold text-lg text-white">Free Accounts</div>
                  <div className="text-xs text-neutral-400 mt-1 leading-relaxed">Redeem tokens for $50K–$200K evaluations</div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                  <Zap size={32} className="text-[#F0C41B] mx-auto mb-3" />
                  <div className="font-bold text-lg text-white">Instant Resets</div>
                  <div className="text-xs text-neutral-400 mt-1 leading-relaxed">Free reset codes for failed challenges</div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                  <ShieldCheck size={32} className="text-[#F0C41B] mx-auto mb-3" />
                  <div className="font-bold text-lg text-white">Payout Assurance</div>
                  <div className="text-xs text-neutral-400 mt-1 leading-relaxed">Verified payouts & trader protection</div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                  <Sparkles size={32} className="text-[#F0C41B] mx-auto mb-3" />
                  <div className="font-bold text-lg text-white">+100 Sign up Bonus</div>
                  <div className="text-xs text-neutral-400 mt-1 leading-relaxed">Instant tokens on Google/Discord sign up</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════ WHY CHOOSE PROPxWEALTH ════════════════ */}
        <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Why Traders Choose PROPxWEALTH</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Built by traders for traders. Unlock maximum value from every challenge purchase.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-[#121215] border border-white/10 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] mb-5">
                <Percent size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Code WEALTHX Savings</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Access highest verified discount codes directly from partner prop firms to save up to 50% on challenge fees.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#121215] border border-white/10 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] mb-5">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tokenized Cashback</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Earn Wealth Tokens on every purchase. Accumulate tokens to claim free evaluation accounts and resets.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#121215] border border-white/10 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Payout Proofs</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Browse verified payout proofs, real trader feedback, and transparent rule breakdowns before buying.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════ FREQUENTLY ASKED QUESTIONS ════════════════ */}
        <section className="relative z-10 py-16 px-4 sm:px-6 max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Everything you need to know about PROPxWEALTH discounts and tokens.</p>
          </div>

          <div className="space-y-4">
            <FaqItem 
              question="How do I use the promo code WEALTHX?"
              answer="Simply click any firm deal on PROPxWEALTH, copy the code WEALTHX, and enter it at checkout on the prop firm's website to instantly receive the highest available discount."
            />
            <FaqItem 
              question="How do Wealth Tokens work?"
              answer="Wealth Tokens are cashback rewards earned every time you buy a challenge or leave a verified review. You can redeem tokens in our Rewards Store for free challenge accounts, account resets, and exclusive perks."
            />
            <FaqItem 
              question="Are the prop firms listed on PROPxWEALTH verified?"
              answer="Yes. We strictly vet and list proprietary trading firms with verified payout track records, transparent drawdown rules, and active community reputation."
            />
            <FaqItem 
              question="Is PROPxWEALTH free to use?"
              answer="100% free! You can search, compare, and use exclusive discount codes without paying any subscription fee."
            />
          </div>
        </section>

        {/* ════════════════ BOTTOM CTA BANNER ════════════════ */}
        <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
          <div className="rounded-3xl bg-gradient-to-r from-[#181611] via-[#241f12] to-[#181611] border border-[#F0C41B]/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_0_60px_rgba(240,196,27,0.15)]">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Ready to Trade & <span className="text-[#F0C41B]">Get Rewarded?</span>
              </h2>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8">
                Join thousands of funded traders using PROPxWEALTH to save on evaluations and earn cashback tokens.
              </p>
              <Link to={getModePath('/firms')}>
                <button className="bg-[#F0C41B] hover:bg-[#ffe359] text-black font-black text-base sm:text-lg px-9 py-4 rounded-full shadow-[0_0_40px_rgba(240,196,27,0.6)] hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2">
                  <span>Explore Top Prop Firms</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </KineticGrid>
  );
};

export default LandingPage;
