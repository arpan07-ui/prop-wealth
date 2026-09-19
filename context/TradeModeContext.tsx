import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type TradeMode = 'futures' | 'forex' | 'crypto';

interface TradeModeContextType {
  mode: TradeMode;
  setMode: (mode: TradeMode) => void;
  toggleMode: () => void;
  getModePath: (path: string) => string;
  /** Returns a human-readable label for the current mode */
  modeLabel: string;
}

const TradeModeContext = createContext<TradeModeContextType | undefined>(undefined);

/** Ordered list of modes for cycling via toggleMode */
const MODE_CYCLE: TradeMode[] = ['futures', 'forex', 'crypto'];

/** Prefixes used in URLs for non-default modes */
const MODE_PREFIXES: Record<string, TradeMode> = {
  '/forex': 'forex',
  '/crypto': 'crypto',
};

/** Display labels */
const MODE_LABELS: Record<TradeMode, string> = {
  futures: 'Futures',
  forex: 'Forex',
  crypto: 'Crypto',
};

/** Detect mode from a URL pathname */
function detectModeFromPath(pathname: string): TradeMode {
  if (pathname.startsWith('/forex')) return 'forex';
  if (pathname.startsWith('/crypto')) return 'crypto';
  return 'futures'; // Default
}

/** Strip any mode prefix from a path */
function stripModePrefix(pathname: string): string {
  if (pathname.startsWith('/forex')) return pathname.replace(/^\/forex/, '') || '/';
  if (pathname.startsWith('/crypto')) return pathname.replace(/^\/crypto/, '') || '/';
  return pathname;
}

export const TradeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setModeState] = useState<TradeMode>('futures');

  // Sync state with URL path
  useEffect(() => {
    const newMode = detectModeFromPath(location.pathname);
    setModeState(newMode);
    document.documentElement.setAttribute('data-theme', newMode);
  }, [location.pathname]);

  const getModePath = (path: string) => {
    // If it's an admin path, don't prefix (admin is global)
    if (path.includes('/admin')) return path;
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Futures is the default — no prefix needed
    if (mode === 'futures') return cleanPath;

    // Forex and Crypto get their prefix
    return `/${mode}${cleanPath === '/' ? '' : cleanPath}`;
  };

  const setMode = (newMode: TradeMode) => {
    const currentPath = location.pathname;
    // Remove any existing mode prefix
    let cleanPath = stripModePrefix(currentPath);
    if (cleanPath === '') cleanPath = '/';

    // Futures is default (no prefix), others get their prefix
    const newPath = newMode === 'futures'
      ? cleanPath
      : `/${newMode}${cleanPath === '/' ? '' : cleanPath}`;
    
    navigate(newPath + location.search);
  };

  const toggleMode = () => {
    const currentIndex = MODE_CYCLE.indexOf(mode);
    const nextIndex = (currentIndex + 1) % MODE_CYCLE.length;
    setMode(MODE_CYCLE[nextIndex]);
  };

  const modeLabel = MODE_LABELS[mode];

  return (
    <TradeModeContext.Provider value={{ mode, setMode, toggleMode, getModePath, modeLabel }}>
      {children}
    </TradeModeContext.Provider>
  );
};

export const useTradeMode = () => {
  const context = useContext(TradeModeContext);
  if (context === undefined) {
    throw new Error('useTradeMode must be used within a TradeModeProvider');
  }
  return context;
};
