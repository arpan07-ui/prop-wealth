import React from 'react';
import { useTradeMode, TradeMode } from '../context/TradeModeContext';
import { Activity, TrendingUp, Bitcoin } from 'lucide-react';

const MODES: { key: TradeMode; label: string; icon: React.ComponentType<{ className?: string }>; color: string; dotColor: string }[] = [
  { 
    key: 'futures',  
    label: 'FUTURES', 
    icon: Activity, 
    color: 'bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)] border border-cyan-400/40',
    dotColor: 'bg-cyan-300'
  },
  { 
    key: 'forex',    
    label: 'FOREX',   
    icon: TrendingUp,      
    color: 'bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-black font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.4)] border border-amber-300/60',
    dotColor: 'bg-amber-900'
  },
  { 
    key: 'crypto',   
    label: 'CRYPTO',  
    icon: Bitcoin,  
    color: 'bg-gradient-to-r from-purple-500/90 to-violet-500/90 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] border border-purple-400/40',
    dotColor: 'bg-purple-300'
  },
];

const ModeToggle: React.FC = () => {
  const { mode, setMode } = useTradeMode();
  const activeIndex = MODES.findIndex(m => m.key === mode);

  return (
    <div className="relative flex items-center bg-[#100e0b]/90 backdrop-blur-md border border-white/10 rounded-full p-0.5 w-[205px] h-7.5 sm:h-8 select-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
      {/* Sliding Active Pill */}
      <div 
        className={`absolute top-0.5 bottom-0.5 rounded-full transition-all duration-300 ease-out z-0 ${MODES[activeIndex].color}`}
        style={{
          width: 'calc(33.333% - 2px)',
          left: `calc(${activeIndex * 33.333}% + 1px)`,
        }}
      />

      {/* Mode Buttons */}
      {MODES.map((m) => {
        const isActive = mode === m.key;
        const Icon = m.icon;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1 text-[10px] font-bold tracking-tight transition-all duration-200 cursor-pointer h-full rounded-full ${
              isActive 
                ? (m.key === 'forex' ? 'text-black font-black' : 'text-white font-black') 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${isActive ? 'scale-110' : 'opacity-70'}`} />
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ModeToggle;
