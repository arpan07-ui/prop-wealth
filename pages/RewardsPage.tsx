import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gift, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  Check, 
  Search, 
  Filter, 
  ArrowRight, 
  Laptop, 
  Smartphone, 
  Monitor, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  Copy,
  ExternalLink,
  Flame,
  Coins,
  Ticket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTradeMode } from '../context/TradeModeContext';
import { supabase } from '../lib/supabaseClient';

interface RewardItem {
  id: string;
  title: string;
  category: 'accounts' | 'tech' | 'software' | 'giftcards';
  cost: number;
  usdValue: number;
  description: string;
  badge?: string;
  popular?: boolean;
  deliveryTime: string;
  features: string[];
  image: string;
  stock: 'In Stock' | 'Limited Stock' | 'Instant Delivery';
}

const DEFAULT_REWARDS: RewardItem[] = [
  // ── 1. FREE PROP ACCOUNTS ──
  {
    id: 'prop-topstep-50k',
    title: 'Topstep 50K Express Funded Account',
    category: 'accounts',
    cost: 1650,
    usdValue: 165,
    description: '100% Free 50K Futures evaluation challenge at Topstep with zero activation fee.',
    badge: 'Futures Classic',
    popular: true,
    deliveryTime: 'Instant Delivery',
    features: ['100% Promo Paid', 'Zero Activation Fee', 'Same-Day Account Credentials'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1783190412/tradzu/firms-featured/funded-trader-markets-featured-1783190412112.png',
    stock: 'Instant Delivery'
  },
  {
    id: 'prop-ftmo-100k',
    title: 'FTMO $100,000 Challenge Account',
    category: 'accounts',
    cost: 5400,
    usdValue: 540,
    description: 'Full $100K 2-step FTMO challenge evaluation account delivered directly to your email.',
    badge: 'Industry Standard',
    popular: true,
    deliveryTime: 'Within 2 Hours',
    features: ['Full $100,000 Account', '90% Profit Split', 'Refundable Evaluation Fee'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1783190412/tradzu/firms-featured/funded-trader-markets-featured-1783190412112.png',
    stock: 'In Stock'
  },
  {
    id: 'prop-funding-pips-100k',
    title: 'Funding Pips $100K Evaluation',
    category: 'accounts',
    cost: 3900,
    usdValue: 399,
    description: 'Direct voucher for a $100K 2-phase evaluation on Funding Pips with crypto/forex pairs.',
    badge: 'High Value',
    deliveryTime: 'Instant Delivery',
    features: ['Instant Voucher Code', 'Fast Payout Cycle', 'No Time Limit'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1783190412/tradzu/firms-featured/funded-trader-markets-featured-1783190412112.png',
    stock: 'Instant Delivery'
  },
  {
    id: 'prop-goat-funded-50k',
    title: 'Goat Funded $50K Evaluation Account',
    category: 'accounts',
    cost: 2100,
    usdValue: 219,
    description: 'Zero commission evaluation with up to 95% profit split and fast bi-weekly payouts.',
    badge: 'Fast Payouts',
    deliveryTime: 'Within 1 Hour',
    features: ['Up to 95% Profit Split', 'Crypto & Forex Trading', 'Full Support'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1783190412/tradzu/firms-featured/funded-trader-markets-featured-1783190412112.png',
    stock: 'In Stock'
  },

  // ── 2. TECH & HARDWARE ──
  {
    id: 'tech-macbook-air-m3',
    title: 'Apple MacBook Air M3 (16GB / 512GB)',
    category: 'tech',
    cost: 12900,
    usdValue: 1299,
    description: 'Brand new, sealed Apple MacBook Air with M3 chip, Midnight finish, shipped worldwide.',
    badge: 'Ultimate Trader Setup',
    popular: true,
    deliveryTime: '3-5 Business Days',
    features: ['Apple Silicon M3', 'Liquid Retina Display', 'Official Apple Warranty'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1786894272/tradzu/rewards/reward-macbook-m5-air-1786894272179.png',
    stock: 'Limited Stock'
  },
  {
    id: 'tech-iphone-16-pro',
    title: 'Apple iPhone 16 Pro (256GB)',
    category: 'tech',
    cost: 10900,
    usdValue: 1099,
    description: 'Brand new iPhone 16 Pro in Natural Titanium. Mobile charting and trade management powerhouse.',
    badge: 'Mobile Power',
    deliveryTime: '3-5 Business Days',
    features: ['Titanium Design', 'ProMotion 120Hz', 'Factory Unlocked'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1786894272/tradzu/rewards/reward-macbook-m5-air-1786894272179.png',
    stock: 'Limited Stock'
  },
  {
    id: 'tech-curved-monitor',
    title: 'Dell UltraSharp 34" Curved Trading Monitor',
    category: 'tech',
    cost: 7500,
    usdValue: 750,
    description: 'WQHD 34-inch curved panoramic monitor tailored for multi-chart technical analysis.',
    badge: 'Desk Upgrade',
    deliveryTime: '4-7 Business Days',
    features: ['Panoramic View', 'USB-C 90W Hub', 'Eye Comfort Certified'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1786894272/tradzu/rewards/reward-macbook-m5-air-1786894272179.png',
    stock: 'In Stock'
  },

  // ── 3. SOFTWARE & TOOLS ──
  {
    id: 'soft-tradingview-premium',
    title: 'TradingView Premium (1-Year Subscription)',
    category: 'software',
    cost: 3800,
    usdValue: 420,
    description: 'Official 12-month voucher for TradingView Premium with 8 charts per tab and 400 alerts.',
    badge: 'Most Essential',
    popular: true,
    deliveryTime: 'Instant Voucher',
    features: ['8 Charts Per Layout', 'Seconds Timeframes', '400 Active Alerts'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1783190412/tradzu/firms-featured/funded-trader-markets-featured-1783190412112.png',
    stock: 'Instant Delivery'
  },
  {
    id: 'soft-wealth-replay-pass',
    title: 'PROPxWEALTH Market Replay Pro (Lifetime)',
    category: 'software',
    cost: 1500,
    usdValue: 199,
    description: 'Lifetime access to our proprietary tick-by-tick market replay simulator and trade journal.',
    badge: 'Exclusive',
    deliveryTime: 'Instant Activation',
    features: ['Tick-by-Tick Data', 'Automated Journal Sync', 'Lifetime License'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1783190412/tradzu/firms-featured/funded-trader-markets-featured-1783190412112.png',
    stock: 'Instant Delivery'
  },
  {
    id: 'soft-ai-bot-pass',
    title: 'Wealth AI Assistant (1-Year VIP Pass)',
    category: 'software',
    cost: 1200,
    usdValue: 149,
    description: 'Instant access to AI prop rules checking, contract risk sizing, and live trade analytics.',
    badge: 'AI Intelligence',
    deliveryTime: 'Instant Activation',
    features: ['Rule Violation Guard', 'Lot Size Calculator', 'Real-Time News Alert'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1783190412/tradzu/firms-featured/funded-trader-markets-featured-1783190412112.png',
    stock: 'Instant Delivery'
  },

  // ── 4. GIFT CARDS & CASH ──
  {
    id: 'card-amazon-500',
    title: '$500 USD Amazon Digital Gift Card',
    category: 'giftcards',
    cost: 5000,
    usdValue: 500,
    description: 'Global Amazon e-gift card voucher delivered immediately to your account dashboard.',
    badge: 'Cash Equivalent',
    popular: true,
    deliveryTime: 'Instant Code',
    features: ['Global Redemption', 'Never Expires', 'Direct Email Delivery'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1786894272/tradzu/rewards/reward-macbook-m5-air-1786894272179.png',
    stock: 'Instant Delivery'
  },
  {
    id: 'card-usdt-250',
    title: '$250 USDT Crypto Direct Payout',
    category: 'giftcards',
    cost: 2600,
    usdValue: 250,
    description: 'Direct USDT (TRC-20 or ERC-20) withdrawal deposited straight into your Web3 wallet.',
    badge: 'Direct Crypto',
    deliveryTime: 'Within 30 Minutes',
    features: ['Instant TRC-20 / ERC-20', 'Zero Gas Fee for You', 'Automated Verification'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1786894272/tradzu/rewards/reward-macbook-m5-air-1786894272179.png',
    stock: 'Instant Delivery'
  },
  {
    id: 'card-uber-200',
    title: '$200 USD Uber & UberEats Gift Card',
    category: 'giftcards',
    cost: 2000,
    usdValue: 200,
    description: 'Enjoy free rides and food delivery with a $200 Uber gift code.',
    badge: 'Lifestyle',
    deliveryTime: 'Instant Code',
    features: ['Uber & UberEats Eligible', 'No Expiration Date', 'Worldwide Acceptance'],
    image: 'https://res.cloudinary.com/dwq3wjqa1/image/upload/v1786894272/tradzu/rewards/reward-macbook-m5-air-1786894272179.png',
    stock: 'Instant Delivery'
  }
];

const RewardsPage: React.FC = () => {
  const { user } = useAuth();
  const { getModePath } = useTradeMode();

  const [rewards, setRewards] = useState<RewardItem[]>(DEFAULT_REWARDS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [userTokens, setUserTokens] = useState(1450);
  const [hasClaimedDaily, setHasClaimedDaily] = useState(false);
  const [claimFeedback, setClaimFeedback] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  // Daily checkin bonus simulation
  const handleDailyClaim = () => {
    if (hasClaimedDaily) return;
    setUserTokens(prev => prev + 50);
    setHasClaimedDaily(true);
    setClaimFeedback('+50 WEALTH claimed successfully!');
    setTimeout(() => setClaimFeedback(''), 4000);
  };

  // Filter rewards
  const filteredRewards = useMemo(() => {
    return rewards.filter(r => {
      const matchCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [rewards, selectedCategory, searchQuery]);

  const handleRedeem = (reward: RewardItem) => {
    setSelectedReward(reward);
    setRedeemSuccess(false);
  };

  const confirmRedemption = () => {
    if (selectedReward && userTokens >= selectedReward.cost) {
      setUserTokens(prev => prev - selectedReward.cost);
      setRedeemSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070605] text-white pt-24 sm:pt-28 pb-20 relative overflow-hidden">
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-accent/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ═══════════════════ HEADER ═══════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-accent/[0.08] border border-brand-accent/30 rounded-full px-4 py-1.5 mb-5 shadow-[0_0_15px_rgba(240,196,27,0.12)]">
            <Gift className="w-3.5 h-3.5 text-brand-accent" />
            <span className="text-[10px] font-extrabold text-brand-accent uppercase tracking-widest">
              WEALTH Rewards Vault & Marketplace
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            Redeem WEALTH Tokens For <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0C41B] via-amber-300 to-amber-500">
              Free Challenges & Tech Gear
            </span>
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Every prop firm challenge purchased using promo code <strong className="text-brand-accent">WEALTH</strong> earns you automatic cashback tokens. Trade, accumulate, and redeem for real tangible prizes.
          </p>
        </div>

        {/* ═══════════════════ USER TOKEN WALLET & TICKER BANNER ═══════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          
          {/* Token Balance Card */}
          <div className="rounded-2xl bg-[#0e0d0a] border border-brand-accent/40 p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(240,196,27,0.06)] relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-accent/[0.08] rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Your Rewards Wallet</span>
                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active
                </span>
              </div>
              
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl sm:text-4xl font-black text-brand-accent tracking-tight font-mono">
                  {userTokens.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-neutral-300">WEALTH</span>
              </div>
              <div className="text-xs text-neutral-400">
                ≈ <strong className="text-white font-semibold">${(userTokens * 0.1).toFixed(2)} USD</strong> Redeemable Value
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDailyClaim}
                disabled={hasClaimedDaily}
                className={`text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  hasClaimedDaily 
                    ? 'bg-white/5 text-neutral-500 cursor-not-allowed border border-white/5' 
                    : 'bg-brand-accent text-black hover:bg-amber-400 shadow-[0_0_15px_rgba(240,196,27,0.3)]'
                }`}
              >
                <Sparkles size={13} />
                {hasClaimedDaily ? 'Daily Bonus Claimed' : 'Claim +50 Daily Bonus'}
              </button>

              {claimFeedback && (
                <span className="text-xs text-green-400 font-bold animate-fade-in truncate">
                  {claimFeedback}
                </span>
              )}
            </div>
          </div>

          {/* How to Earn More Card */}
          <div className="rounded-2xl bg-[#0e0d0a] border border-white/10 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame size={16} className="text-[#F0C41B]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Fastest Way to Earn</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mb-2 leading-snug">
                Buy Challenges with Code <span className="text-brand-accent">WEALTH</span>
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Get up to 30% instant checkout discount across 50+ prop firms + auto-credited 15% cashback tokens directly into this wallet.
              </p>
            </div>

            <Link to={getModePath('/offers')}>
              <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <span>Browse Discounted Challenges</span>
                <ArrowRight size={13} className="text-brand-accent" />
              </button>
            </Link>
          </div>

          {/* Active Community Pool Preview Card */}
          <div className="rounded-2xl bg-[#0e0d0a] border border-white/10 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/[0.06] rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Ticket size={11} /> Community Pool
                </span>
                <span className="text-[10px] text-neutral-400">Ends in 2d 14h</span>
              </div>

              <h4 className="text-base font-black text-white mb-1">
                MacBook Air M3 Community Raffle Pool
              </h4>
              <p className="text-xs text-neutral-400 mb-3">
                Current Pool Progress: 84% Funded (16 Tickets Left)
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-black/60 rounded-full h-2 border border-white/10 overflow-hidden mb-2">
                <div className="bg-gradient-to-r from-brand-accent to-amber-500 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">Ticket: <strong>250 WEALTH</strong></span>
              <button 
                onClick={() => handleRedeem(DEFAULT_REWARDS[4])}
                className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
              >
                Join Pool <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>

        {/* ═══════════════════ CATEGORY TABS & SEARCH ═══════════════════ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Rewards', icon: Gift },
              { id: 'accounts', label: 'Prop Accounts', icon: Shield },
              { id: 'tech', label: 'Tech & Gear', icon: Laptop },
              { id: 'software', label: 'Software & Tools', icon: Zap },
              { id: 'giftcards', label: 'Gift Cards & Crypto', icon: CreditCard },
            ].map(tab => {
              const active = selectedCategory === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-brand-accent text-black shadow-[0_0_15px_rgba(240,196,27,0.35)]'
                      : 'bg-[#12100d] text-neutral-400 hover:text-white border border-white/5 hover:border-white/10'
                  }`}
                >
                  <Icon size={13} className={active ? 'text-black' : 'text-neutral-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search rewards..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#12100d] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-accent/50 transition-colors"
            />
          </div>

        </div>

        {/* ═══════════════════ REWARDS GRID ═══════════════════ */}
        {filteredRewards.length === 0 ? (
          <div className="text-center py-20 bg-[#0e0d0a] rounded-2xl border border-white/10">
            <Gift className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No rewards found</h3>
            <p className="text-xs text-neutral-400">Try adjusting your search query or switching categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRewards.map((reward) => (
              <div 
                key={reward.id}
                className="group relative rounded-2xl bg-[#0e0d0a] border border-white/10 hover:border-brand-accent/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              >
                {/* Popular / Badge Flag */}
                {reward.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${
                      reward.popular 
                        ? 'bg-brand-accent text-black shadow-[0_0_12px_rgba(240,196,27,0.4)]' 
                        : 'bg-white/10 text-neutral-300 border border-white/10'
                    }`}>
                      {reward.badge}
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[9px] font-bold text-neutral-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                    {reward.stock}
                  </span>
                </div>

                <div>
                  {/* Visual Header / Image Area */}
                  <div className="relative h-44 bg-gradient-to-b from-[#18150f] to-[#0e0d0a] border-b border-white/5 flex items-center justify-center p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                    
                    {/* Glowing circular backdrop */}
                    <div className="absolute w-28 h-28 bg-brand-accent/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />

                    <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#14120e] border border-white/10 flex items-center justify-center text-brand-accent shadow-lg group-hover:scale-105 transition-transform">
                      {reward.category === 'accounts' && <Shield size={36} className="text-brand-accent" />}
                      {reward.category === 'tech' && <Laptop size={36} className="text-amber-400" />}
                      {reward.category === 'software' && <Zap size={36} className="text-cyan-400" />}
                      {reward.category === 'giftcards' && <CreditCard size={36} className="text-emerald-400" />}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-black text-white mb-2 group-hover:text-brand-accent transition-colors line-clamp-1">
                      {reward.title}
                    </h3>

                    <p className="text-neutral-400 text-xs leading-relaxed mb-4 line-clamp-2">
                      {reward.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5 mb-5">
                      {reward.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-300">
                          <CheckCircle2 size={12} className="text-brand-accent shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer: Price & CTA */}
                <div className="p-5 pt-0">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[10px] text-neutral-500 font-bold uppercase">Token Cost</div>
                      <div className="text-lg font-black text-brand-accent font-mono">
                        {reward.cost.toLocaleString()} <span className="text-xs text-white">WEALTH</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-neutral-500 font-bold uppercase">USD Value</div>
                      <div className="text-sm font-bold text-white">${reward.usdValue}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRedeem(reward)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-accent to-amber-500 hover:from-amber-400 hover:to-brand-accent text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(240,196,27,0.25)] hover:shadow-[0_0_20px_rgba(240,196,27,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Redeem Reward</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════ REDEEM CONFIRMATION MODAL ═══════════════════ */}
        {selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md rounded-2xl bg-[#0e0d0a] border border-brand-accent/40 p-6 sm:p-7 shadow-2xl">
              
              <button 
                onClick={() => setSelectedReward(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
              >
                ✕
              </button>

              {!redeemSuccess ? (
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent mb-4">
                    <Gift size={24} />
                  </div>

                  <h3 className="text-xl font-black text-white mb-1">Confirm Redemption</h3>
                  <p className="text-xs text-neutral-400 mb-5">
                    You are about to exchange WEALTH tokens for:
                  </p>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 mb-4">
                    <div className="text-sm font-bold text-white mb-1">{selectedReward.title}</div>
                    <div className="text-xs text-brand-accent font-black">{selectedReward.cost.toLocaleString()} WEALTH Tokens</div>
                    <div className="text-[10px] text-neutral-500 mt-1">Estimated delivery: {selectedReward.deliveryTime}</div>
                  </div>

                  {/* Balance Check */}
                  <div className="flex items-center justify-between text-xs py-2 border-b border-white/10 mb-5">
                    <span className="text-neutral-400">Your Current Balance:</span>
                    <span className={`font-black ${userTokens >= selectedReward.cost ? 'text-green-400' : 'text-red-400'}`}>
                      {userTokens.toLocaleString()} WEALTH
                    </span>
                  </div>

                  {userTokens >= selectedReward.cost ? (
                    <button
                      type="button"
                      onClick={confirmRedemption}
                      className="w-full py-3 rounded-xl bg-brand-accent text-black font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(240,196,27,0.4)] cursor-pointer"
                    >
                      Confirm & Deduct Tokens
                    </button>
                  ) : (
                    <div>
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 mb-3">
                        Insufficient token balance. You need {(selectedReward.cost - userTokens).toLocaleString()} more WEALTH tokens to claim this reward.
                      </div>
                      <Link to={getModePath('/offers')} onClick={() => setSelectedReward(null)}>
                        <button className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors">
                          Earn Tokens by Buying Challenges
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Redemption Successful!</h3>
                  <p className="text-xs text-neutral-300 mb-5 leading-relaxed">
                    We have received your request for <strong>{selectedReward.title}</strong>. Your confirmation code and voucher details have been generated.
                  </p>

                  <div className="p-3 rounded-xl bg-black/60 border border-brand-accent/30 font-mono text-xs text-brand-accent mb-5 select-all">
                    VOUCHER-WLTH-{Math.random().toString(36).substring(2, 9).toUpperCase()}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="w-full py-2.5 rounded-xl bg-brand-accent text-black font-bold text-xs hover:bg-amber-400"
                  >
                    Done & Back to Rewards
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ═══════════════════ FAQ SECTION ═══════════════════ */}
        <div className="mt-24 pt-16 border-t border-white/10 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-white mb-2">Frequently Asked Questions</h3>
            <p className="text-xs text-neutral-400">Everything you need to know about WEALTH tokens and redemption.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How do I earn WEALTH tokens?',
                a: 'You earn tokens automatically by purchasing evaluations or challenges from our 50+ supported prop firms using promo code WEALTHX. Each purchase deposits up to 15% cashback value in tokens into your wallet.'
              },
              {
                q: 'How are the rewards delivered?',
                a: 'Prop firm evaluation codes, software vouchers, and Amazon gift cards are delivered immediately to your email and dashboard. Physical hardware (like MacBooks and monitors) are shipped via tracked DHL/FedEx.'
              },
              {
                q: 'Do WEALTH tokens expire?',
                a: 'No! WEALTH tokens never expire as long as your account remains active. You can save and accumulate them for high-ticket items like MacBooks or redeem them immediately.'
              },
              {
                q: 'Are the free challenge accounts legitimate evaluations?',
                a: 'Yes! They are 100% genuine evaluation accounts issued directly by Topstep, FTMO, Funding Pips, or Goat Funded Trader. Once you pass, you receive a real funded trader agreement.'
              }
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0e0d0a] border border-white/10 text-left">
                <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{faq.q}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RewardsPage;
