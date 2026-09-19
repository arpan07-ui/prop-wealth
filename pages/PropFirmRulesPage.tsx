import React, { useEffect, useState } from 'react';
import { useTradeMode } from '../context/TradeModeContext';
import { FirmService } from '../lib/services';
import { PropFirm } from '../types';
import { ExternalLink, BookOpen, Loader2 } from 'lucide-react';


const PropFirmRulesPage: React.FC = () => {
  const { mode, modeLabel } = useTradeMode();
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFirms = async () => {
      setLoading(true);
      try {
        const activeFirms = await FirmService.getActiveFirms(mode);
        setFirms(activeFirms);
      } catch (error) {
        console.error("Error loading firms for rules page:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFirms();
  }, [mode]);

  return (
    <div className="min-h-screen bg-background-dark pt-32 pb-20 relative overflow-hidden">


      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-bold mb-6 animate-fade-in-up">
            <BookOpen size={16} />
            <span>Official Guidelines & FAQ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {modeLabel} Prop Firm <span className="text-brand-accent">Rules</span>
          </h1>
          <p className="text-xl text-brand-muted animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Access the official rules, trading guidelines, and FAQs for every {modeLabel.toLowerCase()} proprietary trading firm listed on our platform.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-brand-muted">
            <Loader2 className="w-12 h-12 animate-spin text-brand-accent mb-4" />
            <p className="font-medium text-lg text-white">Loading {modeLabel} Firms...</p>
          </div>
        ) : firms.length === 0 ? (
          <div className="text-center py-20 bg-brand-surface/30 rounded-3xl border border-brand-border/50">
            <p className="text-brand-muted text-lg">No {modeLabel} firms found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-5xl mx-auto">
            {firms.map((firm) => (
              <div 
                key={firm.id} 
                className="bg-[#141414] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-2xl flex flex-col p-5 w-full transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                  {/* Left Column: Logo & Promo Box */}
                  <div className="bg-[#0a0a0a] border border-brand-accent/20 rounded-xl p-5 flex flex-col items-center min-w-[260px] shrink-0 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Logo & Rating Header */}
                    <div className="flex items-center gap-3 w-full mb-6 relative z-10">
                      <div className="w-12 h-12 rounded bg-[#111] flex items-center justify-center p-2 border border-[#2a2a2a]">
                         <img src={firm.logo} alt={`${firm.name} Logo`} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-white font-bold text-sm truncate max-w-[150px]">{firm.name}</span>
                         <div className="flex items-center bg-[#111] border border-[#2a2a2a] px-1.5 py-0.5 rounded w-fit mt-1">
                            <span className="text-white text-[10px] font-bold mr-1">{firm.rating}</span>
                            <span className="text-brand-gold text-[10px]">★★★★★</span>
                         </div>
                      </div>
                    </div>

                    {/* NEW OFFER Pill */}
                    <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full mb-4 flex items-center gap-1.5 relative z-10">
                      <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
                      New Offer
                    </div>

                    {/* Percentage */}
                    <div className="text-brand-accent font-black text-4xl mb-5 tracking-tighter relative z-10">
                      {firm.discountValue || '10'}% <span className="text-xl">OFF</span>
                    </div>

                    {/* Code Section */}
                    <div className="flex items-center justify-between w-full bg-[#111] border border-brand-accent/30 border-dashed rounded-lg p-2.5 relative z-10">
                      <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">Code:</span>
                      <span className="text-white font-bold text-sm tracking-widest">{firm.promoCode || firm.discountCode || 'WEALTHX'}</span>
                    </div>
                  </div>
                  
                  {/* Right Column: AI Summary */}
                  <div className="flex-1 flex flex-col lg:pl-2">
                    {/* Header: AI Pill & Trust Badge */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen size={12} /> AI Summary
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${firm.trustScore >= 90 ? 'border-brand-accent text-brand-accent bg-brand-accent/10' : 'border-orange-500 text-orange-500 bg-orange-500/10'}`}>
                          {firm.trustScore >= 90 ? 'A' : firm.trustScore >= 75 ? 'B' : 'C'}
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-neutral-500 mt-1 font-bold">
                          {firm.trustScore >= 90 ? 'Very Reliable' : 'Reliable'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-white font-extrabold text-xl mb-4 tracking-tight">{firm.name} Rules AI Summary</h2>

                    {/* Bullet Points */}
                    <ul className="text-[#a0a0a0] text-[13px] space-y-2.5 list-disc pl-4 marker:text-brand-accent/50 mb-6 flex-1 pr-4">
                      <li>
                        <strong className="text-[#e0e0e0] font-semibold">Program structure:</strong> Evaluation requires minimum {firm.minDays || 5} trading days per phase. Funded accounts have no minimum.
                      </li>
                      <li>
                        <strong className="text-[#e0e0e0] font-semibold">Drawdown & loss limits:</strong> Daily drawdown is capped at {firm.drawdown || '5%'}. Cannot risk entire daily drawdown on a single trade.
                      </li>
                      <li>
                        <strong className="text-[#e0e0e0] font-semibold">Trading rules:</strong> {firm.newsTrading ? 'News trading is permitted.' : 'News trading is restricted.'} {firm.weekendHolding ? 'Weekend holding is allowed.' : 'All open positions must be closed before the weekend.'}
                      </li>
                      <li>
                        <strong className="text-[#e0e0e0] font-semibold">Trading restrictions:</strong> Off-the-shelf EAs and high-frequency trading (HFT) bots may be restricted. Reverse trading and hedging across multiple accounts are prohibited.
                      </li>
                    </ul>

                    {/* Action Button */}
                    <div className="flex justify-start">
                      <a 
                        href={firm.rules_url || firm.website || firm.affiliateLink || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-brand-accent/10 border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-black transition-colors text-[11px] uppercase tracking-widest font-black px-6 py-2.5 rounded-full inline-flex items-center gap-2"
                      >
                        View Official FAQ <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: General Rules Section */}
                <div className="w-full mt-6 pt-5 border-t border-[#2a2a2a]">
                  <h4 className="text-white font-extrabold text-[11px] uppercase tracking-widest mb-3 flex items-center gap-2">
                    General Rules <span className="h-[1px] flex-1 bg-[#2a2a2a] ml-2"></span>
                  </h4>
                  <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a]">
                    <p className="text-[#888] text-[13px] leading-relaxed">
                      {firm.description || `Read the official trading rules, payout policies, scaling plans, and evaluation guidelines for ${firm.name}. Max Capital Allocation is $${firm.maxFunding?.toLocaleString() || '200,000'}.`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropFirmRulesPage;
