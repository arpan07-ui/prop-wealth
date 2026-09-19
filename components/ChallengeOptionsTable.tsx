import React, { useState, useMemo } from 'react';
import { Tag, Landmark, RotateCcw, Copy, Check, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Search, Info, CheckCircle2, Sparkles } from 'lucide-react';

// ── FIRM LOGO HELPER COMPONENT ──
const FirmIcon: React.FC<{ name: string; url?: string }> = ({ name, url }) => {
  const [imgError, setImgError] = useState(false);

  const renderFallback = () => {
    const n = name.toLowerCase();
    if (n.includes('blueguardian') || n.includes('blue guardian')) {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400 fill-cyan-400/20" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (n.includes('e8')) {
      return (
        <span className="text-white font-black text-xs tracking-tighter border border-white/20 rounded px-1 py-0.5">
          E8
        </span>
      );
    }
    if (n.includes('seat')) {
      return (
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white text-[10px] font-black">
          FS
        </div>
      );
    }
    if (n.includes('funded trader') || n.includes('trader markets')) {
      return (
        <div className="w-5 h-5 rotate-45 border-2 border-cyan-400 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 -rotate-45" />
        </div>
      );
    }
    if (n.includes('funding pips') || n.includes('fundingpips')) {
      return (
        <div className="w-5 h-5 rounded bg-purple-600/70 flex items-center justify-center font-black text-[11px] text-white">
          P
        </div>
      );
    }
    if (n.includes('goat')) {
      return (
        <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-[10px]">
          G
        </div>
      );
    }
    return (
      <span className="text-white font-black text-xs uppercase">
        {name.substring(0, 2)}
      </span>
    );
  };

  return (
    <div className="w-9 h-9 rounded-xl bg-[#0f1117] border border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-inner overflow-hidden">
      {url && !imgError ? (
        <img
          src={url}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain filter contrast-125"
        />
      ) : (
        renderFallback()
      )}
    </div>
  );
};

// ── FIRM DEAL ITEM FOR "ALL FIRMS" VIEW ──
export interface FirmDealItem {
  id: string;
  name: string;
  logo: string;
  category: 'Forex' | 'Futures' | 'Crypto';
  discount: number; // e.g. 25
  code: string; // e.g. "TZU"
  affiliateUrl: string;
  description: string;
}

