import React from 'react';
import { HelpCircle, Search, ShieldCheck, FileCheck } from 'lucide-react';
import WorkInProgressPage from '../components/WorkInProgressPage';

const FAQPage: React.FC = () => {
  return (
    <WorkInProgressPage
      pageKey="faq"
      pageTitle="Trader Knowledge Base & FAQs"
      badgeText="KNOWLEDGE CENTER OVERHAUL"
      tagline="Instant Answers on Challenge Rules, Payout Proof & Wealth Rewards"
      description="We are upgrading our comprehensive trader help desk and FAQ portal. Soon you'll have access to an instant AI-powered rule inspector, verified community payout certificates, and step-by-step guides to maximizing your PropX Wealth rewards."
      mainIcon={<HelpCircle size={54} className="text-[#10b981] drop-shadow-[0_0_24px_rgba(16,185,129,0.85)]" />}
      brandColor="#10b981"
      glowColor="rgba(16, 185, 129, 0.45)"
      progressPercentage={91}
      launchTimeline="Public Launch • April 2026"
      features={[
        {
          icon: Search,
          title: "AI Rule & Regulation Search",
          desc: "Type any question in natural language to instantly search over 500+ prop firm terms, hidden clauses, and drawdown nuances.",
          badge: "AI SEARCH"
        },
        {
          icon: ShieldCheck,
          title: "Verified Payout Proof Vault",
          desc: "Browse on-chain transaction receipts, Deel confirmation receipts, and certified bank disbursements from real prop traders.",
          badge: "VERIFIED"
        },
        {
          icon: FileCheck,
          title: "Reward Claim & Coupon Guides",
          desc: "Clear visual walkthroughs on how to claim free challenge vouchers, apply the WEALTH discount code, and withdraw rewards.",
          badge: "GUIDES"
        }
      ]}
    />
  );
};

export default FAQPage;
