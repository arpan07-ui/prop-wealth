import React from 'react';
import { Link } from 'react-router-dom';
import { PropFirm } from '../types';
import { useComparison } from '../context/ComparisonContext';
import { useTradeMode } from '../context/TradeModeContext';
import { formatFunding } from '../lib/format';
import FirmLogo from './FirmLogo';
import PlatformLogo from './PlatformLogo';
import { ArrowUpRight, GitCompareArrows, Star, CheckCircle } from 'lucide-react';
import { generateSlug } from '../lib/services';

interface FirmCardProps {
  firm: PropFirm;
  className?: string;
  rank?: number;
}

const FirmCard: React.FC<FirmCardProps> = ({ firm, className, rank }) => {
  const { toggleFirm, isInComparison } = useComparison();
  const { getModePath } = useTradeMode();
  const isSelected = isInComparison(firm.id);

  const getFaviconUrl = () => {
    if (firm.favicon) return firm.favicon;
    if (firm.website) {
      try {
        const hostname = new URL(firm.website).hostname;
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
      } catch (e) {
        return firm.logo;
      }
    }
    return firm.logo;
  };

  const iconUrl = getFaviconUrl();
  const splitNum = parseInt(firm.profitSplit?.replace('%', '') || '80');

  return (
    <article className={`relative rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] flex flex-col h-full transition-all duration-300 hover:border-[#333] hover:shadow-2xl hover:-translate-y-1 ${className || ''}`}>
      
      {/* Rank Badge */}
      {rank && (
        <div className={`absolute -top-3 -left-3 px-3 py-1 rounded-md font-black text-xs z-20 shadow-lg flex items-center gap-1 ${
          rank === 1 ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black' : 
          rank === 2 ? 'bg-gradient-to-r from-neutral-200 to-neutral-300 text-black' : 
          rank === 3 ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white' : 
          'bg-[#1f1f1f] text-neutral-400 border border-[#333]'
        }`}>
          {rank === 1 && <span className="text-[10px]">👑</span>}
          #{rank}
        </div>
      )}

      {/* Top Header Section */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <FirmLogo
              src={iconUrl}
              fallbackSrc={firm.logo}
              alt={firm.name}
              size="sm"
              className="rounded-lg w-12 h-12 object-cover bg-[#111] border border-[#222]"
            />
            
            <div className="pt-0.5 flex flex-col justify-center">
              <h3 className="font-bold text-[15px] text-white tracking-tight leading-tight mb-1.5">{firm.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle size={8} strokeWidth={3} />
                  Verified
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-[1px] mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={11} className={s <= Math.round(firm.rating) ? "text-brand-accent fill-brand-accent" : "text-[#222] fill-[#222]"} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-neutral-400">{firm.rating}/5 ({firm.reviewCount || 0})</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {/* Max Fund */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg py-3 flex flex-col items-center justify-center">
            <span className="block text-sm font-bold text-white mb-0.5">{formatFunding(firm.maxFunding)}</span>
            <span className="block text-[8px] uppercase tracking-wider text-neutral-500 font-bold">Max Fund</span>
          </div>
          {/* Profit Split */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg py-3 flex flex-col items-center justify-center">
            <span className="block text-sm font-bold text-brand-accent mb-0.5">{splitNum}%</span>
            <span className="block text-[8px] uppercase tracking-wider text-neutral-500 font-bold">Profit Split</span>
          </div>
          {/* Drawdown */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg py-3 flex flex-col items-center justify-center">
            <span className="block text-sm font-bold text-white mb-0.5">{firm.drawdown || '10%'}</span>
            <span className="block text-[8px] uppercase tracking-wider text-neutral-500 font-bold">Drawdown</span>
          </div>
        </div>
      </div>

      {/* Visual Profit Split Bar */}
      <div className="px-5 pb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider">Profit Split</span>
          <span className="text-[10px] text-brand-accent font-bold">{splitNum}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-brand-accent"
            style={{ width: `${splitNum}%` }}
          ></div>
        </div>
      </div>

      {/* Platform Tags */}
      <div className="px-5 pb-4 mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {((firm.tags && firm.tags.length > 0 ? firm.tags : firm.platforms) || []).slice(0, 4).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 rounded bg-[#111] border border-[#222] text-[9px] font-bold text-neutral-300 uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 mt-auto flex items-center gap-3">
        <Link to={getModePath(`/firm/${generateSlug(firm.name)}`)} className="flex-1">
          <button className="w-full h-10 flex items-center justify-center gap-1.5 rounded-lg bg-brand-gradient hover:bg-brand-neon text-white font-bold text-[13px] transition-all shadow-brand-glow">
            View Firm
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </button>
        </Link>
        
        <button
          onClick={() => toggleFirm(firm)}
          className={`shrink-0 w-[100px] h-10 flex items-center justify-center gap-1.5 rounded-lg border font-bold text-[11px] transition-all ${
            isSelected
            ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent'
            : 'bg-[#111] border-[#333] text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'
          }`}
        >
          <GitCompareArrows size={14} />
          {isSelected ? 'Added' : 'Compare'}
        </button>
      </div>
    </article>
  );
};

export default FirmCard;
