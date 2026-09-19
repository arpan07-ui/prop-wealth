import React from 'react';
import { BookOpen, TrendingUp, Award } from 'lucide-react';
import WorkInProgressPage from '../components/WorkInProgressPage';

const BlogListPage: React.FC = () => {
  return (
    <WorkInProgressPage
      pageKey="blogs"
      pageTitle="PropX Insights & Intelligence"
      badgeText="EDITORIAL SUITE IN DEVELOPMENT"
      tagline="Prop Firm Reviews, Evaluation Playbooks & 6-Figure Trader Case Studies"
      description="Our research team and veteran traders are crafting deep-dive investigative reviews, high-probability evaluation passing strategies, risk management templates, and unfiltered interviews with 6-figure funded traders."
      mainIcon={<BookOpen size={54} className="text-[#a855f7] drop-shadow-[0_0_24px_rgba(168,85,247,0.85)]" />}
      brandColor="#a855f7"
      glowColor="rgba(168, 85, 247, 0.45)"
      progressPercentage={72}
      launchTimeline="First Edition Release • May 2026"
      features={[
        {
          icon: BookOpen,
          title: "Stress-Tested Firm Audits",
          desc: "Unbiased, data-driven tests analyzing real server slippage, spread markups, and withdrawal turnaround times across new firms.",
          badge: "REVIEWS"
        },
        {
          icon: TrendingUp,
          title: "Evaluation Passing Playbooks",
          desc: "Battle-tested mathematical rules for scaling lot sizes, locking in profits, and navigating Phase 1 and Phase 2 targets safely.",
          badge: "STRATEGY"
        },
        {
          icon: Award,
          title: "Funded Trader Case Studies",
          desc: "Exclusive interviews and breakdown journals from profitable traders securing consistent $20,000+ monthly payouts.",
          badge: "CASE STUDIES"
        }
      ]}
    />
  );
};

export default BlogListPage;
