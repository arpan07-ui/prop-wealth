import React from 'react';
import { Flame, Ticket, Zap } from 'lucide-react';
import WorkInProgressPage from '../components/WorkInProgressPage';

const OffersPage: React.FC = () => {
  return (
    <WorkInProgressPage
      pageKey="hot-deals"
      pageTitle="Hot Deals & Exclusive Promos"
      badgeText="PROMO ENGINE UPGRADE"
      tagline="Verified Flash Discounts, Exclusive BOGO Codes & Evaluation Promos"
      description="We are upgrading the PropX Wealth real-time promo aggregator. Soon you'll enjoy verified flash discounts up to 90% off, exclusive BOGO (Buy One Get One) account vouchers, and automated checkout coupon verifiers across 40+ leading prop firms."
      mainIcon={<Flame size={54} className="text-[#f97316] drop-shadow-[0_0_24px_rgba(249,115,22,0.85)]" />}
      brandColor="#f97316"
      glowColor="rgba(249, 115, 22, 0.45)"
      progressPercentage={84}
      launchTimeline="Flash Deals Engine • April 2026"
      features={[
        {
          icon: Flame,
          title: "Real-Time Flash Sale Alerts",
          desc: "Automated bots monitoring prop firm social feeds and Discord servers to notify you of limited-time 80-90% flash discounts.",
          badge: "FLASH SALES"
        },
        {
          icon: Ticket,
          title: "Exclusive BOGO & Free Resets",
          desc: "PropX exclusive Buy-One-Get-One vouchers and 50% off evaluation resets negotiated directly with prop firm founders.",
          badge: "EXCLUSIVE"
        },
        {
          icon: Zap,
          title: "6-Hour Live Code Validator",
          desc: "Algorithmic bot that continuously verifies every promo code against live checkout portals to guarantee 100% validity.",
          badge: "VERIFIED"
        }
      ]}
    />
  );
};

export default OffersPage;
