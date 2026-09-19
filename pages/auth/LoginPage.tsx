import React, { useState } from 'react';
import { ShieldCheck, Coins, Key, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkInProgressPage from '../../components/WorkInProgressPage';
import { useTradeMode } from '../../context/TradeModeContext';

const LoginPage: React.FC = () => {
  const { getModePath } = useTradeMode();

  return (
    <div className="relative">
      {/* Top back navigation button */}
      <div className="absolute top-6 left-6 z-30">
        <Link
          to={getModePath('/')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-neutral-300 hover:text-white transition-all backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </div>

      <WorkInProgressPage
        pageKey="login"
        pageTitle="Trader Portal & Login"
        badgeText="AUTHENTICATION UPGRADE"
        tagline="Next-Gen Unified Trader Authentication & Multi-Firm Portfolio"
        description="We are upgrading the PropX Wealth member authentication system. We're integrating high-speed cryptographic single sign-on, automated Discord community perk synchronization, and real-time affiliate reward tracking."
        mainIcon={<Lock size={54} className="text-[#F0C41B] drop-shadow-[0_0_24px_rgba(240,196,27,0.85)]" />}
        brandColor="#F0C41B"
        glowColor="rgba(240, 196, 27, 0.45)"
        progressPercentage={88}
        launchTimeline="Security Audit • Launching April 2026"
        features={[
          {
            icon: ShieldCheck,
            title: "1-Click Discord & Google SSO",
            desc: "Instant passwordless authentication linking your Discord community perks, verified buyer role, and exclusive deals.",
            badge: "SSO SYNC"
          },
          {
            icon: Coins,
            title: "Real-Time Token & Payout Ledger",
            desc: "Live dashboard tracking your earned Wealth Credits, pending cashback redemptions, and active evaluation challenges.",
            badge: "PORTFOLIO"
          },
          {
            icon: Key,
            title: "Smart Challenge Auto-Sync",
            desc: "Store your firm account numbers securely to automatically monitor drawdown stats and receive breach warning alerts.",
            badge: "SECURITY"
          }
        ]}
      />
    </div>
  );
};

export default LoginPage;