export const ALL_FIRMS_DATA: FirmDealItem[] = [
  {
    id: 'blueguardian',
    name: 'BlueGuardian',
    logo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    category: 'Forex',
    discount: 25,
    code: 'TZU',
    affiliateUrl: 'https://blueguardian.com',
    description: 'Get up to 25% OFF on all BlueGuardian Forex accounts.'
  },
  {
    id: 'blueguardian-futures',
    name: 'BlueGuardian Futures',
    logo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    category: 'Futures',
    discount: 25,
    code: 'TZU',
    affiliateUrl: 'https://blueguardian.com',
    description: 'Get up to 25% OFF on BlueGuardian Futures challenges.'
  },
  {
    id: 'e8-futures',
    name: 'E8 FUTURES',
    logo: 'https://e8markets.com/images/logo/logo.svg',
    category: 'Futures',
    discount: 10,
    code: 'TZU',
    affiliateUrl: 'https://e8markets.com',
    description: 'Get up to 10% OFF on all E8 Futures combine models.'
  },
  {
    id: 'e8-crypto',
    name: 'E8 Crypto',
    logo: 'https://e8markets.com/images/logo/logo.svg',
    category: 'Crypto',
    discount: 10,
    code: 'TZU',
    affiliateUrl: 'https://e8markets.com',
    description: 'Get up to 10% OFF on E8 Crypto evaluation tiers.'
  },
  {
    id: 'e8-markets',
    name: 'E8 Markets',
    logo: 'https://e8markets.com/images/logo/logo.svg',
    category: 'Forex',
    discount: 10,
    code: 'TZU',
    affiliateUrl: 'https://e8markets.com',
    description: 'Get up to 10% OFF on E8 Markets FX programs.'
  },
  {
    id: 'funded-seat',
    name: 'Funded Seat',
    logo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif',
    category: 'Futures',
    discount: 50,
    code: 'TZU',
    affiliateUrl: 'https://fundedseat.com',
    description: 'Get up to 50% OFF on Funded Seat evaluations.'
  },
  {
    id: 'funded-trader-markets',
    name: 'Funded Trader Markets',
    logo: 'https://atsfunded.com/ats-logo.png',
    category: 'Forex',
    discount: 65,
    code: 'TZU',
    affiliateUrl: 'https://thefundedtraderprogram.com',
    description: 'Get up to 65% OFF flash discount with coupon TZU.'
  },
  {
    id: 'funding-pips',
    name: 'Funding Pips',
    logo: 'https://media.propxwealth.com/system/b5filxasbwwrg110uhxvgv4v/675854fe6df8f98dc09b6caf_FundingPips-Logotype.svg',
    category: 'Forex',
    discount: 5,
    code: 'TZU',
    affiliateUrl: 'https://www.fundingpips.com',
    description: 'Get up to 5% OFF on all Funding Pips evaluation tiers.'
  },
  {
    id: 'goat-funded-futures',
    name: 'Goat Funded Futures',
    logo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif',
    category: 'Futures',
    discount: 50,
    code: 'TZU',
    affiliateUrl: 'https://goatfundedtrader.com',
    description: 'Get up to 50% OFF on Goat Funded Futures challenges.'
  },
  {
    id: 'apex-trader-funding',
    name: 'Apex Trader Funding',
    logo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif',
    category: 'Futures',
    discount: 80,
    code: 'TZU',
    affiliateUrl: 'https://apextraderfunding.com',
    description: 'Get up to 80% OFF on all Apex Trader evaluations.'
  },
  {
    id: 'topstep',
    name: 'Topstep',
    logo: 'https://atsfunded.com/ats-logo.png',
    category: 'Futures',
    discount: 20,
    code: 'TZU',
    affiliateUrl: 'https://topstep.com',
    description: 'Get up to 20% OFF on Topstep Trading Combines.'
  },
  {
    id: 'fundednext',
    name: 'FundedNext',
    logo: 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundedNext_Logo_White_Christmas_2025.png&w=384&q=75',
    category: 'Forex',
    discount: 20,
    code: 'TZU',
    affiliateUrl: 'https://fundednext.com',
    description: 'Get up to 20% OFF on FundedNext Stellar accounts.'
  },
  {
    id: 'the5ers',
    name: 'The5ers',
    logo: 'https://the5ers.com/images/menu/logo.svg',
    category: 'Forex',
    discount: 10,
    code: 'TZU',
    affiliateUrl: 'https://the5ers.com',
    description: 'Get up to 10% OFF on The5ers Bootcamp and High Stakes.'
  },
  {
    id: 'alpha-capital',
    name: 'Alpha Capital',
    logo: 'https://alphacapitalgroup.uk/static/media/companyLogoInitials.879d8bbc8b528b1fd27761f4e43c34a0.svg',
    category: 'Forex',
    discount: 20,
    code: 'TZU',
    affiliateUrl: 'https://alphacapitalgroup.uk',
    description: 'Get up to 20% OFF on Alpha Capital evaluations.'
  },
  {
    id: 'fundedhive',
    name: 'Fundedhive',
    logo: 'https://fundedhive.com/wp-content/uploads/2024/02/cropped-Favicon-32x32.png',
    category: 'Forex',
    discount: 10,
    code: 'TZU',
    affiliateUrl: 'https://fundedhive.com',
    description: 'Get up to 10% OFF on Fundedhive Workerbee challenges.'
  }
];

// ── CHALLENGE OPTION FOR "CHALLENGE OPTIONS" VIEW ──
export interface ChallengeOption {
  id: string;
  firmId: string;
  firmName: string;
  firmLogo: string;
  badge: string;
  accountSize: number;
  accountType: string;
  stepType: 'One Step' | 'Two Step' | 'Instant Funded';
  profitTarget: number;
  drawdown: number;
  drawdownType: 'STATIC' | 'TRAILING';
  dailyLoss: number;
  challengeFee: number;
  trueCost: number;
  isCheapest?: boolean;
  pointsText?: string;
  discountPercent: number;
  discountCode: string;
  affiliateUrl: string;
}

