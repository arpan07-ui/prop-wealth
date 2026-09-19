import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Tag,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    CreditCard,
    Shield,
    Trophy,
    Send,
    BookOpen,
    Gift,
    ChevronRight,
    Activity,
    ExternalLink,
    ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
    badge?: string;
    badgeColor?: string;
}

interface NavSection {
    section: string;
    items: NavItem[];
}

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [notifOpen, setNotifOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const menuSections: NavSection[] = [
        {
            section: 'Analytics',
            items: [
                { icon: Activity, label: 'Dashboard', path: '/admin', badge: 'LIVE', badgeColor: 'bg-green-500/20 text-green-400 border border-green-500/20' },
            ]
        },
        {
            section: 'Management',
            items: [
                { icon: Building2, label: 'Prop Firms', path: '/admin/firms' },
                { icon: ShoppingBag, label: 'Purchases & Credits', path: '/admin/purchases', badge: 'NEW', badgeColor: 'bg-[#F0C41B]/20 text-[#F0C41B] border border-[#F0C41B]/30' },
                { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
                { icon: CreditCard, label: 'Payouts', path: '/admin/payouts' },
                { icon: Shield, label: 'Trust Badges', path: '/admin/badges' },
                { icon: Trophy, label: 'Competitions', path: '/admin/competitions' },
                { icon: Tag, label: 'Offers & Partner Deals', path: '/admin/offers', badge: 'TOP 3', badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/30' },
                { icon: Gift, label: 'Rewards', path: '/admin/rewards' },
                { icon: BookOpen, label: 'Blog', path: '/admin/blog' },
                { icon: Send, label: 'Marketing', path: '/admin/marketing' },
            ]
        },
        {
            section: 'Platform',
            items: [
                { icon: Users, label: 'Users', path: '/admin/users' },
                { icon: Settings, label: 'Configuration', path: '/admin/settings' },
            ]
        }
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const avatarUrl = user?.user_metadata?.avatar_url;
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';
    const displayEmail = user?.email || 'admin@propxwealth.com';

    const notifications = [
        { icon: '🏢', title: 'New Firm Applied', desc: 'FundedNext submitted a new application', time: '2m ago' },
        { icon: '⭐', title: 'Review Flagged', desc: 'Review #8921 flagged for moderation', time: '15m ago' },
        { icon: '💰', title: 'Payout Verified', desc: '$12,450 payout verified for User_99', time: '1h ago' },
        { icon: '👤', title: 'New User Signup', desc: 'waleed@propxwealth.com joined', time: '2h ago' },
    ];

    return (
        <div className="bg-[#0a0a0b] text-white overflow-hidden h-screen flex font-sans">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={`w-64 xl:w-72 bg-[#111113] border-r border-white/5 flex flex-col h-full flex-shrink-0 transition-transform duration-300 z-30 fixed lg:relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group" target="_blank">
                        <div className="w-9 h-9 rounded-xl bg-[#F0C41B]/10 flex items-center justify-center text-[#F0C41B] text-lg font-black border border-[#F0C41B]/20">
                            P
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-white font-bold text-sm tracking-tight">PROP<span className="text-[#F0C41B]">x</span>WEALTH</span>
                            <span className="text-white/40 text-[10px] font-medium mt-0.5 flex items-center gap-1">
                                Admin Console <ExternalLink size={8} />
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
                    {menuSections.map((section, idx) => (
                        <div key={idx} className={idx > 0 ? 'mt-3' : ''}>
                            <div className="pt-1 pb-2 px-3 text-[10px] font-bold text-white/25 uppercase tracking-widest">
                                {section.section}
                            </div>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group mb-0.5 ${isActive
                                            ? 'bg-[#F0C41B]/10 text-[#F0C41B] border border-[#F0C41B]/15'
                                            : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon
                                                size={16}
                                                className={`flex-shrink-0 transition-colors ${isActive ? 'text-[#F0C41B]' : 'text-white/35 group-hover:text-white/80'}`}
                                            />
                                            <span className="flex-1 truncate">{item.label}</span>
                                            {item.badge && (
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            {isActive && <ChevronRight size={12} className="text-[#F0C41B]/50 flex-shrink-0" />}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="p-3 border-t border-white/5">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="h-9 w-9 rounded-full flex-shrink-0 overflow-hidden bg-[#F0C41B]/20 flex items-center justify-center font-bold text-[#F0C41B] text-sm">
                            {avatarUrl
                                ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                                : displayName.charAt(0).toUpperCase()
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-bold truncate">{displayName}</div>
                            <div className="text-white/40 text-[10px] truncate">{displayEmail}</div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"
                            title="Sign Out"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0b] relative">
                <header className="h-14 border-b border-white/5 flex items-center justify-between px-5 lg:px-7 bg-[#0a0a0b]/90 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <Menu size={18} />
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-xs text-white/30">
                            <Link to="/" className="hover:text-white transition-colors">PROPxWEALTH</Link>
                            <ChevronRight size={12} />
                            <span className="text-white/60">Admin</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[16px]">search</span>
                            <input
                                className="w-52 lg:w-72 bg-white/5 border border-white/8 text-white text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-[#F0C41B]/40 focus:bg-white/8 placeholder-white/25 transition-all"
                                placeholder="Search firms, users, reviews..."
                                type="text"
                            />
                        </div>

                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-green-400 text-xs font-medium">Live</span>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            >
                                <Bell size={16} />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#F0C41B] rounded-full border-2 border-[#0a0a0b]"></span>
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-[#111113] border border-white/8 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                                        <span className="text-white font-bold text-sm">Notifications</span>
                                        <span className="text-[10px] font-bold text-[#F0C41B] bg-[#F0C41B]/10 px-2 py-0.5 rounded-full">4 new</span>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        {notifications.map((n, i) => (
                                            <div key={i} className="px-4 py-3 hover:bg-white/3 transition-colors cursor-pointer border-b border-white/5 last:border-0">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white text-xs font-semibold">{n.title}</div>
                                                        <div className="text-white/50 text-[11px] mt-0.5 truncate">{n.desc}</div>
                                                        <div className="text-white/30 text-[10px] mt-1">{n.time}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 border-t border-white/5">
                                        <button className="w-full text-center text-[11px] text-[#F0C41B] hover:underline">View all notifications</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/8"
                        >
                            <ExternalLink size={12} />
                            View Site
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto" onClick={() => notifOpen && setNotifOpen(false)}>
                    <div className="p-5 lg:p-7 min-h-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
