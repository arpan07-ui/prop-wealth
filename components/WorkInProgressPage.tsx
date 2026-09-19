import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Bell, 
  ShieldCheck, 
  Compass,
  Zap,
  Timer
} from 'lucide-react';
import { useTradeMode } from '../context/TradeModeContext';

export interface UpcomingFeature {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  badge: string;
}

interface WorkInProgressPageProps {
  pageKey: string;
  pageTitle: string;
  badgeText?: string;
  tagline: string;
  description: string;
  mainIcon: React.ReactNode;
  brandColor?: string; // hex like #F0C41B, #00b4d8, #a855f7, #10b981
  glowColor?: string;
  progressPercentage: number;
  launchTimeline: string;
  features: UpcomingFeature[];
  extraChildren?: React.ReactNode;
}

export const WorkInProgressPage: React.FC<WorkInProgressPageProps> = ({
  pageTitle,
  badgeText = 'WORK IN PROGRESS',
  tagline,
  description,
  mainIcon,
  brandColor = '#F0C41B',
  glowColor = 'rgba(240, 196, 27, 0.35)',
  progressPercentage = 85,
  launchTimeline = 'Coming Soon • Q2 2026',
  features,
  extraChildren
}) => {
  const { getModePath } = useTradeMode();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  return (
    <div className="relative min-h-[92vh] bg-[#07080c] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center justify-center">
      {/* ═══════════════════ AMBIENT BACKGROUND GLOWS ═══════════════════ */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-25 transition-all duration-700"
        style={{ backgroundColor: brandColor }}
      />
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none" />

      {/* Cyber Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 max-w-4xl w-full mx-auto text-center flex flex-col items-center">
        
        {/* ── LIVE STATUS PILL ── */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <span className="relative flex h-2.5 w-2.5">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: brandColor }}
            />
            <span 
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: brandColor }}
            />
          </span>
          <span 
            className="text-[11px] font-black tracking-widest uppercase"
            style={{ color: brandColor }}
          >
            {badgeText}
          </span>
          <span className="text-white/20 text-xs">•</span>
          <span className="text-[11px] font-bold text-neutral-400">
            UPDATING SOON
          </span>
        </div>

        {/* ── FUTURISTIC HOLOGRAPHIC GRAPHIC CONTAINER ── */}
        <div 
          className="relative mb-10 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Concentric Rotating Radar Rings */}
          <div className="absolute -inset-10 rounded-full border border-dashed border-white/10 animate-spin-slow pointer-events-none" />
          <div 
            className="absolute -inset-16 rounded-full border border-white/5 animate-spin-reverse-slow pointer-events-none"
            style={{ borderColor: `${brandColor}20` }}
          />
          <div 
            className="absolute -inset-6 rounded-full animate-pulse-radar pointer-events-none"
            style={{ 
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` 
            }}
          />

          {/* Hexagonal / Rounded Hologram Center Emblem */}
          <div 
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-[#151922] to-[#0d0f15] border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-500 group-hover:scale-105"
            style={{
              boxShadow: isHovered 
                ? `0 0 50px ${glowColor}, 0 20px 40px rgba(0,0,0,0.9)` 
                : `0 0 30px ${glowColor}, 0 10px 30px rgba(0,0,0,0.7)`
            }}
          >
            {/* Embedded Logo Icon */}
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
              {mainIcon}
            </div>

            {/* Corner Tech Accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-white/40 rounded-tl-sm" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-white/40 rounded-tr-sm" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-white/40 rounded-bl-sm" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-white/40 rounded-br-sm" />
          </div>

          {/* Floating Orbiting Chip Badge */}
          <div className="absolute -bottom-3 -right-3 px-3 py-1 rounded-xl bg-[#11131a] border border-white/15 text-[10px] font-black text-white shadow-lg flex items-center gap-1.5">
            <Zap size={12} style={{ color: brandColor }} />
            <span>v2.4 DEV</span>
          </div>
        </div>

        {/* ── HEADLINE & DESCRIPTION ── */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          {pageTitle}
        </h1>
        
        <p className="text-base sm:text-xl font-medium text-neutral-300 max-w-2xl mx-auto mb-3">
          {tagline}
        </p>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
          {description}
        </p>

        {/* ── DEVELOPMENT PROGRESS BAR ── */}
        <div className="w-full max-w-md bg-[#0f1118] border border-white/10 rounded-2xl p-4 sm:p-5 mb-10 shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs font-bold mb-2.5">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Timer size={14} style={{ color: brandColor }} />
              <span>Deployment Progress</span>
            </span>
            <span className="font-black" style={{ color: brandColor }}>
              {progressPercentage}% Complete
            </span>
          </div>

          {/* Shimmering Progress Track */}
          <div className="w-full h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full transition-all duration-1000 animate-progress-shimmer"
              style={{
                width: `${progressPercentage}%`,
                background: `linear-gradient(90deg, ${brandColor}, #ffffff, ${brandColor})`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-semibold mt-2.5">
            <span>Milestone: System Architecture</span>
            <span className="text-neutral-300 font-bold">{launchTimeline}</span>
          </div>
        </div>

        {/* ── UPCOMING FEATURES PREVIEW GRID ── */}
        {features && features.length > 0 && (
          <div className="w-full mb-10">
            <div className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4 text-center">
              What's Being Built Behind The Scenes
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {features.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl bg-[#0c0e14] border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 shrink-0"
                          style={{ 
                            backgroundColor: `${brandColor}15`,
                            color: brandColor
                          }}
                        >
                          <IconComponent size={20} />
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 uppercase">
                          {feat.badge}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white mb-1.5">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-neutral-500">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      <span>Ready at Release</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Extra Children (e.g. Login Form Preview) */}
        {extraChildren && (
          <div className="w-full mb-10">
            {extraChildren}
          </div>
        )}

        {/* ── NOTIFY ME / VIP EARLY ACCESS FORM ── */}
        <div className="w-full max-w-lg mb-10">
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-[#0d0f17] border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.7)]">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your trader email for launch alert..."
                  required
                  className="flex-1 bg-transparent px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
                  style={{ backgroundColor: brandColor }}
                >
                  <Bell size={14} className="stroke-[2.5]" />
                  <span>Notify Me</span>
                </button>
              </div>
              <div className="text-[11px] text-neutral-500 mt-2 flex items-center justify-center gap-2">
                <ShieldCheck size={12} className="text-neutral-400" />
                <span>Zero spam. Direct ping the moment this section goes live.</span>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-scale-in">
              <CheckCircle2 size={18} />
              <span>You're on the VIP launch list! We'll alert you the moment this goes live.</span>
            </div>
          )}
        </div>

        {/* ── BACK & EXPLORE NAVIGATION BUTTONS ── */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={getModePath('/firms')}
            className="px-6 py-3 rounded-xl bg-[#bbf426] hover:bg-[#a6f208] text-black font-black text-xs sm:text-sm transition-all hover:scale-105 shadow-[0_4px_18px_rgba(187,244,38,0.3)] flex items-center gap-2 cursor-pointer"
          >
            <Compass size={16} />
            <span>Explore Marketplace</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            to={getModePath('/')}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <span>Return to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default WorkInProgressPage;
