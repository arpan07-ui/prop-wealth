// Comprehensive fallback datasets and resilient timeout wrapper
// Ensures zero infinite loading, zero blank screens, and 100% instant render across all pages

export const withTimeout = async <T>(promise: Promise<T>, ms: number = 2500, fallback: T): Promise<T> => {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return result;
  } catch (err) {
    clearTimeout(timer);
    return fallback;
  }
};

export interface FallbackFirm {
  id: string;
  name: string;
  website: string;
  affiliate_link: string;
  logo_url: string;
  rating: number;
  status: string;
  profit_split: string;
  max_funding: string;
  founded_year: string;
  hq_location: string;
  avg_payout_time: string;
  payout_percentage: number;
  platforms: string[];
  tags: string[];
  trading_type: string;
  discount_code: string;
  description: string;
}

export const FALLBACK_FIRMS: FallbackFirm[] = [
  {
    id: 'ftmo-01',
    name: 'FTMO',
    website: 'https://ftmo.com',
    affiliate_link: 'https://ftmo.com?ref=propxwealth',
    logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
    rating: 4.9,
    status: 'active',
    profit_split: '90%',
    max_funding: '$2,000,000',
    founded_year: '2015',
    hq_location: 'Prague, Czech Republic',
    avg_payout_time: '8 Hours',
    payout_percentage: 95,
    platforms: ['MT4', 'MT5', 'cTrader', 'DXtrade'],
    tags: ['Forex', 'Crypto', 'Indices', 'Popular', 'Fast Payouts'],
    trading_type: 'forex',
    discount_code: 'WEALTHX',
    description: 'The industry benchmark for proprietary trading firms with an unbeatable track record of reliable payouts and excellent trading conditions.'
  },
  {
    id: 'fundednext-02',
    name: 'FundedNext',
    website: 'https://fundednext.com',
    affiliate_link: 'https://fundednext.com?ref=propxwealth',
    logo_url: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=120&auto=format&fit=crop&q=80',
    rating: 4.8,
    status: 'active',
    profit_split: '95%',
    max_funding: '$300,000',
    founded_year: '2022',
    hq_location: 'Ajman, UAE',
    avg_payout_time: '12 Hours',
    payout_percentage: 96,
    platforms: ['MT4', 'MT5', 'cTrader', 'TradeLocker'],
    tags: ['Forex', 'Crypto', 'Best Split', '15% Profit Share'],
    trading_type: 'forex',
    discount_code: 'WEALTH15',
    description: 'Features a unique 15% profit sharing during evaluation phases and up to 95% profit splits once funded.'
  },
  {
    id: 'alpha-03',
    name: 'Alpha Capital Group',
    website: 'https://alphacapitalgroup.uk',
    affiliate_link: 'https://alphacapitalgroup.uk?ref=propxwealth',
    logo_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=120&auto=format&fit=crop&q=80',
    rating: 4.7,
    status: 'active',
    profit_split: '80%',
    max_funding: '$2,000,000',
    founded_year: '2021',
    hq_location: 'London, United Kingdom',
    avg_payout_time: '24 Hours',
    payout_percentage: 94,
    platforms: ['MT5', 'cTrader'],
    tags: ['Forex', 'Zero Commission', 'Raw Spreads'],
    trading_type: 'forex',
    discount_code: 'ALPHA10',
    description: 'Zero commission trading with proprietary trading technology and institutional grade liquidity.'
  },
  {
    id: 'the5ers-04',
    name: 'The5%ers',
    website: 'https://the5ers.com',
    affiliate_link: 'https://the5ers.com?ref=propxwealth',
    logo_url: 'https://the5ers.com/wp-content/uploads/2021/01/logo-5ers.png',
    rating: 4.8,
    status: 'active',
    profit_split: '100%',
    max_funding: '$4,000,000',
    founded_year: '2016',
    hq_location: 'Ra’anana, Israel',
    avg_payout_time: '24 Hours',
    payout_percentage: 97,
    platforms: ['MT5'],
    tags: ['Forex', 'Instant Funding', 'High Growth', 'Futures'],
    trading_type: 'forex',
    discount_code: '5ERSBONUS',
    description: 'Renowned for instant funding models, high growth scaling plans reaching $4M, and up to 100% profit splits.'
  },
  {
    id: 'fundingpips-05',
    name: 'FundingPips',
    website: 'https://fundingpips.com',
    affiliate_link: 'https://fundingpips.com?ref=propxwealth',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    rating: 4.6,
    status: 'active',
    profit_split: '90%',
    max_funding: '$1,000,000',
    founded_year: '2022',
    hq_location: 'Dubai, UAE',
    avg_payout_time: '6 Hours',
    payout_percentage: 93,
    platforms: ['cTrader', 'Match-Trader', 'TradeLocker'],
    tags: ['Forex', 'Crypto', 'Budget Friendly', 'Crypto Payouts'],
    trading_type: 'forex',
    discount_code: 'PIPS10',
    description: 'Extremely popular for lower entry challenge fees, rapid 5-day payout intervals, and great execution.'
  },
  {
    id: 'topstep-06',
    name: 'Topstep',
    website: 'https://topstep.com',
    affiliate_link: 'https://topstep.com?ref=propxwealth',
    logo_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=120&auto=format&fit=crop&q=80',
    rating: 4.9,
    status: 'active',
    profit_split: '90%',
    max_funding: '$150,000',
    founded_year: '2012',
    hq_location: 'Chicago, USA',
    avg_payout_time: '24 Hours',
    payout_percentage: 98,
    platforms: ['NinjaTrader', 'Tradovate', 'TradingView'],
    tags: ['Futures', 'CME', 'Top Rated', 'US Regulated'],
    trading_type: 'futures',
    discount_code: 'TOPSTEP20',
    description: 'The golden standard for regulated futures prop trading with daily payout processing and TradingView integration.'
  },
  {
    id: 'e8markets-07',
    name: 'E8 Markets',
    website: 'https://e8markets.com',
    affiliate_link: 'https://e8markets.com?ref=propxwealth',
    logo_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    rating: 4.7,
    status: 'active',
    profit_split: '80%',
    max_funding: '$1,000,000',
    founded_year: '2021',
    hq_location: 'Dallas, USA',
    avg_payout_time: '12 Hours',
    payout_percentage: 95,
    platforms: ['MT5', 'cTrader'],
    tags: ['Forex', 'Customizable', 'Crypto'],
    trading_type: 'forex',
    discount_code: 'E8BONUS',
    description: 'Pioneered custom challenge builder where traders can configure target profits and drawdowns.'
  },
  {
    id: 'apex-08',
    name: 'Apex Trader Funding',
    website: 'https://apextraderfunding.com',
    affiliate_link: 'https://apextraderfunding.com?ref=propxwealth',
    logo_url: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=120&auto=format&fit=crop&q=80',
    rating: 4.8,
    status: 'active',
    profit_split: '100%',
    max_funding: '$300,000',
    founded_year: '2021',
    hq_location: 'Texas, USA',
    avg_payout_time: '24 Hours',
    payout_percentage: 97,
    platforms: ['NinjaTrader', 'Tradovate', 'Rithmic'],
    tags: ['Futures', 'CME', 'Popular', 'Low Cost', '100% Split'],
    trading_type: 'futures',
    discount_code: 'APEX80',
    description: 'The largest futures prop firm with 100% profit split on first $25K, frequent 80% discount sales, and multiple accounts.'
  },
  {
    id: 'mff-09',
    name: 'MyFundedFutures',
    website: 'https://myfundedfutures.com',
    affiliate_link: 'https://myfundedfutures.com?ref=propxwealth',
    logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
    rating: 4.9,
    status: 'active',
    profit_split: '90%',
    max_funding: '$600,000',
    founded_year: '2023',
    hq_location: 'Delaware, USA',
    avg_payout_time: '12 Hours',
    payout_percentage: 96,
    platforms: ['Tradovate', 'NinjaTrader', 'TradingView'],
    tags: ['Futures', 'No Daily Drawdown', 'Rapid Payouts'],
    trading_type: 'futures',
    discount_code: 'MFFVIP',
    description: 'Offers starter & expert plans with end-of-day trailing drawdown and zero daily drawdown restrictions.'
  },
  {
    id: 'blueguardian-10',
    name: 'Blue Guardian',
    website: 'https://blueguardian.com',
    affiliate_link: 'https://blueguardian.com?ref=propxwealth',
    logo_url: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    rating: 4.7,
    status: 'active',
    profit_split: '85%',
    max_funding: '$2,000,000',
    founded_year: '2021',
    hq_location: 'London, UK',
    avg_payout_time: '8 Hours',
    payout_percentage: 95,
    platforms: ['cTrader', 'Match-Trader', 'DXtrade'],
    tags: ['Forex', 'Crypto', 'Guardian Protector', 'Fast Payouts'],
    trading_type: 'forex',
    discount_code: 'WEALTHX',
    description: 'Features Guardian Protector equity shield that prevents account breaches automatically, plus unlimited trading periods.'
  },
  {
    id: 'e8crypto-11',
    name: 'E8 Crypto',
    website: 'https://e8markets.com',
    affiliate_link: 'https://e8markets.com?ref=propxwealth',
    logo_url: 'https://e8markets.com/images/logo/logo.svg',
    rating: 4.8,
    status: 'active',
    profit_split: '90%',
    max_funding: '$500,000',
    founded_year: '2022',
    hq_location: 'Dallas, USA',
    avg_payout_time: '12 Hours',
    payout_percentage: 95,
    platforms: ['cTrader', 'MT5'],
    tags: ['Crypto', 'Bitcoin', 'Ethereum', 'Weekend Trading'],
    trading_type: 'crypto',
    discount_code: 'WEALTHX',
    description: 'Dedicated 24/7 crypto proprietary trading evaluations covering BTC, ETH, and over 60+ altcoins.'
  }
];

