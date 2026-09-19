import { FALLBACK_FIRMS } from './fallbackData';

export interface VerifiedPartnerDeal {
  id: string;
  firmId: string;
  firmName: string;
  category: 'Forex' | 'Futures' | 'Crypto';
  discountText: string;
  highlightOffer: string;
  code: string;
  claimUrl: string;
  infoTooltip: string;
  logoUrl?: string;
  logoBg?: string;
  position: number;
  badge?: string;
  isActive: boolean;
}

export const STORAGE_KEY_PARTNER_DEALS = 'pms_verified_partner_deals';
export const PARTNER_DEALS_EVENT = 'pms_partner_deals_updated';

// 100% Real Listed Prop Firms only
export const DEFAULT_PARTNER_DEALS: VerifiedPartnerDeal[] = [
  {
    id: 'deal-ftmo-01',
    firmId: 'ftmo-01',
    firmName: 'FTMO',
    category: 'Forex',
    discountText: 'Get Upto',
    highlightOffer: '10% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://ftmo.com?ref=propxwealth',
    infoTooltip: 'Verified 10% discount on all FTMO evaluation models with 90% profit split and fast bi-weekly payouts.',
    logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
    logoBg: '#091e3a',
    position: 1,
    badge: 'Gold Partner',
    isActive: true
  },
  {
    id: 'deal-fundednext-02',
    firmId: 'fundednext-02',
    firmName: 'FundedNext',
    category: 'Forex',
    discountText: 'Get Upto',
    highlightOffer: '15% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://fundednext.com?ref=propxwealth',
    infoTooltip: '15% off Stellar & Evaluation plans with 15% profit sharing earned during challenge phases.',
    logoUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=120&auto=format&fit=crop&q=80',
    logoBg: '#13112c',
    position: 2,
    badge: 'Silver Partner',
    isActive: true
  },
  {
    id: 'deal-topstep-06',
    firmId: 'topstep-06',
    firmName: 'Topstep',
    category: 'Futures',
    discountText: 'Get Upto',
    highlightOffer: '20% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://topstep.com?ref=propxwealth',
    infoTooltip: '20% discount on Trading Combine futures evaluations with daily payout processing and TradingView integration.',
    logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=120&auto=format&fit=crop&q=80',
    logoBg: '#1a1805',
    position: 3,
    badge: 'Bronze Partner',
    isActive: true
  },
  {
    id: 'deal-apex-08',
    firmId: 'apex-08',
    firmName: 'Apex Trader Funding',
    category: 'Futures',
    discountText: 'Get Upto',
    highlightOffer: '80% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://apextraderfunding.com?ref=propxwealth',
    infoTooltip: 'Up to 80% off simulated futures accounts with 100% profit split on your first $25,000.',
    logoUrl: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=120&auto=format&fit=crop&q=80',
    logoBg: '#092119',
    position: 4,
    badge: 'Massive Discount',
    isActive: true
  },
  {
    id: 'deal-the5ers-04',
    firmId: 'the5ers-04',
    firmName: 'The5%ers',
    category: 'Forex',
    discountText: 'Get Upto',
    highlightOffer: '10% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://the5ers.com?ref=propxwealth',
    infoTooltip: 'Exclusive bonus on Bootcamp & Hyper Growth instant funding plans scaling up to $4M.',
    logoUrl: 'https://the5ers.com/wp-content/uploads/2021/01/logo-5ers.png',
    logoBg: '#1e140a',
    position: 5,
    badge: 'Popular',
    isActive: true
  },
  {
    id: 'deal-alpha-03',
    firmId: 'alpha-03',
    firmName: 'Alpha Capital Group',
    category: 'Forex',
    discountText: 'Get Upto',
    highlightOffer: '10% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://alphacapitalgroup.uk?ref=propxwealth',
    infoTooltip: '10% discount on zero-commission ACG evaluations with raw institutional liquidity spreads.',
    logoUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=120&auto=format&fit=crop&q=80',
    logoBg: '#121218',
    position: 6,
    isActive: true
  },
  {
    id: 'deal-fundingpips-05',
    firmId: 'fundingpips-05',
    firmName: 'FundingPips',
    category: 'Forex',
    discountText: 'Get Upto',
    highlightOffer: '10% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://fundingpips.com?ref=propxwealth',
    infoTooltip: '10% discount on 1-step and 2-step evaluations with lowest market challenge prices and rapid 5-day payouts.',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    logoBg: '#1e1635',
    position: 7,
    badge: 'Best Value',
    isActive: true
  },
  {
    id: 'deal-e8markets-07',
    firmId: 'e8markets-07',
    firmName: 'E8 Markets',
    category: 'Forex',
    discountText: 'Get Upto',
    highlightOffer: '10% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://e8markets.com?ref=propxwealth',
    infoTooltip: '10% off E8 classic & track evaluations with custom drawdown configuration and instant scaling.',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    logoBg: '#11141c',
    position: 8,
    isActive: true
  },
  {
    id: 'deal-mff-09',
    firmId: 'mff-09',
    firmName: 'MyFundedFutures',
    category: 'Futures',
    discountText: 'Get Upto',
    highlightOffer: '50% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://myfundedfutures.com?ref=propxwealth',
    infoTooltip: '50% discount on Expert and Starter plans with zero daily drawdown restrictions.',
    logoUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
    logoBg: '#211707',
    position: 9,
    isActive: true
  },
  {
    id: 'deal-blueguardian-10',
    firmId: 'blueguardian-10',
    firmName: 'Blue Guardian',
    category: 'Forex',
    discountText: 'Get Upto',
    highlightOffer: '25% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://blueguardian.com?ref=propxwealth',
    infoTooltip: '25% off all Unlimited and Standard evaluations with Guardian Protector equity shield.',
    logoUrl: 'https://cdn.prod.website-files.com/67d98b7861a3fdabba993d7d/67d98b7961a3fdabba993db4_Logo%20(74).avif',
    logoBg: '#091e3a',
    position: 10,
    isActive: true
  },
  {
    id: 'deal-e8crypto-11',
    firmId: 'e8crypto-11',
    firmName: 'E8 Crypto',
    category: 'Crypto',
    discountText: 'Get Upto',
    highlightOffer: '10% OFF',
    code: 'WEALTHX',
    claimUrl: 'https://e8markets.com?ref=propxwealth',
    infoTooltip: '10% discount on dedicated crypto evaluations with up to 90% profit split.',
    logoUrl: 'https://e8markets.com/images/logo/logo.svg',
    logoBg: '#161922',
    position: 11,
    isActive: true
  }
];

