import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Flame, Gift, Trophy, Zap, ShieldCheck, Sparkles, CheckCircle2, ChevronDown, Award, Percent, DollarSign, Tag, BarChart3, Users, Check, MessageSquare, Globe } from 'lucide-react';
import { formatFunding } from '../lib/format';
import { PropFirm } from '../types';
import { useTradeMode } from '../context/TradeModeContext';
import { FirmService } from '../lib/services';
import PropDealsTable from '../components/PropDealsTable';
import ChallengeOptionsTable from '../components/ChallengeOptionsTable';
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

// ── MINIMAL TICKER FIRM ITEM (NO DUPLICATE TEXT & TIGHT SPACING) ──
interface TickerItemProps {
  name: string;
  logo: string;
  domain?: string;
  isWordmark?: boolean;
}

const TickerFirmItem: React.FC<TickerItemProps> = ({ name, logo, domain, isWordmark }) => {
  const [imgSrc, setImgSrc] = useState(logo);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (domain && !imgSrc.includes('google.com/s2/favicons')) {
      setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0 select-none group/ticker opacity-75 hover:opacity-100 transition-opacity">
      {!hasError ? (
        <img
          src={imgSrc}
          alt={name}
          onError={handleError}
          className="h-5 sm:h-6 max-w-[125px] w-auto object-contain filter brightness-105 contrast-125"
        />
      ) : (
        <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center font-black text-[9px] text-[#F0C41B]">
          {name.substring(0, 2).toUpperCase()}
        </div>
      )}
      {/* Remove redundant text for logos that already include the brand wordmark */}
      {!isWordmark && (
        <span className="text-[11px] sm:text-xs font-semibold text-neutral-300 group-hover/ticker:text-white tracking-wider uppercase whitespace-nowrap">
          {name}
        </span>
      )}
    </div>
  );
};

// Authentic Gold Wealth Coin with embossed 'W' logo for the interactive rain effect
const GoldWealthCoin: React.FC<{ size: number }> = ({ size }) => (
  <div 
    style={{ width: `${size}px`, height: `${size}px` }} 
    className="relative flex items-center justify-center filter drop-shadow-[0_4px_14px_rgba(240,196,27,0.75)] select-none pointer-events-none"
  >
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id={`coinRimGold-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8cf" />
          <stop offset="25%" stopColor="#F0C41B" />
          <stop offset="65%" stopColor="#aa7600" />
          <stop offset="100%" stopColor="#ffd84d" />
        </linearGradient>
        <radialGradient id={`coinFaceGold-${size}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fffde6" />
          <stop offset="35%" stopColor="#F0C41B" />
          <stop offset="80%" stopColor="#b37c00" />
          <stop offset="100%" stopColor="#664600" />
        </radialGradient>
      </defs>

      {/* Outer Coin Base & Rim */}
      <circle cx="50" cy="50" r="48" fill={`url(#coinRimGold-${size})`} stroke="#4d3500" strokeWidth="2.5" />
      {/* Outer Grooves Ring */}
      <circle cx="50" cy="50" r="43" fill="none" stroke="#ffe57f" strokeWidth="1.6" strokeDasharray="3.5 2.5" />
      {/* Coin Face Plate */}
      <circle cx="50" cy="50" r="38" fill={`url(#coinFaceGold-${size})`} stroke="#8c6100" strokeWidth="1.5" />
      
      {/* Bold Embossed 'W' Logo */}
      <path 
        d="M26 33 L37 68 L48 44 L52 44 L63 68 L74 33 L65 33 L58 57 L51 39 L49 39 L42 57 L35 33 Z" 
        fill="#121214" 
        stroke="#4a3700" 
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Top Specular Arc Reflection */}
      <path d="M24 24 A 36 36 0 0 1 76 24" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

const LandingPage: React.FC = () => {
  const { mode, getModePath } = useTradeMode();
  const [topFirms, setTopFirms] = useState<PropFirm[]>([]);
  const [copiedFirm, setCopiedFirm] = useState<{name: string; logo: string; rating: number; code: string; discount: string; website: string; affiliate: string} | null>(null);
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
  const toggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };
  const modeLabel = mode === 'futures' ? 'Futures' : mode === 'crypto' ? 'Crypto' : 'Prop';

  // ── GOLD COIN RAIN EASTER EGG (Triggered by clicking middle W emblem) ──
  const [isFlippingLogo, setIsFlippingLogo] = useState(false);
  const [isRainingCoins, setIsRainingCoins] = useState(false);
  const [rainingCoins, setRainingCoins] = useState<Array<{
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    drift: number;
    spinSpeed: number;
  }>>([]);
  const rainTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerGoldenRain = () => {
    if (rainTimeoutRef.current) clearTimeout(rainTimeoutRef.current);
    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);

    setIsFlippingLogo(true);

    // Spawn 50 randomized gold coins with embedded 'W' logo
    const coins = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 95 + 2.5, // 2.5% to 97.5% across screen
      size: Math.floor(Math.random() * 24) + 32, // 32px to 56px
      duration: Number((Math.random() * 1.5 + 2.4).toFixed(2)), // 2.4s to 3.9s
      delay: Number((Math.random() * 1.6).toFixed(2)), // staggered 0s to 1.6s
      drift: Math.floor(Math.random() * 90) - 45, // -45px to +45px drift
      spinSpeed: Number((Math.random() * 0.7 + 0.7).toFixed(2)), // 0.7s to 1.4s 3D tumble
    }));

    setRainingCoins(coins);
    setIsRainingCoins(true);

    // Flip duration: 1.6s (completes 3 full 360° side-by-side spins = 1080°)
    flipTimeoutRef.current = setTimeout(() => {
      setIsFlippingLogo(false);
    }, 1600);

    // Gold rain lasts for 4.2 seconds (between 3 to 5 seconds)
    rainTimeoutRef.current = setTimeout(() => {
      setIsRainingCoins(false);
      setRainingCoins([]);
    }, 4200);
  };

  // Intersection observer to trigger smooth sequential slide-in from left when scrolled into view
  const [stepsVisible, setStepsVisible] = useState(false);
  const stepsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStepsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (stepsSectionRef.current) {
      observer.observe(stepsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Static logos for the infinite running ticker with verified URLs & fallbacks
  const TICKER_LOGOS: { name: string; logo: string; domain: string; isWordmark?: boolean }[] = [
    { 
      name: 'Goat Funded Trader', 
      logo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif',
      domain: 'goatfundedtrader.com',
      isWordmark: true
    },
    { 
      name: 'Blue Guardian', 
      logo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
      domain: 'blueguardian.com',
      isWordmark: true
    },
    { 
      name: 'FundedNext', 
      logo: 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundednext%20logo_White%20(1).png&w=384&q=75',
      domain: 'fundednext.com',
      isWordmark: true
    },
    { 
      name: 'Funding Pips', 
      logo: 'https://www.google.com/s2/favicons?domain=fundingpips.com&sz=128',
      domain: 'fundingpips.com'
    },
    { 
      name: 'E8 Markets', 
      logo: 'https://www.google.com/s2/favicons?domain=e8markets.com&sz=128',
      domain: 'e8markets.com'
    },
    { 
      name: 'Alpha Capital', 
      logo: 'https://alphacapitalgroup.uk/wp-content/uploads/2023/04/Logo-White.png',
      domain: 'alphacapitalgroup.uk',
      isWordmark: true
    },
    { 
      name: 'The 5ers', 
      logo: 'https://the5ers.com/images/menu/logo.svg',
      domain: 'the5ers.com',
      isWordmark: true
    },
    { 
      name: 'Topstep', 
      logo: 'https://www.google.com/s2/favicons?domain=topstep.com&sz=128',
      domain: 'topstep.com'
    },
    { 
      name: 'ATS Funded', 
      logo: 'https://www.google.com/s2/favicons?domain=atsfunded.com&sz=128',
      domain: 'atsfunded.com'
    },
    { 
      name: 'Blueberry Funded', 
      logo: 'https://www.google.com/s2/favicons?domain=blueberryfunded.com&sz=128',
      domain: 'blueberryfunded.com'
    },
    { 
      name: 'Apex Trader Funding', 
      logo: 'https://www.google.com/s2/favicons?domain=apextraderfunding.com&sz=128',
      domain: 'apextraderfunding.com'
    }
  ];

  const tickerFirms = useMemo(() => {
    // 2 duplicates is mathematically exact for seamless 0% to -50% translateX loop
    return [...TICKER_LOGOS, ...TICKER_LOGOS];
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
                
                {/* Floating Gold "W" Token Emblem (Click to Flip & Trigger 3-5s Golden Coin Rain) */}
                <div 
                  onClick={triggerGoldenRain}
                  title="Click to flip & trigger Golden Wealth Rain! 🪙"
                  className={`relative z-20 cursor-pointer select-none group transition-transform duration-300 ${
                    isFlippingLogo ? 'animate-emblem-flip' : 'animate-float hover:scale-110 active:scale-95'
                  }`}
                  style={{ perspective: '1200px' }}
                >
                  {/* Dynamic Golden Flare Burst on Click */}
                  {isFlippingLogo && (
                    <div className="absolute inset-0 rounded-full bg-[#F0C41B]/45 blur-2xl animate-ping pointer-events-none" />
                  )}

                  <img 
                    src="/w-emblem.png" 
                    alt="PROPxWEALTH Gold Emblem" 
                    className="w-[180px] sm:w-[220px] md:w-[250px] h-auto object-contain drop-shadow-[0_15px_35px_rgba(240,196,27,0.45)]"
                  />

                  {/* Micro hover pill indicator */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-30">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/90 text-[#F0C41B] border border-[#F0C41B]/40 text-[9px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(240,196,27,0.5)] flex items-center gap-1">
                      <span>🪙 CLICK FOR RAIN</span>
                    </span>
                  </div>
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

                {/* CARD 1: TOP LEFT - Up to 90% OFF */}
                <div 
                  className="hidden md:block absolute top-0 sm:top-1 right-[calc(50%+108px)] sm:right-[calc(50%+122px)] lg:right-[calc(50%+134px)] animate-float z-30 pointer-events-auto" 
                  style={{ animationDelay: '0s' }}
                >
                  <div 
                    onClick={() => toggleCardFlip('card-1')}
                    className="relative cursor-pointer select-none transition-transform duration-300 hover:scale-105"
                    style={{ perspective: '800px' }}
                    title="Click to flip"
                  >
                    <div 
                      className="relative transition-transform duration-700 ease-out"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flippedCards['card-1']
                          ? 'perspective(600px) rotateY(196deg) rotateX(4deg) rotateZ(-2deg)'
                          : 'perspective(600px) rotateY(16deg) rotateX(4deg) rotateZ(-2deg)'
                      }}
                    >
                      {/* FRONT FACE */}
                      <div 
                        className="relative bg-[#0c0d13]/90 border border-white/[0.14] hover:border-[#F0C41B]/60 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(240,196,27,0.12),inset_0_1px_1px_rgba(255,225,120,0.3)] flex items-center gap-3 text-left whitespace-nowrap min-w-[178px] sm:min-w-[195px]"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden'
                        }}
                      >
                        {/* Glowing Top Light Ray */}
                        <div className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B]/75 to-transparent pointer-events-none" />
                        {/* Subtle Corner Sparkle */}
                        <div className="absolute -top-1.5 -left-1.5 pointer-events-none opacity-50 animate-pulse">
                          <Sparkles size={12} className="text-[#F0C41B] drop-shadow-[0_0_6px_rgba(240,196,27,0.6)]" />
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/25 flex items-center justify-center text-[#F0C41B] shrink-0 shadow-[0_0_10px_rgba(240,196,27,0.15)]">
                          <Tag size={19} className="stroke-[2.2] fill-[#F0C41B]/20" />
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 leading-tight">Up to</div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight">90% OFF</div>
                        </div>
                      </div>

                      {/* BACK FACE - W LOGO */}
                      <div 
                        className="absolute inset-0 bg-[#0c0d13]/95 border border-[#F0C41B]/50 hover:border-[#F0C41B]/80 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(240,196,27,0.25),inset_0_1px_2px_rgba(255,225,120,0.35)] flex items-center gap-3 text-left whitespace-nowrap overflow-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        {/* Glowing Top Light Ray */}
                        <div className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B] to-transparent pointer-events-none" />
                        {/* Subtle Corner Sparkle */}
                        <div className="absolute -top-1.5 -right-1.5 pointer-events-none opacity-60 animate-pulse">
                          <Sparkles size={12} className="text-[#F0C41B] drop-shadow-[0_0_6px_rgba(240,196,27,0.7)]" />
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#F0C41B]/25 to-[#F0C41B]/10 border border-[#F0C41B]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(240,196,27,0.3)] p-0.5">
                          <img src="/w-emblem.png" alt="W Logo" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(240,196,27,0.6)]" />
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-[#F0C41B] tracking-wider uppercase leading-tight">PROPxWEALTH</div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight">Max 90% Deals</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: BOTTOM LEFT - Compare 50+ Firms */}
                <div 
                  className="hidden md:block absolute top-30 sm:top-34 lg:top-38 right-[calc(50%+116px)] sm:right-[calc(50%+130px)] lg:right-[calc(50%+142px)] animate-float z-30 pointer-events-auto" 
                  style={{ animationDelay: '1.4s' }}
                >
                  <div 
                    onClick={() => toggleCardFlip('card-2')}
                    className="relative cursor-pointer select-none transition-transform duration-300 hover:scale-105"
                    style={{ perspective: '800px' }}
                    title="Click to flip"
                  >
                    <div 
                      className="relative transition-transform duration-700 ease-out"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flippedCards['card-2']
                          ? 'perspective(600px) rotateY(196deg) rotateX(-5deg) rotateZ(1deg)'
                          : 'perspective(600px) rotateY(16deg) rotateX(-5deg) rotateZ(1deg)'
                      }}
                    >
                      {/* FRONT FACE */}
                      <div 
                        className="relative bg-[#0c0d13]/90 border border-white/[0.14] hover:border-[#F0C41B]/60 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(240,196,27,0.12),inset_0_1px_1px_rgba(255,225,120,0.3)] flex items-center gap-3 text-left whitespace-nowrap min-w-[178px] sm:min-w-[195px]"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden'
                        }}
                      >
                        {/* Glowing Top Light Ray */}
                        <div className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B]/75 to-transparent pointer-events-none" />
                        {/* Subtle Corner Sparkle */}
                        <div className="absolute -bottom-1 -left-1.5 pointer-events-none opacity-45 animate-pulse" style={{ animationDelay: '0.8s' }}>
                          <Sparkles size={11} className="text-[#F0C41B] drop-shadow-[0_0_5px_rgba(240,196,27,0.5)]" />
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/25 flex items-center justify-center text-[#F0C41B] shrink-0 shadow-[0_0_10px_rgba(240,196,27,0.15)]">
                          <BarChart3 size={19} className="stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 leading-tight">Compare</div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight">50+ Firms</div>
                        </div>
                      </div>

                      {/* BACK FACE - W LOGO */}
                      <div 
                        className="absolute inset-0 bg-[#0c0d13]/95 border border-[#F0C41B]/50 hover:border-[#F0C41B]/80 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(240,196,27,0.25),inset_0_1px_2px_rgba(255,225,120,0.35)] flex items-center gap-3 text-left whitespace-nowrap overflow-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        {/* Glowing Top Light Ray */}
                        <div className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B] to-transparent pointer-events-none" />
                        {/* Subtle Corner Sparkle */}
                        <div className="absolute -top-1.5 -right-1.5 pointer-events-none opacity-60 animate-pulse">
                          <Sparkles size={12} className="text-[#F0C41B] drop-shadow-[0_0_6px_rgba(240,196,27,0.7)]" />
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#F0C41B]/25 to-[#F0C41B]/10 border border-[#F0C41B]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(240,196,27,0.3)] p-0.5">
                          <img src="/w-emblem.png" alt="W Logo" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(240,196,27,0.6)]" />
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-[#F0C41B] tracking-wider uppercase leading-tight">PROPxWEALTH</div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight">Top 50+ Ranked</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: TOP RIGHT - Earn Rewards */}
                <div 
                  className="hidden md:block absolute top-0 sm:top-1 left-[calc(50%+108px)] sm:left-[calc(50%+122px)] lg:left-[calc(50%+134px)] animate-float z-30 pointer-events-auto" 
                  style={{ animationDelay: '0.7s' }}
                >
                  <div 
                    onClick={() => toggleCardFlip('card-3')}
                    className="relative cursor-pointer select-none transition-transform duration-300 hover:scale-105"
                    style={{ perspective: '800px' }}
                    title="Click to flip"
                  >
                    <div 
                      className="relative transition-transform duration-700 ease-out"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flippedCards['card-3']
                          ? 'perspective(600px) rotateY(164deg) rotateX(4deg) rotateZ(2deg)'
                          : 'perspective(600px) rotateY(-16deg) rotateX(4deg) rotateZ(2deg)'
                      }}
                    >
                      {/* FRONT FACE */}
                      <div 
                        className="relative bg-[#0c0d13]/90 border border-white/[0.14] hover:border-[#F0C41B]/60 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(240,196,27,0.12),inset_0_1px_1px_rgba(255,225,120,0.3)] flex items-center gap-3 text-left whitespace-nowrap min-w-[178px] sm:min-w-[195px]"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden'
                        }}
                      >
                        {/* Glowing Top Light Ray */}
                        <div className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B]/75 to-transparent pointer-events-none" />
                        {/* Subtle Corner Sparkle */}
                        <div className="absolute -top-1.5 -right-1.5 pointer-events-none opacity-50 animate-pulse" style={{ animationDelay: '0.4s' }}>
                          <Sparkles size={12} className="text-[#F0C41B] drop-shadow-[0_0_6px_rgba(240,196,27,0.6)]" />
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/25 flex items-center justify-center text-[#F0C41B] shrink-0 shadow-[0_0_10px_rgba(240,196,27,0.15)]">
                          <Gift size={19} className="stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight">Earn Rewards</div>
                          <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 leading-tight">On Every Purchase</div>
                        </div>
                      </div>

                      {/* BACK FACE - W LOGO */}
                      <div 
                        className="absolute inset-0 bg-[#0c0d13]/95 border border-[#F0C41B]/50 hover:border-[#F0C41B]/80 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(240,196,27,0.25),inset_0_1px_2px_rgba(255,225,120,0.35)] flex items-center gap-3 text-left whitespace-nowrap overflow-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        {/* Glowing Top Light Ray */}
                        <div className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B] to-transparent pointer-events-none" />
                        {/* Subtle Corner Sparkle */}
                        <div className="absolute -top-1.5 -left-1.5 pointer-events-none opacity-60 animate-pulse">
                          <Sparkles size={12} className="text-[#F0C41B] drop-shadow-[0_0_6px_rgba(240,196,27,0.7)]" />
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#F0C41B]/25 to-[#F0C41B]/10 border border-[#F0C41B]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(240,196,27,0.3)] p-0.5">
                          <img src="/w-emblem.png" alt="W Logo" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(240,196,27,0.6)]" />
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-[#F0C41B] tracking-wider uppercase leading-tight">PROPxWEALTH</div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight">Wealth Rewards</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 4: BOTTOM RIGHT - Exclusive Perks */}
                <div 
                  className="hidden md:block absolute top-30 sm:top-34 lg:top-38 left-[calc(50%+116px)] sm:left-[calc(50%+130px)] lg:left-[calc(50%+142px)] animate-float z-30 pointer-events-auto" 
                  style={{ animationDelay: '2.1s' }}
                >
                  <div 
                    onClick={() => toggleCardFlip('card-4')}
                    className="relative cursor-pointer select-none transition-transform duration-300 hover:scale-105"
                    style={{ perspective: '800px' }}
                    title="Click to flip"
                  >
                    <div 
                      className="relative transition-transform duration-700 ease-out"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flippedCards['card-4']
                          ? 'perspective(600px) rotateY(164deg) rotateX(-5deg) rotateZ(-1deg)'
                          : 'perspective(600px) rotateY(-16deg) rotateX(-5deg) rotateZ(-1deg)'
                      }}
                    >
                      {/* FRONT FACE */}
                      <div 
                        className="relative bg-[#0c0d13]/90 border border-white/[0.14] hover:border-[#F0C41B]/60 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(240,196,27,0.12),inset_0_1px_1px_rgba(255,225,120,0.3)] flex items-center gap-3 text-left whitespace-nowrap min-w-[178px] sm:min-w-[195px]"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden'
                        }}
                      >
                        {/* Glowing Top Light Ray */}
                        <div className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B]/75 to-transparent pointer-events-none" />
                        {/* Subtle Corner Sparkle */}
                        <div className="absolute -bottom-1 -right-1.5 pointer-events-none opacity-45 animate-pulse" style={{ animationDelay: '1.2s' }}>
                          <Sparkles size={11} className="text-[#F0C41B] drop-shadow-[0_0_5px_rgba(240,196,27,0.5)]" />
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/25 flex items-center justify-center text-[#F0C41B] shrink-0 shadow-[0_0_10px_rgba(240,196,27,0.15)]">
                          <Zap size={19} className="stroke-[2.2] fill-[#F0C41B]/20" />
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight">Exclusive Perks</div>
                          <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 leading-tight">Only at Prop X Wealth</div>
                        </div>
                      </div>

                      {/* BACK FACE - W LOGO */}
                      <div 
                        className="absolute inset-0 bg-[#0c0d13]/95 border border-[#F0C41B]/50 hover:border-[#F0C41B]/80 backdrop-blur-md rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(240,196,27,0.25),inset_0_1px_2px_rgba(255,225,120,0.35)] flex items-center gap-3 text-left whitespace-nowrap overflow-hidden"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        {/* Glowing Top Light Ray */}
                        <div className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B] to-transparent pointer-events-none" />
                        {/* Subtle Corner Sparkle */}
                        <div className="absolute -top-1.5 -left-1.5 pointer-events-none opacity-60 animate-pulse">
                          <Sparkles size={12} className="text-[#F0C41B] drop-shadow-[0_0_6px_rgba(240,196,27,0.7)]" />
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#F0C41B]/25 to-[#F0C41B]/10 border border-[#F0C41B]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(240,196,27,0.3)] p-0.5">
                          <img src="/w-emblem.png" alt="W Logo" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(240,196,27,0.6)]" />
                        </div>
                        <div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-[#F0C41B] tracking-wider uppercase leading-tight">PROPxWEALTH</div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight">VIP Elite Perks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

          </div>

          {/* Mobile Cards (Compact 2x2 grid below visual on phones) */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-3 md:hidden z-20">
              <div 
                onClick={() => toggleCardFlip('m-1')}
                className="relative cursor-pointer select-none" 
                style={{ perspective: '600px' }}
              >
                <div 
                  className="relative transition-transform duration-500 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards['m-1'] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  <div 
                    className="bg-[#0c0d12]/90 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-left"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <Tag size={15} className="text-[#F0C41B] shrink-0" />
                    <div>
                      <div className="text-[9px] text-neutral-400 leading-none">Up to</div>
                      <div className="text-xs font-bold text-white mt-0.5">90% OFF</div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 bg-[#0c0d12]/95 border border-[#F0C41B]/40 rounded-xl p-2 flex items-center gap-2 text-left"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <img src="/w-emblem.png" alt="W" className="w-4 h-4 object-contain shrink-0" />
                    <div>
                      <div className="text-[8px] font-bold text-[#F0C41B] leading-none">PROPxWEALTH</div>
                      <div className="text-[10px] font-bold text-white mt-0.5 leading-none">90% Deals</div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => toggleCardFlip('m-2')}
                className="relative cursor-pointer select-none" 
                style={{ perspective: '600px' }}
              >
                <div 
                  className="relative transition-transform duration-500 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards['m-2'] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  <div 
                    className="bg-[#0c0d12]/90 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-left"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <Gift size={15} className="text-[#F0C41B] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white leading-none">Earn Rewards</div>
                      <div className="text-[9px] text-neutral-400 mt-0.5">On Purchases</div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 bg-[#0c0d12]/95 border border-[#F0C41B]/40 rounded-xl p-2 flex items-center gap-2 text-left"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <img src="/w-emblem.png" alt="W" className="w-4 h-4 object-contain shrink-0" />
                    <div>
                      <div className="text-[8px] font-bold text-[#F0C41B] leading-none">PROPxWEALTH</div>
                      <div className="text-[10px] font-bold text-white mt-0.5 leading-none">Rewards</div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => toggleCardFlip('m-3')}
                className="relative cursor-pointer select-none" 
                style={{ perspective: '600px' }}
              >
                <div 
                  className="relative transition-transform duration-500 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards['m-3'] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  <div 
                    className="bg-[#0c0d12]/90 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-left"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <BarChart3 size={15} className="text-[#F0C41B] shrink-0" />
                    <div>
                      <div className="text-[9px] text-neutral-400 leading-none">Compare</div>
                      <div className="text-xs font-bold text-white mt-0.5">50+ Firms</div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 bg-[#0c0d12]/95 border border-[#F0C41B]/40 rounded-xl p-2 flex items-center gap-2 text-left"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <img src="/w-emblem.png" alt="W" className="w-4 h-4 object-contain shrink-0" />
                    <div>
                      <div className="text-[8px] font-bold text-[#F0C41B] leading-none">PROPxWEALTH</div>
                      <div className="text-[10px] font-bold text-white mt-0.5 leading-none">Top Firms</div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => toggleCardFlip('m-4')}
                className="relative cursor-pointer select-none" 
                style={{ perspective: '600px' }}
              >
                <div 
                  className="relative transition-transform duration-500 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards['m-4'] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  <div 
                    className="bg-[#0c0d12]/90 border border-white/10 rounded-xl p-2 flex items-center gap-2 text-left"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <Zap size={15} className="text-[#F0C41B] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white leading-none">Exclusive Perks</div>
                      <div className="text-[9px] text-neutral-400 mt-0.5">Prop X Wealth</div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 bg-[#0c0d12]/95 border border-[#F0C41B]/40 rounded-xl p-2 flex items-center gap-2 text-left"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <img src="/w-emblem.png" alt="W" className="w-4 h-4 object-contain shrink-0" />
                    <div>
                      <div className="text-[8px] font-bold text-[#F0C41B] leading-none">PROPxWEALTH</div>
                      <div className="text-[10px] font-bold text-white mt-0.5 leading-none">VIP Perks</div>
                    </div>
                  </div>
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

        {/* ════════════════ TRUST SECTION & LOGO TICKER (MINIMAL RUNNING MARQUEE) ════════════════ */}
        <section className="relative z-10 mt-6 sm:mt-8 py-4 sm:py-5 bg-transparent border-y border-white/[0.04] overflow-hidden">
          <div className="text-center text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-neutral-500 uppercase mb-3 sm:mb-4">
            TRUSTED BY TRADERS WORLDWIDE
          </div>

          <div className="relative w-full overflow-hidden">
            {/* Left & Right gradient edge fades for seamless infinity carousel look */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#030407] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#030407] to-transparent z-10" />

            <div className="animate-marquee-scroll flex items-center gap-7 sm:gap-9">
              {tickerFirms.map((item, idx) => (
                <TickerFirmItem
                  key={`${item.name}-${idx}`}
                  name={item.name}
                  logo={item.logo}
                  domain={item.domain}
                  isWordmark={item.isWordmark}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ AVAILABLE CHALLENGE OPTIONS TABLE ════════════════ */}
        <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
          <ChallengeOptionsTable />
        </section>

        {/* ════════════════ HOW TO GET STARTED (WEALTH REWARDS STEPS) ════════════════ */}
        <section ref={stepsSectionRef} className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-hidden">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              How to get started
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-2.5">
              Follow these steps to get started with <span className="text-[#cbfb3d] font-black">WEALTH</span>
            </p>
          </div>

          {/* 4 Steps Cards Grid with Connecting Horizontal Line */}
          <div className="relative max-w-6xl mx-auto">
            {/* Horizontal Connecting Guide Line with Animated Laser Flow (Desktop) */}
            <div className="hidden lg:block absolute top-[108px] left-28 right-28 h-[2px] bg-white/[0.06] overflow-hidden pointer-events-none z-0 rounded-full">
              <div className="w-56 h-full bg-gradient-to-r from-transparent via-[#F0C41B] to-transparent animate-beam-flow shadow-[0_0_16px_rgba(240,196,27,0.9)]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
              
              {/* ── STEP 01: Sign Up (Animated from left - Card 1) ── */}
              <div
                className={`group relative rounded-2xl bg-gradient-to-b from-[#0e121a]/95 via-[#080b10]/95 to-[#05070a] border border-white/[0.08] hover:border-[#F0C41B]/60 p-6 sm:p-7 text-center flex flex-col justify-between backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.95),0_0_35px_rgba(240,196,27,0.2)] hover:-translate-y-2.5 transition-all duration-400 overflow-hidden min-h-[390px] ${
                  stepsVisible ? 'animate-slide-left' : 'opacity-0 -translate-x-16'
                }`}
                style={{ animationDelay: '100ms' }}
              >
                {/* Top Glass Specular Line on Hover */}
                <span className="absolute -top-[1px] inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B]/70 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Step Badge */}
                <div className="flex justify-center mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0C41B]/10 border border-[#F0C41B]/25 text-[10px] font-black tracking-[0.2em] text-[#F0C41B] uppercase shadow-[0_0_10px_rgba(240,196,27,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B] animate-ping" />
                    STEP 01
                  </span>
                </div>

                {/* Rich Graphic Stage 1: Holographic ID Pass & Laser Scan */}
                <div className="relative w-full h-36 flex items-center justify-center my-2">
                  {/* Ambient Backlight Aura */}
                  <div className="absolute w-28 h-28 rounded-full bg-[#F0C41B]/15 blur-2xl group-hover:bg-[#F0C41B]/30 animate-glow-breathe transition-all duration-500" />

                  {/* Outer Orbital Rotating Ring */}
                  <div className="absolute w-32 h-32 rounded-full border border-dashed border-[#F0C41B]/25 animate-spin-slow pointer-events-none" />

                  {/* 3D Holographic Pass Card */}
                  <div className="relative z-10 w-28 h-24 rounded-xl bg-gradient-to-br from-[#1c1808] via-[#0f0d04] to-[#060502] border border-[#F0C41B]/50 p-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(240,196,27,0.2)] animate-float group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    {/* Live Laser Scanline */}
                    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#F0C41B] to-transparent animate-scanline shadow-[0_0_8px_rgba(240,196,27,1)] pointer-events-none" />

                    {/* Hologram Card Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-4 h-3 rounded-sm bg-[#F0C41B]/40 border border-[#F0C41B]/60" />
                      <div className="w-2 h-2 rounded-full bg-[#F0C41B] animate-pulse" />
                    </div>

                    {/* Biometric User Avatar & Data Traces */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#F0C41B]/20 border border-[#F0C41B]/60 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 16 16" className="w-4 h-4 text-[#F0C41B] fill-current">
                          <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm-5 6a5 5 0 0110 0H3z" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-10 bg-[#F0C41B]/50 rounded" />
                        <div className="h-1 w-7 bg-white/30 rounded" />
                      </div>
                    </div>

                    {/* Chip Bottom Strip */}
                    <div className="mt-2 pt-1 border-t border-white/[0.08] flex justify-between items-center text-[7px] font-mono text-[#F0C41B]/80">
                      <span>ID: #WEALTH-01</span>
                      <span>ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-1.5 tracking-tight group-hover:text-[#F0C41B] transition-colors">
                    Sign Up
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Create your free account in seconds.
                  </p>
                </div>
              </div>

              {/* ── STEP 02: Purchase (Animated from left - Card 2) ── */}
              <div
                className={`group relative rounded-2xl bg-gradient-to-b from-[#0e121a]/95 via-[#080b10]/95 to-[#05070a] border border-white/[0.08] hover:border-[#F0C41B]/60 p-6 sm:p-7 text-center flex flex-col justify-between backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.95),0_0_35px_rgba(240,196,27,0.2)] hover:-translate-y-2.5 transition-all duration-400 overflow-hidden min-h-[390px] ${
                  stepsVisible ? 'animate-slide-left' : 'opacity-0 -translate-x-16'
                }`}
                style={{ animationDelay: '300ms' }}
              >
                {/* Top Glass Specular Line on Hover */}
                <span className="absolute -top-[1px] inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B]/70 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Step Badge */}
                <div className="flex justify-center mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0C41B]/10 border border-[#F0C41B]/25 text-[10px] font-black tracking-[0.2em] text-[#F0C41B] uppercase shadow-[0_0_10px_rgba(240,196,27,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B] animate-ping" />
                    STEP 02
                  </span>
                </div>

                {/* Rich Graphic Stage 2: WEALTH Cyber Card & Discount Terminal */}
                <div className="relative w-full h-36 flex items-center justify-center my-2">
                  {/* Ambient Backlight Aura */}
                  <div className="absolute w-28 h-28 rounded-full bg-[#F0C41B]/15 blur-2xl group-hover:bg-[#F0C41B]/30 animate-glow-breathe transition-all duration-500" />

                  {/* Pulsing Radar Circle */}
                  <div className="absolute w-32 h-32 rounded-full border border-[#F0C41B]/20 animate-pulse-slow pointer-events-none" />

                  {/* Main Metallic Discount Card displaying WEALTH */}
                  <div className="relative z-10 w-28 h-24 rounded-xl bg-gradient-to-br from-[#1c1808] via-[#0f0d04] to-[#060502] border border-[#F0C41B]/50 p-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(240,196,27,0.2)] animate-float-delayed group-hover:scale-105 transition-transform duration-300">
                    {/* VIP Chip & Savings Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-5 h-3.5 rounded-sm bg-[#F0C41B]/80 border border-[#F0C41B] shadow-[0_0_6px_rgba(240,196,27,0.5)]" />
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[#F0C41B]/20 text-[#F0C41B] border border-[#F0C41B]/40">
                        25% OFF
                      </span>
                    </div>

                    {/* EMBOSSED DISCOUNT CODE: WEALTH */}
                    <div className="mt-1">
                      <div className="text-[7px] text-neutral-400 font-bold uppercase tracking-wider">CODE:</div>
                      <div className="text-xs font-black text-[#F0C41B] tracking-widest drop-shadow-[0_0_6px_rgba(240,196,27,0.6)]">
                        WEALTH
                      </div>
                    </div>

                    {/* Mini Verified Badge */}
                    <div className="mt-1 flex items-center gap-1 text-[7px] text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B]" />
                      <span>Official Prop Code</span>
                    </div>
                  </div>

                  {/* Floating Gold Coin Accent */}
                  <div className="absolute -bottom-1 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-[#F0C41B] to-[#b38600] border border-white/40 shadow-[0_0_12px_rgba(240,196,27,0.6)] flex items-center justify-center animate-bounce-slow">
                    <span className="text-black font-black text-xs">$</span>
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-1.5 tracking-tight group-hover:text-[#F0C41B] transition-colors">
                    Purchase
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Apply code <span className="text-[#F0C41B] font-black">WEALTH</span> at checkout to earn rewards.
                  </p>
                </div>
              </div>

              {/* ── STEP 03: Sync / Submit (Animated from left - Card 3) ── */}
              <div
                className={`group relative rounded-2xl bg-gradient-to-b from-[#0e121a]/95 via-[#080b10]/95 to-[#05070a] border border-white/[0.08] hover:border-[#F0C41B]/60 p-6 sm:p-7 text-center flex flex-col justify-between backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.95),0_0_35px_rgba(240,196,27,0.2)] hover:-translate-y-2.5 transition-all duration-400 overflow-hidden min-h-[390px] ${
                  stepsVisible ? 'animate-slide-left' : 'opacity-0 -translate-x-16'
                }`}
                style={{ animationDelay: '500ms' }}
              >
                {/* Top Glass Specular Line on Hover */}
                <span className="absolute -top-[1px] inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B]/70 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Step Badge */}
                <div className="flex justify-center mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0C41B]/10 border border-[#F0C41B]/25 text-[10px] font-black tracking-[0.2em] text-[#F0C41B] uppercase shadow-[0_0_10px_rgba(240,196,27,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B] animate-ping" />
                    STEP 03
                  </span>
                </div>

                {/* Rich Graphic Stage 3: Gyroscope Quantum Sync Reactor */}
                <div className="relative w-full h-36 flex items-center justify-center my-2">
                  {/* Ambient Backlight Aura */}
                  <div className="absolute w-28 h-28 rounded-full bg-[#F0C41B]/15 blur-2xl group-hover:bg-[#F0C41B]/30 animate-glow-breathe transition-all duration-500" />

                  {/* Outer Clockwise Rotating Gyro Ring */}
                  <div className="absolute w-32 h-32 rounded-full border-2 border-transparent border-t-[#F0C41B] border-b-[#F0C41B]/30 animate-spin-slow pointer-events-none" />

                  {/* Inner Counter-Clockwise Gyro Ring */}
                  <div className="absolute w-24 h-24 rounded-full border-2 border-transparent border-r-[#F0C41B] border-l-[#F0C41B]/30 animate-spin-reverse-slow pointer-events-none" />

                  {/* Central Core with Floating Verified Order Badge */}
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1c1808] to-[#060502] border border-[#F0C41B]/50 flex flex-col items-center justify-center shadow-[0_0_22px_rgba(240,196,27,0.3)] animate-float group-hover:scale-105 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#F0C41B] drop-shadow-[0_0_8px_rgba(240,196,27,0.7)]" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 00-15.5-6.4L3 8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 12a9 9 0 0015.5 6.4L21 16" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 21v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {/* Mini Verified Check Badge */}
                    <div className="mt-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#F0C41B]/20 border border-[#F0C41B]/40">
                      <span className="w-1 h-1 rounded-full bg-[#F0C41B]" />
                      <span className="text-[7px] font-black text-[#F0C41B]">SYNCED</span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-1.5 tracking-tight group-hover:text-[#F0C41B] transition-colors">
                    Sync / Submit
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Link your email once for reward sync, or submit orders manually.
                  </p>
                </div>
              </div>

              {/* ── STEP 04: Reward (Animated from left - Card 4) ── */}
              <div
                className={`group relative rounded-2xl bg-gradient-to-b from-[#0e121a]/95 via-[#080b10]/95 to-[#05070a] border border-white/[0.08] hover:border-[#F0C41B]/60 p-6 sm:p-7 text-center flex flex-col justify-between backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.95),0_0_35px_rgba(240,196,27,0.2)] hover:-translate-y-2.5 transition-all duration-400 overflow-hidden min-h-[390px] ${
                  stepsVisible ? 'animate-slide-left' : 'opacity-0 -translate-x-16'
                }`}
                style={{ animationDelay: '700ms' }}
              >
                {/* Top Glass Specular Line on Hover */}
                <span className="absolute -top-[1px] inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#F0C41B]/70 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Step Badge */}
                <div className="flex justify-center mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0C41B]/10 border border-[#F0C41B]/25 text-[10px] font-black tracking-[0.2em] text-[#F0C41B] uppercase shadow-[0_0_10px_rgba(240,196,27,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B] animate-ping" />
                    STEP 04
                  </span>
                </div>

                {/* Rich Graphic Stage 4: 3D Stacked Wealth Tokens Vault */}
                <div className="relative w-full h-36 flex items-center justify-center my-2">
                  {/* Ambient Backlight Aura */}
                  <div className="absolute w-28 h-28 rounded-full bg-[#F0C41B]/15 blur-2xl group-hover:bg-[#F0C41B]/30 animate-glow-breathe transition-all duration-500" />

                  {/* Pulsing Sparkle Ring */}
                  <div className="absolute w-32 h-32 rounded-full border border-[#F0C41B]/25 animate-pulse-slow pointer-events-none" />

                  {/* 3D Stacked Wealth Coins Vault with W Emblem */}
                  <div className="relative z-10 w-24 h-24 flex items-center justify-center animate-float group-hover:scale-105 transition-transform duration-300">
                    <svg viewBox="0 0 48 48" className="w-20 h-20 drop-shadow-[0_0_14px_rgba(240,196,27,0.6)]" fill="none">
                      {/* Base Coin 3 */}
                      <ellipse cx="24" cy="36" rx="16" ry="6" fill="#181504" stroke="#F0C41B" strokeWidth="1.8" />
                      <path d="M8 36v5c0 3.3 7.2 6 16 6s16-2.7 16-6v-5" fill="#100e02" stroke="#F0C41B" strokeWidth="1.8" />
                      
                      {/* Mid Coin 2 */}
                      <ellipse cx="24" cy="28" rx="16" ry="6" fill="#221c06" stroke="#F0C41B" strokeWidth="1.8" />
                      <path d="M8 28v5c0 3.3 7.2 6 16 6s16-2.7 16-6v-5" fill="#181504" stroke="#F0C41B" strokeWidth="1.8" />

                      {/* Top Coin 1 with Golden Face */}
                      <ellipse cx="24" cy="20" rx="16" ry="6" fill="url(#stepGoldGradient)" stroke="#F0C41B" strokeWidth="2" />
                      {/* Center W Emblem */}
                      <path d="M17 18l3.5 6 3.5-5 3.5 5 3.5-6" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

                      <defs>
                        <linearGradient id="stepGoldGradient" x1="8" y1="14" x2="40" y2="26" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#ffe46b" />
                          <stop offset="0.5" stopColor="#F0C41B" />
                          <stop offset="1" stopColor="#d49e00" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Floating Reward Bonus Tag */}
                    <div className="absolute -top-1 -right-2 px-1.5 py-0.5 rounded-full bg-[#F0C41B] text-black text-[8px] font-black tracking-wider shadow-[0_0_10px_rgba(240,196,27,0.9)] animate-bounce">
                      +FREE
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-1.5 tracking-tight group-hover:text-[#F0C41B] transition-colors">
                    Reward
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Earn <span className="text-[#F0C41B] font-black">WEALTH</span> credits redeemable for exclusive rewards.
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Centered CTA Button: Simple Clean Rectangle with Yellow/Black Gradient & Continuous Glowing Sweep */}
            <div className="flex justify-center mt-12 sm:mt-14 relative z-10">
              <Link to={getModePath('/rewards')}>
                <button className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-lg overflow-hidden bg-gradient-to-r from-[#d49e00] via-[#F0C41B] to-[#ffe359] hover:from-[#e5aa00] hover:via-[#ffd84d] hover:to-[#fff07d] text-black font-black text-xs sm:text-sm tracking-wider uppercase border-2 border-black/85 shadow-[0_4px_16px_rgba(0,0,0,0.8)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer select-none">
                  {/* Continuous glowing light sweep beam passing across the button */}
                  <span className="absolute inset-0 -translate-x-full animate-btn-glow-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

                  {/* Top specular reflection */}
                  <span className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-md" />

                  <span className="relative z-10 font-black tracking-wider text-black">
                    Start Earning Rewards
                  </span>
                  <span className="relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-md bg-black text-[#F0C41B] text-xs font-black group-hover:translate-x-1 transition-transform shadow-sm">
                    &gt;
                  </span>
                </button>
              </Link>
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

        {/* ════════════════ DISCORD COMMUNITY BANNER ════════════════ */}
        <section className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#d99800] via-[#F0C41B] to-[#ffda47] shadow-[0_16px_40px_rgba(0,0,0,0.55)] border border-black/15">
            {/* Top Specular Glass Highlight */}
            <div className="absolute top-0 inset-x-0 h-[35%] bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center p-6 sm:p-8 lg:p-10 gap-6">
              {/* Left Content (Title, Description, Button) */}
              <div className="md:col-span-8 lg:col-span-8 flex flex-col items-start text-left z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-black tracking-tight leading-tight mb-2 sm:mb-2.5">
                  Join Our Discord Community
                </h2>
                <p className="text-black/85 text-xs sm:text-sm lg:text-[15px] font-semibold leading-relaxed max-w-lg mb-4 sm:mb-5">
                  Connect with thousands of traders in our free Discord community. Explore strategies, access free resources, and stay updated with the latest announcements.
                </p>
                <a
                  href="https://discord.gg/propxwealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-black hover:bg-neutral-900 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group select-none border border-white/10"
                >
                  <span className="tracking-widest">GET ENTERED</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F0C41B] text-black font-black text-xs group-hover:translate-x-1 transition-transform">
                    &gt;
                  </span>
                </a>
              </div>

              {/* Right Visual: 3D Discord Icon cropped slightly at edge */}
              <div className="md:col-span-4 lg:col-span-4 flex items-center justify-center md:justify-end relative z-10">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-56 lg:h-56 md:translate-x-3 lg:translate-x-6 flex items-center justify-center">
                  <img
                    src="/discord-3d.png"
                    alt="Discord Community"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.3)] animate-float hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
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

        {/* ══════════ GOLD COINS RAIN OVERLAY (Triggered on Emblem Click) ══════════ */}
        {isRainingCoins && (
          <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {rainingCoins.map(coin => (
              <div
                key={coin.id}
                className="absolute top-0"
                style={{
                  left: `${coin.left}%`,
                  animation: `coin-rain-drop ${coin.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${coin.delay}s forwards`,
                  ['--coin-drift' as any]: `${coin.drift}px`,
                }}
              >
                <div
                  style={{
                    animation: `coin-tumble-3d ${coin.spinSpeed}s linear infinite`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <GoldWealthCoin size={coin.size} />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </KineticGrid>
  );
};

export default LandingPage;
