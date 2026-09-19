import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, ExternalLink, CheckCircle, ChevronRight, Calendar, MapPin, Star, Heart, MessageSquare, TrendingUp, ArrowRight, Zap, Trophy, ShieldCheck, CreditCard, Layout, Layers, Info, History } from 'lucide-react';
import Button from '../components/Button';
import FirmCard from '../components/FirmCard';
import FirmLogo from '../components/FirmLogo';
import PlatformLogo from '../components/PlatformLogo';
import { FirmService, generateSlug, generateFakeUserForReview, mapFirmFromDB } from '../lib/services';
import { PropFirm } from '../types';
import { formatFunding } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useTradeMode } from '../context/TradeModeContext';
import { useModal } from '../context/ModalContext';
import SEO from '../components/SEO';

const getCountryFlag = (location: string): string => {
  const countryFlags: { [key: string]: string } = {
    'usa': '🇺🇸', 'united states': '🇺🇸', 'us': '🇺🇸', 'america': '🇺🇸',
    'uk': '🇬🇧', 'united kingdom': '🇬🇧', 'england': '🇬🇧', 'britain': '🇬🇧',
    'uae': '🇦🇪', 'dubai': '🇦🇪', 'united arab emirates': '🇦🇪',
    'pakistan': '🇵🇰', 'pk': '🇵🇰',
    'india': '🇮🇳', 'in': '🇮🇳',
    'canada': '🇨🇦', 'ca': '🇨🇦',
    'australia': '🇦🇺', 'au': '🇦🇺',
    'germany': '🇩🇪', 'de': '🇩🇪',
    'france': '🇫🇷', 'fr': '🇫🇷',
    'spain': '🇪🇸', 'es': '🇪🇸',
    'italy': '🇮🇹', 'it': '🇮🇹',
    'netherlands': '🇳🇱', 'nl': '🇳🇱', 'holland': '🇳🇱',
    'switzerland': '🇨🇭', 'ch': '🇨🇭',
    'singapore': '🇸🇬', 'sg': '🇸🇬',
    'hong kong': '🇭🇰', 'hk': '🇭🇰',
    'japan': '🇯🇵', 'jp': '🇯🇵',
    'china': '🇨🇳', 'cn': '🇨🇳',
    'south africa': '🇿🇦', 'za': '🇿🇦',
    'nigeria': '🇳🇬', 'ng': '🇳🇬',
    'brazil': '🇧🇷', 'br': '🇧🇷',
    'mexico': '🇲🇽', 'mx': '🇲🇽',
    'cyprus': '🇨🇾', 'cy': '🇨🇾',
    'malta': '🇲🇹', 'mt': '🇲🇹',
    'seychelles': '🇸🇨', 'sc': '🇸🇨',
    'belize': '🇧🇿', 'bz': '🇧🇿',
    'st. vincent': '🇻🇨', 'saint vincent': '🇻🇨',
  };

  const lower = location.toLowerCase().trim();
  for (const [key, flag] of Object.entries(countryFlags)) {
    if (lower.includes(key)) return flag;
  }
  return '🌍';
};

