import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, MessageSquare, Star, Loader2, Search, RotateCcw, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Review {
    id: string;
    firm_id: string;
    user_name: string;
    rating: number;
    comment: string;
    status: string;
    created_at: string;
    firms?: { name: string; logo_url: string };
}

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    pending: { label: 'Pending', bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/20' },
    approved: { label: 'Approved', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    rejected: { label: 'Rejected', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    flagged: { label: 'Flagged', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
};

const AdminReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, firms(name, logo_url)')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase.from('reviews').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const statusCounts = {
        all: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        approved: reviews.filter(r => r.status === 'approved').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
        flagged: reviews.filter(r => r.status === 'flagged').length,
    };

    const filteredReviews = reviews.filter(r => {
        const matchStatus = filterStatus === 'all' || r.status === filterStatus;
        const matchSearch = !searchTerm ||
            r.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.firms?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.comment?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="flex flex-col gap-5 max-w-5xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Review Moderation</h2>
                    <p className="text-white/40 text-xs mt-1">Approve, reject, or flag user-submitted reviews.</p>
                </div>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-52 bg-[#111113] border border-white/8 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/25 focus:border-yellow-400/40 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {(['all', 'pending', 'approved', 'flagged', 'rejected'] as const).map((status) => {
                    const count = statusCounts[status];
                    const cfg = status !== 'all' ? statusConfig[status] : null;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ' + (filterStatus === status
                                ? (cfg ? cfg.bg + ' ' + cfg.text + ' border ' + cfg.border : 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/20')
                                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                            )}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className={'text-[10px] font-bold px-1.5 py-0.5 rounded-full ' + (filterStatus === status ? 'bg-white/20' : 'bg-white/5')}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 text-white/30 gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span className="text-sm">Loading reviews...</span>
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="text-center py-20 bg-[#111113] border border-white/5 rounded-2xl">
                    <MessageSquare className="mx-auto text-white/10 mb-4" size={40} />
                    <h3 className="text-white font-bold text-sm">No Reviews Found</h3>
                    <p className="text-white/30 text-xs mt-1">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredReviews.map((review) => {
                        const cfg = statusConfig[review.status] || statusConfig.pending;
                        return (
                            <div key={review.id} className="bg-[#111113] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {review.firms?.logo_url
                                                ? <img src={review.firms.logo_url} alt="" className="w-full h-full object-contain p-1" />
                                                : <span className="text-white/40 font-bold text-xs">{review.firms?.name?.substring(0, 2) || '??'}</span>
                                            }
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{review.firms?.name || 'Unknown Firm'}</h4>
                                            <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                                                <span>by <span className="text-yellow-400 font-medium">{review.user_name}</span></span>
                                                <span>•</span>
                                                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={'px-2.5 py-1 rounded-lg text-[10px] font-bold border ' + cfg.bg + ' ' + cfg.text + ' ' + cfg.border}>
                                        {cfg.label}
                                    </span>
                                </div>

                                <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={'transition-colors ' + (i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/15')} />
                                        ))}
                                        <span className="text-white text-xs font-bold ml-2">{review.rating}.0</span>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed italic">"{review.comment}"</p>
                                </div>

                                <div className="flex flex-wrap justify-end gap-2">
                                    {review.status !== 'approved' && (
                                        <button onClick={() => handleStatusChange(review.id, 'approved')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-xl text-xs font-bold transition-colors">
                                            <CheckCircle2 size={13} /> Approve
                                        </button>
                                    )}
                                    {review.status !== 'flagged' && (
                                        <button onClick={() => handleStatusChange(review.id, 'flagged')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 rounded-xl text-xs font-bold transition-colors">
                                            <AlertTriangle size={13} /> Flag
                                        </button>
                                    )}
                                    {review.status !== 'rejected' && (
                                        <button onClick={() => handleStatusChange(review.id, 'rejected')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-xs font-bold transition-colors">
                                            <XCircle size={13} /> Reject
                                        </button>
                                    )}
                                    {review.status !== 'pending' && (
                                        <button onClick={() => handleStatusChange(review.id, 'pending')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white/40 border border-white/8 hover:bg-white/10 rounded-xl text-xs font-bold transition-colors">
                                            <RotateCcw size={13} /> Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminReviewsPage;