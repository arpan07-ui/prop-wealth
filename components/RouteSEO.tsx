import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO, { SEOProps } from './SEO';

interface RouteSEOConfig {
  [path: string]: SEOProps;
}

const ROUTE_CONFIG: RouteSEOConfig = {
  '/': {
    title: 'PROPxWEALTH | Buy, Earn & Spend Wealth Tokens - Top Prop Trading Firms 2026',
    description: 'The #1 proprietary trading comparison platform. Compare top forex, futures & crypto prop firms, save with exclusive code WEALTHX, earn Wealth Tokens on challenge purchases, and verify payout proof.',
    keywords: 'prop trading firms, best prop firms 2026, funded trader accounts, buy wealth tokens, prop firm discounts, forex prop firms, futures funding, crypto prop trading, funded trading evaluation, prop firm reviews, prop match spot',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      'name': 'PROPxWEALTH',
      'url': 'https://propxwealth.com',
      'logo': 'https://propxwealth.com/wealth-logo.png',
      'description': 'Compare top proprietary trading firms, earn tokenized cashback, and access verified reviews.',
      'sameAs': [
        'https://twitter.com/PROPxWEALTH',
        'https://discord.gg/propxwealth'
      ]
    }
  },
  '/firms': {
    title: 'Compare Best Prop Trading Firms 2026 | Ratings, Rules & Payouts - PROPxWEALTH',
    description: 'Filter and compare top proprietary trading firms. Discover highest profit splits (up to 90%), static vs trailing drawdown rules, instant funding options, and verified payout speeds.',
    keywords: 'compare prop firms, best prop firms list, 1 step evaluation prop firms, 2 step prop firms, instant funding prop firms, highest profit split prop firm, best forex prop firms, futures prop trading firms, crypto prop firms',
  },
  '/reviews': {
    title: 'Verified Prop Firm Reviews & Trader Ratings 2026 | PROPxWEALTH',
    description: 'Read 100% genuine trader reviews and payout experiences for top prop firms. Unbiased feedback on slippage, spreads, rules enforcement, customer support, and payout reliability.',
    keywords: 'prop firm reviews, verified trader feedback, prop trading scams, prop firm payout reviews, real prop firm ratings, trusted prop firms 2026, prop firm complaints, best prop firm reviews',
  },
  '/offers': {
    title: 'Exclusive Prop Firm Promo Codes & Discounts 2026 | Code WEALTHX - PROPxWEALTH',
    description: 'Save up to 50% on proprietary trading evaluations. Verified promo codes, seasonal sales, free reset offers, and exclusive discount code WEALTHX for funded trading challenges.',
    keywords: 'prop firm promo codes, prop firm discount coupons, prop firm sale 2026, prop firm discount code wealthx, cheap funded account, save on prop challenges, 50% off prop firm, free prop firm reset',
  },
  '/rewards': {
    title: 'Wealth Rewards Store | Redeem Tokens for Free Challenges & VIP Perks - PROPxWEALTH',
    description: 'Earn Wealth Tokens on every challenge purchase and verified review. Redeem your tokens for free evaluation resets, +10% profit split vouchers, VIP trading Discord, and crypto rewards.',
    keywords: 'wealth tokens, prop firm rewards store, free prop firm challenge, trade to earn, crypto wealth tokens, funded account rewards, prop firm cashback, redeem wealth tokens',
  },
  '/competitions': {
    title: 'Free Prop Trading Competitions & Tournaments | Win Funded Accounts - PROPxWEALTH',
    description: 'Compete in monthly free prop trading tournaments. Trade risk-free on demo accounts, top the global leaderboard, and win free funded accounts and cash prizes.',
    keywords: 'prop trading competitions, free trading tournament, win funded account, trading contest 2026, forex competition, paper trading tournament, prop firm challenge giveaway',
  },
  '/rules': {
    title: 'Prop Firm Rules, Drawdown & Evaluation Guide 2026 | PROPxWEALTH',
    description: 'Master proprietary firm challenge rules. Comprehensive guide comparing daily drawdown limits, maximum overall drawdown, news trading restrictions, weekend holding, and consistency rules.',
    keywords: 'prop firm rules, daily drawdown explained, trailing drawdown prop firm, news trading allowed prop firms, weekend holding prop firms, consistency rules prop trading, how to pass prop evaluation',
  },
  '/compare': {
    title: 'Side-by-Side Prop Firm Comparison Tool | PROPxWEALTH',
    description: 'Compare prop trading firms head-to-head. Analyze price per $100k, profit targets, drawdown limits, leverage, platforms, and profit split side by side before purchasing.',
    keywords: 'compare prop firms side by side, prop firm comparison tool, cheapest prop firm challenge, best value prop firm, prop firm vs prop firm',
  },
  '/blog': {
    title: 'Prop Trading Guides, Strategy & Industry News | PROPxWEALTH Blog',
    description: 'Actionable trading education, risk management guides, evaluation walkthroughs, and industry analysis written by experienced funded traders.',
    keywords: 'prop trading blog, how to pass prop firm challenge, funded trader tips, drawdown management, prop trading strategies, prop firm news 2026, risk management prop trading',
  },
  '/about': {
    title: 'About Us | Empowering Funded Traders Worldwide - PROPxWEALTH',
    description: 'Learn about PROPxWEALTH mission: building the most transparent, rewarding, and trader-first proprietary trading directory and ecosystem in the world.',
    keywords: 'about propxwealth, prop match spot, prop firm aggregator, funded trader mission, transparent prop trading',
  },
  '/contact': {
    title: 'Contact Us | 24/7 Trader Support & Firm Inquiries - PROPxWEALTH',
    description: 'Need help or want to list your prop firm? Contact the PROPxWEALTH team for prompt support, marketing inquiries, and partnership opportunities.',
    keywords: 'contact propxwealth, list prop firm, prop firm partnership, prop trading support, prop firm listing inquiry',
  },
  '/terms': {
    title: 'Terms of Service | PROPxWEALTH',
    description: 'Read the terms and conditions for using PROPxWEALTH directory, comparison tools, promotional discount codes, and Wealth Token reward services.',
    keywords: 'propxwealth terms of service, user agreement, legal terms prop trading directory',
  },
  '/privacy': {
    title: 'Privacy Policy | PROPxWEALTH',
    description: 'Our commitment to protecting your personal data and privacy under global data protection standards. Learn how PROPxWEALTH collects and safeguards your information.',
    keywords: 'propxwealth privacy policy, data protection, privacy terms',
  },
  '/risk': {
    title: 'Risk Disclosure & Disclaimer | PROPxWEALTH',
    description: 'Important risk disclosure regarding proprietary trading evaluations, financial risks, speculative trading, and hypothetical performance results.',
    keywords: 'prop trading risk disclosure, financial disclaimer, CFTC rule 4.41, trading risk warning',
  },
  '/wealth-ai': {
    title: 'Wealth AI | Automated Prop Firm Matching & Evaluation Assistant',
    description: 'Use artificial intelligence to match your personal trading style, risk tolerance, and target instruments with the ideal proprietary trading firm.',
    keywords: 'wealth ai, prop trading ai, find best prop firm ai, trading assistant, ai prop firm matcher',
  },
  '/wealth-replay': {
    title: 'Wealth Replay Simulator | Backtest & Practice Prop Evaluations',
    description: 'Practice prop firm challenges with institutional market replay. Test strategies with realistic spreads, slippage, and strict daily drawdown simulation.',
    keywords: 'prop firm replay simulator, market replay backtesting, practice prop challenge, prop evaluation simulator',
  },
  '/login': {
    title: 'Sign In to PROPxWEALTH | Trader Portal Access',
    description: 'Sign in with Google or Discord to access your PROPxWEALTH trader dashboard, saved evaluations, active competitions, and Wealth Tokens.',
    keywords: 'propxwealth login, trader portal sign in, access funded accounts',
    noIndex: false,
  },
  '/signup': {
    title: 'Create Account | Claim +100 Wealth Tokens Free - PROPxWEALTH',
    description: 'Join 15,000+ funded traders on PROPxWEALTH. 1-click social sign up via Google or Discord with +100 bonus Wealth Tokens to redeem for free rewards.',
    keywords: 'propxwealth signup, register trader account, claim free wealth tokens, join prop trading community',
    noIndex: false,
  },
  '/dashboard': {
    title: 'Trader Dashboard | My Evaluations & Rewards - PROPxWEALTH',
    description: 'Manage your saved firms, track your reviews, and redeem Wealth Tokens for free challenge resets and exclusive trader rewards.',
    noIndex: true,
  },
};

export const RouteSEO: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Clean path (remove trailing slash if needed, unless root)
  const normalizedPath = pathname.length > 1 && pathname.endsWith('/') 
    ? pathname.slice(0, -1) 
    : pathname;

  // Find exact config or prefix match
  let config: SEOProps = ROUTE_CONFIG[normalizedPath];

  if (!config) {
    if (normalizedPath.startsWith('/firm/')) {
      config = {
        title: 'Prop Firm Evaluation Review & Details | PROPxWEALTH',
        description: 'Comprehensive review of proprietary trading firm evaluations, pricing, rules, platforms, and exclusive discounts with code WEALTH.',
        keywords: 'prop firm review, evaluation rules, prop firm pricing, challenge account size, prop firm discount',
      };
    } else if (normalizedPath.startsWith('/blog/')) {
      config = {
        title: 'Prop Trading Guide & Analysis | PROPxWEALTH Blog',
        description: 'Expert proprietary trading advice, evaluation pass techniques, risk management, and funded account walkthroughs.',
        keywords: 'prop trading guide, funded trader analysis, pass prop challenge, trading psychology',
      };
    } else if (normalizedPath.startsWith('/competition/')) {
      config = {
        title: 'Trading Competition Details & Registration | PROPxWEALTH',
        description: 'Enter this prop trading tournament. Free entry, live leaderboard tracking, and real funded account rewards for top traders.',
        keywords: 'trading competition, enter trading tournament, win funded account, trading contest prize',
      };
    } else if (normalizedPath.startsWith('/admin')) {
      config = {
        title: 'Admin Control Center | PROPxWEALTH',
        description: 'Administrative panel for managing firms, reviews, challenges, payouts, and platform settings.',
        noIndex: true,
      };
    } else {
      config = ROUTE_CONFIG['/'];
    }
  }

  return <SEO {...config} canonical={`${window.location.origin}${normalizedPath}`} />;
};

export default RouteSEO;
