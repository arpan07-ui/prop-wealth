import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trophy, Calendar, DollarSign, ArrowRight, Timer, Zap } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useTradeMode } from '../context/TradeModeContext';

import { FALLBACK_COMPETITIONS, withTimeout } from '../lib/fallbackData';

interface Competition {
    id: string;
    firm_name: string;
    title: string;
    description: string;
    prize_pool: string;
    entry_fee: string;
    start_date: string;
    end_date: string;
    join_url: string;
    image_url: string;
    status: 'upcoming' | 'active' | 'ended';
    firms?: {
        trading_type?: string;
        tags?: string[];
    };
}

const CompetitionsPage = () => {
    const { mode, getModePath } = useTradeMode();
    const [competitions, setCompetitions] = useState<Competition[]>(FALLBACK_COMPETITIONS as any);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const modeLabel = mode === 'futures' ? 'Futures' : mode === 'crypto' ? 'Crypto' : 'Prop Trading';

    useEffect(() => {
        fetchCompetitions();
    }, [mode]);

    const fetchCompetitions = async () => {
        try {
            const fetchPromise = supabase
                .from('competitions')
                .select('*, firms(trading_type, tags)')
                .order('start_date', { ascending: true });

            const res = await withTimeout(fetchPromise, 2500, { data: null, error: null });

            if (res?.data && res.data.length > 0) {
                setCompetitions(res.data);
            }
        } catch (error) {
            console.warn('Using resilient competitions dataset:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCompetitions = competitions.filter(comp => {
        // Status filter
        const matchesStatus = filter === 'all' ? true : comp.status === filter;
        if (!matchesStatus) return false;

        // Category filter if user manually selected a category
        if (selectedCategory !== 'all') {
            const firmType = (comp.firms?.trading_type || '').toLowerCase();
            const tags = (comp.firms?.tags || []).map(t => t.toLowerCase());
            const titleOrDesc = `${comp.title} ${comp.description}`.toLowerCase();
            
            if (selectedCategory === 'futures') {
                return firmType === 'futures' || tags.includes('futures') || titleOrDesc.includes('futures');
            }
            if (selectedCategory === 'crypto') {
                return firmType === 'crypto' || tags.includes('crypto') || titleOrDesc.includes('crypto') || titleOrDesc.includes('btc');
            }
            if (selectedCategory === 'forex') {
                return firmType === 'forex' || tags.includes('forex') || (!tags.includes('futures') && !tags.includes('crypto'));
            }
        }

        return true;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const getDaysRemaining = (targetDate: string) => {
        const diff = new Date(targetDate).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    return (
        <div className="min-h-screen bg-black pt-36 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/10 rounded-full blur-[150px] animate-aurora"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[150px] animate-aurora-reverse"></div>
                <div className="absolute inset-0 bg-grid-white opacity-[0.02]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                        <Trophy size={14} /> Elite Trading Events
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight uppercase animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {modeLabel} <span className="text-brand-accent">Competitions</span>
                    </h1>
                    <p className="text-brand-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Join the arena where the world's best traders compete for glory and massive capital. 
                        Test your strategy, dominate the leaderboard, and win funded accounts up to $1M.
                    </p>
                </div>

                {/* Glassmorphism Filters */}
                <div className="flex flex-col items-center gap-4 mb-14 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    {/* Market Category Pills */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { key: 'all', label: 'All Markets' },
                            { key: 'futures', label: 'Futures Arenas' },
                            { key: 'forex', label: 'Forex Arenas' },
                            { key: 'crypto', label: 'Crypto Arenas' },
                        ].map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                                    selectedCategory === cat.key
                                        ? 'bg-brand-accent text-black shadow-brand-glow'
                                        : 'bg-[#111] border border-white/5 text-neutral-400 hover:text-white hover:border-white/20'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Status Tabs */}
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-1 rounded-2xl flex gap-1 shadow-2xl">
                        {(['all', 'active', 'upcoming'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-500 uppercase tracking-wider ${filter === f
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-t-2 border-brand-accent animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-b-2 border-brand-accent opacity-50 animate-spin-slow"></div>
                        </div>
                        <p className="mt-6 text-brand-muted font-bold tracking-widest uppercase text-xs animate-pulse">Synchronizing Data...</p>
                    </div>
                )}

                {/* Competition Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCompetitions.map((comp, idx) => (
                            <div
                                key={comp.id}
                                className="group bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl overflow-hidden hover:border-brand-accent/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-full animate-fade-in-up"
                                style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                            >
                                {/* Visual Banner */}
                                <div className="h-56 bg-[#111] relative overflow-hidden p-8 flex items-center justify-center border-b border-[#1f1f1f]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 to-transparent opacity-50"></div>
                                    <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
                                    
                                    <img
                                        src={comp.image_url || 'https://via.placeholder.com/150'}
                                        alt={comp.firm_name}
                                        className="h-24 w-auto object-contain z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                                    />

                                    {/* Status Indicator */}
                                    <div className="absolute top-6 right-6 z-20">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${
                                            comp.status === 'active' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                                            : comp.status === 'upcoming' 
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                            : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                        }`}>
                                            <span className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${comp.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`}></span>
                                                {comp.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-brand-accent text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-accent/5 border border-brand-accent/10">
                                                {comp.firm_name}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                                            <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Season 04</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-brand-accent transition-colors duration-300 leading-tight">
                                            {comp.title}
                                        </h3>
                                        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 font-medium">
                                            {comp.description}
                                        </p>
                                    </div>

                                    {/* Stats Dashboard */}
                                    <div className="grid grid-cols-2 gap-px bg-[#1f1f1f] rounded-2xl overflow-hidden border border-[#1f1f1f] mb-8 shadow-inner">
                                        <div className="bg-[#0d0d0d] p-4 flex flex-col gap-1">
                                            <span className="text-neutral-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Trophy size={10} className="text-brand-accent" /> Prize Pool
                                            </span>
                                            <span className="text-white text-lg font-black tracking-tight">{comp.prize_pool}</span>
                                        </div>
                                        <div className="bg-[#0d0d0d] p-4 flex flex-col gap-1">
                                            <span className="text-neutral-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Zap size={10} className="text-amber-500" /> Entry Fee
                                            </span>
                                            <span className="text-amber-500 text-lg font-black tracking-tight">{comp.entry_fee}</span>
                                        </div>
                                        <div className="bg-[#0d0d0d] p-4 flex flex-col gap-1">
                                            <span className="text-neutral-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Calendar size={10} /> Start Date
                                            </span>
                                            <span className="text-neutral-300 text-sm font-bold uppercase">{formatDate(comp.start_date)}</span>
                                        </div>
                                        <div className="bg-[#0d0d0d] p-4 flex flex-col gap-1">
                                            <span className="text-neutral-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Timer size={10} /> {comp.status === 'active' ? 'Ends In' : 'Starts In'}
                                            </span>
                                            <span className="text-white text-sm font-black uppercase">
                                                {getDaysRemaining(comp.status === 'active' ? comp.end_date : comp.start_date)} Days
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-auto pt-2">
                                        <Link to={getModePath(`/competition/${comp.id}`)} className="block w-full">
                                            <button className="w-full h-14 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-accent hover:text-white transition-all duration-300 group/btn shadow-xl active:scale-[0.98]">
                                                View Arena <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredCompetitions.length === 0 && !loading && (
                    <div className="text-center py-32 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-neutral-700 mb-6">
                            <Trophy size={40} />
                        </div>
                        <h3 className="text-white font-black text-xl mb-2">NO ACTIVE ARENAS</h3>
                        <p className="text-neutral-500 font-medium">There are currently no competitions matching your selection.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitionsPage;