export const CHALLENGE_OPTIONS_DATA: ChallengeOption[] = [
  {
    id: 'bg-10k',
    firmId: 'blue-guardian',
    firmName: 'Blue Guardian',
    firmLogo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    badge: '2 STEP STANDARD',
    accountSize: 10000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 800,
    drawdown: 800,
    drawdownType: 'STATIC',
    dailyLoss: 400,
    challengeFee: 56,
    trueCost: 42,
    pointsText: 'Coming soon pts',
    discountPercent: 25,
    discountCode: 'BG25',
    affiliateUrl: 'https://blueguardian.com'
  },
  {
    id: 'fh-100k',
    firmId: 'fundedhive',
    firmName: 'Fundedhive',
    firmLogo: 'https://fundedhive.com/wp-content/uploads/2024/02/cropped-Favicon-32x32.png',
    badge: 'WORKERBEE',
    accountSize: 100000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 8000,
    drawdown: 10000,
    drawdownType: 'STATIC',
    dailyLoss: 4000,
    challengeFee: 599,
    trueCost: 539.1,
    pointsText: 'Coming soon pts',
    discountPercent: 10,
    discountCode: 'HIVE',
    affiliateUrl: 'https://fundedhive.com'
  },
  {
    id: 'bg-5k',
    firmId: 'blue-guardian',
    firmName: 'Blue Guardian',
    firmLogo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    badge: '2 STEP STANDARD',
    accountSize: 5000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 400,
    drawdown: 400,
    drawdownType: 'STATIC',
    dailyLoss: 200,
    challengeFee: 24,
    trueCost: 18,
    isCheapest: true,
    pointsText: 'Coming soon pts',
    discountPercent: 25,
    discountCode: 'BG25',
    affiliateUrl: 'https://blueguardian.com'
  },
  {
    id: 'bg-100k',
    firmId: 'blue-guardian',
    firmName: 'Blue Guardian',
    firmLogo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    badge: '2 STEP STANDARD',
    accountSize: 100000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 8000,
    drawdown: 8000,
    drawdownType: 'STATIC',
    dailyLoss: 4000,
    challengeFee: 497,
    trueCost: 372.75,
    pointsText: 'Coming soon pts',
    discountPercent: 25,
    discountCode: 'BG25',
    affiliateUrl: 'https://blueguardian.com'
  },
  {
    id: 'fn-100k',
    firmId: 'fundednext',
    firmName: 'FundedNext',
    firmLogo: 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundedNext_Logo_White_Christmas_2025.png&w=384&q=75',
    badge: 'STELLAR 2-STEP',
    accountSize: 100000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 8000,
    drawdown: 10000,
    drawdownType: 'STATIC',
    dailyLoss: 5000,
    challengeFee: 549,
    trueCost: 439.2,
    pointsText: 'Coming soon pts',
    discountPercent: 20,
    discountCode: 'NEXT20',
    affiliateUrl: 'https://fundednext.com'
  },
  {
    id: 'fp-50k',
    firmId: 'fundingpips',
    firmName: 'FundingPips',
    firmLogo: 'https://media.propxwealth.com/system/b5filxasbwwrg110uhxvgv4v/675854fe6df8f98dc09b6caf_FundingPips-Logotype.svg',
    badge: '2 STEP PRO',
    accountSize: 50000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 4000,
    drawdown: 5000,
    drawdownType: 'TRAILING',
    dailyLoss: 2500,
    challengeFee: 239,
    trueCost: 215.1,
    pointsText: 'Coming soon pts',
    discountPercent: 10,
    discountCode: 'PIPS10',
    affiliateUrl: 'https://www.fundingpips.com'
  },
  {
    id: 'ac-100k',
    firmId: 'alpha-capital',
    firmName: 'Alpha Capital',
    firmLogo: 'https://alphacapitalgroup.uk/static/media/companyLogoInitials.879d8bbc8b528b1fd27761f4e43c34a0.svg',
    badge: 'ALPHA PRO',
    accountSize: 100000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 8000,
    drawdown: 10000,
    drawdownType: 'STATIC',
    dailyLoss: 5000,
    challengeFee: 499,
    trueCost: 399.2,
    pointsText: 'Coming soon pts',
    discountPercent: 20,
    discountCode: 'ALPHA20',
    affiliateUrl: 'https://alphacapitalgroup.uk'
  },
  {
    id: 'apex-50k',
    firmId: 'apex-trader',
    firmName: 'Apex Trader Funding',
    firmLogo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif',
    badge: 'FUTURES 1-STEP',
    accountSize: 50000,
    accountType: 'CHALLENGE',
    stepType: 'One Step',
    profitTarget: 3000,
    drawdown: 2500,
    drawdownType: 'TRAILING',
    dailyLoss: 2500,
    challengeFee: 167,
    trueCost: 33.4,
    pointsText: 'Coming soon pts',
    discountPercent: 80,
    discountCode: 'APEX80',
    affiliateUrl: 'https://apextraderfunding.com'
  },
  {
    id: 'the5ers-100k',
    firmId: 'the5ers',
    firmName: 'The5ers',
    firmLogo: 'https://the5ers.com/images/menu/logo.svg',
    badge: 'HIGH STAKES',
    accountSize: 100000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 8000,
    drawdown: 10000,
    drawdownType: 'STATIC',
    dailyLoss: 5000,
    challengeFee: 495,
    trueCost: 445.5,
    pointsText: 'Coming soon pts',
    discountPercent: 10,
    discountCode: '5ERS10',
    affiliateUrl: 'https://the5ers.com'
  },
  {
    id: 'topstep-50k',
    firmId: 'topstep',
    firmName: 'Topstep',
    firmLogo: 'https://atsfunded.com/ats-logo.png',
    badge: 'TRADING COMBINE',
    accountSize: 50000,
    accountType: 'CHALLENGE',
    stepType: 'One Step',
    profitTarget: 3000,
    drawdown: 2000,
    drawdownType: 'TRAILING',
    dailyLoss: 1000,
    challengeFee: 49,
    trueCost: 39.2,
    pointsText: 'Coming soon pts',
    discountPercent: 20,
    discountCode: 'STEP20',
    affiliateUrl: 'https://topstep.com'
  }
];

