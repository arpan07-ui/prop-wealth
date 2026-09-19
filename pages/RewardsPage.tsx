import React from 'react';
import { Gift, Laptop, Zap } from 'lucide-react';
import WorkInProgressPage from '../components/WorkInProgressPage';

const RewardsPage: React.FC = () => {
  return (
    <WorkInProgressPage
      pageKey="rewards"
      pageTitle="PropX Rewards Store 2.0"
      badgeText="VAULT UPGRADE IN PROGRESS"
      tagline="Redeem Wealth Tokens for Free Prop Accounts, Apple Hardware & Pro Tools"
      description="We are upgrading the PropX Wealth automated rewards vault. Soon you'll be able to exchange your earned Wealth Credits for 100% free evaluation challenges, multi-monitor trading rigs, and direct cash disbursements with instant smart-contract delivery."
      mainIcon={<Gift size={54} className="text-[#F0C41B] drop-shadow-[0_0_20px_rgba(240,196,27,0.8)]" />}
      brandColor="#F0C41B"
      glowColor="rgba(240, 196, 27, 0.45)"
      progressPercentage={86}
      launchTimeline="Phase 2 Deployment • Q2 2026"
      features={[
        {
          icon: Gift,
          title: "Free Prop Evaluation Accounts",
          desc: "Claim $25K, $50K, $100K, and $200K evaluation accounts from top-rated firms using your accumulated Wealth Points.",
          badge: "POPULAR"
        },
        {
          icon: Laptop,
          title: "Trading Tech & Hardware",
          desc: "Redeem tokens for Apple MacBook Pros, 49\" curved ultrawide trading screens, and Elgato Stream Decks shipped globally.",
          badge: "HARDWARE"
        },
        {
          icon: Zap,
          title: "Instant Voucher Dispatch",
          desc: "Automated instant coupon code and challenge login dispatch directly to your verified trader dashboard in under 60 seconds.",
          badge: "AUTOMATED"
        }
      ]}
    />
  );
};

export default RewardsPage;
