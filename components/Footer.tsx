import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Mail, Phone, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useTradeMode } from '../context/TradeModeContext';

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.93-1.28 4.88-2.12 5.86-2.54 2.8-.1.18 3.38.93 3.6.14.05.3.16.44.25.07.05.12.13.1.22z" />
  </svg>
);

const Footer: React.FC = () => {
  const { mode, getModePath } = useTradeMode();

  return (
    <footer className="relative bg-[#070709] border-t border-white/[0.08] pt-16 pb-12 overflow-hidden">
      {/* Top subtle brand gold ambient glow strip */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#F0C41B]/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[80px] bg-[#F0C41B]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ══════════ TOP GRID ══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/[0.06]">

          {/* Brand Info (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to={getModePath('/')} className="inline-flex items-center mb-4 group">
              <img 
                src={mode === 'crypto' ? '/wealth-crypto.png' : mode === 'forex' ? '/wealth-forex.png' : '/wealth-futures.png'} 
                alt="PROPxWEALTH" 
                className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" 
              />
            </Link>

            <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed mb-5 max-w-sm">
              The premier evaluation & cashback rewards platform for proprietary traders. Compare vetted prop firms, access exclusive discounts, and earn Wealth Tokens on every challenge.
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-neutral-300 tracking-wide">
                Live Data & Verified Codes
              </span>
            </div>
          </div>

          {/* Nav Columns (Span 8: 4 Sub-Columns) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">

            {/* Column 1: Platform */}
            <div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.16em] mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B]" />
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <Link to={getModePath('/firms')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    Browse Firms
                  </Link>
                </li>
                <li>
                  <Link to={getModePath('/rewards')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                    <span className="group-hover:text-[#F0C41B] transition-colors">Rewards Vault</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[#F0C41B] text-black tracking-wider uppercase">
                      NEW
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to={getModePath('/compare')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    Compare Tool
                  </Link>
                </li>
                <li>
                  <Link to={getModePath('/offers')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    Offers & Codes
                  </Link>
                </li>
                <li>
                  <Link to={getModePath('/competitions')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    Competitions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Ecosystem */}
            <div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.16em] mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B]" />
                Company
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <Link to={getModePath('/about')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to={getModePath('/contact')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <a href="https://discord.gg/propxwealth" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">
                    <span>Trader Discord</span>
                    <ArrowUpRight size={12} className="text-[#F0C41B]" />
                  </a>
                </li>
                <li>
                  <Link to={getModePath('/firms')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    List Your Firm
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Security */}
            <div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.16em] mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B]" />
                Legal
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px]">
                <li>
                  <Link to={getModePath('/terms')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to={getModePath('/privacy')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to={getModePath('/risk')} className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center">
                    Risk Disclosure
                  </Link>
                </li>
                <li>
                  <span className="text-neutral-500 text-xs inline-flex items-center gap-1 mt-1">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>SSL Secured</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Direct Support & Socials */}
            <div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.16em] mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0C41B]" />
                Connect
              </h4>
              <ul className="space-y-3 text-xs sm:text-[13px] mb-5">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center shrink-0">
                    <Mail size={12} className="text-[#F0C41B]" />
                  </div>
                  <a href="mailto:support@propxwealth.com" className="text-neutral-300 hover:text-[#F0C41B] transition-colors truncate">
                    support@propxwealth.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center shrink-0">
                    <Phone size={12} className="text-[#F0C41B]" />
                  </div>
                  <a href="tel:+918882511483" className="text-neutral-300 hover:text-[#F0C41B] transition-colors">
                    +91 88825 11483
                  </a>
                </li>
              </ul>

              {/* Social Icon Pills */}
              <div className="flex items-center gap-2">
                <a 
                  href="https://x.com/PROPxWEALTHx" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#F0C41B]/40 hover:bg-[#F0C41B]/10 text-neutral-400 hover:text-[#F0C41B] flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <Twitter size={14} />
                </a>
                <a 
                  href="https://discord.gg/propxwealth" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Discord"
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#F0C41B]/40 hover:bg-[#F0C41B]/10 text-neutral-400 hover:text-[#F0C41B] flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <DiscordIcon />
                </a>
                <a 
                  href="https://t.me/propxwealth" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Telegram"
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#F0C41B]/40 hover:bg-[#F0C41B]/10 text-neutral-400 hover:text-[#F0C41B] flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <TelegramIcon />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ══════════ FINANCIAL RISK DISCLAIMER ══════════ */}
        <div className="py-8 border-b border-white/[0.06] text-[11px] sm:text-xs text-neutral-500 leading-relaxed">
          <p className="max-w-5xl">
            <span className="font-bold text-neutral-400 uppercase tracking-wider mr-1">Risk Disclaimer:</span>
            Trading financial instruments, foreign exchange (Forex), commodities, and contracts for differences (CFDs) carries a high level of risk and may not be suitable for all investors. Proprietary trading evaluation challenges simulate live market conditions, and virtual evaluation capital is provided according to the individual rules and terms of each proprietary trading firm. PROPxWEALTH operates as an independent comparison, review, and token rewards portal and is not a broker, dealer, or financial advisor. All materials and promo codes published are for informational purposes only.
          </p>
        </div>

        {/* ══════════ BOTTOM COPYRIGHT ROW ══════════ */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} <span className="text-white font-semibold">PROPxWEALTH</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to={getModePath('/privacy')} className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-neutral-700">•</span>
            <Link to={getModePath('/terms')} className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-neutral-700">•</span>
            <Link to={getModePath('/risk')} className="hover:text-white transition-colors">Risk Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
