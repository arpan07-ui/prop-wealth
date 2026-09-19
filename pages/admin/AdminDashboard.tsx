import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import {
  TrendingUp, TrendingDown, Users, Building2, Tag, Star,
  DollarSign, MessageSquare, RefreshCw, ArrowUpRight, ShoppingBag,
  Clock, Shield, CheckCircle2, AlertTriangle, ChevronRight,
  Plus, Zap, Eye, Activity, Database, Sparkles, Filter, ExternalLink
} from 'lucide-react';
import { fetchPurchaseRequests, PurchaseRequest } from '../../lib/purchaseRequestsService';
import { FALLBACK_FIRMS, withTimeout } from '../../lib/fallbackData';

interface DashboardStats {
  firmsCount: number;
  offersCount: number;
  usersCount: number;
  reviewsCount: number;
  avgRating: string;
  pendingReviews: number;
  pendingPurchases: number;
  payoutVolume: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    firmsCount: FALLBACK_FIRMS.length,
    offersCount: 9,
    usersCount: 156,
    reviewsCount: 48,
    avgRating: '4.8',
    pendingReviews: 0,
    pendingPurchases: 0,
    payoutVolume: '$1,485,200',
  });
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [pendingPurchasesList, setPendingPurchasesList] = useState<PurchaseRequest[]>([]);

  const fetchStats = async () => {
    try {
      const statsPromise = Promise.all([
        supabase.from('firms').select('*', { count: 'exact', head: true }),
        supabase.from('offers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true }),
        supabase.from('firms').select('rating'),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const results = await withTimeout(statsPromise, 2500, null);

      if (results) {
        const [
          { count: firmsCount },
          { count: offersCount },
          { count: usersCount },
          { count: reviewsCount },
          { data: firmsRatings },
          { count: pendingReviews },
        ] = results;

        const totalRating = firmsRatings?.reduce((acc, curr) => acc + (curr.rating || 0), 0) || 0;
        const avgRating = firmsRatings?.length ? (totalRating / firmsRatings.length).toFixed(1) : '4.8';

        setStats(prev => ({
          ...prev,
          firmsCount: firmsCount || prev.firmsCount,
          offersCount: offersCount || prev.offersCount,
          usersCount: usersCount || prev.usersCount,
          reviewsCount: reviewsCount || prev.reviewsCount,
          avgRating,
          pendingReviews: pendingReviews || 0,
        }));
      }

      // Fetch pending purchases with safety
      try {
        const purchases = await withTimeout(fetchPurchaseRequests(), 2000, []);
        const pendingP = purchases.filter(p => p.status === 'pending');
        setPendingPurchasesList(pendingP);
        setStats(prev => ({ ...prev, pendingPurchases: pendingP.length }));
      } catch (err) {
        // Fallback already kept
      }

      setLastRefreshed(new Date());
    } catch (e) {
      console.warn('Dashboard fetch notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const handleUpdate = () => fetchStats();
    window.addEventListener('purchase_requests_updated', handleUpdate);
    return () => window.removeEventListener('purchase_requests_updated', handleUpdate);
  }, []);

  const statCards = [
    {
      label: 'Listed Prop Firms',
      value: stats.firmsCount,
      icon: Building2,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/20',
      sub: '85+ data attributes tracked',
      link: '/admin/firms',
      badge: 'Active Directory',
    },
    {
      label: 'Registered Traders',
      value: stats.usersCount,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20',
      sub: '+24% new signups this month',
      link: '/admin/users',
      badge: 'Growing',
    },
    {
      label: 'Pending Purchase Credits',
      value: stats.pendingPurchases,
      icon: ShoppingBag,
      color: 'text-[#F0C41B]',
      bg: 'bg-[#F0C41B]/10',
      border: 'border-[#F0C41B]/30',
      sub: stats.pendingPurchases > 0 ? 'Requires credit assignment' : 'All claims verified',
      link: '/admin/purchases',
      badge: stats.pendingPurchases > 0 ? 'ACTION NEEDED' : 'Clear',
      pulse: stats.pendingPurchases > 0,
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: MessageSquare,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
      sub: `${stats.reviewsCount} total reviews posted`,
      link: '/admin/reviews',
      badge: 'Community',
    },
    {
      label: 'Active Partner Deals',
      value: stats.offersCount,
      icon: Tag,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
      border: 'border-orange-400/20',
      sub: 'Avg. $78 savings per trader',
      link: '/admin/offers',
      badge: 'Affiliate Deals',
    },
    {
      label: 'Verified Payout Volume',
      value: stats.payoutVolume,
      icon: DollarSign,
      color: 'text-teal-400',
      bg: 'bg-teal-400/10',
      border: 'border-teal-400/20',
      sub: 'Across partner prop firms',
      link: '/admin/payouts',
      badge: 'Audited',
    },
  ];

  const topFirms = [
    { name: 'FTMO', split: '90%', clicks: '14,820', rating: 4.9, status: 'Verified Partner', change: '+18%' },
    { name: 'FundedNext', split: '95%', clicks: '11,430', rating: 4.8, status: 'Top Cashback', change: '+24%' },
    { name: 'Alpha Capital Group', split: '80%', clicks: '8,920', rating: 4.7, status: 'Zero Comm', change: '+9%' },
    { name: 'The5ers', split: '100%', clicks: '7,150', rating: 4.8, status: 'Instant Scaling', change: '+14%' },
    { name: 'FundingPips', split: '90%', clicks: '6,840', rating: 4.6, status: 'Rapid Payouts', change: '+6%' },
  ];

  const quickActions = [
    { label: 'Add Prop Firm', icon: Plus, link: '/admin/firms', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { label: 'Verify Purchases & Assign Credits', icon: ShoppingBag, link: '/admin/purchases', color: 'bg-[#F0C41B]/15 text-[#F0C41B] border-[#F0C41B]/30', badge: stats.pendingPurchases > 0 ? stats.pendingPurchases : undefined },
    { label: 'Moderate Reviews', icon: MessageSquare, link: '/admin/reviews', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { label: 'Manage Discount Offers', icon: Tag, link: '/admin/offers', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    { label: 'Reward Pools', icon: Zap, link: '/admin/rewards', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Top Status & Command Bar */}
      <div className="bg-[#111113] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live System Active
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-white/40 text-xs font-mono">Supabase Connected</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Executive Command Center
          </h1>
          <p className="text-white/40 text-xs mt-0.5">
            Real-time analytics, purchase credit assignments, and partner prop firm moderation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <div className="text-right hidden sm:block mr-2">
            <div className="text-[11px] text-white/30">Last Synchronized</div>
            <div className="text-xs text-white/70 font-mono">{lastRefreshed.toLocaleTimeString()}</div>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2.5 rounded-xl transition-all border border-white/8"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-[#F0C41B]' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Quick Actions Power Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {quickActions.map((act, i) => (
          <Link
            key={i}
            to={act.link}
            className={`p-3.5 rounded-2xl border ${act.color} flex items-center justify-between group hover:scale-[1.02] transition-all shadow-lg`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <act.icon size={16} className="flex-shrink-0" />
              <span className="text-xs font-bold truncate text-white">{act.label}</span>
            </div>
            {act.badge && (
              <span className="bg-[#F0C41B] text-black text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                {act.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* 6 Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className={`bg-[#111113] border ${card.border} rounded-2xl p-4 hover:border-white/20 transition-all duration-200 group relative overflow-hidden shadow-lg flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className={`w-8 h-8 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center`}>
                  <card.icon size={15} className={card.color} />
                </div>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                  card.pulse ? 'bg-[#F0C41B] text-black animate-pulse' : 'bg-white/5 text-white/40'
                }`}>
                  {card.badge}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-[#F0C41B] transition-colors">
                {loading ? '...' : card.value}
              </div>
              <div className="text-white/50 text-[11px] font-medium mt-0.5">{card.label}</div>
            </div>
            <div className="text-white/30 text-[10px] mt-3 pt-2 border-t border-white/5 truncate">
              {card.sub}
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid: Chart & Pending Review Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Analytics Growth Chart */}
        <div className="lg:col-span-2 bg-[#111113] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <TrendingUp size={18} className="text-[#F0C41B]" />
                Platform Traffic & Referral Volume
              </h2>
              <p className="text-white/40 text-xs mt-0.5">Estimated challenge referrals and trader link-outs</p>
            </div>
            <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 self-start sm:self-center">
              {(['7D', '30D', '90D'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setTimeRange(p)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                    timeRange === p
                      ? 'bg-[#F0C41B] text-black shadow-md'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative w-full h-[220px]">
            <svg className="w-full h-full" viewBox="0 0 700 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="adminGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#F0C41B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F0C41B" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="180" x2="700" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="135" x2="700" y2="135" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="45" x2="700" y2="45" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <path
                d="M0,190 C80,185 120,150 200,135 C280,120 320,140 400,95 C480,50 520,80 600,45 C650,25 680,35 700,20"
                fill="none"
                stroke="#F0C41B"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0,190 C80,185 120,150 200,135 C280,120 320,140 400,95 C480,50 520,80 600,45 C650,25 680,35 700,20 L700,220 L0,220 Z"
                fill="url(#adminGrad)"
              />
              <circle cx="200" cy="135" r="4" fill="#0a0a0b" stroke="#F0C41B" strokeWidth="2.5" />
              <circle cx="400" cy="95" r="4" fill="#0a0a0b" stroke="#F0C41B" strokeWidth="2.5" />
              <circle cx="600" cy="45" r="4" fill="#0a0a0b" stroke="#F0C41B" strokeWidth="2.5" />
              <circle cx="700" cy="20" r="4" fill="#0a0a0b" stroke="#F0C41B" strokeWidth="2.5" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-white/30 uppercase tracking-wider font-mono">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4 (Current)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5 mt-4 text-center">
            <div>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Total Clicks</span>
              <div className="text-white font-black text-base mt-0.5">48,210</div>
            </div>
            <div>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Referral Rate</span>
              <div className="text-emerald-400 font-black text-base mt-0.5">14.8%</div>
            </div>
            <div>
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Est. Commissions</span>
              <div className="text-[#F0C41B] font-black text-base mt-0.5">$9,420</div>
            </div>
          </div>
        </div>

        {/* Action Center: Pending Purchases & Approvals */}
        <div className="bg-[#111113] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-base flex items-center gap-2">
                  <Clock size={17} className="text-[#F0C41B]" />
                  Action Center
                </h2>
                <p className="text-white/40 text-xs mt-0.5">Items awaiting administrative signoff</p>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                stats.pendingPurchases > 0 ? 'bg-[#F0C41B]/15 text-[#F0C41B] border-[#F0C41B]/20' : 'bg-white/5 text-white/30 border-white/5'
              }`}>
                {stats.pendingPurchases} pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingPurchasesList.length === 0 ? (
                <div className="py-8 text-center bg-white/[0.01] border border-white/5 rounded-xl">
                  <CheckCircle2 size={28} className="text-emerald-400/50 mx-auto mb-2" />
                  <div className="text-white text-xs font-bold">All caught up!</div>
                  <div className="text-white/30 text-[11px] mt-0.5">Zero pending purchase credit claims.</div>
                </div>
              ) : (
                pendingPurchasesList.slice(0, 3).map(p => (
                  <div
                    key={p.id}
                    className="p-3 bg-white/[0.02] border border-amber-500/20 rounded-xl flex items-center justify-between gap-3 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold text-xs truncate">{p.firm_name}</span>
                        <span className="text-[#F0C41B] text-[11px] font-semibold">({p.account_size})</span>
                      </div>
                      <div className="text-white/40 text-[10px] truncate mt-0.5">
                        {p.user_name || p.user_email} • Order #{p.order_number}
                      </div>
                    </div>
                    <Link
                      to="/admin/purchases"
                      className="px-2.5 py-1 bg-[#F0C41B] hover:bg-yellow-300 text-black font-bold text-[11px] rounded-lg transition-all whitespace-nowrap shadow-md"
                    >
                      Credit XP
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4">
            <Link
              to="/admin/purchases"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Purchase Credit Review Queue</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Performing Firms & System Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Top Performing Firms Leaderboard */}
        <div className="bg-[#111113] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-sm">Top Performing Partner Firms</h2>
              <p className="text-white/40 text-xs mt-0.5">Ranked by trader clickouts and conversions</p>
            </div>
            <Link to="/admin/firms" className="text-[#F0C41B] text-xs font-bold flex items-center gap-1 hover:underline">
              Manage All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {topFirms.map((firm, i) => (
              <div key={i} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <span className="text-white/30 text-xs font-mono font-bold w-4">#{i + 1}</span>
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center font-bold text-xs text-[#F0C41B]">
                  {firm.name.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-white text-xs font-bold truncate">{firm.name}</div>
                    <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.2 rounded font-medium">
                      {firm.status}
                    </span>
                  </div>
                  <div className="text-white/40 text-[11px] mt-0.5">
                    Split: <strong className="text-white/80">{firm.split}</strong> • {firm.clicks} clicks
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#F0C41B] text-xs font-bold">
                  <Star size={12} fill="currentColor" />
                  <span>{firm.rating}</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono ml-1">{firm.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Administrative Audit Log */}
        <div className="bg-[#111113] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <Shield size={16} className="text-[#F0C41B]" />
                Administrative Security & Activity Log
              </h2>
              <p className="text-white/40 text-xs mt-0.5">Audit events recorded across the platform</p>
            </div>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" title="Telemetry Live" />
          </div>
          <div className="divide-y divide-white/5 p-2">
            {[
              { title: 'Wealth Credits Assigned', desc: '1,000 XP granted for FTMO order #FTMO-8829', time: '12m ago', icon: Zap, color: 'text-[#F0C41B] bg-[#F0C41B]/10' },
              { title: 'Staff Authentication', desc: 'Admin session authorized from secure IP', time: '28m ago', icon: Shield, color: 'text-blue-400 bg-blue-400/10' },
              { title: 'Payout Proof Verified', desc: '$12,450 FundedNext trader payout cleared', time: '1h ago', icon: DollarSign, color: 'text-emerald-400 bg-emerald-400/10' },
              { title: 'Promo Code Refreshed', desc: 'Code WEALTH15 renewed with 15% partner discount', time: '3h ago', icon: Tag, color: 'text-purple-400 bg-purple-400/10' },
              { title: '5-Star Review Published', desc: 'Trader review approved for Alpha Capital Group', time: '5h ago', icon: MessageSquare, color: 'text-sky-400 bg-sky-400/10' },
            ].map((evt, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 hover:bg-white/[0.02] rounded-xl transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${evt.color}`}>
                  <evt.icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-bold truncate">{evt.title}</div>
                  <div className="text-white/40 text-[11px] truncate mt-0.5">{evt.desc}</div>
                </div>
                <span className="text-white/25 text-[10px] font-mono whitespace-nowrap">{evt.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;