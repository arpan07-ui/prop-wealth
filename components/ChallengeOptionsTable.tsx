import React, { useState, useMemo } from 'react';
import { Tag, Landmark, RotateCcw, Copy, Check, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ChallengeOption {
  id: string;
  firmId: string;
  firmName: string;
  firmLogo: string;
  badge: string; // e.g. "2 STEP STANDARD", "WORKERBEE", "RAPID 1-STEP"
  accountSize: number; // 5000, 10000, 25000, 50000, 100000, 200000
  accountType: string; // "CHALLENGE"
  stepType: 'One Step' | 'Two Step' | 'Instant Funded';
  profitTarget: number; // in dollars
  drawdown: number; // in dollars
  drawdownType: 'STATIC' | 'TRAILING';
  dailyLoss: number; // in dollars
  challengeFee: number; // in dollars
  trueCost: number; // in dollars after discount
  isCheapest?: boolean;
  pointsText?: string;
  discountPercent: number; // e.g. 25
  discountCode: string; // e.g. "BG25"
  affiliateUrl: string;
}

export const CHALLENGE_OPTIONS_DATA: ChallengeOption[] = [
  // ── Blue Guardian ──
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
  },
  {
    id: 'bg-50k',
    firmId: 'blue-guardian',
    firmName: 'Blue Guardian',
    firmLogo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    badge: '2 STEP STANDARD',
    accountSize: 50000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 4000,
    drawdown: 4000,
    drawdownType: 'STATIC',
    dailyLoss: 2000,
    challengeFee: 270,
    trueCost: 202.5,
    pointsText: 'Coming soon pts',
    discountPercent: 25,
    discountCode: 'BG25',
    affiliateUrl: 'https://blueguardian.com'
  },
  {
    id: 'bg-200k',
    firmId: 'blue-guardian',
    firmName: 'Blue Guardian',
    firmLogo: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    badge: '2 STEP STANDARD',
    accountSize: 200000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 16000,
    drawdown: 16000,
    drawdownType: 'STATIC',
    dailyLoss: 8000,
    challengeFee: 970,
    trueCost: 727.5,
    pointsText: 'Coming soon pts',
    discountPercent: 25,
    discountCode: 'BG25',
    affiliateUrl: 'https://blueguardian.com'
  },
  {
    id: 'fh-50k',
    firmId: 'fundedhive',
    firmName: 'Fundedhive',
    firmLogo: 'https://fundedhive.com/wp-content/uploads/2024/02/cropped-Favicon-32x32.png',
    badge: 'WORKERBEE',
    accountSize: 50000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 4000,
    drawdown: 5000,
    drawdownType: 'STATIC',
    dailyLoss: 2000,
    challengeFee: 299,
    trueCost: 269.1,
    pointsText: 'Coming soon pts',
    discountPercent: 10,
    discountCode: 'HIVE',
    affiliateUrl: 'https://fundedhive.com'
  },
  {
    id: 'fh-25k',
    firmId: 'fundedhive',
    firmName: 'Fundedhive',
    firmLogo: 'https://fundedhive.com/wp-content/uploads/2024/02/cropped-Favicon-32x32.png',
    badge: 'WORKERBEE',
    accountSize: 25000,
    accountType: 'CHALLENGE',
    stepType: 'Two Step',
    profitTarget: 2000,
    drawdown: 2500,
    drawdownType: 'STATIC',
    dailyLoss: 1000,
    challengeFee: 169,
    trueCost: 152.1,
    pointsText: 'Coming soon pts',
    discountPercent: 10,
    discountCode: 'HIVE',
    affiliateUrl: 'https://fundedhive.com'
  },
  {
    id: 'e8-100k',
    firmId: 'e8-markets',
    firmName: 'E8 Markets',
    firmLogo: 'https://e8markets.com/images/logo/logo.svg',
    badge: 'INSTANT FUNDED',
    accountSize: 100000,
    accountType: 'CHALLENGE',
    stepType: 'Instant Funded',
    profitTarget: 0,
    drawdown: 8000,
    drawdownType: 'TRAILING',
    dailyLoss: 4000,
    challengeFee: 588,
    trueCost: 529.2,
    pointsText: 'Coming soon pts',
    discountPercent: 10,
    discountCode: 'E8X',
    affiliateUrl: 'https://e8markets.com'
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
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'challenge_options' | 'all_firms'>('challenge_options');

  // Filter states
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedSize, setSelectedSize] = useState<string>('All Sizes');
  const [selectedFirm, setSelectedFirm] = useState<string>('All Firms');

  // Sort states - null keeps curated screenshot order
  const [sortField, setSortField] = useState<'trueCost' | 'challengeFee' | 'accountSize' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Copied feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Extract unique firm names for dropdown
  const firmOptions = useMemo(() => {
    const set = new Set<string>();
    CHALLENGE_OPTIONS_DATA.forEach(item => set.add(item.firmName));
    return ['All Firms', ...Array.from(set).sort()];
  }, []);

  // Filtered and sorted dataset
  const filteredData = useMemo(() => {
    const filtered = CHALLENGE_OPTIONS_DATA.filter(item => {
      // Step Type filter
      if (selectedType !== 'All Types' && item.stepType !== selectedType) {
        return false;
      }
      // Account size filter
      if (selectedSize !== 'All Sizes') {
        const sizeNumber = parseInt(selectedSize.replace('K', '')) * 1000;
        if (item.accountSize !== sizeNumber) {
          return false;
        }
      }
      // Firm filter
      if (selectedFirm !== 'All Firms' && item.firmName !== selectedFirm) {
        return false;
      }
      return true;
    });

    if (!sortField) {
      return filtered; // Preserves screenshot order
    }

    return [...filtered].sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'trueCost') {
        return (a.trueCost - b.trueCost) * modifier;
      }
      if (sortField === 'challengeFee') {
        return (a.challengeFee - b.challengeFee) * modifier;
      }
      if (sortField === 'accountSize') {
        return (a.accountSize - b.accountSize) * modifier;
      }
      return 0;
    });
  }, [selectedType, selectedSize, selectedFirm, sortField, sortOrder]);

  // Handle Sort Toggle
  const toggleSort = (field: 'trueCost' | 'challengeFee') => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortField(null); // Return to default
        setSortOrder('asc');
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Reset Filters
  const handleReset = () => {
    setSelectedType('All Types');
    setSelectedSize('All Sizes');
    setSelectedFirm('All Firms');
    setSortField(null);
    setSortOrder('asc');
  };

  // Copy Code Handler
  const handleCopy = (e: React.MouseEvent, item: ChallengeOption) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.discountCode).then(() => {
      setCopiedId(item.id);
      setToastMessage(`Copied ${item.discountCode}! Save ${item.discountPercent}% at ${item.firmName}`);
      if (onCopyCode) {
        onCopyCode(item.discountCode, item.firmName);
      }
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    });
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return '$' + val.toLocaleString();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0f14] border border-[#00e575]/50 text-white px-5 py-3 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(0,229,117,0.3)] flex items-center gap-3 animate-fade-in backdrop-blur-xl">
          <CheckCircle2 size={18} className="text-[#00e575] shrink-0" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ── TOP VIEW TOGGLE: [🏷️ Challenge Options]  [🏛️ All Firms] ── */}
      <div className="flex justify-center mb-8 sm:mb-10">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#0b0c10] border border-neutral-800/90 shadow-lg">
          <button
            onClick={() => setActiveTab('challenge_options')}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'challenge_options'
                ? 'border border-[#00e575]/80 bg-[#00e575]/10 text-[#00e575] shadow-[0_0_15px_rgba(0,229,117,0.25)]'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            <Tag size={15} className={activeTab === 'challenge_options' ? 'text-[#00e575]' : 'text-neutral-400'} />
            <span>Challenge Options</span>
          </button>

          <button
            onClick={() => setActiveTab('all_firms')}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'all_firms'
                ? 'border border-[#00e575]/80 bg-[#00e575]/10 text-[#00e575] shadow-[0_0_15px_rgba(0,229,117,0.25)]'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            <Landmark size={15} className={activeTab === 'all_firms' ? 'text-[#00e575]' : 'text-neutral-400'} />
            <span>All Firms</span>
          </button>
        </div>
      </div>

      {activeTab === 'all_firms' ? (
        /* ── ALL FIRMS DIRECTORY VIEW ── */
        <div className="rounded-3xl bg-[#090a0e] border border-neutral-800/80 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">All Verified Prop Firms</h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">Browse all vetted proprietary trading firms, ratings, and max funding limits.</p>
            </div>
            <Link to="/firms" className="text-xs font-bold text-[#00e575] hover:underline flex items-center gap-1">
              <span>View Full Directory</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {firmOptions.filter(f => f !== 'All Firms').map((firm, idx) => (
              <div key={idx} className="bg-[#101217] border border-white/5 hover:border-[#00e575]/40 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#171a22] border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                    {firm.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{firm}</div>
                    <div className="text-[11px] text-neutral-400">Verified Partner</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFirm(firm);
                    setActiveTab('challenge_options');
                  }}
                  className="px-3 py-1.5 bg-[#00e575]/10 hover:bg-[#00e575]/20 border border-[#00e575]/40 text-[#00e575] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Challenges
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── CHALLENGE OPTIONS VIEW ── */
        <div className="space-y-6">
          {/* Header Row: Title & Subtitle + Firm Dropdown & Reset */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Available Challenge Options
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
                Use the firm toggle to view one firm, or keep all firms selected.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
              <span className="hidden sm:inline-block text-xs text-neutral-400 font-medium">
                Click Firm Name For Full Details
              </span>

              {/* Firm Selector Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-300">Firm</span>
                <div className="relative">
                  <select
                    value={selectedFirm}
                    onChange={(e) => setSelectedFirm(e.target.value)}
                    className="appearance-none bg-[#111318] hover:bg-[#15181f] border border-neutral-800 text-white rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold focus:outline-none focus:border-[#00e575] cursor-pointer transition-colors"
                  >
                    {firmOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#111318] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="bg-[#111318] hover:bg-white/5 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw size={12} className="text-neutral-400" />
                <span>RESET</span>
              </button>
            </div>
          </div>

          {/* Filter Bars (Two Pill Boxes Side-by-Side) */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Step Types Filter */}
            <div className="inline-flex items-center bg-[#0b0c10] border border-neutral-800/90 rounded-xl p-1 gap-1 overflow-x-auto">
              {['All Types', 'One Step', 'Two Step', 'Instant Funded'].map((type) => {
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'border border-[#00e575] bg-[#00e575]/10 text-[#00e575] shadow-[0_0_12px_rgba(0,229,117,0.2)]'
                        : 'text-neutral-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-[#00e575] rounded-full shadow-[0_0_8px_#00e575]" />
                    )}
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>

            {/* Account Sizes Filter */}
            <div className="inline-flex items-center bg-[#0b0c10] border border-neutral-800/90 rounded-xl p-1 gap-1 overflow-x-auto">
              {['All Sizes', '5K', '10K', '25K', '50K', '100K', '200K'].map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`relative px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'border border-[#00e575] bg-[#00e575]/10 text-[#00e575] shadow-[0_0_12px_rgba(0,229,117,0.2)]'
                        : 'text-neutral-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-[#00e575] rounded-full shadow-[0_0_8px_#00e575]" />
                    )}
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Table Container ── */}
          <div className="w-full overflow-hidden rounded-2xl bg-[#090a0d] border border-neutral-800/40 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-neutral-800/40 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">FIRM</th>
                    <th className="py-3.5 px-4 font-bold">ACCOUNT SIZE</th>
                    <th className="py-3.5 px-4 font-bold">PROFIT TARGET</th>
                    <th className="py-3.5 px-4 font-bold">DRAWDOWN</th>
                    <th className="py-3.5 px-4 font-bold">DAILY LOSS</th>
                    <th 
                      onClick={() => toggleSort('challengeFee')}
                      className="py-3.5 px-4 font-bold cursor-pointer hover:text-white transition-colors select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>CHALLENGE FEE</span>
                        {sortField === 'challengeFee' ? (
                          sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#00e575]" /> : <ArrowDown size={12} className="text-[#00e575]" />
                        ) : (
                          <ArrowUpDown size={12} className="text-neutral-500" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => toggleSort('trueCost')}
                      className="py-3.5 px-4 font-bold cursor-pointer hover:text-white transition-colors select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>TRUE COST</span>
                        {sortField === 'trueCost' ? (
                          sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#00e575]" /> : <ArrowDown size={12} className="text-[#00e575]" />
                        ) : (
                          <ArrowUpDown size={12} className="text-neutral-500" />
                        )}
                      </div>
                    </th>
                    <th className="py-3.5 px-4 font-bold">POINTS</th>
                    <th className="py-3.5 px-4 font-bold text-center">DISCOUNT</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-neutral-800/50">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-neutral-400 text-sm">
                        No challenge options found matching the selected filters.
                        <div className="mt-3">
                          <button
                            onClick={handleReset}
                            className="px-4 py-1.5 rounded-lg bg-[#111318] border border-neutral-700 text-xs font-bold text-[#00e575] hover:bg-white/5 cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => {
                      const isCopied = copiedId === item.id;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* 1. FIRM */}
                          <td className="py-4 px-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#111318] border border-white/10 flex items-center justify-center shrink-0 p-1.5 overflow-hidden shadow-inner">
                                <img
                                  src={item.firmLogo}
                                  alt={item.firmName}
                                  className="w-full h-full object-contain filter contrast-125"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white group-hover:text-[#00e575] transition-colors">
                                  {item.firmName}
                                </div>
                                <div className="inline-block mt-0.5 border border-[#00e575]/40 bg-[#00e575]/10 text-[#00e575] text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                                  {item.badge}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. ACCOUNT SIZE */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <div className="text-base font-extrabold text-white">
                              {formatCurrency(item.accountSize)}
                            </div>
                            <div className="inline-block mt-0.5 bg-neutral-800/80 text-neutral-400 text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                              {item.accountType}
                            </div>
                          </td>

                          {/* 3. PROFIT TARGET */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <div className="text-sm font-bold text-white">
                              {item.profitTarget === 0 ? 'None' : formatCurrency(item.profitTarget)}
                            </div>
                          </td>

                          {/* 4. DRAWDOWN */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <div className="text-sm font-bold text-white">
                              {formatCurrency(item.drawdown)}
                            </div>
                            <div className="inline-block mt-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                              {item.drawdownType}
                            </div>
                          </td>

                          {/* 5. DAILY LOSS */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <div className="text-sm font-bold text-white">
                              {formatCurrency(item.dailyLoss)}
                            </div>
                          </td>

                          {/* 6. CHALLENGE FEE */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <div className="text-sm font-bold text-white">
                              {formatCurrency(item.challengeFee)}
                            </div>
                          </td>

                          {/* 7. TRUE COST */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <div className="text-sm sm:text-base font-extrabold text-[#00e575] drop-shadow-[0_0_6px_rgba(0,229,117,0.3)]">
                              {formatCurrency(item.trueCost)}
                            </div>
                            {item.isCheapest && (
                              <div className="inline-block mt-0.5 bg-[#00e575]/15 border border-[#00e575]/40 text-[#00e575] text-[9px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                                CHEAPEST
                              </div>
                            )}
                          </td>

                          {/* 8. POINTS */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <div className="text-xs font-bold text-[#00e575]">
                              {item.pointsText || 'Coming soon pts'}
                            </div>
                          </td>

                          {/* 9. DISCOUNT (HIGH IMPACT CTA) */}
                          <td className="py-4 px-4 align-middle text-center whitespace-nowrap">
                            <div
                              onClick={(e) => handleCopy(e, item)}
                              className="inline-block w-full max-w-[124px] bg-[#00e575] hover:bg-[#00ff83] transition-all duration-300 rounded-xl p-1.5 shadow-[0_0_18px_rgba(0,229,117,0.35)] hover:shadow-[0_0_26px_rgba(0,229,117,0.55)] hover:scale-[1.03] active:scale-95 cursor-pointer select-none"
                              title={`Click to copy code ${item.discountCode}`}
                            >
                              <div className="text-xs font-black text-black leading-tight uppercase tracking-tight">
                                {item.discountPercent}% OFF
                              </div>
                              <div className="bg-black/90 hover:bg-black text-white rounded-lg px-2 py-1 text-[10px] font-black flex items-center justify-center gap-1 mt-1 transition-colors">
                                {isCopied ? (
                                  <>
                                    <Check size={11} className="text-[#00e575]" />
                                    <span className="text-[#00e575]">COPIED</span>
                                  </>
                                ) : (
                                  <>
                                    <span>{item.discountCode}</span>
                                    <Copy size={11} className="text-neutral-400 group-hover:text-white" />
                                  </>
                                )}
                              </div>
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