/**
 * Get verified partner deals from localStorage or fallback to default listed firms.
 * Synchronizes referral links with live firms.
 */
export const getStoredPartnerDeals = (liveFirms?: any[]): VerifiedPartnerDeal[] => {
  let deals = DEFAULT_PARTNER_DEALS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTNER_DEALS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        deals = parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored partner deals:', e);
  }

  // Ensure referral links match live firms whenever available
  const firmsPool = liveFirms && liveFirms.length > 0 ? liveFirms : FALLBACK_FIRMS;
  const syncedDeals = deals.map((deal) => {
    const matchedFirm = firmsPool.find(
      (f) =>
        (deal.firmId && f.id === deal.firmId) ||
        (f.name && f.name.toLowerCase() === deal.firmName.toLowerCase())
    );

    if (matchedFirm) {
      const referralLink = matchedFirm.affiliate_link || matchedFirm.affiliateLink || matchedFirm.website || deal.claimUrl;
      return {
        ...deal,
        claimUrl: referralLink || deal.claimUrl,
        logoUrl: deal.logoUrl || matchedFirm.logo_url || matchedFirm.logoUrl,
      };
    }
    return deal;
  });

  return syncedDeals.sort((a, b) => a.position - b.position);
};

/**
 * Save partner deals to localStorage and broadcast change event
 */
export const saveStoredPartnerDeals = (deals: VerifiedPartnerDeal[]): void => {
  try {
    // Re-index positions sequentially
    const ordered = [...deals]
      .sort((a, b) => a.position - b.position)
      .map((deal, idx) => ({
        ...deal,
        position: idx + 1
      }));

    localStorage.setItem(STORAGE_KEY_PARTNER_DEALS, JSON.stringify(ordered));
    window.dispatchEvent(new CustomEvent(PARTNER_DEALS_EVENT, { detail: ordered }));
  } catch (e) {
    console.error('Error saving partner deals:', e);
  }
};

/**
 * Reset partner deals back to defaults
 */
export const resetStoredPartnerDeals = (liveFirms?: any[]): VerifiedPartnerDeal[] => {
  const firmsPool = liveFirms && liveFirms.length > 0 ? liveFirms : FALLBACK_FIRMS;
  const resetDeals = DEFAULT_PARTNER_DEALS.map((deal, idx) => {
    const matchedFirm = firmsPool.find(
      (f) =>
        (deal.firmId && f.id === deal.firmId) ||
        (f.name && f.name.toLowerCase() === deal.firmName.toLowerCase())
    );

    const referralLink = matchedFirm?.affiliate_link || matchedFirm?.affiliateLink || matchedFirm?.website || deal.claimUrl;
    return {
      ...deal,
      position: idx + 1,
      claimUrl: referralLink
    };
  });

  saveStoredPartnerDeals(resetDeals);
  return resetDeals;
};
