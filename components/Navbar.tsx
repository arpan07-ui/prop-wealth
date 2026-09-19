import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronRight, Sparkles, Search, Copy, Check, Gift, ArrowRight, LogIn } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useTradeMode } from '../context/TradeModeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedNavCode, setCopiedNavCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const copyNavCode = () => {
    navigator.clipboard.writeText('WEALTHX');
    setCopiedNavCode(true);
    setTimeout(() => setCopiedNavCode(false), 2500);
  };

  const location = useLocation();
  const { user } = useAuth();
  const { getModePath } = useTradeMode();

  const primaryNavLinks = [
    { name: 'Marketplace', path: getModePath('/firms') },
    { name: 'Rewards', path: getModePath('/rewards') },
    { name: 'Calculator', path: getModePath('/compare') },
    { name: 'Blogs', path: getModePath('/blog') },
    { name: 'FAQ', path: getModePath('/faq') },
    { name: 'Hot Deals', path: getModePath('/offers'), isHot: true },
  ];

  const isActive = (path: string) => {
    if (path && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-2.5 sm:top-4 inset-x-0 mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 z-50 pointer-events-none transition-all duration-300">
      {/* ═══════════════════ TRANSLUCENT GLASS NAVBAR CONTAINER ═══════════════════ */}
      <div className="pointer-events-auto relative rounded-[17px] bg-[#141416]/75 backdrop-blur-xl border-none shadow-[0_18px_45px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300">
        
        <div className="px-4 sm:px-4.5 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          
          {/* LEFT: POWERED BY PROP x WEALTH Brand */}
          <Link 
            to={getModePath('/')} 
            className="flex items-center gap-2.5 group shrink-0"
          >
            {/* Official Yellow W-Arrow Brand Logo Box */}
            <div className="w-8 h-8 rounded-[7px] overflow-hidden shadow-[0_0_10px_rgba(240,196,27,0.35)] group-hover:scale-105 transition-transform shrink-0 border border-[#F0C41B]/30">
              <img src="/FAVICON.jpeg" alt="PROPxWEALTH" className="w-full h-full object-cover max-w-full max-h-full block" />
            </div>

            {/* POWERED BY Text Layout */}
            <div className="flex flex-col text-left justify-center leading-none">
              <span className="text-[8px] sm:text-[8.5px] font-bold tracking-[0.16em] text-neutral-400 uppercase opacity-90">POWERED BY</span>
              <span className="text-xs sm:text-sm font-black tracking-tight text-white mt-0.5">
                PROP <span className="text-[#f97316]">x</span> WEALTH
              </span>
            </div>
          </Link>

          {/* CENTER/RIGHT: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0 ml-auto font-sans">
            {primaryNavLinks.map((link) => {
              const active = isActive(link.path);
              if (link.isHot) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative text-xs xl:text-sm font-medium transition-all duration-300"
                  >
                    {/* Animated Yellow Shimmer Text */}
                    <span className="bg-gradient-to-r from-[#F0C41B] via-[#fff5b8] to-[#F0C41B] bg-[length:200%_auto] animate-text-shimmer bg-clip-text text-transparent font-medium">
                      {link.name}
                    </span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'text-white font-bold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Code Box & Login Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Redesigned USE CODE: WEALTHX Box (Subtle dark border, deep shadow, glowing checkmark symbol only) */}
            <div
              onClick={copyNavCode}
              className={`hidden md:flex items-center justify-between gap-3 pl-3.5 pr-1 py-1 rounded-xl bg-[#0b0d0c] shadow-[0_8px_25px_rgba(0,0,0,0.85)] transition-all cursor-pointer group shrink-0 select-none ${
                copiedNavCode 
                  ? 'border border-transparent' 
                  : 'border border-white/[0.06] hover:border-white/10'
              }`}
              title="Click to copy exclusive discount code"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#F0C41B] tracking-widest uppercase">USE CODE:</span>
                <span className="text-xs font-black text-white tracking-widest">WEALTHX</span>
              </div>

              <div className={`w-8 h-8 aspect-square rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                copiedNavCode 
                  ? 'bg-[#1c1809] border-none shadow-none ring-0' 
                  : 'bg-[#1c1809] border border-[#F0C41B]/40 group-hover:bg-[#28220c]'
              }`}>
                {copiedNavCode ? (
                  <Check size={14} className="text-green-400 stroke-[3] drop-shadow-[0_0_10px_rgba(74,222,128,1)] animate-scale-in" />
                ) : (
                  <Copy size={14} className="text-[#F0C41B] stroke-[2]" />
                )}
              </div>
            </div>

            {/* Auth Actions: Single Screenshot Styled LOGIN Box Button */}
            {user ? (
              <Link to={getModePath('/dashboard')} className="hidden sm:block shrink-0">
                <Button variant="secondary" size="sm" className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-xl text-xs font-bold px-3.5 py-1.5">
                  <User size={14} /> Dashboard
                </Button>
              </Link>
            ) : (
              <Link 
                to={getModePath('/login')} 
                className="hidden sm:flex items-center gap-2.5 pl-1 pr-3.5 py-1 rounded-xl bg-[#0b0d0c] border border-white/10 hover:border-white/20 transition-all cursor-pointer group shrink-0"
              >
                <div className="w-8 h-8 aspect-square rounded-lg bg-[#1c1809] border border-[#F0C41B] text-[#F0C41B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <LogIn size={14} className="stroke-[2]" />
                </div>
                <span className="text-xs font-extrabold text-white tracking-widest uppercase">LOGIN</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* ═══════════════════ MOBILE GLASS DRAWER ═══════════════════ */}
      <div 
        className={`lg:hidden pointer-events-auto mt-2 rounded-2xl bg-[#141416]/95 backdrop-blur-2xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[85vh] opacity-100 p-4' : 'max-h-0 opacity-0 p-0 border-transparent'
        }`}
      >
        <div className="space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search prop firms & challenges..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#f97316]/50 transition-colors"
            />
          </div>

          {/* Preserved Navigation Links */}
          <div className="space-y-1">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-[#f97316]/15 text-[#f97316] font-bold border border-[#f97316]/30'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.isRewards && <Gift size={14} className="text-[#f97316]" />}
                  <span>{link.name}</span>
                  {link.isRewards && (
                    <span className="text-[8px] font-black uppercase bg-[#f97316] text-black px-1.5 py-0.5 rounded-md">
                      New
                    </span>
                  )}
                </div>
                <ChevronRight size={14} className={isActive(link.path) ? 'text-[#f97316]' : 'text-neutral-600'} />
              </Link>
            ))}
          </div>

          {/* Mobile Promo Code Box (Matches Screenshot) */}
          <div className="pt-2 border-t border-white/5">
            <div
              onClick={copyNavCode}
              className={`w-full flex items-center justify-between pl-4 pr-1.5 py-1.5 rounded-xl bg-[#0b0d0c] shadow-[0_8px_25px_rgba(0,0,0,0.85)] active:scale-98 transition-all cursor-pointer select-none ${
                copiedNavCode 
                  ? 'border border-transparent' 
                  : 'border border-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F0C41B] tracking-widest uppercase">USE CODE:</span>
                <span className="text-sm font-black text-white tracking-widest">WEALTHX</span>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                copiedNavCode 
                  ? 'bg-[#1c1809] border-none shadow-none ring-0' 
                  : 'bg-[#1c1809] border border-[#F0C41B]/40'
              }`}>
                {copiedNavCode ? (
                  <Check size={15} className="text-green-400 stroke-[3] drop-shadow-[0_0_10px_rgba(74,222,128,1)] animate-scale-in" />
                ) : (
                  <Copy size={15} className="text-[#F0C41B] stroke-[2]" />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-2 border-t border-white/5">
            {user ? (
              <Link to={getModePath('/dashboard')} onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full justify-center gap-2 bg-[#ff5500] text-white font-bold rounded-[8px] py-2.5 border-none shadow-[0_4px_20px_rgba(255,85,0,0.4)] text-xs">
                  <User size={15} /> Open Trader Dashboard
                </Button>
              </Link>
            ) : (
              <Link to={getModePath('/signup')} onClick={() => setIsOpen(false)} className="block">
                <div className="w-full flex items-center justify-center gap-2.5 pl-1 pr-3.5 py-2 rounded-[8px] bg-[#0b0d0c] border border-white/10 active:scale-98 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-[6px] bg-[#1c1809] border border-[#F0C41B] text-[#F0C41B] flex items-center justify-center">
                    <LogIn size={15} className="stroke-[2]" />
                  </div>
                  <span className="text-xs font-extrabold text-white tracking-widest uppercase">GET STARTED</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 pointer-events-auto"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