export interface FallbackOffer {
  id: string;
  firm_id: string;
  title: string;
  code: string;
  discount: string;
  expiry_date: string;
  verified: boolean;
  status: string;
  firms?: {
    name: string;
    logo_url: string;
    website: string;
    affiliate_link: string;
    trading_type: string;
    tags: string[];
  };
}

export const FALLBACK_OFFERS: FallbackOffer[] = [
  {
    id: 'off-1',
    firm_id: 'fundednext-02',
    title: '15% Off All Stellar Challenges + 95% Profit Split Boost',
    code: 'WEALTH15',
    discount: '15% OFF',
    expiry_date: '2026-12-31',
    verified: true,
    status: 'active',
    firms: {
      name: 'FundedNext',
      logo_url: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=120&auto=format&fit=crop&q=80',
      website: 'https://fundednext.com',
      affiliate_link: 'https://fundednext.com?ref=propxwealth',
      trading_type: 'forex',
      tags: ['Forex', 'Crypto']
    }
  },
  {
    id: 'off-2',
    firm_id: 'ftmo-01',
    title: 'Exclusive Partner 10% Discount & Free Reset Guarantee',
    code: 'WEALTHX',
    discount: '10% OFF',
    expiry_date: '2026-12-31',
    verified: true,
    status: 'active',
    firms: {
      name: 'FTMO',
      logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
      website: 'https://ftmo.com',
      affiliate_link: 'https://ftmo.com?ref=propxwealth',
      trading_type: 'forex',
      tags: ['Forex', 'Crypto', 'Popular']
    }
  },
  {
    id: 'off-3',
    firm_id: 'alpha-03',
    title: '20% Off All Evaluations with Zero Commissions',
    code: 'ALPHA20',
    discount: '20% OFF',
    expiry_date: '2026-11-30',
    verified: true,
    status: 'active',
    firms: {
      name: 'Alpha Capital Group',
      logo_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=120&auto=format&fit=crop&q=80',
      website: 'https://alphacapitalgroup.uk',
      affiliate_link: 'https://alphacapitalgroup.uk?ref=propxwealth',
      trading_type: 'forex',
      tags: ['Forex', 'Zero Commission']
    }
  },
  {
    id: 'off-4',
    firm_id: 'topstep-06',
    title: '20% Off Trading Combine + Free Activation Fee Waiver',
    code: 'TOPSTEP20',
    discount: '20% OFF',
    expiry_date: '2026-12-31',
    verified: true,
    status: 'active',
    firms: {
      name: 'Topstep',
      logo_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=120&auto=format&fit=crop&q=80',
      website: 'https://topstep.com',
      affiliate_link: 'https://topstep.com?ref=propxwealth',
      trading_type: 'futures',
      tags: ['Futures', 'CME']
    }
  },
  {
    id: 'off-5',
    firm_id: 'the5ers-04',
    title: '10% Instant Cashback on High Stakes $100K Challenge',
    code: '5ERSBONUS',
    discount: '10% CASHBACK',
    expiry_date: '2026-12-31',
    verified: true,
    status: 'active',
    firms: {
      name: 'The5%ers',
      logo_url: 'https://the5ers.com/wp-content/uploads/2021/01/logo-5ers.png',
      website: 'https://the5ers.com',
      affiliate_link: 'https://the5ers.com?ref=propxwealth',
      trading_type: 'forex',
      tags: ['Forex', 'Instant Funding']
    }
  },
  {
    id: 'off-6',
    firm_id: 'fundingpips-05',
    title: '10% Off All Student & Practitioner Challenge Tiers',
    code: 'PIPS10',
    discount: '10% OFF',
    expiry_date: '2026-12-31',
    verified: true,
    status: 'active',
    firms: {
      name: 'FundingPips',
      logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      website: 'https://fundingpips.com',
      affiliate_link: 'https://fundingpips.com?ref=propxwealth',
      trading_type: 'forex',
      tags: ['Forex', 'Crypto']
    }
  },
  {
    id: 'off-7',
    firm_id: 'apex-08',
    title: '80% Flash Sale on All Rithmic & Tradovate 50K-300K Accounts',
    code: 'APEX80',
    discount: '80% OFF',
    expiry_date: '2026-12-31',
    verified: true,
    status: 'active',
    firms: {
      name: 'Apex Trader Funding',
      logo_url: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=120&auto=format&fit=crop&q=80',
      website: 'https://apextraderfunding.com',
      affiliate_link: 'https://apextraderfunding.com?ref=propxwealth',
      trading_type: 'futures',
      tags: ['Futures', 'CME', 'Sale']
    }
  },
  {
    id: 'off-8',
    firm_id: 'mff-09',
    title: '40% Off First Month on All Expert Futures Challenges',
    code: 'MFF40',
    discount: '40% OFF',
    expiry_date: '2026-12-31',
    verified: true,
    status: 'active',
    firms: {
      name: 'MyFundedFutures',
      logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
      website: 'https://myfundedfutures.com',
      affiliate_link: 'https://myfundedfutures.com?ref=propxwealth',
      trading_type: 'futures',
      tags: ['Futures', 'Expert']
    }
  },
  {
    id: 'off-9',
    firm_id: 'e8crypto-11',
    title: '15% Off All Crypto Evaluation Accounts with 90% Profit Split',
    code: 'CRYPTO15',
    discount: '15% OFF',
    expiry_date: '2026-12-31',
    verified: true,
    status: 'active',
    firms: {
      name: 'E8 Crypto',
      logo_url: 'https://e8markets.com/images/logo/logo.svg',
      website: 'https://e8markets.com',
      affiliate_link: 'https://e8markets.com?ref=propxwealth',
      trading_type: 'crypto',
      tags: ['Crypto', 'Bitcoin']
    }
  }
];