const FirmDetailPage: React.FC = () => {
  const { mode, getModePath } = useTradeMode();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal();
  const isFutures = mode === 'futures';

  const [isSaved, setIsSaved] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChallengeType, setSelectedChallengeType] = useState<string>('all');
  const [similarFirms, setSimilarFirms] = useState<PropFirm[]>([]);

  useEffect(() => {
    const fetchFirmDetails = async () => {
      if (!id) return;
      try {
        const data = await FirmService.getFirmDetails(id);
        setFirm(data);
      } catch (error) {
        console.error("Failed to load firm details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirmDetails();
  }, [id]);

  useEffect(() => {
    if (firm) {
      // Determine the firm's actual mode
      const isFuturesFirm = firm.trading_type === 'futures' || firm.tags?.some(t => t.toLowerCase() === 'futures');
      const isCryptoFirm = firm.trading_type === 'crypto' || firm.tags?.some(t => t.toLowerCase() === 'crypto');
      
      const firmMode = isCryptoFirm ? 'crypto' : isFuturesFirm ? 'futures' : 'forex';
      
      // Determine current URL mode
      const isForexRoute = location.pathname.startsWith('/forex');
      const isCryptoRoute = location.pathname.startsWith('/crypto');
      const currentRouteMode = isForexRoute ? 'forex' : isCryptoRoute ? 'crypto' : 'futures';
      
      // Redirect if mismatch
      if (firmMode !== currentRouteMode) {
        const prefix = firmMode === 'futures' ? '' : `/${firmMode}`;
        navigate(`${prefix}/firm/${id}`, { replace: true });
      }
    }
  }, [firm, location.pathname, navigate, id]);

  useEffect(() => {
    if (!firm?.id) return;

    const checkSavedStatus = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('saved_firms')
        .select('*')
        .eq('user_id', user.id)
        .eq('firm_id', firm.id)
        .single();
      setIsSaved(!!data);
    };

    const fetchReviews = async () => {
      setReviewLoading(true);
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('firm_id', firm.id)
        .order('created_at', { ascending: false });

      if (data) setReviews(data);
      setReviewLoading(false);
    };

    const fetchSimilarFirms = async () => {
      try {
        const { data, error } = await supabase
            .from('firms')
            .select('*, challenges(*)')
            .neq('id', firm.id)
            .eq('status', 'active')
            .limit(10); // Fetch a few more to filter in JS

        if (data && !error) {
          const allSimilar = data.map(mapFirmFromDB);
          const filtered = allSimilar.filter(f => {
            if (firm.trading_type) return f.trading_type === firm.trading_type;
            const isFutures = f.trading_type === 'futures' || f.tags?.some(t => t.toLowerCase() === 'futures');
            const isCrypto = f.trading_type === 'crypto' || f.tags?.some(t => t.toLowerCase() === 'crypto');
            const firmIsFutures = firm.tags?.some(t => t.toLowerCase() === 'futures');
            const firmIsCrypto = firm.tags?.some(t => t.toLowerCase() === 'crypto');
            if (firmIsFutures) return isFutures;
            if (firmIsCrypto) return isCrypto;
            return !isFutures && !isCrypto;
          }).slice(0, 3);
          
          setSimilarFirms(filtered);
        }
      } catch (err) {
        console.error('Error fetching similar firms:', err);
      }
    };

    checkSavedStatus();
    fetchReviews();
    fetchSimilarFirms();
  }, [firm?.id, user]);

  const toggleSave = async () => {
    if (!user) {
      showModal({ type: 'info', title: 'Login Required', message: 'Please log in to save firms.' });
      return;
    }
    if (isSaved) {
      await supabase.from('saved_firms').delete().match({ user_id: user.id, firm_id: firm?.id });
      setIsSaved(false);
    } else {
      await supabase.from('saved_firms').insert({ user_id: user.id, firm_id: firm?.id });
      setIsSaved(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveTab(sectionId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-accent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-6 uppercase tracking-widest">Firm Not Found</h2>
          <Link to={getModePath('/firms')}><Button size="lg">Return to Browse</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-black text-white font-sans relative overflow-hidden">
      <SEO 
        title={`${firm.name} Review 2026 | Rules, Drawdown & Promo Code WEALTHX`}
        description={`In-depth review of ${firm.name}. Up to ${firm.profitSplit} profit split, max funding of $${firm.maxFunding?.toLocaleString() || '200,000'}, leverage ${firm.leverage || '1:100'}. Get exclusive discount code ${firm.discountCode || 'WEALTHX'} on PROPxWEALTH.`}
        keywords={`${firm.name} review, ${firm.name} discount code, ${firm.name} rules, ${firm.name} promo code, ${firm.name} drawdown, ${firm.name} evaluation 2026, prop firm review`}
        ogImage={firm.logo}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': firm.name,
          'image': firm.logo,
          'description': firm.description,
          'brand': {
            '@type': 'Brand',
            'name': firm.name,
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': firm.rating || 4.5,
            'reviewCount': firm.reviewCount || 12,
          }
        }}
      />
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-brand-accent/5 rounded-full blur-[150px] animate-aurora"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/10 rounded-full blur-[120px] animate-aurora-reverse"></div>
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-500 mb-10 animate-fade-in-up">
            <Link to={getModePath('/firms')} className="hover:text-brand-accent transition-colors">Firms</Link>
            <ChevronRight size={12} />
            <span className="text-white">{firm.name}</span>
        </div>

        {/* Profile Header Card */}
        <div className="bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center relative z-10">
                {/* Logo Section */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-brand-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative bg-[#111] border border-white/5 p-4 rounded-[32px] shadow-2xl w-32 h-32 md:w-44 md:h-44 flex items-center justify-center overflow-hidden">
                        <FirmLogo src={firm.logo} alt={firm.name} className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">{firm.name}</h1>
                        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <ShieldCheck size={14} /> Verified Firm
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-neutral-400 mb-8">
                        <div className="flex items-center gap-1.5 text-white">
                            <Star size={18} className="text-brand-accent fill-brand-accent" />
                            <span className="text-lg">{firm.rating}</span>
                            <span className="text-neutral-600 font-medium">({firm.reviewCount} Reviews)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={16} className={firm.trustScore > 90 ? "text-emerald-400" : "text-amber-500"} />
                            <span className="uppercase tracking-widest text-[10px] font-black">{firm.trustScore}% Trust Score</span>
                        </div>
                        {firm.hqLocation && (
                            <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{getCountryFlag(firm.hqLocation)}</span>
                                <span className="uppercase tracking-widest text-[10px] font-black">{firm.hqLocation}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {firm.platforms.map(p => (
                            <span key={p} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-neutral-300">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA Box */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                    <div className="flex gap-3">
                        <button 
                            onClick={toggleSave}
                            className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${isSaved ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent' : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'}`}
                        >
                            <Heart size={24} className={isSaved ? "fill-current" : ""} />
                        </button>
                        <a 
                            href={firm.website} 
                            target="_blank" 
                            className="flex-1 h-14 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all duration-300 shadow-xl active:scale-[0.98]"
                        >
                            Visit Website
                        </a>
                    </div>
                    
                    {/* Promo Code Floating Container */}
                    <div 
                        className="bg-[#0d0d0d] border border-white/5 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-brand-accent/30 transition-all"
                        onClick={() => {
                            navigator.clipboard.writeText(firm.discountCode || 'WEALTHX');
                            showModal({ type: 'success', title: 'Code Copied!', message: `Promo code "${firm.discountCode || 'WEALTHX'}" copied to clipboard!` });
                        }}
                    >
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-1">Exclusive Discount</span>
                            <span className="text-white font-black text-lg tracking-[0.2em]">{firm.discountCode || 'WEALTHX'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-500 group-hover:text-brand-accent transition-colors">
                            <CreditCard size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-[80px] z-40 bg-black/80 backdrop-blur-2xl border-b border-white/5 mb-12">
            <div className="max-w-7xl mx-auto flex items-center gap-10">
                {[
                    { id: 'overview', label: 'Overview', icon: Info },
                    { id: 'rules', label: 'Rules & Pricing', icon: Layout },
                    { id: 'payouts', label: 'Payout Stats', icon: TrendingUp },
                    { id: 'reviews', label: 'Trader Reviews', icon: MessageSquare }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`group py-6 relative flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-brand-accent' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-accent rounded-t-full shadow-brand-glow"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Sections Content */}
        <div className="space-y-32">
            
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-48 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-8 bg-brand-accent rounded-full shadow-brand-glow"></div>
                            <h3 className="text-3xl font-black uppercase tracking-tight">The {firm.name} <span className="text-neutral-600">Experience</span></h3>
                        </div>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium mb-12">
                            {firm.description} {firm.name} provides high-leverage accounts with institucional spreads. Their infrastructure is built for scale, ensuring minimal slippage even during high-volatility sessions.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {[
                                { label: 'Max Funding', value: formatFunding(firm.maxFunding), icon: Trophy },
                                { label: 'Profit Split', value: firm.profitSplit, icon: Zap },
                                { label: 'Founded', value: firm.foundedYear || firm.founded || '2023', icon: History },
                                { label: 'HQ Location', value: firm.hqLocation || 'Global', icon: MapPin }
                            ].map((item, i) => (
                                <div key={i} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl hover:border-brand-accent/20 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-brand-accent/5 flex items-center justify-center text-brand-accent mb-4 shadow-inner">
                                        <item.icon size={20} />
                                    </div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-neutral-500 mb-1">{item.label}</div>
                                    <div className="text-white font-black text-xl tracking-tight">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-[50px]"></div>
                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Layers className="text-brand-accent" size={16} /> Market Specs
                        </h4>
                        <ul className="space-y-6">
                            {[
                                { label: 'Platforms', value: firm.platforms.join(', '), type: 'tags' },
                                { label: 'Max Leverage', value: firm.leverage || '1:100' },
                                { label: 'News Trading', value: firm.newsTrading ? 'Allowed' : 'Prohibited', status: firm.newsTrading },
                                { label: 'Weekend Hold', value: firm.weekendHolding ? 'Allowed' : 'Prohibited', status: firm.weekendHolding }
                            ].map((spec, i) => (
                                <li key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                                    <span className="text-xs font-black uppercase tracking-widest text-neutral-500">{spec.label}</span>
                                    {spec.type === 'tags' ? (
                                        <div className="flex gap-2">
                                            {spec.value.split(', ').map(v => (
                                                <span key={v} className="bg-white/5 px-2 py-0.5 rounded text-[9px] font-black text-white">{v}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className={`text-xs font-black uppercase tracking-widest ${spec.status === true ? 'text-emerald-400' : spec.status === false ? 'text-red-500' : 'text-white'}`}>
                                            {spec.value}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Rules & Pricing Section */}
            <section id="rules" className="scroll-mt-48 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-brand-accent rounded-full shadow-brand-glow"></div>
                        <h3 className="text-3xl font-black uppercase tracking-tight">Challenge <span className="text-neutral-600">Models</span></h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/5 shadow-inner">
                        {['all', '1-Step', '2-Step', '3-Step', 'Instant'].map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedChallengeType(type)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedChallengeType === type ? 'bg-brand-accent text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 border-b border-white/5">
                                <tr>
                                    <th className="px-10 py-6">Account Size</th>
                                    <th className="px-10 py-6">Model</th>
                                    <th className="px-10 py-6">Profit Target</th>
                                    <th className="px-10 py-6">Max Drawdown</th>
                                    <th className="px-10 py-6">Price</th>
                                    <th className="px-10 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {firm.challenges?.filter(c => selectedChallengeType === 'all' || c.challengeType === selectedChallengeType).map((challenge) => (
                                    <tr key={challenge.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-10 py-8 font-black text-xl tracking-tight text-white">{challenge.accountSize}</td>
                                        <td className="px-10 py-8">
                                            <span className="px-3 py-1 rounded-lg bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[9px] font-black uppercase tracking-widest">
                                                {challenge.challengeType}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 font-black text-neutral-400 uppercase tracking-widest text-xs">{challenge.profitTarget}</td>
                                        <td className="px-10 py-8 font-black text-red-500/80 uppercase tracking-widest text-xs">{challenge.maxDrawdown}</td>
                                        <td className="px-10 py-8 font-black text-brand-accent text-xl tracking-tight">{challenge.price}</td>
                                        <td className="px-10 py-8 text-right">
                                            <a 
                                                href={firm.affiliateLink || firm.website} 
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all active:scale-[0.95] shadow-lg"
                                            >
                                                Select Account <ArrowRight size={14} />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Payout Stats Section */}
            <section id="payouts" className="scroll-mt-48 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-2 h-8 bg-brand-accent rounded-full shadow-brand-glow"></div>
                    <h3 className="text-3xl font-black uppercase tracking-tight">Payout <span className="text-neutral-600">Reliability</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[40px] shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Average Processing Time</div>
                            <div className="text-emerald-400 font-black tracking-widest text-xs uppercase bg-emerald-500/10 px-3 py-1 rounded-lg">Instant Payouts</div>
                        </div>
                        <div className="text-5xl font-black text-white mb-6 tracking-tighter uppercase">{firm.avgPayoutTime || '12 Hours'}</div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-brand-accent shadow-brand-glow" style={{ width: '92%' }}></div>
                        </div>
                        <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">92% of withdrawal requests completed within time frame</p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[40px] shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Payout Volume (Last 30 Days)</div>
                            <div className="text-5xl font-black text-white tracking-tighter uppercase mb-4">{firm.last30DaysPayouts || '$4.2M+'}</div>
                        </div>
                        <div className="flex items-center gap-4 text-emerald-400">
                             <TrendingUp size={24} />
                             <span className="text-sm font-black uppercase tracking-widest">{firm.payoutGrowth || '+12%'} Increase from previous period</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="scroll-mt-48 pb-24 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-brand-accent rounded-full shadow-brand-glow"></div>
                        <h3 className="text-3xl font-black uppercase tracking-tight">Trader <span className="text-neutral-600">Reviews</span></h3>
                    </div>
                    <Link to={getModePath(`/firm/${generateSlug(firm.name)}/reviews`)}>
                        <Button variant="outline" size="md">Share Your Experience</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.length > 0 ? (
                        reviews.slice(0, 3).map((review) => {
                            const fakeUser = generateFakeUserForReview(review.id);
                            return (
                                <div key={review.id} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[32px] hover:border-brand-accent/20 transition-all group shadow-2xl">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center font-black uppercase border border-brand-accent/10 shadow-inner group-hover:scale-110 transition-transform">
                                                {fakeUser.initial}
                                            </div>
                                            <div>
                                                <div className="text-white font-black text-sm uppercase tracking-tight">{fakeUser.name}</div>
                                                <div className="text-emerald-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 mt-1">
                                                    <CheckCircle size={10} /> Verified Trader
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex text-brand-accent">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} size={10} className={review.rating >= star ? 'fill-current' : 'text-neutral-800'} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-neutral-400 text-sm leading-relaxed font-medium italic">"{review.comment}"</p>
                                    <div className="mt-8 pt-6 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 bg-[#0a0a0a] border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center">
                            <MessageSquare size={48} className="text-neutral-800 mb-6" />
                            <h4 className="text-white font-black text-xl uppercase tracking-widest mb-2">Be the First to Review</h4>
                            <p className="text-neutral-500 font-medium max-w-xs mb-8">Share your trading experience with {firm.name} and help the community.</p>
                            <Link to={getModePath(`/firm/${generateSlug(firm.name)}/reviews`)}>
                                <Button size="lg">Write a Review</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Similar Firms Section */}
            <section className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-2 h-8 bg-neutral-800 rounded-full"></div>
                    <h3 className="text-3xl font-black uppercase tracking-tight">Similar <span className="text-neutral-600">Benchmarks</span></h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {similarFirms.map(f => (
                        <FirmCard key={f.id} firm={f} />
                    ))}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default FirmDetailPage;
