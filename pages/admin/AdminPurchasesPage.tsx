import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, CheckCircle2, XCircle, Clock, Search, Filter,
  DollarSign, Zap, ArrowUpRight, Check, Copy, ExternalLink,
  Shield, AlertCircle, RefreshCw, Plus, User, MessageSquare,
  Sparkles, Calendar, Edit3
} from 'lucide-react';
import {
  PurchaseRequest,
  fetchPurchaseRequests,
  approvePurchaseRequest,
  rejectPurchaseRequest,
  calculateEstimatedCredits
} from '../../lib/purchaseRequestsService';

const AdminPurchasesPage: React.FC = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReq, setSelectedReq] = useState<PurchaseRequest | null>(null);
  const [customCredits, setCustomCredits] = useState<Record<string, number>>({});
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Order number could not be verified under our partner affiliate link.');
  const [rejectTargetId, setRejectTargetId] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [manualCreditModal, setManualCreditModal] = useState(false);
  const [manualForm, setManualForm] = useState({ userEmail: '', amount: 500, reason: 'Special Community Bounty' });
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    const data = await fetchPurchaseRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener('purchase_requests_updated', handleUpdate);
    return () => window.removeEventListener('purchase_requests_updated', handleUpdate);
  }, []);

  const handleApprove = async (req: PurchaseRequest) => {
    const creditsToAssign = customCredits[req.id] || req.credit_amount || 500;
    await approvePurchaseRequest(req.id, creditsToAssign, `Approved by Admin. ${creditsToAssign} Wealth Credits assigned.`);
    setActionSuccessMsg(`Successfully approved Order #${req.order_number} and assigned ${creditsToAssign} Wealth Credits to ${req.user_name || req.user_email}!`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
    loadRequests();
  };

  const handleRejectClick = (id: string) => {
    setRejectTargetId(id);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectTargetId) return;
    await rejectPurchaseRequest(rejectTargetId, rejectReason);
    setRejectModalOpen(false);
    setActionSuccessMsg(`Purchase request rejected with notice.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
    loadRequests();
  };

  const handleManualCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccessMsg(`Successfully credited ${manualForm.amount} Wealth Credits to ${manualForm.userEmail}!`);
    setManualCreditModal(false);
    setManualForm({ userEmail: '', amount: 500, reason: 'Special Community Bounty' });
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(txt);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // Stats
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const totalCreditsAwarded = requests
    .filter(r => r.status === 'approved')
    .reduce((acc, curr) => acc + (curr.credit_amount || 0), 0);

  const filtered = requests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.order_number?.toLowerCase().includes(s) ||
      r.user_email?.toLowerCase().includes(s) ||
      r.user_name?.toLowerCase().includes(s) ||
      r.firm_name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {actionSuccessMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F0C41B]/15 text-[#F0C41B] border border-[#F0C41B]/20 mb-2">
            <Sparkles size={12} /> Tradzu Credit System
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="text-[#F0C41B]" size={24} />
            Purchase Verification & Wealth Credits
          </h1>
          <p className="text-white/40 text-xs mt-1 max-w-2xl">
            Review user-submitted prop firm challenge purchases. Verify the order against affiliate dashboards and instantly assign Wealth Credits to trader balances.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={loadRequests}
            className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setManualCreditModal(true)}
            className="px-4 py-2.5 bg-[#F0C41B] hover:bg-yellow-300 text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-[#F0C41B]/20"
          >
            <Plus size={15} />
            <span>Manual Credit Grant</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#111113] border border-amber-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-xs font-semibold">Pending Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            {pendingCount}
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
          <div className="text-amber-400/80 text-[11px] font-medium mt-1">Requires admin approval</div>
        </div>

        <div className="bg-[#111113] border border-emerald-500/20 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-xs font-semibold">Approved & Credited</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{approvedCount}</div>
          <div className="text-emerald-400/80 text-[11px] font-medium mt-1">Affiliate orders verified</div>
        </div>

        <div className="bg-[#111113] border border-[#F0C41B]/20 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-xs font-semibold">Total Credits Granted</span>
            <div className="w-8 h-8 rounded-xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B]">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F0C41B]">{totalCreditsAwarded.toLocaleString()} <span className="text-sm font-semibold">XP</span></div>
          <div className="text-white/40 text-[11px] font-medium mt-1">Directly added to users</div>
        </div>

        <div className="bg-[#111113] border border-purple-500/20 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-xs font-semibold">Total Submissions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{requests.length}</div>
          <div className="text-white/40 text-[11px] font-medium mt-1">Lifetime purchase claims</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111113] border border-white/8 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by Order #, Email, User Name, or Prop Firm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F0C41B]"
          />
        </div>

        {/* Status buttons */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/5 self-start sm:self-center overflow-x-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-[#F0C41B] text-black shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {s} ({s === 'all' ? requests.length : requests.filter(r => r.status === s).length})
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table / Cards */}
      <div className="bg-[#111113] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40 gap-2">
            <RefreshCw size={20} className="animate-spin text-[#F0C41B]" />
            <span className="text-sm">Loading purchase requests...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag size={36} className="text-white/15 mx-auto mb-3" />
            <h3 className="text-white font-bold text-sm">No purchase requests found</h3>
            <p className="text-white/40 text-xs mt-1">No requests match the current search or status filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(req => {
              const currentCredits = customCredits[req.id] !== undefined ? customCredits[req.id] : req.credit_amount;
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';
              const isRejected = req.status === 'rejected';

              return (
                <div key={req.id} className="p-5 sm:p-6 hover:bg-white/[0.01] transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Trader & Firm Info */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#F0C41B]/10 border border-[#F0C41B]/20 flex items-center justify-center text-[#F0C41B] font-black text-base flex-shrink-0">
                        {req.firm_name?.substring(0, 2) || 'PF'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-white font-black text-base">{req.firm_name}</span>
                          <span className="bg-white/5 text-white/80 font-semibold px-2 py-0.5 rounded-md text-[11px] border border-white/5">
                            {req.account_size}
                          </span>
                          <span className="text-white/40 text-xs">• {req.challenge_type}</span>
                          
                          {/* Status Badge */}
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {req.status}
                          </span>
                        </div>

                        {/* User & Order Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1 gap-x-4 text-xs text-white/50 mt-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <User size={13} className="text-white/30" />
                            <strong className="text-white font-medium">{req.user_name || 'Trader'}</strong>
                            <span className="text-white/30">({req.user_email})</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-white/30">Order:</span>
                            <strong className="text-white select-all">{req.order_number}</strong>
                            <button
                              onClick={() => copyText(req.order_number)}
                              className="text-white/30 hover:text-white ml-0.5"
                              title="Copy Order ID"
                            >
                              {copiedId === req.order_number ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-white/30" />
                            <span>Date: {req.purchase_date}</span>
                          </div>
                        </div>

                        {/* Admin note / reason display */}
                        {req.admin_notes && (
                          <div className="mt-2.5 text-[11px] p-2 rounded-lg bg-black/30 border border-white/5 text-white/60">
                            <strong className="text-white/80">Admin Note:</strong> {req.admin_notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Credit Assignment & Admin Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-end lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                      
                      {/* Credit Input Widget */}
                      <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5">
                        <Zap size={14} className="text-[#F0C41B]" />
                        <span className="text-[11px] text-white/40 font-semibold">Credits:</span>
                        <input
                          type="number"
                          disabled={!isPending}
                          value={currentCredits}
                          onChange={e => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setCustomCredits({ ...customCredits, [req.id]: val });
                          }}
                          className="w-20 bg-transparent text-sm font-black text-[#F0C41B] font-mono focus:outline-none border-b border-transparent focus:border-[#F0C41B] text-right"
                        />
                        <span className="text-[11px] text-white/50 font-bold">XP</span>
                      </div>

                      {/* Action Buttons */}
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(req)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 size={14} />
                            <span>Approve & Credit</span>
                          </button>
                          <button
                            onClick={() => handleRejectClick(req.id)}
                            className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : isApproved ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                          <CheckCircle2 size={14} />
                          <span>+{req.credit_amount} Wealth Credits Assigned</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                          <XCircle size={14} />
                          <span>Rejected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Reject Purchase Request</h3>
            <p className="text-white/40 text-xs mb-4">
              Enter a reason so the user knows why the verification failed (e.g. invalid order ID).
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-white/50 block mb-1 font-semibold">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white shadow-lg"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Credit Grant Modal */}
      {manualCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111113] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} className="text-[#F0C41B]" />
              <h3 className="text-lg font-bold text-white">Manual Wealth Credit Assignment</h3>
            </div>
            <p className="text-white/40 text-xs mb-4">
              Directly grant Wealth Credits to any user for giveaways, bug bounties, or offline partner deals.
            </p>
            <form onSubmit={handleManualCreditSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-white/50 block mb-1 font-semibold">User Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="trader@email.com"
                  value={manualForm.userEmail}
                  onChange={e => setManualForm({ ...manualForm, userEmail: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/50 block mb-1 font-semibold">Wealth Credits Amount</label>
                <input
                  required
                  type="number"
                  value={manualForm.amount}
                  onChange={e => setManualForm({ ...manualForm, amount: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F0C41B] font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/50 block mb-1 font-semibold">Reason / Audit Memo</label>
                <input
                  placeholder="e.g. Community Competition Winner"
                  value={manualForm.reason}
                  onChange={e => setManualForm({ ...manualForm, reason: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F0C41B]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManualCreditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#F0C41B] hover:bg-yellow-300 text-black shadow-lg shadow-[#F0C41B]/20"
                >
                  Assign Credits Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPurchasesPage;