export interface FallbackCompetition {
  id: string;
  firm_id: string;
  firm_name: string;
  title: string;
  description: string;
  prize_pool: string;
  entry_fee: string;
  start_date: string;
  end_date: string;
  join_url: string;
  image_url: string;
  status: 'upcoming' | 'active' | 'ended';
  firms?: {
    trading_type: string;
    tags: string[];
  };
}

export const FALLBACK_COMPETITIONS: FallbackCompetition[] = [
  {
    id: 'comp-101',
    firm_id: 'the5ers-04',
    firm_name: 'The5%ers',
    title: 'Scalpers Paradise Arena',
    description: 'High frequency & scalping strategies permitted. Compete against global traders for funded account prizes.',
    prize_pool: '$100,000 Evaluation',
    entry_fee: 'Free',
    start_date: '2026-09-15T00:00:00Z',
    end_date: '2026-10-15T00:00:00Z',
    join_url: 'https://the5ers.com',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    firms: {
      trading_type: 'forex',
      tags: ['Forex', 'Popular']
    }
  },
  {
    id: 'comp-102',
    firm_id: 'fundednext-02',
    firm_name: 'FundedNext',
    title: 'Stellar Trader World Cup',
    description: 'Monthly competitive trading showdown. Top 100 traders win free challenge accounts and cash prizes.',
    prize_pool: '$250,000 Pool + $10,000 Cash',
    entry_fee: 'Free',
    start_date: '2026-10-01T00:00:00Z',
    end_date: '2026-10-31T00:00:00Z',
    join_url: 'https://fundednext.com',
    image_url: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    firms: {
      trading_type: 'forex',
      tags: ['Forex', 'Crypto']
    }
  },
  {
    id: 'comp-103',
    firm_id: 'topstep-06',
    firm_name: 'Topstep',
    title: 'Futures Championship Series',
    description: 'Trade CME micro and standard futures contracts. Benchmark your winrate and maximum drawdowns.',
    prize_pool: '$150,000 Funded Account',
    entry_fee: 'Free',
    start_date: '2026-09-01T00:00:00Z',
    end_date: '2026-09-30T00:00:00Z',
    join_url: 'https://topstep.com',
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    firms: {
      trading_type: 'futures',
      tags: ['Futures', 'CME']
    }
  },
  {
    id: 'comp-104',
    firm_id: 'apex-08',
    firm_name: 'Apex Trader Funding',
    title: 'Apex Futures Grand Prix',
    description: 'High volatility NQ and ES futures challenge. Top 50 traders get funded without evaluation fees.',
    prize_pool: '$300,000 Account + Cash',
    entry_fee: 'Free',
    start_date: '2026-09-10T00:00:00Z',
    end_date: '2026-10-10T00:00:00Z',
    join_url: 'https://apextraderfunding.com',
    image_url: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    firms: {
      trading_type: 'futures',
      tags: ['Futures', 'CME']
    }
  },
  {
    id: 'comp-105',
    firm_id: 'e8crypto-11',
    firm_name: 'E8 Crypto',
    title: 'Crypto Alpha Tournament',
    description: 'Trade BTC, ETH, and SOL perpetuals with zero overnight fees. Guaranteed payouts for top 20 finish.',
    prize_pool: '$100,000 Allocation',
    entry_fee: 'Free',
    start_date: '2026-09-20T00:00:00Z',
    end_date: '2026-10-20T00:00:00Z',
    join_url: 'https://e8markets.com',
    image_url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    firms: {
      trading_type: 'crypto',
      tags: ['Crypto', 'Bitcoin']
    }
  },
  {
    id: 'comp-106',
    firm_id: 'ftmo-01',
    firm_name: 'FTMO',
    title: 'Autumn Global Challenge',
    description: 'Demonstrate strict discipline and risk management across FX majors, Gold, and indices.',
    prize_pool: '$100,000 Challenge Pass',
    entry_fee: 'Free',
    start_date: '2026-10-15T00:00:00Z',
    end_date: '2026-11-15T00:00:00Z',
    join_url: 'https://ftmo.com',
    image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    status: 'upcoming',
    firms: {
      trading_type: 'forex',
      tags: ['Forex', 'Crypto']
    }
  }
];
