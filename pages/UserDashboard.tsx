import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Heart, MessageSquare, Award, Gift,
  Settings, LogOut, Star, ArrowUpRight, Zap, Users, BookOpen,
  TrendingUp, Copy, Check, Shield, Edit2, Loader2, Activity,
  ShoppingBag, Ticket, Receipt, Trophy, Plus, RefreshCw,
  ExternalLink, CheckCircle2, ChevronRight, AlertCircle, Trash2,
  Wallet, DollarSign, X, Filter, Sparkles, Send, Clock, XCircle,
  FileText, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  fetchPurchaseRequests,
  submitPurchaseRequest,
  calculateEstimatedCredits,
  PurchaseRequest
} from '../lib/purchaseRequestsService';

// Navigation matching Tradzu + PropMatchSpot
const NAV_ITEMS = [
  { id: 'overview',        icon: LayoutDashboard, label: 'Dashboard'       },
  { id: 'broker_accounts', icon: Activity,        label: 'Broker Accounts' },
  { id: 'purchases',       icon: ShoppingBag,     label: 'Purchases'       },
  { id: 'redemptions',     icon: Ticket,          label: 'Redemptions'     },
  { id: 'rewards',         icon: Trophy,          label: 'Reward Pools'    },
  { id: 'saved',           icon: Heart,           label: 'Saved Firms'     },
  { id: 'reviews',         icon: MessageSquare,   label: 'My Reviews'      },
  { id: 'achievements',    icon: Award,           label: 'Achievements'    },
  { id: 'ledger',          icon: Receipt,         label: 'Ledger'          },
  { id: 'referrals',       icon: Users,           label: 'Referrals'       },
  { id: 'profile',         icon: Settings,        label: 'Profile'         },
];

const UserDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ points: 10, reviews: 0, saved: 0, referrals: 0, accounts: 0 });
  const [avatarError, setAvatarError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Safe non-blocking sync with DB
  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const syncUserData = async () => {
      setRefreshing(true);
      try {
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        const reviewsPromise = supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const savedPromise = supabase
          .from('saved_firms')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // 3.5s timeout race
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 3500)
        );

        const [profRes, revRes, savRes]: any = await Promise.race([
          Promise.allSettled([profilePromise, reviewsPromise, savedPromise]),
          timeoutPromise
        ]).catch(() => [null, null, null]);

        if (!isMounted) return;

        let currentPoints = 10;
        if (profRes && profRes.status === 'fulfilled' && profRes.value?.data) {
          setProfile(profRes.value.data);
          if (profRes.value.data.points !== undefined && profRes.value.data.points !== null) {
            currentPoints = profRes.value.data.points;
          }
        }

        const revCount = (revRes?.status === 'fulfilled' && revRes.value?.count) || 0;
        const savCount = (savRes?.status === 'fulfilled' && savRes.value?.count) || 0;

        const localSaved = JSON.parse(localStorage.getItem('pms_saved_firms') || '[]');
        const finalSaved = Math.max(savCount, localSaved.length);

        setStats(prev => ({
          ...prev,
          points: currentPoints,
          reviews: revCount,
          saved: finalSaved,
        }));
      } catch (err) {
        console.warn('Non-critical sync notice:', err);
      } finally {
        if (isMounted) setRefreshing(false);
      }
    };

    syncUserData();
    return () => { isMounted = false; };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  const displayEmail = profile?.email || user?.email || '';
  const rawAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || '';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-20 selection:bg-[#F0C41B] selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* SIDEBAR */}
          <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-3">
            
            {/* User Profile Card */}
            <div className="bg-[#111113] border border-white/8 rounded-2xl p-4 relative overflow-hidden shadow-xl shadow-black/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F0C41B]/15 border border-[#F0C41B]/30 flex items-center justify-center font-black text-lg text-[#F0C41B] flex-shrink-0 shadow-inner">
                  {rawAvatar && !avatarError ? (
                    <img
                      src={rawAvatar}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white text-sm font-bold truncate flex items-center gap-1.5">
                    {displayName}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Online" />
                  </div>
                  <div className="text-white/40 text-[11px] truncate">{displayEmail}</div>
                </div>
              </div>

              {/* Trader Level & XP Progress */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="text-white/50 font-medium">Level 1 Trader</span>
                  <span className="text-[#F0C41B] font-bold">{stats.points} XP</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F0C41B] to-yellow-300 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.points / 1000) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-white/30 text-right mt-1">
                  {Math.max(0, 1000 - stats.points)} XP to Level 2
                </div>
              </div>
            </div>

            {/* Menu Navigation Card */}
            <div className="bg-[#111113] border border-white/8 rounded-2xl p-2 shadow-xl shadow-black/40">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Menu</span>
                {refreshing && (
                  <RefreshCw size={11} className="animate-spin text-white/30" />
                )}
              </div>
              <nav className="flex flex-col gap-0.5">
                {NAV_ITEMS.map(item => {
                  const active = tab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-[#F0C41B] text-black shadow-lg shadow-[#F0C41B]/20 font-bold'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={16} className={`flex-shrink-0 ${active ? 'text-black' : 'text-white/40'}`} />
                      <span className="truncate">{item.label}</span>
                      {item.id === 'purchases' && (
                        <span className={`ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase ${active ? 'bg-black text-[#F0C41B]' : 'bg-[#F0C41B]/15 text-[#F0C41B]'}`}>
                          Earn Credits
                        </span>
                      )}
                      {item.id === 'rewards' && (
                        <span className={`ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase ${active ? 'bg-black text-[#F0C41B]' : 'bg-[#F0C41B]/15 text-[#F0C41B]'}`}>
                          Pools
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            {/* Mobile horizontal navigation */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
              {NAV_ITEMS.map(item => {
                const active = tab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                      active
                        ? 'bg-[#F0C41B] text-black shadow-md shadow-[#F0C41B]/20'
                        : 'bg-[#111113] text-white/60 border border-white/8'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB ROUTING */}
            {tab === 'overview' && (
              <OverviewTab
                stats={stats}
                user={user}
                displayName={displayName}
                onTabChange={setTab}
              />
            )}
            {tab === 'broker_accounts' && <BrokerAccountsTab stats={stats} setStats={setStats} />}
            {tab === 'purchases' && (
              <PurchasesTab
                user={user}
                displayName={displayName}
                stats={stats}
                setStats={setStats}
                onTabChange={setTab}
              />
            )}
            {tab === 'redemptions' && <RedemptionsTab stats={stats} onTabChange={setTab} />}
            {tab === 'rewards' && <RewardPoolsTab stats={stats} setStats={setStats} />}
            {tab === 'saved' && <SavedFirmsTab user={user} />}
            {tab === 'reviews' && <MyReviewsTab user={user} onTabChange={setTab} />}
            {tab === 'achievements' && <AchievementsTab stats={stats} />}
            {tab === 'ledger' && <LedgerTab stats={stats} />}
            {tab === 'referrals' && <ReferralsTab user={user} stats={stats} />}
            {tab === 'profile' && (
              <ProfileTab
                user={user}
                profile={profile}
                onProfileUpdate={(updated: any) => setProfile(updated)}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   1. OVERVIEW / DASHBOARD TAB
   ========================================================================= */
const OverviewTab = ({ stats, displayName, onTabChange }: any) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const statCards = [
    { label: 'Wealth Tokens', value: stats.points, icon: Zap, color: 'text-[#F0C41B]', bg: 'bg-[#F0C41B]/10', border: 'border-[#F0C41B]/20', badge: 'Starter Bonus', tab: 'ledger' },
    { label: 'Reviews Posted', value: stats.reviews, icon: MessageSquare, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', badge: 'Earn 100 XP', tab: 'reviews' },
    { label: 'Saved Firms', value: stats.saved, icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', badge: 'Quick Access', tab: 'saved' },
    { label: 'Active Accounts', value: stats.accounts || 0, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', badge: stats.accounts > 0 ? 'MT4/MT5 Sync' : 'Ready to Connect', tab: 'broker_accounts' },
  ];

  const quickActions = [
    { label: 'Submit Purchase for Credits', desc: 'Claim Wealth Credits for challenge orders', href: null, icon: ShoppingBag, action: () => onTabChange('purchases') },
    { label: 'Browse 85+ Firms', desc: 'Find your next verified prop firm', href: '/firms', icon: TrendingUp, action: null },
    { label: 'Connect Broker Account', desc: 'Sync MT4, MT5, or cTrader stats', href: null, icon: Activity, action: () => onTabChange('broker_accounts') },
    { label: 'Reward Pools', desc: 'Enter weekly funded account draws', href: null, icon: Trophy, action: () => onTabChange('rewards') },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative bg-[#111113] border border-white/8 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0C41B]/10 via-[#F0C41B]/5 to-transparent pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#F0C41B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F0C41B] bg-[#F0C41B]/10 border border-[#F0C41B]/20 px-3 py-1 rounded-full mb-3">
              <Sparkles size={12} />
              <span>Trader Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {greeting}, {displayName.split(' ')[0]}! 👋
            </h1>
            <p className="text-white/50 text-sm mt-1 max-w-xl leading-relaxed">
              Here is what is happening with your prop trading journey today. Track challenges, earn wealth credits on purchases, and enter reward pools.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={() => onTabChange('purchases')}
              className="bg-[#F0C41B] text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-yellow-300 transition-all flex items-center gap-2 shadow-lg shadow-[#F0C41B]/20"
            >
              <Send size={14} /> Earn Credits
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((c, i) => (
          <button
            key={i}
            onClick={() => onTabChange(c.tab)}
            className={`text-left bg-[#111113] border ${c.border} rounded-2xl p-4 sm:p-5 hover:border-white/20 transition-all relative overflow-hidden group shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${c.bg} ${c.border}`}>
                <c.icon size={18} className={c.color} />
              </div>
              <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                {c.badge}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-[#F0C41B] transition-colors">
              {c.value}
            </div>
            <div className="text-white/40 text-xs font-medium mt-1">{c.label}</div>
          </button>
        ))}
      </div>

      {/* Claim Free Audit CTA */}
      <div className="relative bg-gradient-to-r from-[#F0C41B] via-yellow-400 to-[#e5b700] rounded-2xl p-6 sm:p-7 overflow-hidden shadow-xl shadow-[#F0C41B]/10">
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none"
          style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 12px, #000 12px, #000 13px)' }}
        />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-black/20 text-black text-[10px] font-black px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
            <Zap size={12} /> Free Member Benefit
          </div>
          <h2 className="text-black text-xl sm:text-2xl font-black tracking-tight mb-2">
            Claim your free trading journal audit!
          </h2>
          <p className="text-black/80 text-xs sm:text-sm mb-4 leading-relaxed font-medium">
            You've unlocked Level 1 status. Connect your trading account to receive a personalized AI drawdown & strategy diagnostic report via Wealth AI.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/wealth-ai"
              className="bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-900 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Launch Wealth AI Audit</span>
              <ArrowUpRight size={14} />
            </Link>
            <span className="text-black/60 text-xs font-semibold">Instant verification</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-[#111113] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
            <TrendingUp size={16} className="text-[#F0C41B]" />
            Quick Actions
          </h3>
          <span className="text-white/30 text-xs">Trader Toolkit</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, i) => {
            const Content = (
              <div className="flex items-center gap-3 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#F0C41B]/30 hover:bg-[#F0C41B]/5 transition-all group">
                <div className="w-10 h-10 bg-[#F0C41B]/10 border border-[#F0C41B]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <action.icon size={18} className="text-[#F0C41B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs sm:text-sm font-bold group-hover:text-[#F0C41B] transition-colors">
                    {action.label}
                  </div>
                  <div className="text-white/40 text-[11px] truncate mt-0.5">{action.desc}</div>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover:text-[#F0C41B] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            );

            if (action.href) {
              return <Link key={i} to={action.href}>{Content}</Link>;
            }
            return <button key={i} onClick={action.action} className="text-left w-full">{Content}</button>;
          })}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. BROKER ACCOUNTS TAB
   ========================================================================= */
const BrokerAccountsTab = ({ stats, setStats }: any) => {
  const [accounts, setAccounts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('pms_user_broker_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ broker: 'FTMO', platform: 'MT5', accountNumber: '', server: '', readOnlyPass: '' });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    if (accounts.length === 0) {
      alert('No broker accounts connected yet. Please connect your first account!');
      return;
    }
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('All broker accounts synchronized successfully!');
    }, 1200);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accountNumber) return;
    const newAcc = {
      id: 'acc-' + Date.now(),
      broker: form.broker,
      platform: form.platform,
      accountNumber: form.accountNumber,
      server: form.server || 'Live-Server',
      balance: 50000,
      equity: 50000,
      profit: 0,
      profitPct: 0.0,
      target: 5000,
      targetPct: 0,
      dailyDrawdown: 0.0,
      maxDailyDrawdown: 5.0,
      overallDrawdown: 0.0,
      maxOverallDrawdown: 10.0,
      status: 'Active / Tracking',
      lastSync: 'Just now',
    };
    const updated = [newAcc, ...accounts];
    setAccounts(updated);
    try {
      localStorage.setItem('pms_user_broker_accounts', JSON.stringify(updated));
    } catch {}
    setStats((prev: any) => ({ ...prev, accounts: updated.length, points: prev.points + 100 }));
    setIsModalOpen(false);
    setForm({ broker: 'FTMO', platform: 'MT5', accountNumber: '', server: '', readOnlyPass: '' });
  };

  const handleDelete = (id: string) => {
    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    try {
      localStorage.setItem('pms_user_broker_accounts', JSON.stringify(updated));
    } catch {}
    setStats((prev: any) => ({ ...prev, accounts: updated.length }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-[#F0C41B]" size={20} />
            Connected Broker & Prop Accounts
          </h2>
          <p className="text-white/40 text-xs mt-1">
            Connect read-only investor credentials to automatically track equity, drawdown rules, and challenge milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {accounts.length > 0 && (
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-white/80 hover:text-white transition-all flex items-center gap-2"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#F0C41B] hover:bg-yellow-300 text-black font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#F0C41B]/20"
          >
            <Plus size={15} />
            <span>Connect Account</span>
          </button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-[#111113] border border-white/8 rounded-2xl p-10 sm:p-14 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] mx-auto mb-4">
            <Activity size={28} />
          </div>
          <h3 className="text-white font-bold text-lg mb-1.5">No Broker Accounts Connected Yet</h3>
          <p className="text-white/40 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Connect your MT4, MT5, or cTrader read-only investor credentials to automatically track equity, daily drawdown limits, and challenge milestone progress.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F0C41B] hover:bg-yellow-300 text-black font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-[#F0C41B]/20"
          >
            <Plus size={15} />
            <span>Connect Your First Account</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-[#111113] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] font-black text-sm">
                    {acc.broker.substring(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-base">{acc.broker}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        {acc.status}
                      </span>
                    </div>
                    <div className="text-white/40 text-xs mt-0.5 font-mono">
                      Acc #{acc.accountNumber} • {acc.platform} • {acc.server}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[11px] text-white/30">Synced {acc.lastSync}</span>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="text-white/30 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    title="Disconnect account"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <span className="text-[11px] text-white/40 block">Account Balance</span>
                  <span className="text-white font-bold text-lg">${acc.balance.toLocaleString()}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <span className="text-[11px] text-white/40 block">Current Equity</span>
                  <span className="text-emerald-400 font-bold text-lg">${acc.equity.toLocaleString()}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <span className="text-[11px] text-white/40 block">Total Profit</span>
                  <span className="text-[#F0C41B] font-bold text-lg">+${acc.profit.toLocaleString()} ({acc.profitPct}%)</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <span className="text-[11px] text-white/40 block">Daily Drawdown</span>
                  <span className="text-sky-400 font-bold text-lg">{acc.dailyDrawdown}% / {acc.maxDailyDrawdown}%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-white/50">Profit Target Progress</span>
                  <span className="text-[#F0C41B] font-bold">{acc.targetPct}% of ${acc.target.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F0C41B] to-emerald-400 rounded-full"
                    style={{ width: `${acc.targetPct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Activity size={18} className="text-[#F0C41B]" />
              <h3 className="text-lg font-bold text-white">Connect Broker Account</h3>
            </div>
            <p className="text-white/40 text-xs mb-4">
              Enter read-only investor credentials. We never ask for trading or master passwords.
            </p>
            <form onSubmit={handleAddAccount} className="space-y-3">
              <div>
                <label className="text-[11px] text-white/50 font-semibold block mb-1">Prop Firm / Broker</label>
                <select
                  value={form.broker}
                  onChange={e => setForm({ ...form, broker: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
                >
                  <option value="FTMO">FTMO</option>
                  <option value="FundedNext">FundedNext</option>
                  <option value="Alpha Capital Group">Alpha Capital Group</option>
                  <option value="The5%ers">The5%ers</option>
                  <option value="FundingPips">FundingPips</option>
                  <option value="Topstep">Topstep</option>
                  <option value="E8 Markets">E8 Markets</option>
                  <option value="Apex Trader Funding">Apex Trader Funding</option>
                  <option value="MyFundedFutures">MyFundedFutures</option>
                  <option value="Blue Guardian">Blue Guardian</option>
                  <option value="E8 Crypto">E8 Crypto</option>
                  <option value="Other">Other Broker / Prop Firm</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-white/50 font-semibold block mb-1">Platform</label>
                <select
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
                >
                  <option value="MT5">MetaTrader 5 (MT5)</option>
                  <option value="MT4">MetaTrader 4 (MT4)</option>
                  <option value="cTrader">cTrader</option>
                  <option value="TradeLocker">TradeLocker</option>
                  <option value="DXtrade">DXtrade</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-white/50 font-semibold block mb-1">Account Number / Login</label>
                <input
                  required
                  placeholder="e.g. 1049281"
                  value={form.accountNumber}
                  onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/50 font-semibold block mb-1">Server Name</label>
                <input
                  placeholder="e.g. FTMO-Server-02"
                  value={form.server}
                  onChange={e => setForm({ ...form, server: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/50 font-semibold block mb-1">Investor Password (Read-Only)</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={form.readOnlyPass}
                  onChange={e => setForm({ ...form, readOnlyPass: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#F0C41B] hover:bg-yellow-300 text-black font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-[#F0C41B]/20"
                >
                  Verify & Sync Account (+100 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. PURCHASES TAB - SUBMIT A PURCHASE TO EARN CREDITS (TRADZU FEATURE)
   ========================================================================= */
const PurchasesTab = ({ user, displayName, stats, setStats, onTabChange }: any) => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Form State matching screenshot
  const [firmName, setFirmName] = useState('');
  const [challengeType, setChallengeType] = useState('');
  const [accountSize, setAccountSize] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [orderNumber, setOrderNumber] = useState('');
  const [discountCode, setDiscountCode] = useState('WEALTHX');
  const [proofUrl, setProofUrl] = useState('');

  // Only prop firms, challenges, and sizes that are LIVE on our platform
  const LIVE_FIRM_DATA: Record<string, { challenges: string[]; sizes: string[] }> = {
    'FTMO': {
      challenges: ['2-Step Standard Evaluation', '1-Step Rapid Evaluation', 'Swing Account Challenge'],
      sizes: ['$10,000', '$25,000', '$50,000', '$100,000', '$200,000']
    },
    'FundedNext': {
      challenges: ['Stellar 2-Step', 'Stellar 1-Step', 'Evaluation Model', 'Express Model'],
      sizes: ['$6,000', '$15,000', '$25,000', '$50,000', '$100,000', '$200,000']
    },
    'Alpha Capital Group': {
      challenges: ['Alpha Pro 2-Step', 'Alpha Express 1-Step', 'Zero Commission Challenge'],
      sizes: ['$10,000', '$25,000', '$50,000', '$100,000', '$200,000']
    },
    'The5%ers': {
      challenges: ['High Stakes 2-Step', 'Bootcamp $250K', 'Hyper Growth Instant Funding'],
      sizes: ['$5,000', '$10,000', '$20,000', '$60,000', '$100,000', '$250,000']
    },
    'FundingPips': {
      challenges: ['Student 2-Step', 'Practitioner 1-Step', 'Master Evaluation'],
      sizes: ['$5,000', '$10,000', '$25,000', '$50,000', '$100,000']
    },
    'Topstep': {
      challenges: ['Trading Combine $50K', 'Trading Combine $100K', 'Trading Combine $150K'],
      sizes: ['$50,000', '$100,000', '$150,000']
    },
    'E8 Markets': {
      challenges: ['E8 One 1-Step', 'E8 Track 3-Step', 'E8 Classic 2-Step'],
      sizes: ['$10,000', '$25,000', '$50,000', '$100,000', '$200,000']
    },
    'Apex Trader Funding': {
      challenges: ['1-Step Evaluation'],
      sizes: ['$25,000', '$50,000', '$75,000', '$100,000', '$150,000', '$250,000', '$300,000']
    },
    'MyFundedFutures': {
      challenges: ['Starter 1-Step', 'Expert 1-Step'],
      sizes: ['$50,000', '$100,000', '$150,000']
    },
    'Blue Guardian': {
      challenges: ['Unlimited 2-Step', 'Rapid 1-Step'],
      sizes: ['$10,000', '$25,000', '$50,000', '$100,000', '$200,000']
    },
    'E8 Crypto': {
      challenges: ['Crypto Evaluation'],
      sizes: ['$10,000', '$25,000', '$50,000', '$100,000']
    }
  };

  const estimatedCredits = useMemo(() => {
    return calculateEstimatedCredits(accountSize);
  }, [accountSize]);

  // Load user's submitted requests
  const loadUserRequests = async () => {
    setLoadingList(true);
    const data = await fetchPurchaseRequests(user?.id || user?.email);
    setRequests(data);
    setLoadingList(false);
  };

  useEffect(() => {
    loadUserRequests();
    const handleUpdate = () => loadUserRequests();
    window.addEventListener('purchase_requests_updated', handleUpdate);
    return () => window.removeEventListener('purchase_requests_updated', handleUpdate);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName || !challengeType || !accountSize || !orderNumber) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const cleanOrderNumber = orderNumber.replace(/^[#\s]+/, '').trim();
      await submitPurchaseRequest({
        user_id: user?.id || 'guest',
        user_name: displayName,
        user_email: user?.email || '',
        firm_name: firmName,
        challenge_type: challengeType,
        account_size: accountSize,
        purchase_date: purchaseDate,
        order_number: cleanOrderNumber,
        discount_code: discountCode,
        proof_url: proofUrl,
        credit_amount: estimatedCredits,
      });

      setSuccessToast(true);
      setOrderNumber('');
      setProofUrl('');
      loadUserRequests();
      setTimeout(() => setSuccessToast(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Error submitting purchase request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-5 py-4 rounded-2xl flex items-center justify-between text-xs font-semibold animate-fadeIn shadow-2xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-sm text-emerald-300">Purchase Request Submitted Successfully!</div>
              <div className="text-emerald-400/80 text-xs mt-0.5">
                Our team is verifying your order. Your {estimatedCredits} Wealth Credits will be assigned directly to your balance.
              </div>
            </div>
          </div>
          <button onClick={() => setSuccessToast(false)} className="text-emerald-400 hover:text-white text-base">✕</button>
        </div>
      )}

      {/* SUBMIT A PURCHASE CARD (MATCHING USER SCREENSHOT EXACTLY WITH POWERFUL FEATURES) */}
      <div className="bg-[#111113] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header matching screenshot */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
              <Send size={16} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Submit a purchase to earn credits
            </h2>
          </div>
          <p className="text-white/40 text-xs sm:text-sm">
            Choose your prop firm, challenge, and account size. We'll verify and credit your account.
          </p>
        </div>

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Prop Firm Selector */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5">
                Prop Firm
              </label>
              <select
                required
                value={firmName}
                onChange={e => {
                  const firm = e.target.value;
                  setFirmName(firm);
                  const firstChal = LIVE_FIRM_DATA[firm]?.challenges[0] || '';
                  setChallengeType(firstChal);
                  const firstSz = LIVE_FIRM_DATA[firm]?.sizes[0] || '';
                  setAccountSize(firstSz);
                }}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-lime-400 transition-colors"
              >
                <option value="" disabled>Select a live firm</option>
                {Object.keys(LIVE_FIRM_DATA).map(firm => (
                  <option key={firm} value={firm} className="bg-[#111113] text-white">
                    {firm}
                  </option>
                ))}
              </select>
            </div>

            {/* Challenge Selector */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5">
                Challenge
              </label>
              <select
                required
                disabled={!firmName}
                value={challengeType}
                onChange={e => setChallengeType(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-lime-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {firmName ? 'Select a challenge model' : 'Select a firm first'}
                </option>
                {firmName && LIVE_FIRM_DATA[firmName]?.challenges.map(chal => (
                  <option key={chal} value={chal} className="bg-[#111113] text-white">
                    {chal}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Size Selector */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5">
                Account Size
              </label>
              <select
                required
                disabled={!challengeType}
                value={accountSize}
                onChange={e => setAccountSize(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-lime-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {challengeType ? 'Select challenge size' : 'Select a challenge first'}
                </option>
                {firmName && LIVE_FIRM_DATA[firmName]?.sizes.map(sz => (
                  <option key={sz} value={sz} className="bg-[#111113] text-white">
                    {sz} Account
                  </option>
                ))}
              </select>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-lime-400 transition-colors"
              />
            </div>
          </div>

          {/* Invoice / Order Number Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-white/70">
                Invoice / Order number <span className="text-white/40 text-[11px] font-normal">(Don't include # or other prefix characters)</span>
              </label>
              {accountSize && (
                <span className="text-xs font-bold text-lime-400 bg-lime-400/10 px-2.5 py-0.5 rounded-full border border-lime-400/20 flex items-center gap-1">
                  <Zap size={12} /> +{estimatedCredits} Wealth Credits on Approval
                </span>
              )}
            </div>
            <input
              required
              type="text"
              placeholder="e.g. order ID or invoice number"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-lime-400 transition-colors font-mono"
            />
          </div>

          {/* Optional Proof Link & Discount Code (Unique Powerful Features) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-white/50 block mb-1">
                Discount Code Used (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. WEALTHX"
                value={discountCode}
                onChange={e => setDiscountCode(e.target.value)}
                className="w-full bg-black/30 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-lime-400 uppercase font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/50 block mb-1">
                Receipt / Screenshot URL (Optional for 2x faster review)
              </label>
              <input
                type="url"
                placeholder="e.g. https://gyazo.com/... or receipt link"
                value={proofUrl}
                onChange={e => setProofUrl(e.target.value)}
                className="w-full bg-black/30 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>

          {/* Submit Button (Styled like Tradzu Lime Green / Gold) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#a3e635] hover:bg-[#8cd620] text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-lime-400/20 active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Purchase...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Purchase</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* TRACKING SECTION: MY SUBMITTED PURCHASES */}
      <div className="bg-[#111113] border border-white/8 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#F0C41B]" />
              My Purchase Claims & Credit Requests
            </h3>
            <p className="text-white/40 text-xs mt-0.5">
              Live status of your submitted challenge orders and awarded Wealth Credits
            </p>
          </div>
          <button
            onClick={loadUserRequests}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1.5 self-start sm:self-center bg-white/5 px-3 py-1.5 rounded-lg"
          >
            <RefreshCw size={12} className={loadingList ? 'animate-spin' : ''} />
            <span>Refresh Status</span>
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center">
            <ShoppingBag size={32} className="text-white/10 mx-auto mb-2" />
            <div className="text-white/50 text-xs">No purchase claims submitted yet.</div>
            <div className="text-white/30 text-[11px] mt-1">Submit your first order above to start earning Wealth Credits!</div>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map(req => {
              const isApproved = req.status === 'approved';
              const isPending = req.status === 'pending';
              const isRejected = req.status === 'rejected';

              return (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] font-black text-xs flex-shrink-0">
                        {req.firm_name?.substring(0, 2) || 'PF'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">{req.firm_name}</span>
                          <span className="text-white/60 text-xs font-semibold">({req.account_size})</span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="text-white/40 text-xs mt-1 font-mono">
                          Order #{req.order_number} • {req.challenge_type} • {req.purchase_date}
                        </div>
                        {req.admin_notes && (
                          <div className="mt-2 text-[11px] p-2 rounded-lg bg-black/30 text-white/70 border border-white/5">
                            <strong className="text-white">Admin Note:</strong> {req.admin_notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Credit Badge */}
                    <div className="self-end sm:self-center text-right">
                      <div className={`text-base font-black font-mono ${
                        isApproved ? 'text-emerald-400' : 'text-[#F0C41B]'
                      }`}>
                        +{req.credit_amount} XP
                      </div>
                      <div className="text-white/30 text-[10px]">
                        {isApproved ? 'Credited to Balance' : 'Est. Wealth Credits'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   4. REDEMPTIONS TAB
   ========================================================================= */
const RedemptionsTab = ({ stats, onTabChange }: any) => {
  const [copiedCode, setCopiedCode] = useState('');
  const [redemptions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('pms_user_redemptions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Ticket className="text-[#F0C41B]" size={20} />
            My Redemptions & Vouchers
          </h2>
          <p className="text-white/40 text-xs mt-1">
            View active vouchers, coupon codes, and perks you have claimed using your reward points.
          </p>
        </div>
        <button
          onClick={() => onTabChange('rewards')}
          className="px-4 py-2 bg-[#F0C41B] hover:bg-yellow-300 text-black font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#F0C41B]/20 self-start sm:self-center"
        >
          <Trophy size={14} />
          <span>Browse Reward Pools</span>
        </button>
      </div>

      {redemptions.length === 0 ? (
        <div className="bg-[#111113] border border-white/8 rounded-2xl p-10 sm:p-14 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] mx-auto mb-4">
            <Ticket size={28} />
          </div>
          <h3 className="text-white font-bold text-lg mb-1.5">No Vouchers or Redemptions Yet</h3>
          <p className="text-white/40 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
            You haven't claimed any vouchers yet. Earn Wealth Tokens from challenge purchases and reviews, then spend them in Reward Pools or the Rewards Store to unlock tools and perks.
          </p>
          <button
            onClick={() => onTabChange('rewards')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F0C41B] hover:bg-yellow-300 text-black font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-[#F0C41B]/20"
          >
            <Trophy size={15} />
            <span>Explore Reward Pools</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {redemptions.map(r => (
            <div key={r.id} className="bg-[#111113] border border-white/8 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0C41B] bg-[#F0C41B]/10 px-2 py-0.5 rounded-full border border-[#F0C41B]/20">
                    {r.status}
                  </span>
                  <h3 className="text-white font-bold text-base mt-2">{r.title}</h3>
                  <span className="text-white/30 text-xs">Redeemed {r.redeemedDate} • {r.cost} XP</span>
                </div>
                <span className="text-xs text-white/40 font-mono">{r.expiresIn}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">
                  Your Voucher / License Code:
                </div>
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-2">
                  <code className="text-[#F0C41B] font-mono text-xs font-bold flex-1 truncate px-1">
                    {r.code}
                  </code>
                  <button
                    onClick={() => copyCode(r.code)}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    {copiedCode === r.code ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCode === r.code ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   5. REWARD POOLS TAB
   ========================================================================= */
const RewardPoolsTab = ({ stats, setStats }: any) => {
  const [pools, setPools] = useState<any[]>([
    {
      id: 'pool-1',
      title: '$100,000 FTMO Funded Challenge Ticket',
      desc: 'Winner receives a fully paid 100K 2-Step challenge voucher.',
      cost: 100,
      entries: 42,
      maxEntries: 100,
      endsIn: '3 days, 14 hours',
      tag: 'Grand Prize',
      userEntered: false,
    },
    {
      id: 'pool-2',
      title: 'Free TradingView Pro+ 1-Year Subscription',
      desc: 'Unlimited charts, custom indicators, and multi-monitor layout access.',
      cost: 150,
      entries: 28,
      maxEntries: 50,
      endsIn: '5 days, 8 hours',
      tag: 'Trader Tool',
      userEntered: false,
    },
    {
      id: 'pool-3',
      title: '$500 Direct USDT Trader Payout Pool',
      desc: 'Direct crypto wallet disbursement to the selected verified community trader.',
      cost: 250,
      entries: 65,
      maxEntries: 150,
      endsIn: '8 days',
      tag: 'Cash Prize',
      userEntered: false,
    },
  ]);

  const handleEnterPool = (poolId: string, cost: number) => {
    if (stats.points < cost) {
      alert(`You need ${cost} XP to enter this pool! You currently have ${stats.points} XP.`);
      return;
    }
    setStats((prev: any) => ({ ...prev, points: prev.points - cost }));
    setPools(pools.map(p => {
      if (p.id === poolId) {
        return { ...p, entries: p.entries + 1, userEntered: true };
      }
      return p;
    }));
    alert('Entry confirmed! Your ticket has been entered into the pool drawing.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-[#F0C41B]" size={20} />
            Tradzu-Style Reward Pools
          </h2>
          <p className="text-white/40 text-xs mt-1">
            Spend your earned XP to enter high-value giveaway pools. Winners are chosen by provably fair automated draw.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F0C41B]/10 border border-[#F0C41B]/20 px-3.5 py-2 rounded-xl self-start sm:self-center">
          <Zap size={14} className="text-[#F0C41B]" />
          <span className="text-white text-xs font-bold">Your Balance:</span>
          <span className="text-[#F0C41B] text-xs font-black">{stats.points} XP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {pools.map(p => {
          const progress = Math.min((p.entries / p.maxEntries) * 100, 100);
          const canAfford = stats.points >= p.cost;

          return (
            <div key={p.id} className="bg-[#111113] border border-white/8 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#F0C41B]/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0C41B] bg-[#F0C41B]/15 px-2 py-0.5 rounded-full border border-[#F0C41B]/20">
                    {p.tag}
                  </span>
                  <span className="text-white/30 text-[11px]">{p.endsIn}</span>
                </div>
                <h3 className="text-white font-bold text-base leading-snug mb-2">{p.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-4">{p.desc}</p>
              </div>

              <div>
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/40">Entries</span>
                    <span className="text-white font-semibold">{p.entries} / {p.maxEntries}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F0C41B] rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <button
                  disabled={p.userEntered}
                  onClick={() => handleEnterPool(p.id, p.cost)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                    p.userEntered
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : canAfford
                      ? 'bg-[#F0C41B] hover:bg-yellow-300 text-black shadow-[#F0C41B]/20'
                      : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {p.userEntered ? (
                    <>
                      <Check size={14} /> Entered (1 Ticket)
                    </>
                  ) : (
                    <>
                      <Ticket size={14} /> Enter Pool ({p.cost} XP)
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
   6. SAVED FIRMS TAB
   ========================================================================= */
const SavedFirmsTab = ({ user }: any) => {
  const [items, setItems] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('pms_saved_firms') || '[]');
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    setLoading(true);

    supabase
      .from('saved_firms')
      .select('*, firm:firms(id,name,logo_url,rating,profit_split,max_funding)')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (!error && data && data.length > 0) {
          setItems(data.map(d => ({
            id: d.firm?.id || d.id,
            name: d.firm?.name,
            logo_url: d.firm?.logo_url,
            rating: d.firm?.rating || 4.8,
            profit_split: d.firm?.profit_split || '90%',
            max_funding: d.firm?.max_funding || '$1,000,000',
          })));
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [user]);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('pms_saved_firms', JSON.stringify(updated));
    if (user) {
      supabase.from('saved_firms').delete().eq('user_id', user.id).eq('firm_id', id).catch(() => {});
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="text-[#F0C41B]" size={20} />
            Saved Prop Firms
          </h2>
          <p className="text-white/40 text-xs mt-1">{items.length} firms bookmarked for rapid comparison</p>
        </div>
        <Link
          to="/firms"
          className="text-xs font-bold text-[#F0C41B] hover:underline flex items-center gap-1"
        >
          Explore More Firms <ArrowUpRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-white/30 gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading saved firms...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#111113] border border-white/8 rounded-2xl p-12 text-center">
          <Heart size={36} className="text-white/10 mx-auto mb-3" />
          <h3 className="text-white font-bold text-base">No saved firms yet</h3>
          <p className="text-white/40 text-xs max-w-sm mx-auto mt-1 mb-5">
            Click the heart icon on any firm page to bookmark it here for fast access.
          </p>
          <Link
            to="/firms"
            className="inline-flex items-center gap-2 bg-[#F0C41B] text-black font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-all shadow-lg shadow-[#F0C41B]/20"
          >
            Browse All Firms <ArrowUpRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(firm => (
            <Link
              key={firm.id}
              to={`/firm/${firm.id}`}
              className="bg-[#111113] border border-white/8 hover:border-[#F0C41B]/30 rounded-2xl p-5 shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm text-[#F0C41B] flex-shrink-0">
                    {firm.logo_url ? (
                      <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span>{firm.name?.substring(0, 2) || 'PF'}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm group-hover:text-[#F0C41B] transition-colors">
                      {firm.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#F0C41B] text-xs font-bold mt-0.5">
                      <Star size={12} fill="currentColor" />
                      <span>{firm.rating || 4.8}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemove(firm.id, e)}
                  className="text-white/30 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title="Remove from saved"
                >
                  <Heart size={16} className="fill-rose-500 text-rose-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-white/5">
                <div className="bg-white/[0.02] rounded-lg p-2">
                  <span className="text-white/30 block">Profit Split</span>
                  <span className="text-white font-bold">{firm.profit_split || '90%'}</span>
                </div>
                <div className="bg-white/[0.02] rounded-lg p-2">
                  <span className="text-white/30 block">Max Funding</span>
                  <span className="text-white font-bold">{firm.max_funding || '$1,000,000'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   7. MY REVIEWS TAB
   ========================================================================= */
const MyReviewsTab = ({ user, onTabChange }: any) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('reviews')
      .select('*, firm:firms(name,logo_url)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setReviews(data.map(d => ({
            id: d.id,
            firmName: d.firm?.name || 'Verified Prop Firm',
            rating: d.rating,
            comment: d.comment,
            created_at: d.created_at,
            status: d.status || 'approved',
          })));
        }
      })
      .catch(() => {});
  }, [user]);

  const filtered = reviews.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="text-[#F0C41B]" size={20} />
            My Submitted Reviews
          </h2>
          <p className="text-white/40 text-xs mt-1">
            Every published review rewards you with 100 XP points towards reward pools.
          </p>
        </div>
        <Link
          to="/firms"
          className="px-4 py-2 bg-[#F0C41B] hover:bg-yellow-300 text-black font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#F0C41B]/20 self-start sm:self-center"
        >
          <Plus size={14} />
          <span>Write a Review</span>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-3">
        {(['all', 'approved', 'pending'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {f} ({f === 'all' ? reviews.length : reviews.filter(r => r.status === f).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#111113] border border-white/8 rounded-2xl p-12 text-center">
            <MessageSquare size={36} className="text-white/10 mx-auto mb-3" />
            <h3 className="text-white font-bold text-base">No reviews posted yet</h3>
            <p className="text-white/40 text-xs max-w-sm mx-auto mt-1 mb-5">
              Help traders find honest information. Write your experience with any prop firm and earn 100 XP instantly!
            </p>
            <Link
              to="/firms"
              className="inline-flex items-center gap-2 bg-[#F0C41B] text-black font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-all shadow-lg"
            >
              Select a Firm to Review
            </Link>
          </div>
        ) : (
          filtered.map(r => (
            <div key={r.id} className="bg-[#111113] border border-white/8 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-[#F0C41B]">
                    {r.firmName.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{r.firmName}</h3>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < r.rating ? 'text-[#F0C41B] fill-[#F0C41B]' : 'text-white/15'}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    r.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {r.status.toUpperCase()}
                  </span>
                  <span className="text-white/30 text-[11px] font-mono">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed italic bg-white/[0.01] p-3 rounded-xl border border-white/5">
                "{r.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   8. ACHIEVEMENTS TAB
   ========================================================================= */
const AchievementsTab = ({ stats }: any) => {
  const badges = [
    { name: 'First Steps', desc: 'Create and verify your trader account', icon: '🚀', unlocked: true, xp: 10 },
    { name: 'Reviewer', desc: 'Post your first verified prop firm review', icon: '📝', unlocked: stats.reviews >= 1, xp: 100 },
    { name: 'Account Sync', desc: 'Connect MT4, MT5, or cTrader account', icon: '⚡', unlocked: (stats.accounts || 0) >= 1, xp: 100 },
    { name: 'Collector', desc: 'Bookmark 3 firms to your favorites', icon: '❤️', unlocked: stats.saved >= 3, xp: 150 },
    { name: 'Connector', desc: 'Refer 1 fellow trader via your invite code', icon: '🤝', unlocked: stats.referrals >= 1, xp: 200 },
    { name: 'Critic', desc: 'Post 5 community reviews', icon: '⭐', unlocked: stats.reviews >= 5, xp: 250 },
    { name: 'Challenge Master', desc: 'Reach 1,000 Lifetime XP', icon: '🏆', unlocked: stats.points >= 1000, xp: 500 },
    { name: 'Elite Trader', desc: 'Reach Level 2 Trader status', icon: '👑', unlocked: stats.points >= 1000, xp: 600 },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const progressPct = Math.round((unlockedCount / badges.length) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="text-[#F0C41B]" size={20} />
            Trader Achievements & Badges
          </h2>
          <p className="text-white/40 text-xs mt-1">
            Unlock badges to level up your status and claim exclusive reward pool entries.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl self-start sm:self-center">
          <span className="text-white/50 text-xs">Unlocked:</span>
          <span className="text-[#F0C41B] font-bold text-xs">{unlockedCount} / {badges.length}</span>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/8 rounded-2xl p-5 shadow-xl">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-white/60 font-semibold">Gamification Progress</span>
          <span className="text-[#F0C41B] font-bold">{progressPct}% Completed</span>
        </div>
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F0C41B] to-yellow-300 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-5 transition-all relative overflow-hidden shadow-lg ${
              b.unlocked
                ? 'bg-[#111113] border-[#F0C41B]/30'
                : 'bg-[#111113]/40 border-white/5 opacity-40'
            }`}
          >
            <div className="text-3xl mb-3">{b.icon}</div>
            <h3 className={`font-bold text-sm mb-1 ${b.unlocked ? 'text-white' : 'text-white/50'}`}>
              {b.name}
            </h3>
            <p className="text-white/40 text-xs mb-4 min-h-[32px] leading-relaxed">{b.desc}</p>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                b.unlocked ? 'bg-[#F0C41B]/15 text-[#F0C41B]' : 'bg-white/5 text-white/30'
              }`}>
                +{b.xp} XP
              </span>
              {b.unlocked ? (
                <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Done
                </span>
              ) : (
                <span className="text-white/20 text-[10px]">Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   9. LEDGER TAB
   ========================================================================= */
const LedgerTab = ({ stats }: any) => {
  const [filter, setFilter] = useState<'all' | 'earned' | 'spent'>('all');
  const [ledger] = useState<any[]>([
    { id: 'tx-1', date: new Date().toISOString().split('T')[0], desc: 'Starter Login Bonus (Welcome to PROPxWEALTH)', category: 'Bonus', amount: 10, type: 'earned' },
  ]);

  const filtered = ledger.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="text-[#F0C41B]" size={20} />
            Points Ledger & Audit History
          </h2>
          <p className="text-white/40 text-xs mt-1">
            Complete transparent ledger of your XP points earned and reward redemptions.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F0C41B]/10 border border-[#F0C41B]/20 px-3.5 py-1.5 rounded-xl self-start sm:self-center">
          <span className="text-white/50 text-xs font-medium">Balance:</span>
          <span className="text-[#F0C41B] font-black text-xs">{stats.points} XP</span>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/5 pb-3">
        {(['all', 'earned', 'spent'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-white/10 text-white font-bold'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#111113] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.03] text-white/40 uppercase tracking-wider text-[10px] border-b border-white/5">
            <tr>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Transaction Activity</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(tx => (
              <tr key={tx.id} className="hover:bg-white/[0.01]">
                <td className="py-3.5 px-4 font-mono text-white/40 text-[11px]">{tx.date}</td>
                <td className="py-3.5 px-4 text-white font-medium">{tx.desc}</td>
                <td className="py-3.5 px-4">
                  <span className="bg-white/5 text-white/60 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {tx.category}
                  </span>
                </td>
                <td className={`py-3.5 px-4 text-right font-bold font-mono text-sm ${
                  tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   10. REFERRALS TAB
   ========================================================================= */
const ReferralsTab = ({ user, stats }: any) => {
  const [copied, setCopied] = useState(false);
  const refCode = user?.id?.substring(0, 8).toUpperCase() || 'TRADER99';
  const refLink = `${window.location.origin}/?ref=${refCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="text-[#F0C41B]" size={20} />
          Referrals & Partner Program
        </h2>
        <p className="text-white/40 text-xs mt-1">
          Share your referral code. You and your invited friend both get 200 XP points on signup!
        </p>
      </div>

      <div className="bg-[#111113] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-xl mx-auto text-center mb-6">
          <div className="text-5xl mb-3">🤝</div>
          <h3 className="text-white font-bold text-lg mb-1">Invite Friends & Earn Rewards</h3>
          <p className="text-white/40 text-xs sm:text-sm">
            Give friends access to verified prop firm reviews & coupon codes. Earn 200 XP for every trader who joins.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-black/40 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2">
            Your Personal Referral Code
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F0C41B] tracking-widest mb-4 font-mono">
            {refCode}
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={refLink}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white/60 font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#F0C41B] hover:bg-yellow-300 text-black shadow-lg shadow-[#F0C41B]/20'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto text-center">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:p-4">
            <div className="text-white font-black text-xl sm:text-2xl">{stats.referrals || 0}</div>
            <div className="text-white/40 text-[11px] mt-0.5">Friends Joined</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:p-4">
            <div className="text-[#F0C41B] font-black text-xl sm:text-2xl">{(stats.referrals || 0) * 200} XP</div>
            <div className="text-white/40 text-[11px] mt-0.5">Referral Earnings</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 sm:p-4">
            <div className="text-white font-black text-xl sm:text-2xl">Tier 1</div>
            <div className="text-white/40 text-[11px] mt-0.5">Trader Affiliate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   11. PROFILE / SETTINGS TAB
   ========================================================================= */
const ProfileTab = ({ user, profile, onProfileUpdate }: any) => {
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [tradingStyle, setTradingStyle] = useState('Day Trader');
  const [platform, setPlatform] = useState('MetaTrader 5');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMsg('');

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
        });

      if (error) throw error;
      onProfileUpdate({ ...profile, full_name: fullName });
      setMsg('Profile updated successfully!');
    } catch (err: any) {
      setMsg(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const rawAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || '';
  const initials = (fullName || user?.email || 'T').charAt(0).toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="text-[#F0C41B]" size={20} />
          Profile & Account Settings
        </h2>
        <p className="text-white/40 text-xs mt-1">Manage your identity, trading preferences, and security.</p>
      </div>

      <div className="bg-[#111113] border border-white/8 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-white/5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F0C41B]/15 border border-[#F0C41B]/30 flex items-center justify-center font-black text-2xl text-[#F0C41B] flex-shrink-0 shadow-inner">
            {rawAvatar && !avatarError ? (
              <img
                src={rawAvatar}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <div className="text-white font-bold text-base">{fullName || 'Trader'}</div>
            <div className="text-white/40 text-xs font-mono">{user?.email}</div>
            <div className="text-[11px] text-[#F0C41B] mt-1 font-semibold flex items-center gap-1">
              <Shield size={12} /> Level 1 Trader Account
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <input
              disabled
              value={user?.email || ''}
              className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/40 cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block mb-1.5">
              Display Name
            </label>
            <input
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. John Trader"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block mb-1.5">
                Trading Style
              </label>
              <select
                value={tradingStyle}
                onChange={e => setTradingStyle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
              >
                <option value="Day Trader">Day Trader</option>
                <option value="Scalper">Scalper</option>
                <option value="Swing Trader">Swing Trader</option>
                <option value="Algo / EA Trader">Algo / EA Trader</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block mb-1.5">
                Primary Platform
              </label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
              >
                <option value="MetaTrader 5">MetaTrader 5</option>
                <option value="MetaTrader 4">MetaTrader 4</option>
                <option value="cTrader">cTrader</option>
                <option value="TradeLocker">TradeLocker</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block mb-1.5">
              Member Since
            </label>
            <input
              disabled
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'September 2026'}
              className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/40 cursor-not-allowed"
            />
          </div>

          {msg && (
            <div className={`text-xs py-2 px-3 rounded-xl ${
              msg.includes('Error')
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {msg}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F0C41B] hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F0C41B]/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Edit2 size={14} />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;