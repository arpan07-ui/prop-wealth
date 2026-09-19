import React from 'react';
import { Calculator, BarChart3, ShieldAlert } from 'lucide-react';
import WorkInProgressPage from '../components/WorkInProgressPage';

const CalculationPage: React.FC = () => {
  return (
    <WorkInProgressPage
      pageKey="calculation"
      pageTitle="PropX Calculation Engine"
      badgeText="CALCULATOR IN DEVELOPMENT"
      tagline="Intelligent Drawdown, Payout Splits & Evaluation Risk Simulator"
      description="We are architecting the industry's most comprehensive prop trading calculator. Simulate trailing vs static drawdowns, evaluate profit targets against fee costs, and calculate exact risk-per-trade parameters across 40+ top prop firms."
      mainIcon={<Calculator size={54} className="text-[#00b4d8] drop-shadow-[0_0_24px_rgba(0,180,216,0.85)]" />}
      brandColor="#00b4d8"
      glowColor="rgba(0, 180, 216, 0.45)"
      progressPercentage={78}
      launchTimeline="Beta Simulator • May 2026"
      features={[
        {
          icon: BarChart3,
          title: "Multi-Firm Cost-per-Dollar Analysis",
          desc: "Compare evaluation price vs capital allocation to discover which firm gives you the cheapest funded dollars per risk unit.",
          badge: "ANALYTICS"
        },
        {
          icon: Calculator,
          title: "Drawdown Buffer & Lot-Size Simulator",
          desc: "Input your personal risk percentage to accurately compute maximum allowable lots before hitting daily or total drawdown limits.",
          badge: "RISK ENGINE"
        },
        {
          icon: ShieldAlert,
          title: "Consistency Rule & Hidden Fee Auditor",
          desc: "Uncover hidden lot-size rules, mandatory trading day clauses, and high-water mark trailing traps before purchasing an account.",
          badge: "PROTECTION"
        }
      ]}
    />
  );
};

export default CalculationPage;