export interface ChallengeOptionsTableProps {
  className?: string;
  onCopyCode?: (code: string, firmName: string) => void;
}

export const ChallengeOptionsTable: React.FC<ChallengeOptionsTableProps> = ({
  className = '',
  onCopyCode
}) => {
  // Navigation tabs - "All Firms" is FIRST now!
  const [activeTab, setActiveTab] = useState<'all_firms' | 'challenge_options'>('all_firms');

  // ── ALL FIRMS STATE ──
  const [firmCategory, setFirmCategory] = useState<'All' | 'Forex' | 'Crypto' | 'Futures'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [alphaAsc, setAlphaAsc] = useState<boolean | null>(null);
  const [activeInfoId, setActiveInfoId] = useState<string | null>(null);

  // ── CHALLENGE OPTIONS STATE ──
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedSize, setSelectedSize] = useState<string>('All Sizes');
  const [selectedFirm, setSelectedFirm] = useState<string>('All Firms');
  const [sortField, setSortField] = useState<'trueCost' | 'challengeFee' | 'accountSize' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Copied feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── FILTERED FIRMS LIST (Matching Attached Image) ──
  const filteredFirms = useMemo(() => {
    const list = ALL_FIRMS_DATA.filter((firm) => {
      const matchCat = firmCategory === 'All' || firm.category === firmCategory;
      const matchSearch = firm.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (alphaAsc === null) {
      return list;
    }

    return [...list].sort((a, b) => {
      return alphaAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
  }, [firmCategory, searchQuery, alphaAsc]);

  // Extract unique firm names for Challenge dropdown
  const firmDropdownOptions = useMemo(() => {
    const set = new Set<string>();
    CHALLENGE_OPTIONS_DATA.forEach(item => set.add(item.firmName));
    return ['All Firms', ...Array.from(set).sort()];
  }, []);

  // Filtered Challenge Options
  const filteredChallenges = useMemo(() => {
    const filtered = CHALLENGE_OPTIONS_DATA.filter(item => {
      if (selectedType !== 'All Types' && item.stepType !== selectedType) return false;
      if (selectedSize !== 'All Sizes') {
        const sizeNumber = parseInt(selectedSize.replace('K', '')) * 1000;
        if (item.accountSize !== sizeNumber) return false;
      }
      if (selectedFirm !== 'All Firms' && item.firmName !== selectedFirm) return false;
      return true;
    });

    if (!sortField) return filtered;

    return [...filtered].sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'trueCost') return (a.trueCost - b.trueCost) * modifier;
      if (sortField === 'challengeFee') return (a.challengeFee - b.challengeFee) * modifier;
      if (sortField === 'accountSize') return (a.accountSize - b.accountSize) * modifier;
      return 0;
    });
  }, [selectedType, selectedSize, selectedFirm, sortField, sortOrder]);

  // Copy code helper
  const handleCopyCode = (e: React.MouseEvent, id: string, code: string, firmName: string, discount: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setToastMessage(`Copied ${code}! Save ${discount}% at ${firmName}`);
      if (onCopyCode) {
        onCopyCode(code, firmName);
      }
      setTimeout(() => setCopiedId(null), 2000);
      setTimeout(() => setToastMessage(null), 3500);
    });
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return 'None';
    return '$' + Number(val).toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(val) ? 0 : 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0f14] border border-[#F0C41B]/50 text-white px-5 py-3 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(240,196,27,0.35)] flex items-center gap-3 animate-fade-in backdrop-blur-xl">
          <CheckCircle2 size={18} className="text-[#F0C41B] shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ── TOP VIEW TOGGLE: EQUAL SIZE & YELLOW METALLIC COLORED ── */}
      <div className="flex justify-center mb-8 sm:mb-10">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#0a0b0e] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(240,196,27,0.1)]">
          {/* BUTTON 1: ALL FIRMS */}
          <button
            onClick={() => setActiveTab('all_firms')}
            className={`relative flex items-center justify-center gap-2.5 w-[160px] sm:w-[195px] py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer select-none ${
              activeTab === 'all_firms'
                ? 'bg-gradient-to-b from-[#F0C41B]/25 via-[#F0C41B]/12 to-[#F0C41B]/5 text-[#F0C41B] border border-[#F0C41B] shadow-[0_0_20px_rgba(240,196,27,0.35),inset_0_1px_2px_rgba(255,235,140,0.4)] drop-shadow-[0_0_8px_rgba(240,196,27,0.4)]'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            {activeTab === 'all_firms' && (
              <span className="absolute -top-[1px] inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffe875] to-transparent pointer-events-none" />
            )}
            <Landmark size={16} className={activeTab === 'all_firms' ? 'text-[#F0C41B] drop-shadow-[0_0_6px_rgba(240,196,27,0.6)]' : 'text-neutral-400'} />
            <span className="tracking-wide">All Firms</span>
          </button>

          {/* BUTTON 2: CHALLENGE OPTIONS */}
          <button
            onClick={() => setActiveTab('challenge_options')}
            className={`relative flex items-center justify-center gap-2.5 w-[160px] sm:w-[195px] py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer select-none ${
              activeTab === 'challenge_options'
                ? 'bg-gradient-to-b from-[#F0C41B]/25 via-[#F0C41B]/12 to-[#F0C41B]/5 text-[#F0C41B] border border-[#F0C41B] shadow-[0_0_20px_rgba(240,196,27,0.35),inset_0_1px_2px_rgba(255,235,140,0.4)] drop-shadow-[0_0_8px_rgba(240,196,27,0.4)]'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            {activeTab === 'challenge_options' && (
              <span className="absolute -top-[1px] inset-x-4 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffe875] to-transparent pointer-events-none" />
            )}
            <Tag size={16} className={activeTab === 'challenge_options' ? 'text-[#F0C41B] drop-shadow-[0_0_6px_rgba(240,196,27,0.6)]' : 'text-neutral-400'} />
            <span className="tracking-wide">Challenge Options</span>
          </button>
        </div>
      </div>

      {/* ════════════════ VIEW 1: ALL FIRMS TABLE (EXACT MATCH TO ATTACHED IMAGE) ════════════════ */}
      {activeTab === 'all_firms' && (
        <div className="space-y-4">
          {/* Top Controls: Filter Pills (Left) & Search + A-Z Sort (Right) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Pills: All | Forex | Crypto | Futures */}
            <div className="inline-flex items-center bg-[#0b0c10] border border-neutral-800/80 rounded-xl p-1 gap-1">
              {(['All', 'Forex', 'Crypto', 'Futures'] as const).map((cat) => {
                const isActive = firmCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFirmCategory(cat)}
                    className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'border border-[#a6ff00] text-[#a6ff00] bg-[#a6ff00]/10 shadow-[0_0_10px_rgba(166,255,0,0.18)]'
                        : 'text-neutral-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Search Firm Name + A-Z Sort Button */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search Firm Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-neutral-800/90 focus:border-[#a6ff00]/60 text-white text-xs pl-3.5 pr-8 py-2 rounded-xl placeholder:text-neutral-500 focus:outline-none transition-colors"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
              </div>

              <button
                onClick={() => setAlphaAsc(!alphaAsc)}
                className="bg-[#0b0c10] hover:bg-white/5 border border-neutral-800/90 hover:border-neutral-700 text-white rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer select-none shrink-0"
                title="Sort Alphabetically"
              >
                <span>A-Z</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-hidden rounded-2xl bg-[#090a0d] border border-neutral-800/40 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-neutral-800/40 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">FIRM NAME</th>
                    <th className="py-3.5 px-4 font-bold">CATEGORY</th>
                    <th className="py-3.5 px-4 font-bold">OFFER</th>
                    <th className="py-3.5 px-4 font-bold">DISCOUNT CODE</th>
                    <th className="py-3.5 px-4 font-bold text-right">CLAIM OFFER</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-neutral-800/40">
                  {filteredFirms.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-neutral-400 text-sm">
                        No prop firms found matching "{searchQuery}".
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setFirmCategory('All');
                            }}
                            className="px-4 py-1.5 rounded-lg bg-[#111318] border border-neutral-700 text-xs font-bold text-[#a6ff00] hover:bg-white/5 cursor-pointer"
                          >
                            Reset Search
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFirms.map((firm) => {
                      const isCopied = copiedId === firm.id;
                      const isInfoOpen = activeInfoId === firm.id;
                      return (
                        <tr
                          key={firm.id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* 1. FIRM NAME */}
                          <td className="py-4 px-4 align-middle">
                            <div className="flex items-center gap-3">
                              <FirmIcon name={firm.name} url={firm.logo} />
                              <span className="text-sm font-bold text-white group-hover:text-[#a6ff00] transition-colors">
                                {firm.name}
                              </span>
                            </div>
                          </td>

                          {/* 2. CATEGORY */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <span className="text-sm text-neutral-400 font-medium">
                              {firm.category}
                            </span>
                          </td>

                          {/* 3. OFFER */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap relative">
                            <div>
                              <div className="text-[10px] text-neutral-400 font-medium leading-none">
                                Get Upto
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-sm font-black text-[#a6ff00]">
                                  {firm.discount}% OFF
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveInfoId(isInfoOpen ? null : firm.id);
                                  }}
                                  className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                                  title={firm.description}
                                >
                                  <Info size={13} />
                                </button>
                              </div>
                            </div>

                            {/* Info Tooltip Popover */}
                            {isInfoOpen && (
                              <div className="absolute left-4 top-12 z-30 bg-[#111318] border border-[#a6ff00]/40 rounded-xl p-3 shadow-2xl max-w-xs text-xs text-neutral-200 backdrop-blur-lg animate-fade-in">
                                <div className="font-bold text-[#a6ff00] mb-1">{firm.name} Deal Details</div>
                                <p className="text-neutral-300">{firm.description}</p>
                              </div>
                            )}
                          </td>

                          {/* 4. DISCOUNT CODE */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <button
                              onClick={(e) => handleCopyCode(e, firm.id, firm.code, firm.name, firm.discount)}
                              className="inline-flex items-center gap-1.5 text-sm font-black text-[#a6ff00] hover:text-white transition-colors cursor-pointer group/code select-none"
                              title={`Click to copy code ${firm.code}`}
                            >
                              <span>{isCopied ? 'COPIED!' : firm.code}</span>
                              {isCopied ? (
                                <Check size={13} className="text-[#a6ff00]" />
                              ) : (
                                <Copy size={13} className="text-[#a6ff00] group-hover/code:text-white opacity-80" />
                              )}
                            </button>
                          </td>

                          {/* 5. CLAIM OFFER (BUY NOW BUTTON) */}
                          <td className="py-4 px-4 align-middle text-right whitespace-nowrap">
                            <a
                              href={firm.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 bg-[#bbf727] hover:bg-[#cbfb3d] text-black font-extrabold text-xs px-5 py-2 rounded-full shadow-[0_0_15px_rgba(187,247,39,0.3)] hover:shadow-[0_0_22px_rgba(187,247,39,0.5)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
                            >
                              <span>Buy Now</span>
                              <span className="font-bold text-sm leading-none">&gt;</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ VIEW 2: AVAILABLE CHALLENGE OPTIONS TABLE ════════════════ */}
      {activeTab === 'challenge_options' && (
        <div className="space-y-6">
          {/* Header Row: Title & Subtitle + Toolbar (Firm Dropdown & Reset) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Available Challenge Options
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-medium">
                Use the firm toggle to view one firm, or keep all firms selected.
              </p>
            </div>

            {/* Toolbar: Info Pill + Firm Selector + Reset Button */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-[#0e1015] border border-white/10 rounded-lg px-2.5 py-1.5 font-medium">
                <Info size={13} className="text-[#F0C41B]" />
                <span>Click firm for details</span>
              </div>

              {/* Firm Selector Dropdown */}
              <div className="flex items-center gap-2 bg-[#0e1015] hover:bg-[#13161f] border border-white/10 hover:border-[#F0C41B]/40 rounded-lg px-2.5 py-1.5 transition-all">
                <span className="text-xs font-semibold text-neutral-400">Firm</span>
                <div className="relative">
                  <select
                    value={selectedFirm}
                    onChange={(e) => setSelectedFirm(e.target.value)}
                    className="appearance-none bg-transparent text-white pr-5 text-xs font-bold focus:outline-none cursor-pointer transition-colors"
                  >
                    {firmDropdownOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#111318] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedType('All Types');
                  setSelectedSize('All Sizes');
                  setSelectedFirm('All Firms');
                  setSortField(null);
                  setSortOrder('asc');
                }}
                className="group flex items-center gap-1.5 bg-[#0e1015] hover:bg-white/[0.08] border border-white/10 hover:border-[#F0C41B]/40 active:scale-95 text-xs font-bold text-neutral-300 hover:text-[#F0C41B] rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer select-none"
                title="Reset all filters"
              >
                <RotateCcw size={12} className="text-neutral-400 group-hover:text-[#F0C41B] transition-transform duration-500 ease-out group-hover:-rotate-180" />
                <span className="tracking-wide">RESET</span>
              </button>
            </div>
          </div>

          {/* Filter Pills Toolbar: COMPACT & PROFESSIONAL, NO "TYPE:" OR "SIZE:" LABELS, NO GREY SCROLLBAR */}
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 p-1.5 bg-[#0a0b0e] border border-white/10 rounded-xl shadow-md">
            {/* Step Types Filter Buttons (NO SCROLLBAR / NO GREY LINE) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 overflow-hidden no-scrollbar scrollbar-none py-0.5">
              {['All Types', 'One Step', 'Two Step', 'Instant Funded'].map((type) => {
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`group relative px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer select-none outline-none focus:outline-none focus:ring-0 hover:scale-[1.02] active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-b from-[#F0C41B]/20 via-[#F0C41B]/10 to-[#F0C41B]/5 text-[#F0C41B] border border-[#F0C41B]/90 shadow-[0_2px_8px_rgba(240,196,27,0.18)]'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-[1px] inset-x-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffe875] to-transparent rounded-full" />
                    )}
                    <span className="relative z-10 tracking-wide">{type}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden xl:block w-[1px] h-6 bg-white/10 shrink-0" />

            {/* Account Sizes Filter Buttons (NO SCROLLBAR / NO GREY LINE) */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
              {['All Sizes', '5K', '10K', '25K', '50K', '100K', '200K'].map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`group relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer select-none outline-none focus:outline-none focus:ring-0 hover:scale-[1.02] active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-b from-[#F0C41B]/20 via-[#F0C41B]/10 to-[#F0C41B]/5 text-[#F0C41B] border border-[#F0C41B]/90 shadow-[0_2px_8px_rgba(240,196,27,0.18)]'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-[1px] inset-x-2 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffe875] to-transparent rounded-full" />
                    )}
                    <span className="relative z-10 tracking-wide">{size}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Container: Refined, Compact & Professional */}
          <div className="w-full overflow-hidden rounded-xl bg-[#08090c] border border-white/10 shadow-xl">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left border-collapse min-w-[940px]">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-white/10 bg-[#0c0d12] text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-3 px-4 text-left font-bold min-w-[190px]">FIRM</th>
                    <th className="py-3 px-3.5 text-left font-bold min-w-[125px]">ACCOUNT SIZE</th>
                    <th className="py-3 px-3.5 text-left font-bold min-w-[105px]">PROFIT TARGET</th>
                    <th className="py-3 px-3.5 text-left font-bold min-w-[110px]">DRAWDOWN</th>
                    <th className="py-3 px-3.5 text-left font-bold min-w-[95px]">DAILY LOSS</th>
                    <th 
                      onClick={() => {
                        if (sortField === 'challengeFee') {
                          if (sortOrder === 'asc') setSortOrder('desc');
                          else { setSortField(null); setSortOrder('asc'); }
                        } else {
                          setSortField('challengeFee');
                          setSortOrder('asc');
                        }
                      }}
                      className="py-3 px-3.5 text-left font-bold min-w-[115px] cursor-pointer hover:text-[#F0C41B] transition-colors select-none group/sort"
                    >
                      <div className="flex items-center gap-1">
                        <span>CHALLENGE FEE</span>
                        {sortField === 'challengeFee' ? (
                          sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#F0C41B]" /> : <ArrowDown size={12} className="text-[#F0C41B]" />
                        ) : (
                          <ArrowUpDown size={12} className="text-neutral-500 group-hover/sort:text-[#F0C41B] transition-colors" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => {
                        if (sortField === 'trueCost') {
                          if (sortOrder === 'asc') setSortOrder('desc');
                          else { setSortField(null); setSortOrder('asc'); }
                        } else {
                          setSortField('trueCost');
                          setSortOrder('asc');
                        }
                      }}
                      className="py-3 px-3.5 text-left font-bold min-w-[105px] cursor-pointer hover:text-[#F0C41B] transition-colors select-none group/sort"
                    >
                      <div className="flex items-center gap-1">
                        <span>TRUE COST</span>
                        {sortField === 'trueCost' ? (
                          sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#F0C41B]" /> : <ArrowDown size={12} className="text-[#F0C41B]" />
                        ) : (
                          <ArrowUpDown size={12} className="text-neutral-500 group-hover/sort:text-[#F0C41B] transition-colors" />
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-3.5 text-left font-bold min-w-[120px]">POINTS</th>
                    <th className="py-3 px-4 text-center font-bold min-w-[130px]">DISCOUNT</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredChallenges.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-neutral-400 text-sm">
                        No challenge options found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredChallenges.map((item) => {
                      const isCopied = copiedId === item.id;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-white/[0.025] transition-colors group"
                        >
                          {/* 1. FIRM */}
                          <td className="py-3.5 px-4 align-middle">
                            <div className="flex items-center gap-3">
                              <FirmIcon name={item.firmName} url={item.firmLogo} />
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#F0C41B] transition-colors">
                                  {item.firmName}
                                </div>
                                <div className="inline-block mt-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                                  {item.badge}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. ACCOUNT SIZE */}
                          <td className="py-3.5 px-3.5 align-middle whitespace-nowrap">
                            <div className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                              {formatCurrency(item.accountSize)}
                            </div>
                            <div className="inline-block mt-0.5 bg-white/5 border border-white/10 text-neutral-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                              {item.accountType}
                            </div>
                          </td>

                          {/* 3. PROFIT TARGET */}
                          <td className="py-3.5 px-3.5 align-middle whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-semibold text-neutral-200">
                              {item.profitTarget === 0 ? 'None' : formatCurrency(item.profitTarget)}
                            </div>
                          </td>

                          {/* 4. DRAWDOWN */}
                          <td className="py-3.5 px-3.5 align-middle whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-semibold text-neutral-200">
                              {formatCurrency(item.drawdown)}
                            </div>
                            <div className="inline-block mt-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                              {item.drawdownType}
                            </div>
                          </td>

                          {/* 5. DAILY LOSS */}
                          <td className="py-3.5 px-3.5 align-middle whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-semibold text-neutral-200">
                              {formatCurrency(item.dailyLoss)}
                            </div>
                          </td>

                          {/* 6. CHALLENGE FEE */}
                          <td className="py-3.5 px-3.5 align-middle whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-semibold text-neutral-300">
                              {formatCurrency(item.challengeFee)}
                            </div>
                          </td>

                          {/* 7. TRUE COST */}
                          <td className="py-3.5 px-3.5 align-middle whitespace-nowrap">
                            <div className="text-sm sm:text-base font-extrabold text-[#F0C41B]">
                              {formatCurrency(item.trueCost)}
                            </div>
                            {item.isCheapest && (
                              <div className="inline-flex items-center gap-1 mt-0.5 bg-[#F0C41B]/10 border border-[#F0C41B]/40 text-[#F0C41B] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                ★ CHEAPEST
                              </div>
                            )}
                          </td>

                          {/* 8. POINTS */}
                          <td className="py-3.5 px-3.5 align-middle whitespace-nowrap">
                            <div className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/10 text-neutral-300 text-[11px] font-medium px-2 py-1 rounded-md">
                              <Sparkles size={11} className="text-[#F0C41B]" />
                              <span>{item.pointsText || 'Coming soon pts'}</span>
                            </div>
                          </td>

                          {/* 9. DISCOUNT (ULTRA-PREMIUM GLOSSY & GLASSY CTA) */}
                          <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={(e) => handleCopyCode(e, item.id, item.discountCode, item.firmName, item.discountPercent)}
                                className="group/btn relative w-[116px] sm:w-[124px] overflow-hidden rounded-xl p-[1px] bg-gradient-to-b from-white/30 via-white/10 to-[#F0C41B]/40 hover:to-[#F0C41B]/70 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_6px_22px_rgba(240,196,27,0.3),inset_0_1px_2px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 cursor-pointer select-none backdrop-blur-md"
                                title={`Click to copy code ${item.discountCode}`}
                              >
                                {/* Upper Specular Curved Glass Highlight */}
                                <span className="absolute top-0 inset-x-0 h-[48%] bg-gradient-to-b from-white/25 via-white/10 to-transparent pointer-events-none rounded-t-xl z-10" />

                                {/* Glass Shimmer Specular Light Sweep */}
                                <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20" />

                                {/* Glass Card Surface */}
                                <div className="relative rounded-[11px] bg-gradient-to-b from-[#181c26]/90 via-[#0e1119]/95 to-[#090b0e] p-1 border border-white/10 group-hover/btn:border-[#F0C41B]/40 transition-colors">
                                  {/* Top Glossy Banner: Discount % */}
                                  <div className="py-0.5 px-1.5 text-[11px] font-black text-[#F0C41B] leading-tight uppercase tracking-tight flex items-center justify-center gap-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                                    <Tag size={10} className="text-[#F0C41B] stroke-[2.5]" />
                                    <span>{item.discountPercent}% OFF</span>
                                  </div>

                                  {/* Bottom Glass Pill: Coupon Code */}
                                  <div className={`mt-0.5 rounded-lg px-2 py-1 text-[10px] font-extrabold flex items-center justify-between gap-1 transition-all duration-200 border ${
                                    isCopied
                                      ? 'bg-[#F0C41B]/20 border-[#F0C41B] text-[#F0C41B] shadow-[0_0_12px_rgba(240,196,27,0.35),inset_0_1px_2px_rgba(255,235,140,0.3)]'
                                      : 'bg-black/60 hover:bg-black/80 border-white/10 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]'
                                  }`}>
                                    {isCopied ? (
                                      <>
                                        <span className="text-[#F0C41B] tracking-wider text-[9px] font-extrabold">COPIED!</span>
                                        <Check size={11} className="text-[#F0C41B] stroke-[3]" />
                                      </>
                                    ) : (
                                      <>
                                        <span className="tracking-wider text-neutral-100 group-hover/btn:text-white transition-colors">{item.discountCode}</span>
                                        <Copy size={10} className="text-[#F0C41B] group-hover/btn:scale-110 transition-all opacity-90 group-hover/btn:opacity-100" />
                                      </>
                                    )}
                                  </div>
                                </div>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeOptionsTable;
